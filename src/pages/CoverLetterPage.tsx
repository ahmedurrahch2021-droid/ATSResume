import React, { useEffect, useState } from 'react';
import { Copy, Download, RotateCcw } from 'lucide-react';
import type { CoverLetterData } from '../types/coverLetter';
import { COVER_LETTER_PRESETS } from '../data/coverLetterPresets';
import { CoverLetterEditor } from '../components/coverLetter/CoverLetterEditor';
import { CoverLetterPreview } from '../components/coverLetter/CoverLetterPreview';
import { exportCoverLetterToVectorPdf, exportCoverLetterToWord, formatCoverLetterPlainText } from '../utils/coverLetterExporter';
import { createEmptyCoverLetter, isCoverLetterData } from '../utils/coverLetterDocument';
import { loadDraft } from '../utils/resumeDraft';
import { downloadBlob } from '../utils/resumeExporter';

const STORAGE_KEY = 'atsresume_cover_letter_data';

export function CoverLetterPage() {
  const [letterData, setLetterData] = useState<CoverLetterData>(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) { const data: unknown = JSON.parse(saved); if (isCoverLetterData(data)) return data; } } catch { /* Use an empty local draft. */ }
    return createEmptyCoverLetter();
  });
  const [scale, setScale] = useState<number | 'fit'>('fit');
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [message, setMessage] = useState('');
  const [saved, setSaved] = useState(false);
  const [hasResumeData, setHasResumeData] = useState(false);
  const [exporting, setExporting] = useState(false);
  useEffect(() => { setHasResumeData(Boolean(loadDraft())); }, []);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(letterData)); setSaved(true); } catch { setSaved(false); } }, [letterData]);
  const hasContent = Boolean(letterData.sender.fullName.trim() || letterData.opening.trim() || letterData.bodyParagraphs.some((text) => text.trim()));
  const wordCount = [letterData.opening, ...letterData.bodyParagraphs, ...letterData.keyHighlights, letterData.closing].join(' ').split(/\s+/).filter(Boolean).length;
  const applyPreset = (id: string) => {
    const preset = COVER_LETTER_PRESETS.find((item) => item.id === id);
    if (preset && (!hasContent || window.confirm('Replace this draft with the fictional example? Download your text first if you want to keep it.'))) { setLetterData({ ...preset.data, id: `example-${preset.id}` }); setMessage('Fictional example loaded. Replace the facts with your own before using it.'); }
  };
  const importContacts = () => {
    const draft = loadDraft();
    if (!draft) { setMessage('No resume draft is available in this browser.'); return; }
    const resume = draft.resume;
    setLetterData((current) => ({ ...current, sender: { fullName: resume.fullName, jobTitle: resume.targetTitle, email: resume.email, phone: resume.phone, location: resume.location, portfolioUrl: resume.portfolio, linkedInUrl: resume.linkedin } }));
    setMessage('Contact fields copied from your resume draft. Review them before exporting.');
  };
  const downloadWord = async () => {
    setExporting(true);
    try { await exportCoverLetterToWord(letterData); setMessage('DOCX prepared. Open the downloaded file to review it.'); } catch (error) { setMessage(`Could not export: ${(error as Error).message}`); } finally { setExporting(false); }
  };

  return (
    <div className="cover-letter-workspace bg-soft pb-12">
      <section className="border-b border-line bg-paper">
        <div className="workspace-container py-6 space-y-4">
          <div><p className="eyebrow">Free cover letter builder</p><h1 className="mt-2 text-2xl sm:text-3xl">Write a letter for this application.</h1><p className="mt-2 text-sm text-muted">{saved ? 'Saved in this browser.' : 'Session only — download your text before leaving.'} {wordCount} words in the letter body.</p></div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-secondary" disabled={!hasContent} onClick={async () => { try { await navigator.clipboard.writeText(formatCoverLetterPlainText(letterData)); setMessage('Letter text copied.'); } catch { setMessage('Clipboard access was blocked. Download a text file instead.'); } }}><Copy className="h-4 w-4" aria-hidden="true" />Copy text</button>
            <button type="button" className="btn btn-secondary" disabled={!hasContent} onClick={() => downloadBlob(new Blob([formatCoverLetterPlainText(letterData)], { type: 'text/plain;charset=utf-8' }), 'Cover-Letter.txt')}>Download TXT</button>
            <button type="button" className="btn btn-secondary" disabled={!hasContent || exporting} onClick={() => void downloadWord()}><Download className="h-4 w-4" aria-hidden="true" />{exporting ? 'Preparing…' : 'Word (.docx)'}</button>
            <button type="button" className="btn btn-primary" disabled={!hasContent} onClick={() => { exportCoverLetterToVectorPdf(letterData); setMessage('Choose A4 and Save as PDF in the print dialog. Review the page breaks and turn off browser headers and footers.'); }}>Print / Save PDF</button>
            <button type="button" className="btn btn-ghost" onClick={() => { if (!hasContent || window.confirm('Clear this cover letter? Download the text first if you want to keep it.')) { setLetterData(createEmptyCoverLetter()); setMessage('Blank letter started.'); } }}><RotateCcw className="h-4 w-4" aria-hidden="true" />Start blank</button>
          </div>
          {message && <p role="status" className="text-sm text-muted">{message}</p>}
          {letterData.id.startsWith('example-') && <p className="text-xs text-warning">This draft started from a fictional example. Verify every name, employer, claim and number.</p>}
          <div className="flex gap-2 lg:hidden" aria-label="Cover letter view">{(['edit', 'preview'] as const).map((tab) => <button key={tab} type="button" className={`btn flex-1 ${mobileTab === tab ? 'btn-secondary' : 'btn-ghost'}`} aria-pressed={mobileTab === tab} onClick={() => setMobileTab(tab)}>{tab === 'edit' ? 'Edit letter' : 'Preview letter'}</button>)}</div>
        </div>
      </section>
      <div className="workspace-container py-6 grid items-start gap-6 lg:grid-cols-2">
        <div className={`min-w-0 ${mobileTab === 'preview' ? 'hidden lg:block' : ''}`}><CoverLetterEditor data={letterData} onChange={setLetterData} onApplyPreset={applyPreset} onSyncFromResume={importContacts} hasResumeData={hasResumeData} /></div>
        <section className={`min-w-0 space-y-3 lg:sticky lg:top-24 ${mobileTab === 'edit' ? 'hidden lg:block' : ''}`} aria-label="Letter preview">
          <div className="card flex flex-wrap items-center justify-between gap-3 p-3"><h2 className="text-base">Paper preview</h2><div className="flex items-center gap-2"><label htmlFor="letter-zoom" className="text-xs text-muted">Zoom</label><select id="letter-zoom" className="field w-auto" value={scale} onChange={(event) => setScale(event.target.value === 'fit' ? 'fit' : Number(event.target.value))}><option value="fit">Fit width</option><option value="0.75">75%</option><option value="1">100%</option><option value="1.25">125%</option></select></div></div>
          <div className="rounded-card border border-line bg-soft p-2 sm:p-4"><CoverLetterPreview data={letterData} scale={scale} /></div>
        </section>
      </div>
    </div>
  );
}
