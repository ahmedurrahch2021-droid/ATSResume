import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ArrowRight, Check, Download, FileText, Plus, ScanSearch, ShieldCheck, Sparkles, Upload, X } from 'lucide-react';
import type { PageRoute, ResumeData, TargetMarket } from '../types';
import type { UserAccount } from '../types/auth';
import { ROUTE_PATHS } from '../routes';
import { checkBioDataClutter, extractTextFromFile, purgeBioDataClutter, type ExtractedDocument } from '../utils/fileExtractor';
import { parseResumeText, SAMPLE_RESUMES } from '../utils/resumeParser';
import { draftForResume, loadDraft, saveDraft, type ResumeDraft, type DraftSource } from '../utils/resumeDraft';
import { auditResume, auditSummary, type AuditReport } from '../utils/resumeAudit';
import { EDITOR_SECTIONS, editorSearch, findingTarget, firstBulletForFinding, isEditorSection, type EditorSection, type EditorTarget } from '../utils/resumeActions';
import { createEmptyResume, documentPlainText, hasResumeContent, isResumeData, normalizeDocumentSettings, type ResumeDocumentSettings } from '../utils/resumeDocument';
import { downloadBlob, downloadResumeDocx, downloadResumeText, printResume, resumeFilename } from '../utils/resumeExporter';
import { ResumeSectionForm } from '../components/resume/ResumeSectionForm';
import { ResumePreview, type ResumeLayout } from '../components/resume/ResumePreview';
import { FindingCard, ResumeFindings } from '../components/resume/ResumeFindings';
import { PhotoUploader } from '../components/PhotoUploader';
import { LinkedInSyncModal } from '../components/LinkedInSyncModal';
import { PersonalConsultationModal } from '../components/PersonalConsultationModal';
import { RESUME_LAYOUTS, resumeLayout } from '../data/resumeLayouts';
import { SeniorDiagnosticPanel } from '../components/ai/SeniorDiagnosticPanel';
import { TargetCountrySelect } from '../components/common/TargetCountrySelect';
import { applyResumeCoachEdit, resumeCoachTargets } from '../utils/aiCoachTargets';

export interface ResumeWorkspacePageProps {
  onNavigate: (route: PageRoute) => void;
  onOpenOrder: (packageId?: 'starter' | 'boost' | 'full', preloaded?: { resume: string; jd: string }) => void;
  userAccount?: UserAccount;
  onOpenAuth?: () => void;
  initialResumeData?: ResumeData | null;
  draftImport?: ResumeDraft | null;
  onConsumeInitialData?: () => void;
}

