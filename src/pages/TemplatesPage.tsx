import React, { useMemo, useState } from 'react';
import { Copy, Download, Eye, X } from 'lucide-react';
import { ATS_TEMPLATES } from '../data/mockData';
import type { ResumeTemplate, PageRoute, ResumeData } from '../types';
import { EmailSubscriptionBox } from '../components/EmailSubscriptionBox';
import { Modal } from '../components/Modal';
import { ResumePreview, type ResumeLayout } from '../components/resume/ResumePreview';
import { DEFAULT_DOCUMENT_SETTINGS, documentPlainText, hasResumeContent } from '../utils/resumeDocument';
import { downloadResumeDocx, printResume } from '../utils/resumeExporter';
import { resumeFromTemplate } from '../utils/templateResume';
import { loadDraft } from '../utils/resumeDraft';

interface TemplatesPageProps { onNavigate: (route: PageRoute) => void; onOpenOrder: (packageId?: 'starter' | 'boost' | 'full') => void; onOpenInEditor?: (data: ResumeData) => void }

const CATEGORIES = [
  ['all', 'All starters'], ['tech', 'Tech & engineering'], ['product', 'Product & growth'], ['finance', 'Finance & operations'], ['entry', 'Early career'],
] as const;

export function TemplatesPage({ onNavigate, onOpenInEditor }: TemplatesPageProps) {
  const [category, setCategory] = useState('all');
  const [preview, setPreview] = useState<ResumeTemplate | null>(null);
  const [message, setMessage] = useState('');
  const [exporting, setExporting] = useState<string | null>(null);
  const [layout, setLayout] = useState<ResumeLayout>({ pages: [], oversized: false });
  const previewResume = useMemo(() => preview ? resumeFromTemplate(preview) : null, [preview]);
  const openEditor = (template: ResumeTemplate) => {
    const current = loadDraft();
    if (current && hasResumeContent(current.resume) && !window.confirm('Replace your current resume draft with this fictional example? Download a JSON backup in the editor first if you want to keep it.')) return;
    setPreview(null);
    if (onOpenInEditor) onOpenInEditor(resumeFromTemplate(template)); else onNavigate('suite');
  };
  const download = async (template: ResumeTemplate) => {
    setExporting(template.id);
    try { await downloadResumeDocx(resumeFromTemplate(template), DEFAULT_DOCUMENT_SETTINGS); setMessage('Fictional sample DOCX prepared. Replace the sample facts with your own before applying.'); }
    catch (error) { setMessage(`Could not download: ${(error as Error).message}`); }
    finally { setExporting(null); }
  };
  const copy = async (template: ResumeTemplate) => {
    try { await navigator.clipboard.writeText(documentPlainText(resumeFromTemplate(template))); setMessage('Fictional example text copied. Replace the facts with your own.'); }
    catch { setMessage('Clipboard access was blocked. Open the sample in the editor to download text.'); }
  };

  return (
    <div className="section bg-soft">
      <div className="container-page space-y-8">
        <div className="max-w-2xl"><p className="eyebrow">Free single-column starters</p><h1 className="mt-3 text-3xl sm:text-4xl">Start with a clear document.</h1><p className="mt-4 text-muted">{ATS_TEMPLATES.length} profession-specific examples use the same body-flow document layout as the editor. They are fictional starting points—not verified customer resumes or a promise of compatibility with every ATS.</p></div>
        <div className="flex flex-wrap gap-2" aria-label="Template categories">{CATEGORIES.map(([id, label]) => <button type="button" key={id} className={`btn ${category === id ? 'btn-secondary' : 'btn-ghost'}`} aria-pressed={category === id} onClick={() => setCategory(id)}>{label}</button>)}</div>
        {message && <p role="status" className="text-sm text-muted">{message}</p>}
        <div className="grid gap-6 md:grid-cols-2">
          {ATS_TEMPLATES.filter((item) => category === 'all' || item.category === category).map((template) => <section key={template.id} className="card flex min-w-0 flex-col p-5 sm:p-6">
            <p className="eyebrow">{template.categoryLabel}</p><h2 className="mt-2 text-xl">{template.title}</h2><p className="mt-3 text-sm text-muted">For {template.recommendedFor.toLowerCase()}.</p>
            <p className="mt-4 text-xs text-muted">Single-column · body contact block · editable DOCX. Preview the full example before replacing the facts.</p>
            <div className="mt-5 rounded-input border border-line bg-soft p-4 text-sm"><p className="font-medium">{template.sampleContent.experience[0]?.role}</p><p className="mt-2 text-muted">{template.sampleContent.skills.slice(0, 4).join(' · ')}</p><p className="mt-3 text-xs text-muted">Fictional career details</p></div>
            <div className="mt-5 flex flex-wrap gap-2"><button type="button" className="btn btn-secondary" onClick={() => { setLayout({ pages: [], oversized: false }); setPreview(template); }}><Eye className="h-4 w-4" aria-hidden="true" />Preview</button><button type="button" className="btn btn-secondary" onClick={() => openEditor(template)}>Edit this example</button><button type="button" className="btn btn-ghost" disabled={exporting !== null} onClick={() => void download(template)}><Download className="h-4 w-4" aria-hidden="true" />{exporting === template.id ? 'Preparing…' : 'DOCX'}</button><button type="button" className="btn btn-ghost" onClick={() => void copy(template)}><Copy className="h-4 w-4" aria-hidden="true" />Copy text</button></div>
          </section>)}
        </div>
        <section className="card flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><h2 className="text-xl">Write the matching cover letter</h2><p className="mt-2 text-sm text-muted">Copy contact fields from your draft and write about the actual application.</p></div><button type="button" className="btn btn-secondary shrink-0" onClick={() => onNavigate('cover-letter')}>Open cover letter builder</button></section>
        <EmailSubscriptionBox variant="banner" />
      </div>
      <Modal isOpen={Boolean(preview)} onClose={() => setPreview(null)} labelledBy="template-preview-title" className="max-w-4xl">
        {preview && <>
          <div className="flex items-start justify-between gap-3 border-b border-line p-4"><div><h2 id="template-preview-title" className="text-xl">{preview.title}</h2><p className="mt-1 text-sm text-muted">Fictional example · same document layout as the editor.</p></div><button type="button" className="btn btn-ghost px-3" aria-label="Close template preview" onClick={() => setPreview(null)}><X className="h-5 w-5" aria-hidden="true" /></button></div>
          <div className="modal-content bg-soft p-3 sm:p-5">{previewResume && <ResumePreview resume={previewResume} settings={DEFAULT_DOCUMENT_SETTINGS} onLayout={setLayout} />}</div>
          <div className="flex shrink-0 flex-wrap gap-2 border-t border-line p-4"><button type="button" className="btn btn-secondary" onClick={() => printResume(resumeFromTemplate(preview), DEFAULT_DOCUMENT_SETTINGS, layout.oversized ? undefined : layout.pages)}>Print / Save PDF</button><button type="button" className="btn btn-primary" onClick={() => openEditor(preview)}>Edit this example</button></div>
        </>}
      </Modal>
    </div>
  );
}
