import React, { useState, useEffect } from 'react';
import { CoverLetterData } from '../types/coverLetter';
import { INITIAL_COVER_LETTER, COVER_LETTER_PRESETS } from '../data/coverLetterPresets';
import { CoverLetterEditor } from '../components/coverLetter/CoverLetterEditor';
import { CoverLetterPreview } from '../components/coverLetter/CoverLetterPreview';
import { 
  exportCoverLetterToVectorPdf, 
  exportCoverLetterToWord, 
  formatCoverLetterPlainText 
} from '../utils/coverLetterExporter';
import { 
  FileDown, 
  FileText, 
  Copy, 
  RotateCcw, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Sparkles,
  ShieldCheck,
  Eye,
  Edit3
} from 'lucide-react';

const STORAGE_KEY = 'atsresume_cover_letter_data';

export const CoverLetterPage: React.FC = () => {
  // Load initial state from localStorage if available, or fall back to default
  const [letterData, setLetterData] = useState<CoverLetterData>(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_COVER_LETTER;
  });

  const [previewScale, setPreviewScale] = useState<number>(0.85);
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasResumeData, setHasResumeData] = useState<boolean>(false);

  // Check if saved resume exists in browser (client-only)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        setHasResumeData(Boolean(
          localStorage.getItem('atsresume_user_account') || 
          localStorage.getItem('atsresume_active_resume')
        ));
      }
    } catch {
      // Silently fail
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(letterData));
      }
    } catch {
      // Storage unavailable or full
    }
  }, [letterData]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = COVER_LETTER_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setLetterData({
        ...preset.data,
        id: `cl-${Date.now()}`,
      });
      showToast(`Loaded "${preset.name}" preset.`);
    }
  };

  const handleSyncFromResume = () => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const accountRaw = localStorage.getItem('atsresume_user_account');
        if (accountRaw) {
          const account = JSON.parse(accountRaw);
          if (account.displayName || account.email) {
            setLetterData(prev => ({
              ...prev,
              sender: {
                ...prev.sender,
                fullName: account.displayName || prev.sender.fullName,
                email: account.email || prev.sender.email,
                location: account.country ? (account.country === 'Bangladesh' ? 'Dhaka, Bangladesh' : prev.sender.location) : prev.sender.location,
              }
            }));
            showToast('Updated contact details from your profile.');
            return;
          }
        }
      }
    } catch {
      // Silently fail
    }
    showToast('No saved resume profile found to import.');
  };

  const handleReset = () => {
    if (window.confirm('Reset this cover letter to default sample text?')) {
      setLetterData({ ...INITIAL_COVER_LETTER, id: `cl-${Date.now()}` });
      showToast('Cover letter reset to default template.');
    }
  };

  const handleCopyText = () => {
    const text = formatCoverLetterPlainText(letterData);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopySuccess(true);
        showToast('Plain text copied to clipboard!');
        setTimeout(() => setCopySuccess(false), 2000);
      });
    } else {
      showToast('Clipboard not supported in this browser.');
    }
  };

  const handleDownloadPdf = () => {
    exportCoverLetterToVectorPdf(letterData);
    showToast('Generating printable vector PDF...');
  };

  const handleDownloadWord = () => {
    exportCoverLetterToWord(letterData);
    showToast('Downloaded Word (.doc) document.');
  };

  // Word & character stats
  const totalWords = [
    letterData.opening,
    ...letterData.bodyParagraphs,
    ...letterData.keyHighlights,
    letterData.closing
  ].join(' ').split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-soft text-ink pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Studio Control Bar */}
      <section className="bg-paper border-b border-line/90 sticky top-20 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Title & Metadata */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-soft text-accent border border-red-100 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold text-ink tracking-tight">
                    Cover Letter Studio
                  </h1>
                  <span className="text-[10px] uppercase font-bold text-accent bg-soft border border-red-100 px-1.5 py-0.5 rounded">
                    ATS Matching
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted/80 mt-0.5">
                  <span>{totalWords} words</span>
                  <span aria-hidden="true">·</span>
                  <span>Target: {letterData.recipient.companyName || 'Employer'}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-accent font-medium">1-Page Recommended</span>
                </div>
              </div>
            </div>

            {/* Action Buttons & Export Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyText}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-ink/90 bg-paper hover:bg-soft border border-line rounded-lg transition-colors shadow-2xs"
                title="Copy formatted plain text for online job portals"
              >
                {copySuccess ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copySuccess ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadWord}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-ink/90 bg-paper hover:bg-soft border border-line rounded-lg transition-colors shadow-2xs"
                title="Export as an editable Microsoft Word document"
              >
                <FileDown className="w-3.5 h-3.5 text-blue-600" />
                <span>Word (.doc)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors shadow-xs"
                title="Print or save as a crisp, searchable vector PDF"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 text-muted/60 hover:text-muted hover:bg-slate-100 rounded-lg transition-colors ml-1"
                title="Reset to default template"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Tab Toggle (< 1024px) */}
          <div className="flex lg:hidden items-center justify-center gap-1 mt-3 pt-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setMobileTab('edit')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                mobileTab === 'edit'
                  ? 'bg-soft text-accent border border-line'
                  : 'text-muted hover:bg-soft'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Sections</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('preview')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                mobileTab === 'preview'
                  ? 'bg-soft text-accent border border-line'
                  : 'text-muted hover:bg-soft'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Two-Pane Workspace Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Modular Cards Editor (45-50% width on desktop) */}
          <div className={`lg:col-span-6 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <CoverLetterEditor
              data={letterData}
              onChange={setLetterData}
              onApplyPreset={handleApplyPreset}
              onSyncFromResume={handleSyncFromResume}
              hasResumeData={hasResumeData}
            />

            {/* Recruiter Advice Box */}
            <div className="mt-6 p-4 rounded-xl bg-slate-100/70 border border-line text-xs text-muted space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-ink">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>ATS & Recruiter Cover Letter Best Practices</span>
              </div>
              <p className="leading-relaxed">
                Modern recruiters read cover letters when comparing two equally qualified candidates. Keep your letter concise (under 350 words), match the exact font and accent color of your resume, and always address a real hiring manager or team name.
              </p>
            </div>
          </div>

          {/* Right Column: Live Document Preview (50-55% width on desktop) */}
          <div className={`lg:col-span-6 ${mobileTab === 'edit' ? 'hidden lg:block' : 'block'}`}>
            <div className="sticky top-40 space-y-3">
              {/* Preview Zoom Controls Bar */}
              <div className="bg-paper rounded-xl border border-line/90 px-4 py-2.5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink/90">
                  <Eye className="w-3.5 h-3.5 text-accent" />
                  <span>Real-Time Sheet Preview</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewScale(prev => Math.max(0.5, prev - 0.1))}
                    className="p-1 text-muted/80 hover:text-ink hover:bg-slate-100 rounded transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-xs font-mono text-muted min-w-12 text-center">
                    {Math.round(previewScale * 100)}%
                  </span>

                  <button
                    type="button"
                    onClick={() => setPreviewScale(prev => Math.min(1.3, prev + 0.1))}
                    className="p-1 text-muted/80 hover:text-ink hover:bg-slate-100 rounded transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewScale(0.85)}
                    className="p-1 text-muted/80 hover:text-ink hover:bg-slate-100 rounded transition-colors ml-1"
                    title="Reset to Fit"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Elevated Workspace Viewport */}
              <div className="bg-slate-200/60 rounded-2xl border border-slate-300/80 p-4 sm:p-6 overflow-x-auto overflow-y-auto max-h-[calc(100vh-220px)] shadow-inner flex justify-center">
                <CoverLetterPreview data={letterData} scale={previewScale} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
