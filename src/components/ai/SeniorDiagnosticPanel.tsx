import React, { useEffect, useRef, useState } from 'react';
import { Check, RotateCcw, RotateCw, Sparkles, X } from 'lucide-react';
import type { CoachTarget, CoachTurn, CoachUsage, DiagnosticRequest, DiagnosticResponse } from '../../types/ai';
import type { TargetCountry } from '../../types/countryNorms';
import { getCountryProfile } from '../../data/targetCountries';
import { isDiagnosticResponse, localCoachGuidance } from '../../utils/aiGuidance';
import { clearCoachHistory, readCoachHistory, saveCoachHistory } from '../../utils/coachHistory';
import { TargetCountrySelect } from '../common/TargetCountrySelect';
import { SourceLinks } from '../resume/SourceLinks';
import { Modal } from '../Modal';

interface SeniorDiagnosticPanelProps {
  isOpen: boolean;
  onClose: () => void;
  targets: CoachTarget[];
  contextId: string;
  defaultTargetId?: string;
  targetRole?: string;
  targetCountry: TargetCountry;
  onTargetCountryChange: (country: TargetCountry) => void;
  flawsDetected?: string[];
  jobDescription?: string;
  onApplyFix: (targetId: string, originalText: string, newText: string) => boolean;
}