export function ResumeWorkspacePage({ onNavigate, onOpenOrder, initialResumeData, draftImport, onConsumeInitialData }: ResumeWorkspacePageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [initial] = useState(() => {
    const stored = loadDraft();
    if (initialResumeData) return draftForResume(structuredClone(initialResumeData), 'template');
    if (draftImport && stored?.source.importedAt !== draftImport.source.importedAt) return draftImport;
    return stored ?? draftImport ?? draftForResume(createEmptyResume());
  });
  const [resume, setResume] = useState(initial.resume);
  const [source, setSource] = useState(initial.source);
  const [originalText, setOriginalText] = useState(initial.rawText);
  const [originalJobDescription, setOriginalJobDescription] = useState(initial.jobDescription ?? '');
  const [importReport, setImportReport] = useState(initial.report);
  const [jobDescription, setJobDescription] = useState(initial.jobDescription ?? '');
  const [settings, setSettings] = useState<ResumeDocumentSettings>(() => normalizeDocumentSettings(initial.settings));
  const [section, setSection] = useState<EditorSection>(() => { const value = new URLSearchParams(location.search).get('section'); return isEditorSection(value) ? value : 'contact'; });
  const [view, setView] = useState<'build' | 'keywords' | 'findings'>('build');
  const [mobilePane, setMobilePane] = useState<'edit' | 'preview'>('edit');
  const [previewMode, setPreviewMode] = useState<'paper' | 'text'>('paper');
  const [savedLocally, setSavedLocally] = useState(true);
  const [importError, setImportError] = useState('');
  const [processingFile, setProcessingFile] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [showImport, setShowImport] = useState(!hasResumeContent(initial.resume));
  const [dismissedNotice, setDismissedNotice] = useState(false);
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<EditorTarget | null>(null);
  const [exportError, setExportError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkedInOpen, setLinkedInOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const resumeRef = useRef(resume);
  resumeRef.current = resume;
  const formRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const importedId = useRef(initial.source.importedAt);
  const importGeneration = useRef(0);
  const layoutRef = useRef<ResumeLayout>({ pages: [], oversized: false });
  const [pageCount, setPageCount] = useState(1);

  const text = useMemo(() => documentPlainText(resume, settings), [resume, settings]);
  const audit = useMemo(() => auditResume({ text, jobDescription }), [text, jobDescription]);
  const counts = auditSummary(audit);
  const originalAudit = useMemo(() => originalText ? auditResume({ text: originalText, jobDescription: originalJobDescription, structure: source.structure, fileSize: source.size, fileName: source.fileName }) : null, [originalText, source, originalJobDescription]);
  const allFindings = [...audit.format, ...audit.content];
  const openFindings = allFindings.filter((finding) => finding.severity !== 'pass');
  const sectionFindings = openFindings.filter((finding) => findingTarget(finding).section === section);
  const workingFinding = selectedRule ? allFindings.find((finding) => finding.id === selectedRule && finding.severity !== 'pass') ?? originalAudit?.format.concat(originalAudit.content).find((finding) => finding.id === selectedRule) : undefined;
  const selectedStillFlagged = openFindings.some((finding) => finding.id === selectedRule);
  const selectedFileRule = Boolean(selectedRule && /^FMT-0[1-5]$/.test(selectedRule));
  const sectionInfo = EDITOR_SECTIONS.find((item) => item.id === section)!;
  const coachTargets = useMemo(() => resumeCoachTargets(resume), [resume]);
  const coachDefaultId = section === 'experience' ? coachTargets.find((target) => target.id.startsWith('experience:'))?.id : section === 'projects' ? coachTargets.find((target) => target.id.startsWith('project:'))?.id : 'summary';

  const applyDraft = useCallback((draft: ResumeDraft) => {
    importedId.current = draft.source.importedAt;
    setResume(draft.resume); setSource(draft.source); setOriginalText(draft.rawText); setImportReport(draft.report);
    setJobDescription(draft.jobDescription ?? ''); setOriginalJobDescription(draft.jobDescription ?? ''); setSettings(normalizeDocumentSettings(draft.settings));
    setDismissedNotice(false); setSelectedRule(null); setSection('contact'); setView('build'); setMobilePane('edit'); setImportError(''); setShowImport(false);
  }, []);

  useEffect(() => {
    if (initialResumeData || draftImport) onConsumeInitialData?.();
  }, [initialResumeData, draftImport, onConsumeInitialData]);

  useEffect(() => {
    if (draftImport && draftImport.source.importedAt !== importedId.current) applyDraft(draftImport);
  }, [draftImport, applyDraft]);

  // No account or pretend cloud save: persist the actual fields and job posting.
  useEffect(() => {
    setSavedLocally(saveDraft({ resume, report: importReport, rawText: originalText, source, jobDescription, settings }));
  }, [resume, importReport, originalText, source, jobDescription, settings]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const target = params.get('section');
    if (!isEditorSection(target)) return;
    setSection(target); setView('build'); setMobilePane('edit');
    const findingId = params.get('finding') ?? undefined;
    setSelectedRule(findingId ?? null);
    setFocusRequest({ section: target, findingId, field: params.get('field') ?? undefined });
  }, [location.key, location.search]);

  useEffect(() => {
    if (!focusRequest || view !== 'build' || section !== focusRequest.section) return;
    const bulletId = firstBulletForFinding(resume, focusRequest.findingId);
    const field = focusRequest.field ? document.getElementById(`resume-${focusRequest.field}`) : bulletId ? document.getElementById(bulletId) : null;
    const target = field ?? formRef.current?.querySelector<HTMLElement>('input:not([type=file]), textarea, select') ?? document.getElementById('workspace-section-title');
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    setFocusRequest(null);
  }, [focusRequest, section, view]);

  const openEditorTarget = (target: EditorTarget) => {
    setView('build'); setMobilePane('edit'); setSection(target.section); setSelectedRule(target.findingId ?? null);
    navigate(`${ROUTE_PATHS.editor}${editorSearch(target)}`);
  };
  const chooseSection = (value: EditorSection) => openEditorTarget({ section: value });

  const applyExtracted = (extracted: ExtractedDocument, origin: DraftSource['origin'] = 'upload') => {
    const parsed = parseResumeText(extracted.text);
    applyDraft({ version: 1, resume: parsed.resume, report: parsed.report, rawText: extracted.text, jobDescription: '', settings,
      source: { fileName: extracted.fileName, kind: extracted.kind, size: extracted.size, pages: extracted.structure.pages, structure: extracted.structure, warnings: extracted.warnings, importedAt: new Date().toISOString(), origin } });
    navigate(`${ROUTE_PATHS.editor}?section=contact`, { replace: true });
  };

  const importFile = async (file: File) => {
    const generation = ++importGeneration.current;
    setProcessingFile(true); setImportError('');
    try {
      if (file.name.toLowerCase().endsWith('.json')) {
        if (file.size > 10 * 1024 * 1024) throw new Error('The import limit is 10 MB.');
        const restored = JSON.parse(await file.text());
        if (!isResumeData(restored)) throw new Error('This is not a supported resume JSON backup.');
        if (generation !== importGeneration.current) return;
      const draft = draftForResume(restored, 'paste', settings); draft.source.fileName = file.name; applyDraft(draft);
      navigate(`${ROUTE_PATHS.editor}?section=contact`, { replace: true });
      } else {
        const extracted = await extractTextFromFile(file);
        if (generation !== importGeneration.current) return;
        applyExtracted(extracted);
      }
    } catch (error) {
      if (generation === importGeneration.current) setImportError(`${(error as Error).message} Your current draft has not been replaced.`);
    } finally { if (generation === importGeneration.current) setProcessingFile(false); }
  };

  const loadExample = (key: keyof typeof SAMPLE_RESUMES) => {
    if (hasResumeContent(resume) && !window.confirm('Replace this draft with a fictional example? Download a backup first if you want to keep it.')) return;
    applyDraft(draftForResume(structuredClone(SAMPLE_RESUMES[key]), 'example', settings));
    navigate(ROUTE_PATHS.editor, { replace: true });
  };
  const startBlank = () => {
    if (hasResumeContent(resume) && !window.confirm('Start a blank resume and replace this draft? Download a backup first if you want to keep it.')) return;
    applyDraft(draftForResume(createEmptyResume()));
    setShowImport(true);
    navigate(ROUTE_PATHS.editor, { replace: true });
  };
  const onLayout = useCallback((layout: ResumeLayout) => { layoutRef.current = layout; setPageCount(layout.pages.length); }, []);
  const measuredPages = () => !layoutRef.current.oversized && layoutRef.current.settingsKey === JSON.stringify(settings) ? layoutRef.current.pages : undefined;
  const exportDocx = async () => {
    setExporting(true); setExportError('');
    try { await downloadResumeDocx(resume, settings, measuredPages()); }
    catch (error) { setExportError((error as Error).message); }
    finally { setExporting(false); }
  };
  const copyText = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 2000); }
    catch { setExportError('Copy was blocked. Download a TXT file instead.'); }
  };

  return (
    <div className="resume-workspace bg-paper pb-16">
      <div className="workspace-toolbar border-b border-line bg-surface">
        <div className="workspace-container py-5 flex flex-wrap items-center justify-between gap-5">
          <div className="min-w-0">
            <p className="eyebrow">Check → edit → download</p>
            <h1 className="mt-1 text-2xl sm:text-3xl">Your resume workspace</h1>
            <p className="mt-1 flex items-center gap-2 text-xs text-muted"><ShieldCheck className="w-4 h-4 text-success" aria-hidden="true" />{savedLocally ? 'Autosaved in this browser. No account required.' : 'Session only: browser storage was blocked. Download a backup before leaving.'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => setCoachOpen(true)}><Sparkles className="w-4 h-4" aria-hidden="true" />AI Writing Coach</button>
            <button type="button" className="btn btn-secondary" onClick={() => { setView('findings'); setSelectedRule(null); }}><ScanSearch className="w-4 h-4" aria-hidden="true" />Check draft <span className="text-xs text-muted">{counts.toFix + counts.toCheck}</span></button>
            <button type="button" className={`btn ${section === 'export' && view === 'build' ? 'btn-secondary' : 'btn-primary'}`} onClick={() => chooseSection('export')}><Download className="w-4 h-4" aria-hidden="true" />Download</button>
          </div>
        </div>
      </div>
      <div className="workspace-container pt-6 space-y-5">
        <div className="flex flex-wrap items-end gap-3"><TargetCountrySelect compact value={resume.targetCountry ?? 'global'} onChange={(targetCountry) => setResume((current) => ({ ...current, targetCountry }))} /><p className="max-w-2xl text-xs text-muted">Guidance follows the target country and actual vacancy. This choice does not change your facts, photo or page length; document appearance remains under Layout & region.</p></div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1 rounded-card border border-line bg-soft p-1" aria-label="Workspace views">
            {([['build', 'Edit resume'], ['keywords', 'Job terms'], ['findings', 'Findings']] as const).map(([id, label]) => <button key={id} type="button" aria-pressed={view === id} className={`min-h-11 rounded-btn px-4 text-sm font-medium ${view === id ? 'bg-surface text-ink shadow-card' : 'text-muted hover:text-ink'}`} onClick={() => setView(id)}>{label}</button>)}
          </div>
          <button type="button" className="btn btn-ghost" aria-expanded={showImport} onClick={() => setShowImport((current) => !current)}><Upload className="w-4 h-4" aria-hidden="true" />Import / examples</button>
        </div>
        {!savedLocally && <p role="status" className="rounded-card border border-warning/30 bg-warning-soft p-4 text-sm text-warning">Edits remain in this tab, but may be lost on refresh. Save a JSON backup or download the document now.</p>}
        {source.origin === 'example' || source.origin === 'template' ? <p className="rounded-card border border-warning/30 bg-warning-soft p-4 text-sm text-warning">This is a fictional example, not your career history. Replace every detail before applying.</p> : null}
        {showImport && <ImportPanel processing={processingFile} error={importError} fileRef={fileRef} onFile={importFile} pasteText={pasteText} onPasteChange={setPasteText} onPaste={() => { if (!pasteText.trim()) { setImportError('Paste your resume text first.'); return; } applyExtracted({ text: pasteText, fileName: 'Pasted resume', kind: 'text', size: pasteText.length, structure: { tables: 0, headers: 0, footers: 0, textBoxes: 0, images: 0, noTextLayer: false }, warnings: [] }, 'paste'); }} onExample={loadExample} onBlank={startBlank} />}
        {source.origin === 'upload' && !dismissedNotice && <div className="flex items-start justify-between gap-4 rounded-card border border-accent-line bg-accent-soft/40 p-4"><div><p className="text-sm font-semibold">Opened from {source.fileName}</p><p className="mt-1 text-xs text-muted">{importReport.found} of {importReport.total} tracked fields were read. Missing fields were not guessed. Optional fields are not required for every resume. Compare the original text before downloading.</p></div><button type="button" className="min-h-11 min-w-11 rounded-btn text-muted hover:bg-surface" aria-label="Dismiss import notice" onClick={() => setDismissedNotice(true)}><X className="w-4 h-4 mx-auto" aria-hidden="true" /></button></div>}
        {view === 'build' && <div className="workspace-columns">
          <WorkspaceNavigation section={section} findings={openFindings.map(findingTarget)} onSelect={chooseSection} onLinkedIn={() => setLinkedInOpen(true)} onCoverLetter={() => onNavigate('cover-letter')} />
          <div className="lg:hidden flex gap-2"><button type="button" aria-pressed={mobilePane === 'edit'} className="btn btn-secondary flex-1" onClick={() => setMobilePane('edit')}>Edit</button><button type="button" aria-pressed={mobilePane === 'preview'} className="btn btn-secondary flex-1" onClick={() => setMobilePane('preview')}>Preview</button></div>
          <div ref={formRef} className={`workspace-form-pane ${mobilePane === 'preview' ? 'workspace-mobile-hidden' : ''}`}>
            <section className="card p-5 sm:p-6 space-y-6" aria-labelledby="workspace-section-title">
              <div className="border-b border-line pb-4"><h2 id="workspace-section-title" tabIndex={-1} className="text-xl">{sectionInfo.label}</h2><p className="mt-1 text-sm text-muted">{sectionInfo.hint}</p></div>
              {workingFinding && <div className="rounded-card border border-accent-line bg-accent-soft/40 p-4 space-y-2"><p className="eyebrow">Working on {workingFinding.id}</p><h3 className="text-sm">{workingFinding.title}</h3><p className="text-sm text-muted">{workingFinding.fix}</p>{!selectedStillFlagged && <p role="status" className="text-xs font-medium text-success">{selectedFileRule ? 'Download and re-upload the new file to verify this format prompt.' : 'No longer flagged in the current draft. Review the wording before you finish.'}</p>}<button type="button" className="min-h-11 text-sm font-medium text-accent" onClick={() => setView('findings')}>Return to findings →</button></div>}
              <ResumeSectionForm section={section} resume={resume} onChange={setResume} />
              {section === 'design' && <DesignPanel resume={resume} settings={settings} onResume={setResume} onSettings={setSettings} />}
              {section === 'source' && <OriginalTextPanel text={originalText} source={source} onKeepText={(value) => { setResume((current) => ({ ...current, additionalInformation: [current.additionalInformation, value].filter(Boolean).join('\n\n') })); chooseSection('extras'); }} />}
               {section === 'export' && <ExportPanel hasContent={hasResumeContent(resume)} exporting={exporting} error={exportError} onDocx={exportDocx} onPdf={() => printResume(resume, settings, measuredPages())} onText={() => downloadResumeText(resume, settings)} onJson={() => downloadBlob(new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' }), `${resumeFilename(resume)}_resume.json`)} onCopy={copyText} copied={copied} onRecheck={() => onNavigate('free-resume-score')} />}
              {sectionFindings.length > 0 && section !== 'export' && <div className="border-t border-line pt-5"><p className="text-xs text-muted mb-3">Current prompts for this section — not an employer verdict:</p><ul className="space-y-3">{sectionFindings.map((finding) => <FindingCard key={finding.id} finding={finding} />)}</ul></div>}
            </section>
          </div>
          <div className={`workspace-preview-pane ${mobilePane === 'edit' ? 'workspace-mobile-hidden' : ''}`}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3 mb-3"><p className="text-sm font-medium">Your document · {pageCount} page{pageCount === 1 ? '' : 's'}</p><div className="flex gap-1">{([['paper', 'Paper'], ['text', 'Plain text']] as const).map(([id, label]) => <button key={id} type="button" className={`min-h-11 rounded-btn px-3 text-xs ${previewMode === id ? 'bg-surface border border-line text-ink' : 'text-muted'}`} aria-pressed={previewMode === id} onClick={() => setPreviewMode(id)}>{label}</button>)}</div></div>
            <div className={previewMode === 'text' ? 'hidden' : ''}><ResumePreview resume={resume} settings={settings} onLayout={onLayout} /></div>
            {previewMode === 'text' && <div className="card p-5 space-y-3"><p className="text-xs text-muted">Generated from the current fields, not extracted from an exported PDF or an employer’s ATS.</p><pre className="whitespace-pre-wrap break-words text-xs leading-relaxed font-mono">{text || 'No content entered yet.'}</pre><button type="button" className="btn btn-secondary" onClick={copyText}>{copied ? 'Copied' : 'Copy text'}</button></div>}
          </div>
        </div>}
        {view === 'keywords' && <KeywordPanel audit={audit} jobDescription={jobDescription} onJobDescription={setJobDescription} onEdit={openEditorTarget} />}
        {view === 'findings' && <div className="space-y-8"><ResumeFindings audit={audit} onEdit={openEditorTarget} />{originalAudit && <details className="card p-5"><summary className="min-h-11 cursor-pointer text-sm font-medium">See the original file’s findings (kept separately)</summary><div className="mt-4"><ResumeFindings audit={originalAudit} onEdit={openEditorTarget} context="original" /></div></details>}<p className="text-sm text-muted">Layout checks for the upload are not re-verified by editing fields. Download the new file and upload it to the checker to inspect that file.</p></div>}
        <div className="border-t border-line pt-6 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-medium">Free editing first. Optional second pair of eyes.</p><p className="mt-1 text-xs text-muted">Fix, save and download for free. Optional online coaching sends the selected text to Gemini when requested and configured.</p></div><button type="button" className="btn btn-ghost" onClick={() => setReviewOpen(true)}>Human review options <ArrowRight className="w-4 h-4" aria-hidden="true" /></button></div>
      </div>
      <LinkedInSyncModal isOpen={linkedInOpen} onClose={() => setLinkedInOpen(false)} resumeData={resume} />
      <SeniorDiagnosticPanel isOpen={coachOpen} onClose={() => setCoachOpen(false)} targets={coachTargets} contextId={`resume:${source.importedAt}`} defaultTargetId={coachDefaultId} targetRole={resume.targetTitle} targetCountry={resume.targetCountry ?? 'global'} onTargetCountryChange={(targetCountry) => setResume((current) => ({ ...current, targetCountry }))} jobDescription={jobDescription} flawsDetected={openFindings.slice(0, 8).map((finding) => `${finding.id}: ${finding.title}. ${finding.evidence}`)} onApplyFix={(id, originalText, newText) => { const next = applyResumeCoachEdit(resumeRef.current, id, originalText, newText); if (!next) return false; resumeRef.current = next; setResume(next); return true; }} />
      <PersonalConsultationModal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} resumeData={resume} onProceedOrder={(pkg, notes, url) => onOpenOrder(pkg, { resume: text, jd: `${jobDescription}${url ? `\nJob URL: ${url}` : ''}${notes ? `\nNotes: ${notes}` : ''}` })} />
    </div>
  );
}

// Panels below keep the workspace composition separate from the field editor.

interface ImportPanelProps {
  processing: boolean;
  error: string;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onFile: (file: File) => Promise<void>;
  pasteText: string;
  onPasteChange: (text: string) => void;
  onPaste: () => void;
  onExample: (key: keyof typeof SAMPLE_RESUMES) => void;
  onBlank: () => void;
}

function ImportPanel({ processing, error, fileRef, onFile, pasteText, onPasteChange, onPaste, onExample, onBlank }: ImportPanelProps) {
  return (
    <div className="card p-5 sm:p-6 space-y-5">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-card border border-dashed border-accent-line bg-soft p-5" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files[0]; if (file) void onFile(file); }}>
          <h2 className="text-lg">Bring your own resume</h2>
          <p className="mt-2 mb-4 text-sm text-muted">Drop a PDF, DOCX, TXT or JSON backup here. Up to 10 MB. Extraction runs in this browser.</p>
          <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.json" className="hidden" aria-label="Choose a resume file" onChange={(event) => { const file = event.target.files?.[0]; if (file) void onFile(file); event.target.value = ''; }} />
          <button type="button" disabled={processing} className="btn btn-secondary" onClick={() => fileRef.current?.click()}><Upload className="w-4 h-4" aria-hidden="true" />{processing ? 'Reading file…' : 'Choose a file'}</button>
          <p className="mt-3 text-xs text-muted">Importing a valid file replaces the current draft. Download a JSON backup first if you want to keep another version.</p>
        </div>
        <div className="space-y-3">
          <label htmlFor="workspace-import-text" className="block text-sm font-medium">Or paste the resume text</label>
          <textarea id="workspace-import-text" rows={4} className="field" value={pasteText} onChange={(event) => onPasteChange(event.target.value)} placeholder="Paste your actual resume here…" />
          <button type="button" disabled={processing || !pasteText.trim()} className="btn btn-secondary" onClick={onPaste}>Read this text <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
        </div>
      </div>
      {error && <p role="alert" className="rounded-card border border-danger/30 bg-danger-soft p-3 text-sm text-danger">{error}</p>}
      <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <span className="text-xs text-muted mr-1">Fictional examples:</span>
        {([['developer', 'Developer'], ['bangladesh', 'Bangladesh tech'], ['product', 'Product'], ['devops', 'DevOps']] as const).map(([key, label]) => <button key={key} type="button" className="btn btn-ghost" onClick={() => onExample(key)}>{label}</button>)}
        <button type="button" className="btn btn-secondary" onClick={onBlank}><Plus className="w-4 h-4" aria-hidden="true" />Start blank</button>
      </div>
    </div>
  );
}

function WorkspaceNavigation({ section, findings, onSelect, onLinkedIn, onCoverLetter }: {
  section: EditorSection; findings: EditorTarget[]; onSelect: (section: EditorSection) => void; onLinkedIn: () => void; onCoverLetter: () => void;
}) {
  return (
    <aside className="workspace-navigation">
      <div className="lg:hidden space-y-1.5">
        <label htmlFor="workspace-section-select" className="text-xs font-medium text-muted">Resume section</label>
        <select id="workspace-section-select" className="field" value={section} onChange={(event) => onSelect(event.target.value as EditorSection)}>{EDITOR_SECTIONS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
      </div>
      <nav aria-label="Resume sections" className="hidden lg:block space-y-1">
        <p className="eyebrow mb-3">Your sections</p>
        {EDITOR_SECTIONS.map((item) => {
          const count = findings.filter((finding) => finding.section === item.id).length;
          return <button key={item.id} type="button" aria-current={section === item.id ? 'step' : undefined} className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-btn px-3 text-left text-sm ${section === item.id ? 'bg-accent-soft text-accent font-medium' : 'text-muted hover:bg-soft hover:text-ink'}`} onClick={() => onSelect(item.id)}><span>{item.label}</span>{count > 0 && <span className="text-xs text-warning" aria-label={`${count} review prompts`}>{count}</span>}</button>;
        })}
      </nav>
      <div className="flex flex-wrap gap-1 lg:flex-col lg:border-t lg:border-line lg:mt-5 lg:pt-4">
        <button type="button" className="min-h-11 rounded-btn px-3 text-left text-xs text-muted hover:bg-soft" onClick={onLinkedIn}>LinkedIn text</button>
        <button type="button" className="min-h-11 rounded-btn px-3 text-left text-xs text-muted hover:bg-soft" onClick={onCoverLetter}>Cover letter builder</button>
      </div>
    </aside>
  );
}

function DesignPanel({ resume, settings, onResume, onSettings }: { resume: ResumeData; settings: ResumeDocumentSettings; onResume: React.Dispatch<React.SetStateAction<ResumeData>>; onSettings: React.Dispatch<React.SetStateAction<ResumeDocumentSettings>> }) {
  return (
    <div className="space-y-6">
       <div className="rounded-card border border-line bg-soft p-4 space-y-2"><p className="font-medium text-sm">Single-column body text</p><p className="text-sm text-muted">Standard headings and contact details in the body. The selected section order supplies the paper preview, DOCX and plain text. An optional photo is a separate image, not a text column.</p></div>
       <div className="space-y-2"><label htmlFor="resume-layout" className="block text-sm font-medium">Document layout</label><select id="resume-layout" className="field" value={settings.layout ?? 'modern'} onChange={(event) => onSettings({ ...resumeLayout(event.target.value).settings })}>{RESUME_LAYOUTS.map((layout) => <option key={layout.id} value={layout.id}>{layout.name}</option>)}</select><p className="text-xs text-muted">{resumeLayout(settings.layout).description} Choosing a layout sets its font, colour and spacing; your career details are kept.</p><a href={`${ROUTE_PATHS['country-guides']}#layout-${settings.layout ?? 'modern'}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm font-medium text-accent underline underline-offset-4">Layout features & sources <span className="sr-only">(opens in a new tab)</span></a></div>
      <div className="space-y-2"><label htmlFor="resume-market" className="block text-sm font-medium">Application region</label><select id="resume-market" className="field" value={resume.targetMarket ?? 'global'} onChange={(event) => onResume((current) => ({ ...current, targetMarket: event.target.value as TargetMarket }))}><option value="global">International / employer-specific</option><option value="bangladesh">Bangladesh</option><option value="us_uk">US / UK — omit photo</option></select><p className="text-xs text-muted">Region selection never changes your career details. The US / UK option omits the photo and nationality from the exported document. Other regions allow you to choose.</p></div>
      <TargetCountrySelect value={resume.targetCountry ?? 'global'} onChange={(targetCountry) => onResume((current) => ({ ...current, targetCountry }))} label="Country guidance preference" />
      {resume.targetMarket === 'bangladesh' && <p className="rounded-card bg-soft border border-line p-3 text-xs text-muted">Corporate resumes and government application forms have different requirements. Follow the specific vacancy’s instructions; Teletalk form fields are not a universal corporate CV checklist.</p>}
      <div className="space-y-2"><label htmlFor="resume-font" className="block text-sm font-medium">Document font</label><select id="resume-font" className="field" value={settings.font} onChange={(event) => onSettings((current) => ({ ...current, font: event.target.value as ResumeDocumentSettings['font'] }))}>{['Arial', 'Calibri', 'Georgia'].map((font) => <option key={font}>{font}</option>)}</select></div>
      <div className="space-y-2"><label htmlFor="resume-spacing" className="block text-sm font-medium">Line spacing</label><select id="resume-spacing" className="field" value={settings.spacing} onChange={(event) => onSettings((current) => ({ ...current, spacing: event.target.value as ResumeDocumentSettings['spacing'] }))}><option value="standard">Standard</option><option value="compact">Compact</option></select><p className="text-xs text-muted">Two or three pages are supported. Keep necessary experience rather than shrinking the text to force one page.</p></div>
       <div className="space-y-2"><label htmlFor="resume-accent" className="block text-sm font-medium">Heading colour</label><div className="flex items-center gap-3"><input id="resume-accent" type="color" className="h-11 w-14 rounded-input border border-line bg-surface p-1" value={settings.accent} onChange={(event) => onSettings((current) => ({ ...current, accent: event.target.value }))} /><span className="text-sm font-mono text-muted">{settings.accent}</span><button type="button" className="btn btn-ghost" onClick={() => onSettings((current) => ({ ...current, accent: resumeLayout(current.layout).settings.accent }))}>Reset</button></div><p className="text-xs text-muted">Keep strong contrast on white paper and check the document at 100% zoom.</p></div>
      <PhotoUploader photoUrl={resume.photoUrl} photoShape={resume.photoShape} isAntiBiasMode={resume.targetMarket === 'us_uk'} onUpdatePhoto={(photoUrl, photoShape) => onResume((current) => ({ ...current, photoUrl, photoShape }))} />
      {(['nationality', 'drivingLicense', 'remoteReadiness'] as const).map((key) => <div key={key} className="space-y-2"><label htmlFor={`resume-${key}`} className="block text-sm font-medium">{key === 'nationality' ? 'Nationality (optional)' : key === 'drivingLicense' ? 'Driving licence (optional)' : 'Remote-work details (optional)'}</label><input id={`resume-${key}`} className="field" value={resume[key] ?? ''} onChange={(event) => onResume((current) => ({ ...current, [key]: event.target.value }))} /></div>)}
    </div>
  );
}

function OriginalTextPanel({ text, source, onKeepText }: { text: string; source: DraftSource; onKeepText: (text: string) => void }) {
  const personalFields = checkBioDataClutter(text);
  const cleaned = purgeBioDataClutter(text);
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted">{source.fileName} · {source.kind.toUpperCase()}{source.pages ? ` · ${source.pages} pages in the original PDF` : ''}</p>
      <p className="text-sm text-muted">This is the original extraction, kept for comparison. The field parser can miss or misassign information. Use the section navigation to correct it; editing does not overwrite this reference.</p>
      {source.warnings.length > 0 && <ul className="list-disc pl-5 space-y-2 text-xs text-muted">{source.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>}
      <label htmlFor="original-resume-text" className="block text-sm font-medium">Original body text</label>
      <textarea id="original-resume-text" className="field font-mono text-xs" rows={16} readOnly value={text} placeholder="No file imported. Your current fields are shown under Plain text in the preview." />
      {source.structure.outsideText && <div className="space-y-2"><label htmlFor="original-outside-text" className="block text-sm font-medium">Text found in DOCX headers / footers</label><textarea id="original-outside-text" className="field font-mono text-xs" rows={6} readOnly value={source.structure.outsideText} /><p className="text-xs text-muted">Copy essential details into the appropriate fields. They were not automatically merged into your body text.</p></div>}
      {personalFields.hasBioDataClutter && <details className="rounded-card border border-warning/30 bg-warning-soft/40 p-4 text-sm"><summary className="min-h-11 cursor-pointer font-medium">Review personal fields ({personalFields.detectedFields.length})</summary><p className="mt-2 text-muted">Follow the actual application instructions. These fields can be required on some government forms and unnecessary for a corporate resume.</p><ul className="mt-3 space-y-2">{personalFields.detectedFields.map((field) => <li key={field.field}><strong>{field.field}:</strong> {field.foundText}<p className="text-xs text-muted">{field.recommendation}</p></li>)}</ul><label htmlFor="cleaned-source-preview" className="mt-4 block text-sm font-medium">Preview with removable personal-field patterns omitted</label><textarea id="cleaned-source-preview" className="field mt-2 font-mono" rows={8} readOnly value={cleaned} /><p className="mt-2 text-xs text-muted">Review this before using it. Pattern removal is limited to the listed categories; the original text remains above.</p><button type="button" className="btn btn-secondary mt-3" onClick={() => onKeepText(cleaned)}>Use this reviewed text</button></details>}
      {text && <details className="rounded-card border border-line p-4 text-sm"><summary className="min-h-11 cursor-pointer font-medium">Keep unmapped text in the document</summary><p className="mt-2 text-muted">If most of the file was not mapped, copy it into Additional information and edit it there. Remove duplicate content already present in the standard sections.</p><button type="button" className="btn btn-secondary mt-4" onClick={() => onKeepText(text)}>Copy to additional information</button></details>}
    </div>
  );
}

function ExportPanel({ hasContent, exporting, error, onDocx, onPdf, onText, onJson, onCopy, copied, onRecheck }: {
  hasContent: boolean; exporting: boolean; error: string; onDocx: () => void; onPdf: () => void; onText: () => void; onJson: () => void; onCopy: () => void; copied: boolean; onRecheck: () => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted">Follow the employer’s file instructions. Review every field against your original and check names, dates, links and page breaks.</p>
      {!hasContent && <p className="text-sm text-warning">Add your resume details before downloading.</p>}
      <div className="space-y-3">
        <button type="button" className="btn btn-primary w-full" disabled={!hasContent || exporting} onClick={onDocx}><Download className="w-4 h-4" aria-hidden="true" />{exporting ? 'Preparing DOCX…' : 'Download Word (.docx)'}</button>
        <p className="text-xs text-muted">A real, editable Word document. Fonts and pagination can vary between Word, Google Docs and the browser preview.</p>
        <button type="button" className="btn btn-secondary w-full" disabled={!hasContent} onClick={onPdf}><FileText className="w-4 h-4" aria-hidden="true" />Print / Save as PDF</button>
        <p className="text-xs text-muted">In the print dialog, choose Save as PDF, A4, 100% scale and no browser headers / footers. Review the print preview before saving.</p>
      </div>
      {error && <p role="alert" className="rounded-card border border-danger/30 bg-danger-soft p-3 text-sm text-danger">{error}</p>}
      <div className="border-t border-line pt-5 space-y-3"><p className="text-sm font-medium">Plain text and backup</p><div className="flex flex-wrap gap-2"><button type="button" className="btn btn-secondary" disabled={!hasContent} onClick={onText}>Download TXT</button><button type="button" className="btn btn-secondary" onClick={onJson}>JSON backup</button><button type="button" className="btn btn-ghost" disabled={!hasContent} onClick={onCopy}>{copied ? <Check className="w-4 h-4" aria-hidden="true" /> : null}{copied ? 'Copied' : 'Copy text'}</button></div><p className="text-xs text-muted">A JSON backup keeps the editable fields and can be imported here later. Browser storage can be cleared, so keep a download.</p></div>
      <div className="rounded-card border border-line bg-soft p-4 space-y-3"><h3 className="text-base">Check the file you will send</h3><p className="text-sm text-muted">Field checks cannot establish how the exported file will be read. Upload the downloaded PDF or DOCX for a fresh extraction report.</p><button type="button" className="btn btn-secondary" onClick={onRecheck}>Check the exported file <ArrowRight className="w-4 h-4" aria-hidden="true" /></button></div>
    </div>
  );
}

function KeywordPanel({ audit, jobDescription, onJobDescription, onEdit }: { audit: AuditReport; jobDescription: string; onJobDescription: (text: string) => void; onEdit: (target: EditorTarget) => void }) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <section className="card p-5 sm:p-6 space-y-4">
        <h2 className="text-xl">Use the actual job posting</h2>
        <p className="text-sm text-muted">This description is saved alongside your draft. No sample posting is loaded automatically.</p>
        <label htmlFor="workspace-job-description" className="block text-sm font-medium">Target job description</label>
        <textarea id="workspace-job-description" className="field" rows={14} value={jobDescription} onChange={(event) => onJobDescription(event.target.value)} placeholder="Paste the posting you are applying to…" />
      </section>
      <section className="card p-5 sm:p-6 space-y-5">
        <h2 className="text-xl">Keyword coverage</h2>
        {audit.keywords.hasJobDescription ? <>
          <p className="text-sm text-muted">{audit.keywords.covered} of {audit.keywords.total} frequent terms appear in your current draft. This is vocabulary overlap, not suitability or an ATS score.</p>
          <ul className="flex flex-wrap gap-2">{audit.keywords.terms.map((term) => <li key={term.term} className={`chip border ${term.inResume ? 'border-success/30 bg-success-soft text-success' : 'border-line bg-soft text-muted'}`}>{term.inResume && <Check className="w-3.5 h-3.5" aria-hidden="true" />}{term.term}<span className="text-[11px]">{term.inResume ? 'present' : 'not found'}</span></li>)}</ul>
          <p className="text-sm text-muted">If a missing term accurately describes your work, use the employer’s wording and show evidence in a contribution bullet. Leave it out if it is not true. Not every frequent word is a skill.</p>
          <div className="flex flex-wrap gap-2"><button type="button" className="btn btn-secondary" onClick={() => onEdit({ section: 'skills', findingId: 'CNT-08' })}>Edit skills</button><button type="button" className="btn btn-secondary" onClick={() => onEdit({ section: 'experience', findingId: 'CNT-08' })}>Edit supporting experience</button></div>
        </> : <p className="text-sm text-muted">Paste at least 30 characters of the job posting to begin. No comparison is made without a description.</p>}
        <p className="border-t border-line pt-4 text-xs text-muted leading-relaxed">{audit.keywords.method}</p>
      </section>
    </div>
  );
}
