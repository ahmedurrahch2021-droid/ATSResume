import React, { useMemo, useState } from 'react';
import { ArrowRight, Copy, Download, ExternalLink, Eye, X } from 'lucide-react';
import { ATS_TEMPLATES } from '../data/mockData';
import type { ResumeTemplate, PageRoute } from '../types';
import { Modal } from '../components/Modal';
import { ResumePreview, type ResumeLayout } from '../components/resume/ResumePreview';
import { documentPlainText, hasResumeContent } from '../utils/resumeDocument';
import { downloadResumeDocx, printResume } from '../utils/resumeExporter';
import { draftWithTemplate, resumeFromTemplate } from '../utils/templateResume';
import { loadDraft, saveDraft, type ResumeDraft } from '../utils/resumeDraft';
import { RESUME_LAYOUTS, resumeLayout } from '../data/resumeLayouts';
import { SourceLinks } from '../components/resume/SourceLinks';
import { CountryGuideCards } from '../components/resume/CountryGuideCards';
import { ROUTE_PATHS } from '../routes';

interface TemplatesPageProps { onNavigate: (route: PageRoute) => void; onOpenOrder: (packageId?: 'starter' | 'boost' | 'full') => void; onOpenInEditor?: (draft: ResumeDraft) => void }

const CATEGORIES = [
  ['all', 'All layouts'], ['tech', 'Tech & engineering'], ['product', 'Product & growth'], ['finance', 'Finance & operations'], ['entry', 'Early career'],
] as const;

