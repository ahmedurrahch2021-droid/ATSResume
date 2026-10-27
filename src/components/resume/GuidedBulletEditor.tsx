import React, { useState } from 'react';
import { ArrowRight, Undo2 } from 'lucide-react';
import { makeGuidedBullet, type GuidedBulletFacts } from '../../utils/resumeActions';
import { ResumeField } from './ResumeField';

interface GuidedBulletEditorProps { id: string; original: string; onApply: (text: string) => void }

export function GuidedBulletEditor({ id, original, onApply }: GuidedBulletEditorProps) {
  const [facts, setFacts] = useState<GuidedBulletFacts>({ action: '', scope: '', method: '', result: '' });
  const [checked, setChecked] = useState(false);
  const [undo, setUndo] = useState<string | null>(null);
  const proposal = makeGuidedBullet(facts);
  const update = (key: keyof GuidedBulletFacts, value: string) => { setFacts((current) => ({ ...current, [key]: value })); setChecked(false); };
  return (
    <div className="rounded-card border border-accent-line bg-accent-soft/40 p-4 space-y-4">
      <div>
        <p className="eyebrow">Guided rewrite · no AI</p>
        <p className="mt-1 text-sm text-muted">Supply the facts. This helper joins your wording; it does not invent achievements, skills or numbers.</p>
      </div>
      <ResumeField id={`${id}-action`} label="What did you personally do?" value={facts.action} onChange={(value) => update('action', value)} placeholder="Start with an accurate action, such as Prepared the monthly accounts" />
      <ResumeField id={`${id}-scope`} label="Scope (optional)" value={facts.scope} onChange={(value) => update('scope', value)} hint="Volume, frequency, team or budget — only if you know it." />
      <ResumeField id={`${id}-method`} label="How did you do it? (optional)" value={facts.method} onChange={(value) => update('method', value)} />
      <ResumeField id={`${id}-result`} label="What changed? (optional)" value={facts.result} onChange={(value) => update('result', value)} hint="A specific qualitative result is valid. Do not add a percentage just to clear a prompt." />
      <div className="space-y-2 text-sm">
        <div><span className="block text-xs font-semibold text-muted mb-1">Current bullet</span><p className="rounded-input border border-line bg-surface p-3">{original || 'This bullet is blank.'}</p></div>
        <div><span className="block text-xs font-semibold text-muted mb-1">Your proposed wording</span><p className="rounded-input border border-accent-line bg-surface p-3">{proposal || 'Enter an action above to build a draft.'}</p></div>
      </div>
      <label className="flex items-start gap-2 text-sm text-ink">
        <input className="mt-1 accent-accent" type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />
        I checked that this wording is accurate.
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={!proposal || !checked} className="btn btn-secondary" onClick={() => { setUndo(original); onApply(proposal); setChecked(false); }}>
          Apply this wording <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
        {undo !== null && <button type="button" className="btn btn-ghost" onClick={() => { onApply(undo); setUndo(null); }}><Undo2 className="w-4 h-4" aria-hidden="true" /> Undo rewrite</button>}
      </div>
    </div>
  );
}
