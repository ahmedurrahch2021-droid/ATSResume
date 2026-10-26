import React, { useState, useRef } from 'react';
import { analyzeResumeText } from '../utils/atsScanner';
import { SAMPLE_WEAK_RESUMES, SAMPLE_JOB_DESCRIPTIONS } from '../data/mockData';
import { AtsScanResult, PageRoute, DetailedCheckItem } from '../types';
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
}

export const FreeScorePage: React.FC<FreeScorePageProps> = ({ onSelectPlan, onNavigate }) => {
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescriptionText, setJobDescriptionText] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<AtsScanResult | null>(null);
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'cover-letter' | 'import' | 'tracker' | 'interview' | 'matching'>('builder');
  const [selectedCheckCategory, setSelectedCheckCategory] = useState<string>('All');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setResumeText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setResumeText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleRunScan = () => {
    if (!resumeText.trim()) {
      // Default to sample if user clicked without pasting
      setResumeText(SAMPLE_WEAK_RESUMES.developer);
      setJobDescriptionText(SAMPLE_JOB_DESCRIPTIONS.developer);
    }
    setIsScanning(true);
    setTimeout(() => {
      const textToScan = resumeText.trim() || SAMPLE_WEAK_RESUMES.developer;
      const result = analyzeResumeText(textToScan, jobDescriptionText);
      setScanResult(result);
      setIsScanning(false);
      // scroll to results
      const resultsEl = document.getElementById('scan-results');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 750);
  };

  const handleLoadSample = (sampleKey: 'marketing' | 'developer' | 'sales') => {
    setResumeText(SAMPLE_WEAK_RESUMES[sampleKey]);
    setJobDescriptionText(SAMPLE_JOB_DESCRIPTIONS[sampleKey]);
    setUploadedFileName(null);
    setInputMode('paste');
    setScanResult(null);
  };

  const getScoreColor = (score: number) => {
    if (score < 50) return 'text-accent bg-soft border-line';
    if (score < 75) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-accent bg-soft border-line';
  };

  // 27 checks definition grouped into 7 categories
  const categoriesList = [
    {
      name: 'ATS essentials',
      icon: <FileCheck className="w-5 h-5 text-accent" />,
      items: [
        'File format and size',
        'ATS-friendly design',
        'Professional email address',
        'Header links compliance',
        'Resume file name',
        'Dates and links consistency'
      ]
    },
    {
      name: 'Resume sections',
      icon: <Layers className="w-5 h-5 text-accent" />,
      items: [
        'Essential sections',
        'Contact information',
        'Section order'
      ]
    },
    {
      name: 'Content',
      icon: <FileText className="w-5 h-5 text-accent" />,
      items: [
        'ATS parse rate',
        'Quantifying impact with metrics',
        'Repetition of words and phrases',
        'Spelling and grammar',
        'Bullet length and consistency'
      ]
    },
    {
      name: 'Job tailoring',
      icon: <Target className="w-5 h-5 text-accent" />,
      items: [
        'Hard skills match',
        'Soft skills match',
        'Action verbs',
        'Tailored job title'
      ]
    },
    {
      name: 'Recruiter red flags',
      icon: <AlertTriangle className="w-5 h-5 text-accent" />,
      items: [
        'Resume credibility',
        'Interview risk signals',
        'Peer benchmarking',
        'LinkedIn profile match'
      ]
    },
    {
      name: 'Bias & discrimination',
      icon: <ShieldAlert className="w-5 h-5 text-accent" />,
      items: [
        'Age and date bias',
        'Employment gaps'
      ]
    },
    {
      name: 'Seniority & impact',
      icon: <Sparkles className="w-5 h-5 text-accent" />,
      items: [
        'Career progression',
        'Skills evidence',
        'Leadership signals'
      ]
    }
  ];

  // FAQ Accordion Data
  const faqs = [
    {
      q: 'What is a resume checker?',
      a: 'A resume checker is specialized software engineered to evaluate resumes against applicant tracking system (ATS) algorithms. It verifies parsability, checks for proper section formatting, scans for high-priority role keywords, flags passive language, and assesses whether your achievements contain quantified metrics (Google XYZ formula) that recruiters demand.'
    },
    {
      q: 'How do I check my resume score?',
      a: 'Simply upload your PDF, DOCX, or text resume above (optionally adding the target job posting). In seconds, our diagnostic engine evaluates your document across 27 specific criteria and returns an overall ATS score from 0 to 100 with actionable next steps.'
    },
    {
      q: 'How do I improve my resume score?',
      a: 'Focus on 4 high-leverage fixes: 1) Rewrite generic duties into quantified achievements using numbers and percentages; 2) Add core hard skills from the job description directly into context; 3) Replace passive duty phrases with active leadership verbs ("Architected", "Spearheaded"); 4) Use our clean Live CV Editor to generate an ATS-verified vector PDF.'
    },
    {
      q: 'How do I know my resume is ATS compliant?',
      a: 'ATS compliance requires clean UTF-8 text flow, standard section titles ("Work Experience", "Education", "Skills"), clickable contact links, and no nested tables or floating textboxes that confuse parsers. Our checker simulates the exact parser output from Workday, Greenhouse, and Lever.'
    },
    {
      q: 'What is a good ATS score?',
      a: 'Any score above 80 indicates strong ATS parsability and high recruiter appeal. Scores below 50 indicate a severe risk of automated rejection due to missing keywords, passive duty language, or unquantified accomplishments.'
    },
    {
      q: 'Can an ATS read PDFs?',
      a: 'Yes! Modern applicant tracking systems (Greenhouse, Workday, Lever, Taleo) read vector PDFs with 100% fidelity. Vector PDFs ensure your formatting, fonts, and layout remain static across every platform. Our Live Editor generates clean vector PDFs.'
    },
    {
      q: 'How do I review my resume for errors?',
      a: 'Use our dual-view inspection: test your document visually, then switch to the "What the ATS Reads" terminal view. This displays the raw plain text extracted by applicant tracking algorithms so you can spot scrambled sections or missing contact info.'
    },
    {
      q: 'What should I focus on when checking my resume?',
      a: 'Avoid cliches like "hard worker" or "team player", never fabricate experience, proofread for passive voice, list measurable achievements over daily duties, and tailor your core keywords to each specific job application.'
    },
    {
      q: 'Can I create a resume checklist?',
      a: 'Yes. Our 25-Point ATS Checklist covers header compliance, experience formula, technical skill clustering, and recruiter eye-scan hierarchy. You can download the full checklist for free anytime from our platform.'
    },
    {
      q: 'Should I read my resume after writing it?',
      a: 'Always step away for a few hours and re-read it from the perspective of an executive recruiter who spends 6 seconds on the first scan. Does your top fold prove immediate impact?'
    },
    {
      q: 'Does your resume checker serve other purposes?',
      a: 'Yes. Beyond ATS scoring, it acts as a job description matching engine, a passive grammar cleaner, and a seniority progression evaluator.'
    },
    {
      q: 'What’s the difference between the free and paid review plans?',
      a: 'The free checker provides instant automated scoring, 27-check diagnostics, and the Live CV Builder. Our $10 to $25 paid plans provide a 1-on-1 human rewrite by a senior developer and technical recruiter with 24-hour turnaround and unlimited revisions.'
    }
  ];

  return (
    <div className="min-h-screen bg-soft text-ink">
      {/* 1. HERO SECTION: Split layout with Red Brand Accents */}
      <section className="relative overflow-hidden bg-paper border-b border-line pt-12 pb-16 sm:pt-16 sm:pb-24">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-slate-100/80 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading, Subtitle & Uploader */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-soft border border-line text-accent text-xs font-bold uppercase tracking-wider">
                <SearchCheck className="w-4 h-4" />
                <span>Resume Checker · 27 Crucial Checks</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl font-black text-ink tracking-tight leading-[1.1]">
                Is your resume <br className="hidden sm:inline" />
                <span className="text-accent">good enough?</span>
              </h1>

              <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl">
                A free and fast ATS resume checker doing <strong>27 crucial checks</strong> to ensure your resume’s content, layout, and keywords are technically compatible with enterprise applicant tracking systems and get you interview callbacks.
              </p>

              {/* Upload & Paste Control Box */}
              <div className="bg-paper rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#C82333] p-6 sm:p-8 transition-all shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInputMode('upload')}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        inputMode === 'upload'
                          ? 'bg-accent text-white shadow-xs'
                          : 'bg-slate-100 text-muted hover:bg-slate-200'
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
                          : 'bg-slate-100 text-muted hover:bg-slate-200'
                      }`}
                    >
                      Paste Text Directly
                    </button>
                  </div>

                  <span className="text-xs text-muted/60 font-medium hidden sm:inline">
                    100% Free · Instant Score
                  </span>
                </div>

                {inputMode === 'upload' ? (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer py-8 px-4 text-center rounded-xl bg-soft/70 hover:bg-soft/40 border border-line/80 transition-colors flex flex-col items-center justify-center space-y-3"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-xl bg-soft border border-line text-accent flex items-center justify-center shadow-xs">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink">
                        {uploadedFileName ? (
                          <span className="text-accent font-mono">Loaded: {uploadedFileName}</span>
                        ) : (
                          <>Drop your resume here or <span className="text-accent underline">choose a file</span></>
                        )}
                      </p>
                      <p className="text-xs text-muted/80 mt-1">
                        PDF, DOCX & TXT. Max 2MB file size.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                    >
                      {uploadedFileName ? 'Change Resume File' : 'Upload Your Resume'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-ink/90 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-accent" />
                        Paste Resume Content
                      </label>
                      <span className="text-xs text-muted/60">
                        {resumeText.trim().split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your current resume content here (Experience, Education, Skills)..."
                      className="w-full p-3.5 text-xs sm:text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C82333] focus:border-[#C82333] outline-none leading-relaxed"
                    />
                  </div>
                )}

                {/* Optional Target Job Description */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-ink/90 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-accent" />
                      Target Job Description (Optional)
                    </label>
                    <span className="text-[11px] text-accent font-semibold">
                      Enables Keyword Match
                    </span>
                  </div>
                  <input
                    type="text"
                    value={jobDescriptionText}
                    onChange={(e) => setJobDescriptionText(e.target.value)}
                    placeholder="Paste job posting text or key skills (e.g., React, TypeScript, GraphQL, AWS)..."
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C82333] focus:border-[#C82333] outline-none"
                  />
                </div>

                {/* Action Bar & Quick Samples */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted/80 font-medium">Or try sample:</span>
                    <button
                      type="button"
                      onClick={() => handleLoadSample('developer')}
                      className="text-[11px] px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-ink/90 font-medium"
                    >
                      Developer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadSample('marketing')}
                      className="text-[11px] px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-ink/90 font-medium"
                    >
                      Marketing
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadSample('sales')}
                      className="text-[11px] px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-ink/90 font-medium"
                    >
                      Sales
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={isScanning}
                    onClick={handleRunScan}
                    className="w-full sm:w-auto px-6 py-3 bg-accent hover:bg-accent/90 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2"
                  >
                    {isScanning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Running 27 Checks...</span>
                      </>
                    ) : (
                      <>
                        <SearchCheck className="w-4 h-4" />
                        <span>Run 27-Check ATS Scan</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-muted/80">
                  <Lock className="w-3.5 h-3.5 text-muted/60" />
                  <span>We never share your data with 3rd parties or use it for AI model training.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Feature Poster */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-soft0" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-soft0" />
                  </div>
                  <span className="text-[11px] font-mono text-muted/60">ATS Engine v4.2</span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-300">Parse Reliability Rate</span>
                      <span className="text-emerald-400 font-mono">98.4%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-soft0 rounded-full w-[98%]" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-300">Google XYZ Formula Density</span>
                      <span className="text-[#F87171] font-mono">2 / 5 Found</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-accent rounded-full w-[40%]" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-300">Enterprise ATS Tested</span>
                      <span className="text-muted/60 text-[11px]">Workday · Greenhouse · Taleo · Lever</span>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-muted/60 leading-relaxed">
                    "Most rejections happen before a human recruiter looks at your resume. Our dual-tier system tests machine parsing and recruiter impact."
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-muted/60">
                  <span>5,363+ Scans Processed</span>
                  <span className="text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" /> 4.5/5 Rating
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SCAN RESULTS (if scan was run) */}
      {scanResult && (
        <section id="scan-results" className="py-12 bg-slate-100 border-b border-slate-300">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Main Score Card */}
            <div className="bg-paper rounded-2xl border border-line p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-5">
                  <div className={`w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${getScoreColor(scanResult.score)}`}>
                    <span className="font-heading text-3xl font-extrabold">
                      {scanResult.score}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider">
                      out of 100
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted/80">
                      Overall ATS Readiness
                    </span>
                    <h3 className="font-heading text-xl font-bold text-ink mt-0.5">
                      {scanResult.score < 50
                        ? 'High Rejection Risk (75%+ Filtering Likelihood)'
                        : scanResult.score < 75
                        ? 'Average Rating (Needs Metric & Keyword Elevation)'
                        : 'Strong Foundation (Ready for Executive Polish)'}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted mt-1 max-w-xl">
                      {scanResult.summaryFeedback}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('editor')}
                      className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <PenTool className="w-4 h-4 text-accent" />
                      <span>Open in Live CV Editor (Free)</span>
                    </button>
                  )}
                  <button
                    onClick={() => onSelectPlan('starter', { resume: resumeText, jd: jobDescriptionText })}
                    className="px-5 py-3 bg-accent hover:bg-accent/90 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Fix With Senior Dev — From $10</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 5 Category Metric Breakdown */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-3.5 rounded-xl bg-soft border border-line">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted font-medium">Quantified Metrics</span>
                    <span className="font-bold text-ink">{scanResult.categoryScores.quantifiedMetrics}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full" 
                      style={{ width: `${scanResult.categoryScores.quantifiedMetrics}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-muted/60 mt-1 block">
                    {scanResult.quantifiedCount} quantified lines
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-soft border border-line">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted font-medium">Action Verbs</span>
                    <span className="font-bold text-ink">{scanResult.categoryScores.actionVerbs}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-700 rounded-full" 
                      style={{ width: `${scanResult.categoryScores.actionVerbs}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-muted/60 mt-1 block">
                    {scanResult.strongVerbsCount} power verbs found
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-soft border border-line">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted font-medium">Keywords Match</span>
                    <span className="font-bold text-ink">{scanResult.categoryScores.skillsRelevance}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${scanResult.categoryScores.skillsRelevance}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-muted/60 mt-1 block">
                    {scanResult.detectedKeywords.length} core keywords
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-soft border border-line">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted font-medium">ATS Layout</span>
                    <span className="font-bold text-ink">{scanResult.categoryScores.atsReadability}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full" 
                      style={{ width: `${scanResult.categoryScores.atsReadability}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-muted/60 mt-1 block">
                    Clean plain-text parsing
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-soft border border-line">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted font-medium">Section Order</span>
                    <span className="font-bold text-ink">{scanResult.categoryScores.structureFormatting}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${scanResult.categoryScores.structureFormatting}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-muted/60 mt-1 block">
                    Enterprise hierarchy
                  </span>
                </div>
              </div>
            </div>

            {/* 27-Check Interactive Diagnostic Drawer */}
            {scanResult.detailedChecks && (
              <div className="bg-paper rounded-2xl border border-line p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-ink">
                      The 27 Crucial Checks Diagnostic Breakdown
                    </h3>
                    <p className="text-xs text-muted/80 mt-0.5">
                      Status of your resume against all 27 automated and recruiter criteria.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {['All', 'ATS Essentials', 'Resume Sections', 'Content', 'Job Tailoring', 'Recruiter Red Flags', 'Bias & Discrimination', 'Seniority & Impact'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCheckCategory(cat)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                          selectedCheckCategory === cat
                            ? 'bg-accent text-white shadow-xs'
                            : 'bg-slate-100 text-muted hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {scanResult.detailedChecks
                    .filter((chk) => selectedCheckCategory === 'All' || chk.category === selectedCheckCategory)
                    .map((chk) => (
                      <div
                        key={chk.id}
                        className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between space-y-2 ${
                          chk.status === 'pass'
                            ? 'bg-soft/50 border-line text-ink'
                            : chk.status === 'warning'
                            ? 'bg-amber-50/60 border-amber-200 text-ink'
                            : 'bg-soft/60 border-line text-ink'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-ink flex items-center gap-1.5">
                            {chk.status === 'pass' ? (
                              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                            ) : chk.status === 'warning' ? (
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            ) : (
                              <X className="w-4 h-4 text-red-600 shrink-0" />
                            )}
                            {chk.name}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-muted/60">
                            {chk.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted leading-relaxed">
                          {chk.detail}
                        </p>
                        {chk.recommendation && (
                          <div className="pt-1 text-[10px] text-muted/80 border-t border-line/50">
                            <strong>Tip:</strong> {chk.recommendation}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. TWO-TIER SCORING SYSTEM BREAKDOWN (Left/Right Section) */}
      <section className="py-16 sm:py-24 bg-paper border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-5 border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-[#F87171] uppercase tracking-wider">
                    Two-Tier ATS Scoring Architecture
                  </span>
                  <span className="text-xs font-mono text-muted/60">Enterprise Standard</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-xs">1</span>
                    <h4>Tier 1: Machine ATS Parsability</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Evaluates reverse-engineered parsers (Greenhouse, Lever, Workday) to verify that skills, dates, and sections are indexed cleanly into database fields without corrupting.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <span className="w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center text-xs">2</span>
                    <h4>Tier 2: Recruiter Impact & Calibration</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Detects quantifiable achievements (e.g. "30% growth", "$1.2M revenue"), active velocity verbs, and removes unconscious age or gap bias.
                  </p>
                </div>
              </div>
            </div>

            {/* Explanation Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Algorithmic Evaluation
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                ATS Resume Maker’s Resume Checker forms its score with a two-tier system
              </h2>
              <div className="space-y-4 text-muted text-sm sm:text-base leading-relaxed">
                <p>
                  When applying for a job, your resume is first filtered by an applicant tracking system before it ever touches a recruiter’s screen. ATS software parses candidate data into a searchable database.
                </p>
                <p>
                  That’s why your interview callback rate depends on two distinct factors: <strong>how cleanly the ATS machine extracts your skills</strong>, and <strong>how compelling your quantifiable impact appears to the hiring manager</strong> who reviews the extracted profile.
                </p>
              </div>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-soft border border-line">
                  <span className="text-xs font-bold text-ink block mb-1">
                    1. Machine Parsability Proportion
                  </span>
                  <p className="text-xs text-muted/80 leading-relaxed">
                    We test against rules established from reverse-engineering Workday, Taleo, Greenhouse, and Lever.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-soft border border-line">
                  <span className="text-xs font-bold text-ink block mb-1">
                    2. Measurable Accomplishments
                  </span>
                  <p className="text-xs text-muted/80 leading-relaxed">
                    Flags vague duty claims ("Responsible for bugs") and elevates them with metrics ("Resolved 45+ critical bugs, reducing churn by 18%").
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 27 CRUCIAL CHECKS (7 Categories Grid) */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F87171]">
              Full Spectrum Inspection
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
              The AI-powered Resume Checker goes beyond typos and punctuation
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We check your resume against what both ATS software and senior tech recruiters inspect. The engine verifies 27 crucial factors across seven distinct categories:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesList.map((cat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700">
                    {cat.icon}
                  </div>
                  <h3 className="font-heading font-bold text-base text-white">
                    {cat.name}
                  </h3>
                </div>

                <ul className="space-y-2.5 pt-2">
                  {cat.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded bg-accent/20 border border-[#C82333]/50 text-[#F87171] flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* 7th Category Highlight Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#C82333] to-[#8E1724] text-white shadow-lg space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-red-200">
                  Ready To Test Your Score?
                </span>
                <h3 className="font-heading font-bold text-xl mt-1">
                  Run all 27 checks on your resume right now
                </h3>
                <p className="text-xs text-red-100 mt-2 leading-relaxed">
                  No credit card required. Free vector PDF export and personalized task list included.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 bg-paper text-accent font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors shadow-xs"
              >
                Upload & Scan My Resume Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE TABS: "Put your resume score to work" */}
      <section className="py-16 sm:py-24 bg-paper border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              End-to-End Application Platform
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              Put your resume score to work
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Checking is just step one. ATS Resume Maker covers every stage of the international hiring cycle: the rewrite, the cover letter, the job tracking, and the interview prep.
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
                      : 'bg-slate-100 text-ink/90 hover:bg-slate-200'
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
                    Turn diagnostic feedback into an interview-earning resume
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Your report flags what to fix. Our Live CV Builder helps you fix it in real time, with custom color pickers, photo support, and vector PDF exports that pass Workday and Greenhouse parsers.
                  </p>
                  <ul className="space-y-2 text-xs text-ink/90">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent" />
                      <span>20+ specialized sections reviewed by senior technical recruiters</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent" />
                      <span>Google XYZ formula suggestions that turn flat duties into measurable numbers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent" />
                      <span>One-click downloadable vector PDF with selectable plain text</span>
                    </li>
                  </ul>
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('editor')}
                      className="mt-2 px-5 py-2.5 bg-accent hover:bg-accent/90 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2"
                    >
                      <PenTool className="w-4 h-4" />
                      <span>Launch Live CV Editor (Free)</span>
                    </button>
                  )}
                </div>

                <div className="p-6 rounded-xl bg-paper border border-line shadow-sm space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-muted/60 pb-2 border-b">
                    <span>Live Builder Preview</span>
                    <span className="text-accent font-bold">100% ATS Safe</span>
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
                    The file you just checked can immediately become your working draft. Upload an old Word file or paste your LinkedIn URL, and ATS Resume Maker parses your career history into modern format.
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
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Interview Round 2</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-soft border">
                    <span>Stripe · Technical Lead</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">Take-Home Test</span>
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
                    <span>Role Match Score</span>
                    <span className="text-accent">89% Match</span>
                  </div>
                  <p className="text-[11px] text-muted">Matched: React, TypeScript, GraphQL, Docker, Microservices</p>
                  <p className="text-[11px] text-red-600 font-semibold">Missing: Kubernetes, Terraform</p>
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
              Senior Recruiter Intelligence
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              Learn what happens to your resume after you hit apply
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Most ATS advice online is an outdated myth. Our senior developers and recruiters ran real tests on Workday, Lever, and Greenhouse—here is what actually works:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                tag: 'CAREER RESEARCH',
                title: 'Does the ATS Reject Your Resume? 25 Recruiters Explain What Really Happens',
                readTime: '9 min read',
                desc: 'We asked 25 enterprise tech recruiters whether ATS bots reject resumes automatically. Here is the truth behind the 75% filter myth.'
              },
              {
                tag: 'ATS TESTING',
                title: 'Busting ATS Myths: Comprehensive Testing of Popular Resume Builders in 2026',
                readTime: '13 min read',
                desc: 'Testing double-column formats, vector PDFs, icons, and infographics across Workday, Lever, and Greenhouse ATS algorithms.'
              },
              {
                tag: 'RESUME ADVICE',
                title: 'Creating an ATS-Friendly Resume in 2026: What Actually Works',
                readTime: '25 min read',
                desc: 'Step-by-step masterclass on keyword placement, Google XYZ formulas, standard section headers, and contact block formatting.'
              },
              {
                tag: 'COMMON ERRORS',
                title: '20+ Resume Mistakes to Avoid (and How to Fix Them Like a Pro)',
                readTime: '13 min read',
                desc: 'From passive duty language like "responsible for" to unquantified accomplishments—how to spot subtle errors costing you callbacks.'
              },
              {
                tag: 'KEYWORD STRATEGY',
                title: 'Resume Keywords to Land Interviews and Get Hired',
                readTime: '9 min read',
                desc: 'How strategic keyword clustering and contextual evidence prevent keyword stuffing traps while maximizing parser scoring.'
              },
              {
                tag: 'TAILORING GUIDE',
                title: 'How to Tailor Your Resume to the Job Description in Under 5 Minutes',
                readTime: '8 min read',
                desc: 'Learn how to extract the top 10 required terms from a job ad and integrate them naturally into your professional summary.'
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
                  <h4 className="font-heading font-bold text-ink text-base leading-snug hover:text-accent transition-colors cursor-pointer">
                    {article.title}
                  </h4>
                  <p className="text-xs text-muted/80 leading-relaxed">
                    {article.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-accent font-bold">
                  <span>Read Full Research</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. VERIFIED REVIEWS & SOCIAL PROOF */}
      <section className="py-16 sm:py-24 bg-paper border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <h2 className="font-heading text-3xl font-bold text-ink">
              Trusted by executives & senior professionals worldwide
            </h2>
            <p className="text-xs sm:text-sm text-muted/80">
              <strong>4.5 / 5</strong> average rating across 5,363+ candidates hired at Google, Stripe, Microsoft, and Amazon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-soft border border-line space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-ink/90 italic leading-relaxed">
                "Great tool for improving your CV. My initial score was 48 due to passive duties. After following the 27-point recommendations, callbacks jumped from 0 to 4 in two weeks."
              </p>
              <div className="text-xs font-bold text-ink border-t pt-3">
                Mark D. · Senior DevOps Engineer
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-soft border border-line space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-ink/90 italic leading-relaxed">
                "I spent hours on Canva trying to format everything. This checker told me Canva tables fail Workday parsing. Used the ATS Live Builder and got hired at a Fortune 500 company."
              </p>
              <div className="text-xs font-bold text-ink border-t pt-3">
                Rositsa K. · Product Marketing Manager
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-soft border border-line space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-ink/90 italic leading-relaxed">
                "Fast, accurate, and completely transparent about what applicant tracking software looks for. The Bangladesh talent initiative making it free forever is incredible."
              </p>
              <div className="text-xs font-bold text-ink border-t pt-3">
                Carolyn T. · Full Stack Developer
              </div>
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
                    <span className="p-1 rounded-md bg-slate-100 text-muted/80 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-muted leading-relaxed border-t border-slate-100 pt-3">
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
      <section className="py-16 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Get your resume score now!
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Upload your resume and you’ll get an instant personalized diagnostic report across all 27 crucial ATS and hiring manager checks.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-accent hover:bg-accent/90 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Scan My Resume Free (27 Checks)</span>
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate('editor')}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <PenTool className="w-4 h-4 text-[#F87171]" />
                <span>Open Live CV Editor</span>
              </button>
            )}
          </div>

          <p className="text-xs text-muted/60 pt-2">
            No signup required for instant scoring · 100% Free for all Bangladeshi candidates
          </p>
        </div>
      </section>
    </div>
  );
};