export function TemplatesPage({ onNavigate, onOpenInEditor }: TemplatesPageProps) {
  const [category, setCategory] = useState('all');
  const [preview, setPreview] = useState<ResumeTemplate | null>(null);
  const [message, setMessage] = useState('');
  const [exporting, setExporting] = useState<string | null>(null);
  const [layout, setLayout] = useState<ResumeLayout>({ pages: [], oversized: false });
  const previewResume = useMemo(() => preview ? resumeFromTemplate(preview) : null, [preview]);
  const previewSettings = resumeLayout(preview?.layout).settings;
  const templates = RESUME_LAYOUTS.map((style) => ATS_TEMPLATES.find((template) => template.layout === style.id)!).filter((template) => category === 'all' || template.category === category);
  const openEditor = (template: ResumeTemplate, mode: 'layout' | 'example') => {
    const current = loadDraft();
    if (mode === 'example' && current && hasResumeContent(current.resume) && !window.confirm('Replace your current resume draft with this fictional example? Download a JSON backup in the editor first if you want to keep it.')) return;
    const draft = draftWithTemplate(template, mode, current);
    saveDraft(draft);
    setPreview(null);
    if (onOpenInEditor) onOpenInEditor(draft); else onNavigate('suite');
  };
  const download = async (template: ResumeTemplate) => {
    setExporting(template.id);
    try { await downloadResumeDocx(resumeFromTemplate(template), resumeLayout(template.layout).settings); setMessage('Fictional sample DOCX prepared in the selected layout. Replace the sample facts with your own before applying.'); }
    catch (error) { setMessage(`Could not download: ${(error as Error).message}`); }
    finally { setExporting(null); }
  };
  const copy = async (template: ResumeTemplate) => {
    try { await navigator.clipboard.writeText(documentPlainText(resumeFromTemplate(template), resumeLayout(template.layout).settings)); setMessage('Fictional example text copied. Replace the facts with your own.'); }
    catch { setMessage('Clipboard access was blocked. Open the sample in the editor to download text.'); }
  };

  return (
    <div className="section bg-paper">
      <div className="container-page space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end"><div className="max-w-2xl"><p className="eyebrow">Four original layouts · free downloads</p><h1 className="mt-3 text-balance text-3xl sm:text-4xl">A clear resume. A style that feels like you.</h1><p className="mt-4 text-muted">Real document previews, familiar fonts and restrained design, informed by career-service guidance. Use a layout with your own facts, or explore a clearly labelled fictional example.</p></div><div className="rounded-card border border-line bg-soft p-5"><p className="text-sm font-semibold">Your facts stay yours.</p><p className="mt-2 text-sm leading-relaxed text-muted">Use this layout keeps your current draft. Edit this example replaces it only after confirmation. No template is a universal ATS pass or a hiring guarantee.</p><a href={`${ROUTE_PATHS['country-guides']}#photo-guidance`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent underline underline-offset-4">Photo choices & parsing limits<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span></a></div></div>
        <div className="space-y-2"><p className="text-xs text-muted">Filter by the fictional example’s field. Every layout can be used for other professions.</p><div className="flex flex-wrap gap-2" aria-label="Template categories">{CATEGORIES.map(([id, label]) => <button type="button" key={id} className={`btn ${category === id ? 'btn-secondary' : 'btn-ghost'}`} aria-pressed={category === id} onClick={() => setCategory(id)}>{label}</button>)}</div></div>
        {message && <p role="status" className="text-sm text-muted">{message}</p>}
        <div className="grid gap-6 md:grid-cols-2">
          {templates.map((template) => <section key={template.id} id={`template-${template.id}`} aria-labelledby={`template-${template.id}-title`} className="card flex min-w-0 scroll-mt-6 flex-col overflow-hidden">
            <figure className="border-b border-line bg-soft px-5 pt-6 sm:px-8"><img src={template.previewImage} width={794} height={1123} loading="lazy" decoding="async" alt={`First page of ${template.title}, rendered with fictional ${template.categoryLabel.toLowerCase()} career details`} className="mx-auto w-full max-w-[294px] border border-line bg-surface shadow-card" /><figcaption className="py-3 text-center text-xs text-muted">First page · actual print renderer · fictional example</figcaption></figure>
            <div className="flex flex-1 flex-col p-5 sm:p-6"><p className="eyebrow">{template.format}</p><h2 id={`template-${template.id}-title`} className="mt-2 text-xl">{template.title}</h2><p className="mt-3 text-sm leading-relaxed text-muted">{resumeLayout(template.layout).description}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">{template.highlightPoints.slice(0, 2).map((point) => <li key={point}>{point}</li>)}</ul>
              <a href={`${ROUTE_PATHS['country-guides']}#layout-${template.layout}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 self-start text-sm font-medium text-accent underline underline-offset-4">Features & sources<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /><span className="sr-only">for {template.title} (opens in a new tab)</span></a>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4"><button type="button" className="btn btn-secondary" onClick={() => openEditor(template, 'layout')}>Use this layout <ArrowRight className="h-4 w-4" aria-hidden="true" /></button><button type="button" className="btn btn-secondary" onClick={() => { setLayout({ pages: [], oversized: false }); setPreview(template); }}><Eye className="h-4 w-4" aria-hidden="true" />Preview</button></div>
              <details className="mt-3"><summary className="min-h-11 cursor-pointer py-3 text-sm font-medium text-muted">Fictional example actions · {template.categoryLabel}</summary><p className="mt-1 text-xs text-muted">Sample: {template.sampleContent.name}. The example’s achievements are invented for illustration. Replace them with your own evidence.</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" className="btn btn-ghost" onClick={() => openEditor(template, 'example')}>Edit this example</button><button type="button" className="btn btn-ghost" disabled={exporting !== null} aria-busy={exporting === template.id} onClick={() => void download(template)}><Download className="h-4 w-4" aria-hidden="true" />{exporting === template.id ? 'Preparing…' : 'Sample DOCX'}</button><button type="button" className="btn btn-ghost" onClick={() => void copy(template)}><Copy className="h-4 w-4" aria-hidden="true" />Copy sample text</button></div></details>
            </div>
          </section>)}
        </div>
        <section className="card p-5 sm:p-6"><h2 className="text-xl">Guidance, not borrowed credentials.</h2><p className="mt-2 text-sm text-muted">Our layouts use the principles of clear headings, readable type and evidence-led bullets. Published institutional templates remain on their original sites; the sources do not certify our downloads.</p><SourceLinks ids={['mit-ats', 'harvard-bullet', 'imperial-cv']} /></section>
        <section className="space-y-5" aria-labelledby="template-country-title"><div className="max-w-3xl"><p className="eyebrow">Where are you applying?</p><h2 id="template-country-title" className="mt-2 text-2xl">Country context before template rules.</h2><p className="mt-3 text-sm text-muted">Each card opens structure, photo guidance and sources in a new tab. These are suggestions, not twelve automatic country formats.</p></div><CountryGuideCards /></section>
        <section className="card flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><h2 className="text-xl">Write the matching cover letter</h2><p className="mt-2 text-sm text-muted">Copy contact fields from your draft and write about the actual application.</p></div><button type="button" className="btn btn-secondary shrink-0" onClick={() => onNavigate('cover-letter')}>Open cover letter builder</button></section>
      </div>
      <Modal isOpen={Boolean(preview)} onClose={() => setPreview(null)} labelledBy="template-preview-title" className="max-w-4xl">
        {preview && <>
           <div className="flex items-start justify-between gap-3 border-b border-line p-4"><div><h2 id="template-preview-title" className="text-xl">{preview.title}</h2><p className="mt-1 text-sm text-muted">Fictional example · same layout settings as the downloadable document.</p></div><button type="button" className="btn btn-ghost px-3" aria-label="Close template preview" onClick={() => setPreview(null)}><X className="h-5 w-5" aria-hidden="true" /></button></div>
           <div className="modal-content bg-soft p-3 sm:p-5">{previewResume && <ResumePreview resume={previewResume} settings={previewSettings} onLayout={setLayout} />}</div>
           <div className="flex shrink-0 flex-wrap gap-2 border-t border-line p-4"><button type="button" className="btn btn-primary" onClick={() => openEditor(preview, 'layout')}>Use this layout</button><button type="button" className="btn btn-secondary" onClick={() => openEditor(preview, 'example')}>Edit this example</button><button type="button" className="btn btn-secondary" onClick={() => printResume(resumeFromTemplate(preview), previewSettings, layout.oversized ? undefined : layout.pages)}>Print / Save PDF</button></div>
        </>}
      </Modal>
    </div>
  );
}
