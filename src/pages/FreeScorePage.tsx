import React, { useEffect, useState, useRef } from 'react';
import { SAMPLE_WEAK_RESUMES, SAMPLE_JOB_DESCRIPTIONS } from '../data/mockData';
import { PageRoute } from '../types';
import { extractTextFromFile, ExtractionError, type ExtractedDocument } from '../utils/fileExtractor';
import { parseResumeText, type ParseReport } from '../utils/resumeParser';
import { saveDraft, type ResumeDraft } from '../utils/resumeDraft';
import { findingTarget, parseFieldTarget, type EditorTarget } from '../utils/resumeActions';
import {
  auditResume,
  auditSummary,
  evidenceGrade,
  evidenceNote,
  severityLabel,
  type AuditReport,
  type Finding,
  type Severity,
} from '../utils/resumeAudit';
import { 
  SearchCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Zap, 
  FileText,
  RotateCcw,
  Target,
  BarChart3,
  Upload,
  Lock,
  Layers,
  FileCheck,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  ExternalLink,
  BookOpen,
  Eye,
  PenTool,
  Compass,
  Briefcase,
  HelpCircle,
  FileDown
} from 'lucide-react';

interface FreeScorePageProps {
  onSelectPlan: (packageId: 'starter' | 'boost' | 'full', preloadedData?: { resume: string; jd: string }) => void;
  onNavigate?: (page: PageRoute) => void;
  onOpenEditor?: (draft: ResumeDraft, target?: EditorTarget) => void;
}