export function SeniorDiagnosticPanel({ isOpen, onClose, targets, contextId, defaultTargetId, targetRole = '', targetCountry, onTargetCountryChange, flawsDetected = [], jobDescription = '', onApplyFix }: SeniorDiagnosticPanelProps) {
  const [targetId, setTargetId] = useState(defaultTargetId ?? targets[0]?.id ?? '');
  const target = targets.find((item) => item.id === targetId);
  const historyKey = `${contextId}:${targetId}`;
  const [history, setHistory] = useState<CoachTurn[]>([]);
  const [historySaved, setHistorySaved] = useState(true);
  const [instruction, setInstruction] = useState('');
  const [facts, setFacts] = useState('');
  const [result, setResult] = useState<DiagnosticResponse | null>(null);
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [usage, setUsage] = useState<CoachUsage | null>(null);
  const [notice, setNotice] = useState('');
  const [lastEdit, setLastEdit] = useState<{ id: string; before: string; after: string; undone: boolean } | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const stale = Boolean(result && target?.text !== result.originalText);

  useEffect(() => {
    requestRef.current?.abort(); generation.current++;
    setHistory(readCoachHistory(historyKey)); setResult(null); setSuggestion(''); setFacts(''); setInstruction(''); setNotice(''); setLoading(false);
  }, [historyKey]);
  useEffect(() => {
    requestRef.current?.abort(); generation.current++; setResult(null); setSuggestion(''); setLoading(false);
  }, [targetCountry]);
  useEffect(() => { setLastEdit(null); }, [contextId]);
  useEffect(() => {
    if (isOpen && defaultTargetId) setTargetId(defaultTargetId);
  }, [isOpen, defaultTargetId]);
  useEffect(() => {
    if (!isOpen) { requestRef.current?.abort(); generation.current++; setLoading(false); return; }
    setConfigured(null); setUsage(null);
    const controller = new AbortController();
    fetch('/api/gemini/status', { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error('Coach unavailable');
      const status = await response.json();
      if (!controller.signal.aborted) { setConfigured(status.configured === true); setUsage(status.usage ?? null); }
    }).catch(() => { if (!controller.signal.aborted) setConfigured(false); });
    return () => { controller.abort(); requestRef.current?.abort(); generation.current++; };
  }, [isOpen]);

  const requestSuggestion = async (action?: string) => {
    if (!target?.text.trim()) { setNotice('Add your own text in the selected document field first.'); return; }
    if (target.text.length > 6000) { setNotice('Choose a shorter section, up to 6,000 characters.'); return; }
    if (loading) return;
    const nextInstruction = action ?? instruction.trim();
    const request: DiagnosticRequest = { currentText: target.text, sectionType: target.sectionType, targetRole: targetRole.slice(0, 160), countryNorm: targetCountry, flawsDetected: flawsDetected.slice(0, 8).map((flaw) => flaw.slice(0, 600)), userInstruction: nextInstruction, confirmedFacts: facts, jobDescription: jobDescription.slice(0, 4000), history };
    const controller = new AbortController(); requestRef.current = controller;
    const current = ++generation.current;
    setLoading(true); setNotice(''); setResult(null);
    let response: DiagnosticResponse;
    try {
      if (configured !== true) {
        response = localCoachGuidance(request, 'Online coaching is not enabled. This guidance is generated in your browser; your selected text is unchanged.');
      } else {
        const res = await fetch('/api/gemini/diagnose', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request), signal: AbortSignal.any([controller.signal, AbortSignal.timeout(25_000)]) });
        const data: unknown = await res.json();
        if (!isDiagnosticResponse(data) || (res.status !== 429 && !res.ok)) throw new Error('Invalid response');
        // The original always comes from this request, never a model's reconstruction.
        response = { ...data, originalText: request.currentText };
      }
    } catch {
      if (controller.signal.aborted || generation.current !== current) return;
      response = localCoachGuidance(request, 'The online coach could not be reached. Local guidance is shown and your text is retained.');
    }
    if (generation.current !== current || controller.signal.aborted) return;
    setResult(response); setSuggestion(response.suggestedText); setLoading(false); setInstruction('');
    if (response.usage) setUsage(response.usage);
    const turns: CoachTurn[] = [...history, { role: 'user', text: (nextInstruction || 'Help make this clearer.').slice(0, 1500) }, { role: 'assistant', text: `${response.isFallback ? 'Local guidance: ' : ''}${response.rationale}${response.clarifyingQuestion ? `\n${response.clarifyingQuestion}` : ''}`.slice(0, 1500) }].slice(-6) as CoachTurn[];
    setHistory(turns); setHistorySaved(saveCoachHistory(historyKey, turns));
  };

  return <Modal isOpen={isOpen} onClose={onClose} labelledBy="ai-coach-title" className="max-w-2xl">
    <div className="flex items-start justify-between gap-3 border-b border-line p-4 sm:p-5"><div><h2 id="ai-coach-title" className="flex items-center gap-2 text-xl"><Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />AI Writing Coach</h2><p className="mt-1 text-sm text-muted">Practical edits using your facts and the selected application context.</p></div><button type="button" className="btn btn-ghost px-3" aria-label="Close AI Writing Coach" onClick={onClose}><X className="h-5 w-5" aria-hidden="true" /></button></div>
    <div className="modal-content space-y-5 p-4 sm:p-5">
      <div className="rounded-card border border-line bg-soft p-3 text-xs leading-relaxed text-muted"><p>When you request online help, the selected text, added facts, role, job excerpt and recent conversation are sent to Google Gemini. On Google's free tier, prompts and responses may be used for product improvement and human review. Do not send personal, sensitive or confidential information. Ordinary checking, downloads and offline guidance run locally.</p><a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-medium text-accent underline underline-offset-4">Google’s data terms <span className="sr-only">(opens in a new tab)</span></a></div>
      <p className="text-xs text-muted">{configured === null ? 'Checking online coach availability…' : configured ? 'Gemini is configured. Availability is subject to server and provider limits.' : 'Online AI is unavailable or not configured. Local writing guidance is available.'}{configured && usage ? ` ${usage.remaining} of ${usage.limit} connection requests remain on this server instance today. This allowance is shared by a connection and resets on server restart.` : ''}</p>
      <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><label htmlFor="coach-target" className="block text-sm font-medium">Text to improve</label><select id="coach-target" className="field" value={targetId} onChange={(event) => setTargetId(event.target.value)}>{!target && <option value="">Choose a current field</option>}{targets.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div><TargetCountrySelect value={targetCountry} onChange={onTargetCountryChange} label="Coach target country / region" /></div>
      <p className="text-xs text-muted">{targetRole ? `Target role: ${targetRole}. ` : 'No target role supplied. '}{getCountryProfile(targetCountry).spelling} Page length remains subject to the vacancy.</p>
      <div><p className="text-sm font-medium">Current text</p><p className="mt-2 whitespace-pre-wrap break-words rounded-input border border-line bg-soft p-3 text-sm">{target?.text || 'The selected field is empty. Enter your own experience in the editor first.'}</p></div>
      {flawsDetected.length > 0 && <details><summary className="min-h-11 cursor-pointer text-sm font-medium">Current draft review prompts</summary><ul className="list-disc space-y-2 pl-5 text-xs text-muted">{flawsDetected.slice(0, 8).map((flaw, index) => <li key={index}>{flaw}</li>)}</ul></details>}
      <div className="space-y-2"><label htmlFor="coach-facts" className="block text-sm font-medium">Additional facts you can confirm (optional)</label><textarea id="coach-facts" className="field" rows={3} maxLength={2000} value={facts} onChange={(event) => setFacts(event.target.value)} placeholder="What you actually did, how you did it and what changed. Qualitative outcomes are welcome." /></div>
      <div className="flex flex-wrap gap-2">{['Make this clearer', 'Shorten without losing facts', ...(jobDescription.trim() ? ['Tailor wording to the supplied job'] : [])].map((action) => <button key={action} type="button" className="btn btn-secondary" disabled={loading || !target?.text.trim()} onClick={() => void requestSuggestion(action)}>{action}</button>)}</div>
      <form className="space-y-2" onSubmit={(event) => { event.preventDefault(); void requestSuggestion(); }}><label htmlFor="coach-instruction" className="block text-sm font-medium">Ask about this section</label><textarea id="coach-instruction" className="field" rows={2} maxLength={1000} value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder="What would you like to improve?" /><button type="submit" className="btn btn-primary" disabled={loading || !target?.text.trim()} aria-busy={loading}>{loading ? 'Preparing guidance…' : 'Request writing help'}</button></form>
      {notice && <p role="status" className="text-sm text-muted">{notice}</p>}
      {result && <section className="space-y-3 rounded-card border border-line p-4" aria-label="Coach result"><h3 className="text-base">{result.isFallback ? 'Local writing guidance' : 'Proposed wording'}</h3>{result.message && <p role="status" className="text-sm text-muted">{result.message}</p>}<p className="text-sm text-muted">{result.rationale}</p>{result.clarifyingQuestion && <p className="rounded-input bg-soft p-3 text-sm">{result.clarifyingQuestion}</p>}
        <label htmlFor="coach-suggestion" className="block text-sm font-medium">Review and edit the wording</label><textarea id="coach-suggestion" className="field" rows={5} maxLength={8000} value={suggestion} onChange={(event) => setSuggestion(event.target.value)} />
        <p className="text-xs text-muted">Verify every fact. Response checks cannot establish that an AI suggestion is true. Only the selected field is updated.</p>
        {stale && <p role="status" className="text-sm text-warning">The document field has changed. Request fresh guidance before applying this suggestion.</p>}
        <button type="button" className="btn btn-secondary" disabled={stale || !target || !suggestion.trim() || suggestion === result.originalText} onClick={() => {
          if (!target || !onApplyFix(target.id, result.originalText, suggestion)) { setNotice('The field changed; the suggestion was not applied.'); return; }
          setLastEdit({ id: target.id, before: result.originalText, after: suggestion, undone: false }); setNotice(`Applied to ${target.label}.`); setResult(null);
        }}><Check className="h-4 w-4" aria-hidden="true" />Apply to selected field</button><SourceLinks ids={result.sourceIds} /></section>}
      {lastEdit && <button type="button" className="btn btn-secondary" disabled={targets.find((item) => item.id === lastEdit.id)?.text !== (lastEdit.undone ? lastEdit.before : lastEdit.after)} onClick={() => {
        const expected = lastEdit.undone ? lastEdit.before : lastEdit.after;
        const replacement = lastEdit.undone ? lastEdit.after : lastEdit.before;
        if (onApplyFix(lastEdit.id, expected, replacement)) { setNotice(lastEdit.undone ? 'Last coach edit redone.' : 'Last coach edit undone.'); setLastEdit({ ...lastEdit, undone: !lastEdit.undone }); setResult(null); }
      }}>{lastEdit.undone ? <RotateCw className="h-4 w-4" aria-hidden="true" /> : <RotateCcw className="h-4 w-4" aria-hidden="true" />}{lastEdit.undone ? 'Redo last coach edit' : 'Undo last coach edit'}</button>}
      <details className="border-t border-line pt-3"><summary className="min-h-11 cursor-pointer text-sm font-medium">Recent conversation ({history.length} messages)</summary><p className="text-xs text-muted">Up to six messages per selected field are retained in this browser and included in follow-up requests. {historySaved ? '' : 'Browser storage is unavailable; this conversation is session-only.'}</p><ol className="mt-3 space-y-3">{history.map((turn, index) => <li key={index} className="whitespace-pre-wrap break-words rounded-input bg-soft p-3 text-sm"><strong>{turn.role === 'user' ? 'You' : 'Coach'}:</strong> {turn.text}</li>)}</ol><button type="button" className="btn btn-ghost mt-2" onClick={() => { clearCoachHistory(historyKey); setHistory([]); setNotice('Conversation cleared for this field.'); }}>Clear this conversation</button></details>
    </div>
  </Modal>;
}