export const FreeScorePage: React.FC<FreeScorePageProps> = ({ onSelectPlan, onNavigate, onOpenEditor }) => {
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescriptionText, setJobDescriptionText] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [audit, setAudit] = useState<AuditReport | null>(null);
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [imported, setImported] = useState<ExtractedDocument | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [parseReport, setParseReport] = useState<ParseReport | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [checkedDraft, setCheckedDraft] = useState<ResumeDraft | null>(null);
  const [isExample, setIsExample] = useState(false);
  const [activeTab, setActiveTab] = useState<'builder' | 'cover-letter' | 'import' | 'tracker' | 'interview' | 'matching'>('builder');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importGeneration = useRef(0);

  useEffect(() => {
    if (!audit) return;
    const results = document.getElementById('scan-results');
    results?.focus({ preventScroll: true });
    results?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }, [audit]);

  const openCheckedEditor = (target?: EditorTarget) => {
    if (checkedDraft && onOpenEditor) onOpenEditor(checkedDraft, target);
    else onNavigate?.('editor');
  };

  const resetResults = () => { setAudit(null); setParseReport(null); setCheckedDraft(null); setDraftSaved(false); };

  /**
   * Read the file the way a parser would: a real PDF text layer, a real DOCX
   * body. If that is impossible (scanned PDF, legacy .doc, image-only file) we
   * say so and refuse to scan noise.
   */
  const handleFile = async (file: File) => {
    const generation = ++importGeneration.current;
    setImportError(null);
    setImported(null);
    setParseReport(null);
    setAudit(null);
    setCheckedDraft(null);
    setResumeText('');
    setIsExample(false);
    setDraftSaved(false);
    setUploadedFileName(file.name);
    setIsExtracting(true);

    try {
      const doc = await extractTextFromFile(file);
      if (generation !== importGeneration.current) return;
      setImported(doc);
      setResumeText(doc.text);
      setAudit(null);
    } catch (err) {
      if (generation !== importGeneration.current) return;
      const message =
        err instanceof ExtractionError
          ? err.message
          : 'That file could not be read. Try a PDF or DOCX exported from Word or Google Docs.';
      setImportError(message);
      setResumeText('');
      setUploadedFileName(null);
    } finally {
      if (generation === importGeneration.current) setIsExtracting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const handleRunScan = () => {
    if (isExtracting) return;
    // No silent sample substitution: scanning a demo file and presenting the
    // result as the user's resume is how a tool loses trust in one click.
    if (!resumeText.trim()) {
      setImportError(
        imported ? null : 'Add your resume first — upload a PDF or DOCX, or paste the text.',
      );
      return;
    }

    setIsScanning(true);
    setImportError(null);
    try {
      const report = auditResume({
        text: resumeText,
        jobDescription: jobDescriptionText,
        structure: imported?.structure,
        fileName: imported?.fileName ?? uploadedFileName ?? undefined,
        fileSize: imported?.size,
      });
      const { resume, report: parseReportResult } = parseResumeText(resumeText);
      setAudit(report);
      setParseReport(parseReportResult);

      // Keep the document for the editor. Same file, same text, same fields.
      const draft: ResumeDraft = {
        version: 1,
        resume,
        report: parseReportResult,
        rawText: resumeText,
        jobDescription: jobDescriptionText,
        source: {
          fileName: imported?.fileName ?? uploadedFileName ?? 'Pasted text',
          kind: imported?.kind ?? 'text',
          size: imported?.size ?? resumeText.length,
          pages: imported?.structure.pages,
          structure:
            imported?.structure ?? {
              tables: 0,
              headers: 0,
              footers: 0,
              textBoxes: 0,
              images: 0,
              noTextLayer: false,
            },
          warnings: imported?.warnings ?? [],
          importedAt: new Date().toISOString(),
          origin: isExample ? 'example' : imported ? 'upload' : 'paste',
        },
      };
      setCheckedDraft(draft);
      setDraftSaved(saveDraft(draft));
      setFindingFilter('all');
    } catch (error) {
      resetResults();
      setImportError(`This document could not be checked: ${(error as Error).message}`);
    } finally {
      setIsScanning(false);
    }
  };

  const handleLoadSample = (sampleKey: 'marketing' | 'developer' | 'sales') => {
    importGeneration.current++;
    setIsExtracting(false);
    setIsExample(true);
    resetResults();
    setResumeText(SAMPLE_WEAK_RESUMES[sampleKey]);
    setJobDescriptionText(SAMPLE_JOB_DESCRIPTIONS[sampleKey]);
    setUploadedFileName(null);
    setImported(null);
    setImportError(null);
    setParseReport(null);
    setInputMode('paste');
    setAudit(null);
  };

  const findings = audit ? [...audit.format, ...audit.content] : [];
  const counts = audit ? auditSummary(audit) : { toFix: 0, toCheck: 0, passed: 0 };

  const [findingFilter, setFindingFilter] = useState<'all' | Severity>('all');
  const visibleFindings = findings.filter(
    (f) => findingFilter === 'all' || f.severity === findingFilter,
  );

  const categoriesList = [
    {
      name: 'File and contact',
      icon: <FileCheck className="w-5 h-5 text-accent-soft" />,
      items: [
        'Tables, headers, footers, text boxes',
        'Page count and file size',
        'Email and phone readable in the body',
        'City and country present',
      ],
    },
    {
      name: 'Structure',
      icon: <Layers className="w-5 h-5 text-accent-soft" />,
      items: [
        'Standard Experience / Education / Skills headings',
        'Experience and education field mapping',
        'Original text available for comparison',
        'Text long enough to parse',
      ],
    },
    {
      name: 'Content',
      icon: <FileText className="w-5 h-5 text-accent-soft" />,
      items: [
        'Bullets with a number or scale',
        'Passive openers, quoted',
        'Bullets long enough to be skipped',
        'Repeated opening verbs',
        'Summary length',
      ],
    },
    {
      name: 'Keywords',
      icon: <Target className="w-5 h-5 text-accent-soft" />,
      items: [
        'Frequent job-posting terms',
        'Terms absent, with the method stated',
        'No density scoring',
        'No synonym guessing',
      ],
    },
    {
      name: 'Not checked',
      icon: <AlertTriangle className="w-5 h-5 text-accent-soft" />,
      items: [
        'Spelling and grammar',
        'Claims and honesty',
        'Culture fit',
        'Whether you will be hired',
      ],
    },
  ];

  // FAQ Accordion Data
  const faqs = [
    {
      q: 'What does this checker actually do?',
      a: 'It reads the text inside your file the way a parser does, then reports what is there: which sections were found, how many bullets contain a number, which bullets use passive phrasing, whether your email sits in a header a parser may skip, and which frequent words from the job posting are missing. Each finding names the rule and shows the line that triggered it.'
    },
    {
      q: 'Why is there no score out of 100?',
      a: 'We have not validated a score against real hiring outcomes or employer systems. Instead of implying that our own scale predicts success, we show counts, extracted fields and review prompts you can inspect.'
    },
    {
      q: 'How do I fix what the report flags?',
      a: 'Every finding includes the edit to make. Open the file in the editor to make those edits, or take the findings to whoever owns your resume. Nothing is changed automatically: the tool cannot know which number is true, and an invented metric is worse than no metric.'
    },
    {
      q: 'Do you upload my resume anywhere?',
      a: 'No. PDF, DOCX and text extraction runs in your browser. Your document is not sent to a server, and the draft kept for the editor is stored in your own browser storage so you can open the same document without uploading it again.'
    },
    {
      q: 'Can the checker read a scanned PDF?',
      a: 'This checker does not run OCR. If we cannot find a usable text layer, we ask you for a text-based PDF or DOCX. Other systems may have OCR, so our result is not a verdict on every employer system.'
    },
    {
      q: 'Does an ATS reject a resume because of a table or a missing keyword?',
      a: 'Not by itself. Applicant tracking systems store and search applications. Automatic rejection comes from screening questions a company configured, such as work authorisation or a required licence. Formatting hurts you by making a field unreadable, not by triggering a rejection.'
    },
    {
      q: 'How does the keyword comparison work?',
      a: 'When you paste a job posting, we take its most frequent terms of three or more characters, drop a fixed stopword list, and check whether each term appears in your resume. It is a word match, not a fit judgement. Repeating a term more often does not improve anything.'
    },
    {
      q: 'What is deliberately not checked?',
      a: 'Spelling and grammar, whether your claims are true, culture fit, and whether you will be hired. The first would need a dictionary we have not shipped; the rest cannot be measured from a document.'
    },
    {
      q: 'What is free and what costs money?',
      a: 'Checking, the editor, the templates and the cover letter are free. Paid work is a person reading your file and writing back — currently $10 for a written review, $25 for a rewrite of one document, $35 for the full application set. The price is for the work, not for a higher score.'
    },
    {
      q: 'Is my resume safe in the editor?',
      a: 'Everything you type stays in your browser. There is no account requirement and no server copy. The download is a file on your machine, and you decide where it goes.'
    },
  ];

  return (
    <div className="min-h-screen bg-soft text-ink">
      {/* 1. HERO SECTION: Split layout with Red Brand Accents */}
      <section className="relative overflow-hidden bg-paper border-b border-line pt-12 pb-16 sm:pt-16 sm:pb-24">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-soft/80 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading, Subtitle & Uploader */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-soft border border-line text-accent text-xs font-bold uppercase tracking-wider">
                <SearchCheck className="w-4 h-4" />
                <span>Resume Checker · free · no account</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl font-black text-ink tracking-tight leading-[1.1]">
                Is your resume <br className="hidden sm:inline" />
                <span className="text-accent">good enough?</span>
              </h1>

              <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
                Upload the file you actually send. See the text and fields our reader can extract,
                review specific findings, then open the same document in the free editor to make changes.
              </p>

              {/* Upload & Paste Control Box */}
              <div className="bg-paper rounded-2xl border-2 border-dashed border-line hover:border-accent-line p-6 sm:p-8 transition-all shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-line">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInputMode('upload')}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        inputMode === 'upload'
                          ? 'bg-accent text-white shadow-xs'
                          : 'bg-soft text-muted hover:bg-slate-200'
                      }`}
                    >
                      Drop File (PDF / DOCX)
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('paste')}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        inputMode === 'paste'
                          ? 'bg-accent text-white shadow-xs'
                          : 'bg-soft text-muted hover:bg-slate-200'
                      }`}
                    >
                      Paste Text Directly
                    </button>
                  </div>

                  <span className="text-xs text-muted/60 font-medium hidden sm:inline">
                    Free · runs in your browser
                  </span>
                </div>

                {inputMode === 'upload' ? (
                  <div className="space-y-3">
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      className="py-8 px-4 text-center rounded-xl bg-soft/70 border border-line/80 flex flex-col items-center justify-center space-y-3"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,.txt,.md"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-xl bg-soft border border-line text-accent flex items-center justify-center shadow-xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink">
                          {isExtracting ? (
                            'Reading your file…'
                          ) : uploadedFileName ? (
                            <span className="text-accent font-mono">Loaded: {uploadedFileName}</span>
                          ) : (
                            <>Drop your resume here or <span className="text-accent underline">choose a file</span></>
                          )}
                        </p>
                        <p className="text-xs text-muted/80 mt-1">
                          PDF or DOCX. Up to 10 MB. Read in your browser — nothing is uploaded.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isExtracting}
                      >
                        {uploadedFileName ? 'Change Resume File' : 'Upload Your Resume'}
                      </button>
                    </div>

                    {imported && (
                      <div className="rounded-xl border border-line bg-surface p-3 text-xs text-muted">
                        <p className="font-semibold text-ink">
                          Read {imported.text.length.toLocaleString()} characters
                          {imported.structure.pages ? ` from ${imported.structure.pages} page(s)` : ''}.
                        </p>
                        <p className="mt-1">
                          {imported.structure.noTextLayer
                            ? 'No text layer.'
                            : 'Review the text our reader extracted below. Other parsers may read the file differently.'}
                        </p>
                        {(imported.structure.tables > 0 ||
                          imported.structure.headers > 0 ||
                          imported.structure.textBoxes > 0) && (
                          <p className="mt-1 text-warning">
                            Structure detected:{' '}
                            {[
                              imported.structure.tables > 0 &&
                                `${imported.structure.tables} table(s)`,
                              imported.structure.headers > 0 &&
                                `${imported.structure.headers} header(s)`,
                              imported.structure.textBoxes > 0 &&
                                `${imported.structure.textBoxes} text box(es)`,
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        )}
                        {imported.warnings.map((w) => (
                          <p key={w} className="mt-1 text-warning">
                            {w}
                          </p>
                        ))}
                        <details className="mt-3"><summary className="cursor-pointer min-h-11 py-2 font-medium text-accent">Review extracted text</summary><pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-soft p-3 text-xs">{imported.text}</pre></details>
                        {imported.structure.outsideText && <details className="mt-2"><summary className="cursor-pointer min-h-11 py-2 font-medium text-accent">Review DOCX header / footer text</summary><pre className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-soft p-3 text-xs">{imported.structure.outsideText}</pre></details>}
                      </div>
                    )}

                    {importError && (
                      <div role="alert" className="rounded-xl border border-danger/30 bg-danger-soft p-3 text-xs text-danger">
                        <p className="font-semibold">We could not read that file</p>
                        <p className="mt-1 leading-relaxed">{importError}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="checker-resume-text" className="text-xs font-bold uppercase tracking-wider text-ink/90 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-accent" />
                        Paste Resume Content
                      </label>
                      <span className="text-xs text-muted/60">
                        {resumeText.trim().split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>
                    <textarea
                      id="checker-resume-text"
                      rows={6}
                      value={resumeText}
                      onChange={(e) => { importGeneration.current++; setIsExtracting(false); setResumeText(e.target.value); setImported(null); setUploadedFileName(null); setIsExample(false); resetResults(); }}
                      placeholder="Paste your current resume content here (Experience, Education, Skills)..."
                      className="field font-mono"
                    />
                  </div>
                )}

                {inputMode === 'paste' && importError && <p role="alert" className="rounded-lg bg-danger-soft p-3 text-sm text-danger">{importError}</p>}
                {isExample && <p className="text-xs text-warning">Fictional sample loaded. Upload or paste your own resume before checking it.</p>}

                {/* Optional Target Job Description */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="checker-job-description" className="text-xs font-bold uppercase tracking-wider text-ink/90 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-accent" />
                      Target Job Description (Optional)
                    </label>
                    <span className="text-[11px] text-accent font-semibold">
                      Enables Keyword Match
                    </span>
                  </div>
                  <textarea
                    id="checker-job-description"
                    rows={3}
                    value={jobDescriptionText}
                    onChange={(e) => { setJobDescriptionText(e.target.value); resetResults(); }}
                    placeholder="Paste the actual job posting…"
                    className="field"
                  />
                </div>

                {/* Action Bar & Quick Samples */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted/80 font-medium">Or try sample:</span>
                    <button
                      type="button"
                      onClick={() => handleLoadSample('developer')}
                      className="text-[11px] px-2.5 py-1 rounded bg-soft hover:bg-slate-200 text-ink/90 font-medium"
                    >
                      Developer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadSample('marketing')}
                      className="text-[11px] px-2.5 py-1 rounded bg-soft hover:bg-slate-200 text-ink/90 font-medium"
                    >
                      Marketing
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadSample('sales')}
                      className="text-[11px] px-2.5 py-1 rounded bg-soft hover:bg-slate-200 text-ink/90 font-medium"
                    >
                      Sales
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isScanning || isExtracting}
                    onClick={handleRunScan}
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    {isScanning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Reading your file…</span>
                      </>
                    ) : (
                      <>
                        <SearchCheck className="w-4 h-4" />
                        <span>Check my resume</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-muted/80">
                  <Lock className="w-3.5 h-3.5 text-muted/60" />
                  <span>This check runs locally. The file is not sent to a server or an AI provider.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Feature Poster */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-ink text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent-soft" />
                    <div className="w-3 h-3 rounded-full bg-warning-soft" />
                    <div className="w-3 h-3 rounded-full bg-success-soft" />
                  </div>
                  <span className="text-[11px] font-mono text-muted/60">sample finding</span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="p-3.5 rounded-xl bg-ink/80 border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-white/80">CNT-02 · numbers in bullets</span>
                      <span className="text-accent-soft font-mono">check</span>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
                      11 bullets, none containing a number, percentage, amount or scale.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-ink/80 border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-300">FMT-02 · header content</span>
                      <span className="text-warning font-mono">check</span>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
                      1 header part found. Check it for essential details and copy those into the body.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-ink/80 border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-300">What this check does not do</span>
                      <span className="text-muted/60 text-[11px]">no rejection prediction</span>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-muted/60 leading-relaxed">
                    "This report describes what a parser and a reader can see in your file. It does
                    not predict whether any employer will reject you."
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-muted/60">
                  <span>Checked in your browser · file never uploaded</span>
                  <span className="text-muted/60">Findings only, no score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC AUDIT RESULTS (if a check was run) */}
      {audit && (
        <section id="scan-results" tabIndex={-1} aria-label="Resume check results" className="py-12 bg-soft border-b border-line scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* What the parser actually read */}
            {parseReport && (
              <div className="bg-paper rounded-2xl border border-line p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                      Parse report
                    </p>
                    <h2 className="mt-2 font-heading text-xl sm:text-2xl font-bold text-ink">
                      What we read from your file
                    </h2>
                    <p className="mt-2 text-sm text-muted leading-relaxed max-w-2xl">
                      {parseReport.found} of {parseReport.total} tracked fields were mapped by our reader.
                      Missing can mean absent or not recognised. Review the original text; optional fields
                      are not required for every resume.
                    </p>
                  </div>
                  {(onNavigate || onOpenEditor) && (
                    <button
                      type="button"
                      onClick={() => openCheckedEditor()}
                      className="btn btn-primary shrink-0"
                    >
                      Open in the editor
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {parseReport.fields.map((field) => (
                    <li
                      key={field.key}
                      className="flex items-start gap-2.5 rounded-lg border border-line bg-soft/50 px-3 py-2"
                    >
                      {field.found ? (
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      )}
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold text-ink">{field.label}</span>
                        <span className="block text-[11px] text-muted truncate">
                          {field.detail}
                        </span>
                      </span>
                      {(onOpenEditor || onNavigate) && <button type="button" className="ml-auto shrink-0 min-h-11 rounded-btn px-2 text-xs font-medium text-accent hover:bg-accent-soft" onClick={() => openCheckedEditor(parseFieldTarget(field.key))}>Review {field.label.toLowerCase()}</button>}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-[11px] text-muted leading-relaxed">
                  {draftSaved
                    ? 'Saved in this browser only. The editor will open this same document, with the missing fields left blank rather than filled with placeholders.'
                    : 'Browser storage is blocked, but you can still open this document in the editor in this tab. Download a backup before refreshing or closing it.'}
                </p>
              </div>
            )}
                        {/* What this document actually contains */}
            <div className="bg-paper rounded-2xl border border-line p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                    What is in the document
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-ink">
                    {counts.toFix + counts.toCheck === 0
                      ? 'No open prompts from these checks'
                      : `${counts.toFix} thing${counts.toFix === 1 ? '' : 's'} to fix, ${counts.toCheck} to check`}
                  </h2>
                  <p className="mt-2 text-sm text-muted max-w-2xl leading-relaxed">
                    Counts describe the extracted text. Review thresholds are local heuristics,
                    not employer rules. The next step is to inspect each prompt and make an accurate edit.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('editor')}
                      className="btn btn-primary"
                    >
                      <PenTool className="w-4 h-4" />
                      Open in the editor
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onSelectPlan('starter', { resume: resumeText, jd: jobDescriptionText })}
                    className="btn btn-secondary"
                  >
                    Human review — from $10
                  </button>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: 'Words', value: audit.facts.words.toLocaleString() },
                  { label: audit.structure?.pages ? 'PDF pages' : 'Pages (est.)', value: audit.structure?.pages ?? audit.facts.estimatedPages },
                  { label: 'Bullets', value: audit.facts.bullets },
                  {
                    label: 'Bullets with a number',
                    value: `${audit.facts.bulletsWithNumbers}/${audit.facts.bullets || 0}`,
                  },
                  {
                    label: 'Sections found',
                    value: `${audit.facts.sectionsFound.length}/${audit.facts.sectionsFound.length + audit.facts.sectionsMissing.length}`,
                  },
                  { label: 'Duty-style openers', value: audit.facts.passiveOpeners },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-line bg-soft/60 px-3 py-2.5">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                      {stat.label}
                    </dt>
                    <dd className="mt-0.5 font-heading text-lg font-bold text-ink">{stat.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-3 text-[11px] text-muted leading-relaxed">
                Pages are estimated from word count at about 450 words per page. Your PDF viewer is
                the authority on page count.
              </p>
            </div>

            {/* Findings */}
            <div className="bg-paper rounded-2xl border border-line p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
                <div>
                  <h3 className="font-heading text-lg font-bold text-ink">Findings</h3>
                  <p className="text-xs text-muted/80 mt-0.5">
                    Each rule shows the evidence in your file that triggered it.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {([
                    { id: 'all', label: `All ${findings.length}` },
                    { id: 'fix', label: `Fix ${counts.toFix}` },
                    { id: 'check', label: `Check ${counts.toCheck}` },
                    { id: 'pass', label: `Fine ${counts.passed}` },
                  ] as Array<{ id: 'all' | Severity; label: string }>).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFindingFilter(tab.id)}
                      aria-pressed={findingFilter === tab.id}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                        findingFilter === tab.id
                          ? 'bg-accent text-white shadow-xs'
                          : 'bg-soft text-muted hover:bg-line'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {visibleFindings.length === 0 ? (
                <p className="text-sm text-muted">Nothing in this category.</p>
              ) : (
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                  {visibleFindings.map((finding: Finding) => {
                    const grade = finding.sourceId ? evidenceGrade(finding.sourceId) : undefined;
                    const note = finding.sourceId ? evidenceNote(finding.sourceId) : undefined;
                    return (
                      <li
                        key={finding.id}
                        className={`rounded-xl border p-4 text-xs space-y-2 ${
                          finding.severity === 'fix'
                            ? 'border-danger/25 bg-danger-soft/60'
                            : finding.severity === 'check'
                              ? 'border-warning/25 bg-warning-soft/60'
                              : 'border-line bg-soft/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-ink flex items-start gap-1.5">
                            {finding.severity === 'pass' ? (
                              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                            ) : finding.severity === 'check' ? (
                              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                            ) : (
                              <X className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                            )}
                            {finding.title}
                          </span>
                          <span className="shrink-0 text-[10px] font-mono uppercase font-bold text-muted/70">
                            {finding.id}
                          </span>
                        </div>

                        <p className="text-[11px] text-ink/90 leading-relaxed">
                          <strong className="font-semibold">In your file:</strong> {finding.evidence}
                        </p>

                        <p className="text-[11px] text-muted leading-relaxed">
                          <strong className="font-semibold text-ink/80">
                            {severityLabel[finding.severity]}:
                          </strong>{' '}
                          {finding.fix}
                        </p>

                        {finding.why && (
                          <p className="text-[11px] text-muted/90 leading-relaxed">{finding.why}</p>
                        )}

                        {note && (
                          <p className="text-[10px] text-muted/70 leading-relaxed border-t border-line/60 pt-2">
                            {grade ? `Grade ${grade}. ` : ''}
                            {note}
                          </p>
                        )}
                        {finding.severity !== 'pass' && (onOpenEditor || onNavigate) && (
                          <button type="button" className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-btn border border-accent-line bg-surface px-3 text-sm font-medium text-accent hover:bg-accent-soft" onClick={() => openCheckedEditor(findingTarget(finding))}>
                            Fix in editor <ArrowRight className="w-4 h-4" aria-hidden="true" />
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Keyword coverage */}
            <div className="bg-paper rounded-2xl border border-line p-6 sm:p-8 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-ink">Keyword coverage</h3>

              {!audit.keywords.hasJobDescription ? (
                <p className="mt-2 text-sm text-muted leading-relaxed max-w-2xl">
                  Paste the job posting above to compare its vocabulary against your resume. We only
                  run this when there is a posting to compare against — a keyword number without one
                  means nothing.
                </p>
              ) : (
                <>
                  <p className="mt-2 text-sm text-muted leading-relaxed max-w-3xl">
                    {audit.keywords.covered} of {audit.keywords.total} frequent job-posting terms
                    appear in your resume. Matched terms are marked; the rest are candidates to check
                    honestly, not words to stuff in.
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {audit.keywords.terms.map((term) => (
                      <li
                        key={term.term}
                        className={`rounded-md border px-2 py-1 text-[11px] font-medium ${
                          term.inResume
                            ? 'border-success/30 bg-success-soft text-success'
                            : 'border-line bg-soft text-muted'
                        }`}
                        title={term.inResume ? `${term.hits} occurrence(s)` : 'not found'}
                      >
                        {term.term}
                        {term.inResume ? ` · ${term.hits}` : ''}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 text-[11px] text-muted/80 leading-relaxed border-t border-line pt-3">
                    {audit.keywords.method}
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      )}

            {/* 3. HOW THE CHECK WORKS — AND WHAT IT CANNOT TELL YOU */}
      <section className="py-16 sm:py-24 bg-paper border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-ink text-white space-y-4 border border-line">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold text-accent-soft uppercase tracking-wider">
                    What we measure
                  </span>
                  <span className="text-xs font-mono text-white/40">v1.0</span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-bold text-white">The text a parser receives</h4>
                    <p className="mt-1 text-xs text-white/70 leading-relaxed">
                      PDF text layer via pdf.js, DOCX body via mammoth, plain text as-is. If there is
                      no text layer, we stop and say so instead of guessing.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-bold text-white">The structure of the file</h4>
                    <p className="mt-1 text-xs text-white/70 leading-relaxed">
                      Tables, headers, footers, text boxes and images read from the DOCX package, and
                      the page count from the PDF.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-bold text-white">Counts you can verify</h4>
                    <p className="mt-1 text-xs text-white/70 leading-relaxed">
                      Words, bullets, bullets with a number, passive openers, quoted examples of each.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-muted leading-relaxed">
                Every rule in the report carries an id (FMT-01, CNT-03) and the evidence that fired
                it. You can check our work against your own file.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Limits, stated plainly
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                There is no honest way to turn a resume into a score out of 100
              </h2>
              <div className="space-y-4 text-muted text-sm sm:text-base leading-relaxed">
                <p>
                  We have not validated a numeric score against hiring outcomes or employer systems.
                  We report extracted fields and specific review prompts instead. Other parsers can
                  recognise headings or text that our reader misses.
                </p>
                <p>
                  Applicant tracking systems store and search applications. Automatic rejection comes
                  from screening questions a recruiter configured, such as work authorisation or a
                  required licence — not from using a table or missing a keyword.
                </p>
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-soft border border-line">
                  <span className="text-xs font-bold text-ink block mb-1">What you get</span>
                  <p className="text-xs text-muted/80 leading-relaxed">
                    A list of findings with the line that triggered each one, and a specific edit.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-soft border border-line">
                  <span className="text-xs font-bold text-ink block mb-1">What you will not get</span>
                  <p className="text-xs text-muted/80 leading-relaxed">
                    A percentile, a pass/fail verdict, or a prediction about your application.
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-muted/80 leading-relaxed border-t border-line pt-4">
                Sources: Greenhouse's documented 2.5 MB parsing limit; published findings that headers
                and footers are frequently skipped; a randomised field experiment on writing clarity
                (about 8% higher hiring rate). Graded in our{' '}
                <span className="font-medium text-ink">evidence register</span>, referenced by each rule
                that relies on one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT THE RULES COVER */}
      <section className="py-16 sm:py-24 bg-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-soft">
              Rulebook
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
              What the check looks at
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              Two groups of rules. Format rules depend on the file you uploaded; content rules depend
              only on the text. Nothing here involves a language model guessing at your intent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesList.map((cat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    {cat.icon}
                  </div>
                  <h3 className="font-heading font-bold text-base text-white">{cat.name}</h3>
                </div>

                <ul className="space-y-2.5 pt-2">
                  {cat.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2.5 text-xs text-white/75">
                      <div className="w-4 h-4 rounded bg-white/10 border border-white/15 text-accent-soft flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="p-6 rounded-2xl bg-accent text-white shadow-lg space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/70">
                  Ready to check yours?
                </span>
                <h3 className="font-heading font-bold text-xl mt-1">
                  Upload the file you actually send
                </h3>
                <p className="text-xs text-white/80 mt-2 leading-relaxed">
                  Free, no account, read in your browser. You will see the extracted text before any
                  finding is shown, so you can confirm we read the right document.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 bg-paper text-ink font-bold text-xs rounded-xl hover:bg-soft transition-colors shadow-xs"
              >
                Check my resume
              </button>
            </div>
          </div>
        </div>
      </section>

{/* 5. INTERACTIVE TABS: what to do after the check */}
      <section className="py-16 sm:py-24 bg-paper border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              After the check
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              Then make the changes
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              A finding you cannot act on is just criticism. The editor opens the same document you
              checked, with the same fields, so the fix happens where the problem was found.
            </p>

            {/* Tab Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {[
                { id: 'builder', label: 'Resume Builder' },
                { id: 'cover-letter', label: 'Cover Letter' },
                { id: 'import', label: 'Import Old CV' },
                { id: 'tracker', label: 'Job Tracker' },
                { id: 'interview', label: 'Interview Prep' },
                { id: 'matching', label: 'AI Job Matcher' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-accent text-white shadow-sm'
                      : 'bg-soft text-ink/90 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Panel Content */}
          <div className="bg-soft rounded-2xl border border-line p-8 sm:p-12">
            {activeTab === 'builder' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    Live Visual CV Builder
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-ink">
                    Fix the findings in the document itself
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Your report names the rule and the line. The editor opens the same file, with fields
                    that could not be read left blank, so you can fill in what a parser missed and
                    export a clean DOCX or PDF.
                  </p>
                  <ul className="space-y-2 text-xs text-ink/90">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent" />
                      <span>Every resume section is editable, including ones the parser could not map</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent" />
                      <span>XYZ prompts: what you accomplished, measured by what, by doing what</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent" />
                      <span>DOCX by default, PDF for humans, plain text to check it yourself</span>
                    </li>
                  </ul>
                  {(onNavigate || onOpenEditor) && (
                    <button
                      onClick={() => openCheckedEditor()}
                      className="mt-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2"
                    >
                      <PenTool className="w-4 h-4" />
                      <span>Launch Live CV Editor (Free)</span>
                    </button>
                  )}
                </div>

                <div className="p-6 rounded-xl bg-paper border border-line shadow-sm space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-muted/60 pb-2 border-b">
                    <span>Text a parser would read</span>
                    <span className="text-accent font-bold">editable</span>
                  </div>
                  <p className="text-ink font-bold text-sm">SARAH CHEN · STAFF SYSTEMS ARCHITECT</p>
                  <p className="text-muted/80 text-[11px]">San Francisco, CA · sarah.chen@dev.io · linkedin.com/in/sarahchen</p>
                  <div className="pt-2 text-ink/90 text-[11px] leading-relaxed">
                    • Architected distributed Kafka streaming pipeline handling 4.5M msgs/sec, reducing p99 latency by 34%.
                  </div>
                  <div className="text-ink/90 text-[11px] leading-relaxed">
                    • Led 8 senior engineers across 3 time zones; migrated Kubernetes cluster with 99.99% uptime.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cover-letter' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    Targeted Cover Letters
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-ink">
                    Match your resume with a letter worth reading
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    When the role calls for one, generate a matching letter that builds on your resume’s accomplishments instead of lazily restating them.
                  </p>
                  <ul className="space-y-2 text-xs text-ink/90">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent" />
                      <span>Addresses hiring manager directly with role-specific pain points</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent" />
                      <span>Cohesive typography matching your ATS resume theme</span>
                    </li>
                  </ul>
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('cover-letter')}
                      className="mt-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Open Cover Letter Studio (Free)</span>
                    </button>
                  )}
                </div>
                <div className="p-6 rounded-xl bg-paper border border-line shadow-sm space-y-3 text-xs">
                  <p className="font-bold text-ink">Targeted Cover Letter Blueprint</p>
                  <p className="text-muted text-[11px] leading-relaxed italic">
                    "Dear Hiring Team, Having spent the last 4 years scaling real-time transaction engines to $120M annual volume, I was immediately drawn to your mission to democratize payment infra..."
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'import' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    Instant Import
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-ink">
                    Keep your resume history, upgrade everything around it
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    The file you just checked can immediately become your working draft. Upload an old Word file or paste your LinkedIn URL, and ATS Resume Lab parses your career history into modern format.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-paper border border-line shadow-sm space-y-3 text-xs">
                  <div className="p-3 bg-soft border border-line rounded-lg text-ink">
                    <strong>LinkedIn / PDF Parser:</strong> Extracts job titles, companies, dates, and bullets automatically with zero copy-paste fatigue.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tracker' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    Job Search Command Center
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-ink">
                    Keep every application and interview round organized
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Once you’re sending tailored resumes to multiple roles, our built-in tracker holds each version, application status, interview date, and recruiter note in one clean dashboard.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-paper border border-line shadow-sm space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-soft border">
                    <span>Google · Senior Engineer</span>
                    <span className="px-2 py-0.5 rounded bg-success-soft text-success font-bold text-[10px]">Interview Round 2</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-soft border">
                    <span>Stripe · Technical Lead</span>
                    <span className="px-2 py-0.5 rounded bg-accent-soft text-accent font-bold text-[10px]">Take-Home Test</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'interview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    Interview Readiness
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-ink">
                    Prepare for the interviews your resume earns
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    When your checked resume gets you the call, prep with likely behavioral questions, STAR stories, and personal pitch outlines generated directly from your actual experience bullets.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-paper border border-line shadow-sm space-y-2 text-xs">
                  <p className="font-bold text-ink">STAR Story Outline:</p>
                  <p className="text-muted text-[11px]"><strong>Situation:</strong> Database scaling bottleneck during Black Friday sale.</p>
                  <p className="text-muted text-[11px]"><strong>Task:</strong> Maintain 99.99% availability under 10x traffic spike.</p>
                  <p className="text-muted text-[11px]"><strong>Action:</strong> Implemented read-replicas and distributed Redis caching layer.</p>
                  <p className="text-muted text-[11px]"><strong>Result:</strong> Zero downtime, saved $45,000 in cloud compute overages.</p>
                </div>
              </div>
            )}

            {activeTab === 'matching' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    Smart Job Matcher
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-ink">
                    Apply where your resume already matches
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Compare your resume against live job requirements to instantly identify missing hard skills, soft skills, and keyword gaps before hitting apply.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-paper border border-line shadow-sm space-y-2 text-xs">
                  <div className="flex items-center justify-between text-xs font-bold pb-2 border-b">
                    <span>Terms in the posting</span>
                    <span className="text-accent">5 present · 2 absent</span>
                  </div>
                  <p className="text-[11px] text-muted">Present: React, TypeScript, GraphQL, Docker, Microservices</p>
                  <p className="text-[11px] text-danger font-semibold">Absent: Kubernetes, Terraform</p>
                  <p className="text-[10px] text-muted/70 pt-1 border-t border-line">
                    A word match, not a fit score.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. CAREER RESEARCH & MYTH-BUSTING GUIDES */}
      <section className="py-16 sm:py-24 bg-soft border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Evidence, graded
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              What is actually known about ATS parsing
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Most ATS advice repeats itself without a source. These are the claims we could trace to
              a document, with the grade we gave each one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                tag: 'MYTH · GRADE A',
                title: '“75% of resumes are rejected by an ATS”',
                readTime: 'traced to source',
                desc: 'The most repeated number in this industry came from a 2011 vendor press release with no sample and no method. Rejection comes from screening questions, not resume text.'
              },
              {
                tag: 'PARSING · GRADE B',
                title: '43% of resumes carry at least one extraction error',
                readTime: 'industry data',
                desc: 'In published parsing data, 43% of resumes contain an extraction error. The information is not deleted — it lands in the wrong field, where a recruiter search will not find it.'
              },
              {
                tag: 'FORMAT · GRADE C',
                title: 'Two-column layouts reduce field extraction',
                readTime: 'directional',
                desc: 'In batch tests, two-column PDFs extracted 67% of fields correctly against 89% for single-column DOCX. Treat the figures as directional; the direction is consistent.'
              },
              {
                tag: 'LIMITS · GRADE A',
                title: 'Greenhouse documents a 2.5 MB parsing limit',
                readTime: 'vendor documentation',
                desc: 'An image-heavy PDF can upload successfully and still be read as nothing. Compress it before you apply, not after.'
              },
              {
                tag: 'HEADERS · GRADE A',
                title: 'Contact details in a header are frequently skipped',
                readTime: 'vendor documentation',
                desc: 'Headers and footers sit outside the main text flow. That is how candidates become nameless profiles in a database.'
              },
              {
                tag: 'WRITING · GRADE A',
                title: 'Clearer writing raised hiring rates by about 8%',
                readTime: 'randomised field experiment',
                desc: 'Jobseekers given writing-clarity help were hired 8% more often, and employers did not rate their applications as weaker.'
              }
            ].map((article, idx) => (
              <div
                key={idx}
                className="bg-paper rounded-2xl border border-line p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-accent tracking-wider">{article.tag}</span>
                    <span className="text-muted/60">{article.readTime}</span>
                  </div>
                  <h4 className="font-heading font-bold text-ink text-base leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-xs text-muted/80 leading-relaxed">
                    {article.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-between text-xs text-muted font-bold">
                  <span>In our evidence register</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* 7. WHAT THIS TOOL DOES NOT CLAIM */}
      <section className="py-16 sm:py-24 bg-paper border-b border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              No invented proof
            </span>
            <h2 className="font-heading text-3xl font-bold text-ink">
              You will not find testimonials here
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              This product is new. There is no user count, no star rating and no success rate we can
              honestly publish yet, so there is none on this page. When real reviews exist, they will
              appear with the review they came from attached.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-soft border border-line space-y-2">
              <h3 className="text-sm font-bold text-ink">What we measure</h3>
              <p className="text-xs text-muted leading-relaxed">
                Your file: the extracted text, its structure, and named rules with quoted evidence.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-soft border border-line space-y-2">
              <h3 className="text-sm font-bold text-ink">What we do not measure</h3>
              <p className="text-xs text-muted leading-relaxed">
                Whether you will be hired, shortlisted or rejected. Nobody can measure that from a
                document.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-soft border border-line space-y-2">
              <h3 className="text-sm font-bold text-ink">Where the money goes</h3>
              <p className="text-xs text-muted leading-relaxed">
                Checking, editing and downloads are free. Optional human review is priced separately,
                with scope and availability confirmed before payment.
              </p>
            </div>
          </div>
        </div>
      </section>

{/* 8. COMPREHENSIVE 12-ITEM FAQ ACCORDION */}
      <section className="py-16 sm:py-24 bg-soft border-b border-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Frequently Asked Questions
            </span>
            <h2 className="font-heading text-3xl font-bold text-ink">
              Everything you need to know about ATS resume checking
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div
                  key={index}
                  className="bg-paper rounded-xl border border-line overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-ink hover:text-accent transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <span className="p-1 rounded-md bg-soft text-muted/80 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-muted leading-relaxed border-t border-line pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CONVERSION TOOL WIDGET */}
      <section className="py-16 sm:py-20 bg-ink text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Check the file you actually send
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            You will see the extracted text first, then the findings with the line that triggered each
            one. Free, no account, nothing uploaded.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn btn-primary w-full sm:w-auto"
            >
              <Upload className="w-4 h-4" />
              <span>Upload my resume</span>
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate('editor')}
                className="w-full sm:w-auto px-8 py-3.5 bg-ink hover:bg-neutral text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <PenTool className="w-4 h-4 text-accent-soft" />
                <span>Open Live CV Editor</span>
              </button>
            )}
          </div>

          <p className="text-xs text-muted/60 pt-2">
            No signup required for checking and editing · Free for Bangladeshi candidates and applicants elsewhere
          </p>
        </div>
      </section>
    </div>
  );
};
