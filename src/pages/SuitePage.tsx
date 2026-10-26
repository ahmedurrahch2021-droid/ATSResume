import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ResumeData, 
  PageRoute, 
  ResumeExperienceItem, 
  TargetMarket, 
  ResumeLanguageItem, 
  CompetitiveProgrammingItem 
} from '../types';
import { 
  DEFAULT_RESUME_DATA, 
  SAMPLE_RESUMES, 
  BANGLADESH_TECH_SAMPLE,
  parseRawResumeText, 
  formatResumeAsPlainText, 
  exportResumeAsJson 
} from '../utils/resumeParser';
import { analyzeJobMatch } from '../utils/jobMatcher';
import { analyzeResumeText } from '../utils/atsScanner';
import { extractTextFromFile, checkBioDataClutter, purgeBioDataClutter } from '../utils/fileExtractor';

import { PhotoUploader } from '../components/PhotoUploader';
import { AtsTerminalView } from '../components/AtsTerminalView';
import { LinkedInSyncModal } from '../components/LinkedInSyncModal';
import { PersonalConsultationModal } from '../components/PersonalConsultationModal';
import { BangladeshInitiativeBanner } from '../components/BangladeshInitiativeBanner';

import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Download, 
  ArrowRight, 
  Plus, 
  Trash2, 
  SearchCheck, 
  Target, 
  Sliders, 
  Layers, 
  ShieldCheck, 
  Code, 
  Copy, 
  Check, 
  RefreshCw,
  ExternalLink,
  Zap,
  Info,
  UploadCloud,
  Terminal,
  Share2,
  Globe,
  Award,
  Palette
} from 'lucide-react';
import { UserAccount } from '../types/auth';

interface SuitePageProps {
  onNavigate: (route: PageRoute) => void;
  onOpenOrder: (packageId?: 'starter' | 'boost' | 'full', preloaded?: { resume: string; jd: string }) => void;
  userAccount?: UserAccount;
  onOpenAuth?: () => void;
  initialResumeData?: ResumeData | null;
}

export const SuitePage: React.FC<SuitePageProps> = ({ 
  onNavigate, 
  onOpenOrder,
  userAccount,
  onOpenAuth,
  initialResumeData
}) => {
  const [activeTab, setActiveTab] = useState<'builder' | 'matcher' | 'auditor'>('builder');
  const [previewMode, setPreviewMode] = useState<'visual' | 'terminal'>('visual');
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData || DEFAULT_RESUME_DATA);
  const [accentColor, setAccentColor] = useState<string>('#C82333');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [savedNotification, setSavedNotification] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<'form' | 'paste' | 'upload'>('form');
  const [rawPasteText, setRawPasteText] = useState<string>('');
  
  // Market Target & Bangladesh Initiative
  const [targetMarket, setTargetMarket] = useState<TargetMarket>('global');
  const [isDhakaTimezone, setIsDhakaTimezone] = useState<boolean>(false);

  // Modals
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState<boolean>(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // File upload state
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Target Job Description for Matcher
  const [jobDescription, setJobDescription] = useState<string>(
    `Seeking a Senior Full Stack Software Engineer to build scalable cloud-native web applications.
Requirements:
- 5+ years with React, TypeScript, Node.js, and modern CSS/Tailwind.
- Proven experience with Docker, Kubernetes, and AWS cloud microservices.
- Strong SQL and PostgreSQL database optimization skills.
- Track record of CI/CD pipeline automation with GitHub Actions.
- Excellent cross-functional leadership, agile execution, and mentorship abilities.`
  );

  // Auto-detect Bangladesh timezone on mount
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === 'Asia/Dhaka') {
        setIsDhakaTimezone(true);
        setTargetMarket('bangladesh');
        setResumeData(BANGLADESH_TECH_SAMPLE);
      }
    } catch {
      // fallback
    }
  }, []);

  // Sync initial resume data if opened from templates
  useEffect(() => {
    if (initialResumeData) {
      setResumeData(initialResumeData);
      setInputMode('form');
    }
  }, [initialResumeData]);

  // Resume text representation
  const plainTextResume = useMemo(() => formatResumeAsPlainText(resumeData), [resumeData]);

  // ATS Scanner analysis
  const atsAudit = useMemo(() => {
    return analyzeResumeText(plainTextResume, jobDescription);
  }, [plainTextResume, jobDescription]);

  // Job Matcher analysis
  const jobMatch = useMemo(() => {
    return analyzeJobMatch(resumeData, jobDescription);
  }, [resumeData, jobDescription]);

  // Bio-Data clutter scan
  const bioDataCheck = useMemo(() => {
    return checkBioDataClutter(plainTextResume);
  }, [plainTextResume]);

  // Handle sample loaders
  const handleLoadSample = (sampleType: 'developer' | 'product' | 'devops' | 'bangladesh') => {
    setResumeData(SAMPLE_RESUMES[sampleType]);
    if (sampleType === 'bangladesh') {
      setTargetMarket('bangladesh');
    }
  };

  // Handle parsing raw paste
  const handleParsePaste = () => {
    if (!rawPasteText.trim()) return;
    const parsed = parseRawResumeText(rawPasteText);
    setResumeData(parsed);
    setInputMode('form');
  };

  // Handle file drop / upload
  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessingFile(true);
      const extracted = await extractTextFromFile(file);
      setRawPasteText(extracted.text);
      const parsed = parseRawResumeText(extracted.text);
      setResumeData(parsed);
      setInputMode('form');
    } catch (err) {
      alert('Error parsing document: ' + (err as Error).message);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Add bullet to an experience item
  const handleAddBullet = (expId: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          return {
            ...exp,
            bullets: [...exp.bullets, 'Engineered high-performance module delivering 25% efficiency gains.']
          };
        }
        return exp;
      })
    }));
  };

  // Update bullet
  const handleUpdateBullet = (expId: string, bulletIdx: number, text: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          const newBullets = [...exp.bullets];
          newBullets[bulletIdx] = text;
          return { ...exp, bullets: newBullets };
        }
        return exp;
      })
    }));
  };

  // Remove bullet
  const handleRemoveBullet = (expId: string, bulletIdx: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          const newBullets = exp.bullets.filter((_, idx) => idx !== bulletIdx);
          return { ...exp, bullets: newBullets };
        }
        return exp;
      })
    }));
  };

  // Add new experience entry
  const handleAddExperience = () => {
    const newExp: ResumeExperienceItem = {
      id: `exp-${Date.now()}`,
      role: 'Software Engineer',
      company: 'Tech Enterprise Co.',
      location: 'Remote',
      dates: '2020 – 2022',
      bullets: [
        'Built full-stack web applications serving 50,000+ monthly active users.',
        'Decreased bundle size by 30% via modern code-splitting.'
      ]
    };
    setResumeData(prev => ({
      ...prev,
      experience: [newExp, ...prev.experience]
    }));
  };

  // Remove experience entry
  const handleRemoveExperience = (expId: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== expId)
    }));
  };

  // Add language
  const handleAddLanguage = () => {
    const newLang: ResumeLanguageItem = {
      id: `lang-${Date.now()}`,
      name: 'English',
      level: 'C1 (Advanced)'
    };
    setResumeData(prev => ({
      ...prev,
      languages: [...(prev.languages || []), newLang]
    }));
  };

  const handleRemoveLanguage = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter(l => l.id !== id)
    }));
  };

  // Add competitive programming handle
  const handleAddCpProfile = () => {
    const newProfile: CompetitiveProgrammingItem = {
      id: `cp-${Date.now()}`,
      platform: 'LeetCode',
      handle: 'candidate_code',
      rating: '1850',
      badgeOrRank: 'Knight'
    };
    setResumeData(prev => ({
      ...prev,
      competitiveProgramming: [...(prev.competitiveProgramming || []), newProfile]
    }));
  };

  const handleRemoveCpProfile = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      competitiveProgramming: (prev.competitiveProgramming || []).filter(c => c.id !== id)
    }));
  };

  // Print vector PDF
  const handlePrint = () => {
    window.print();
  };

  // Save to Cloud handler
  const handleSaveToCloud = () => {
    if (!userAccount?.isLoggedIn) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    setSavedNotification(true);
    setLastSavedTime('Just now');
    setTimeout(() => setSavedNotification(false), 2500);
  };

  // Copy plain text
  const handleCopyText = () => {
    navigator.clipboard.writeText(plainTextResume);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="min-h-screen bg-soft text-ink pb-20">
      {/* 1. Bangladesh Talent Initiative & Global Market Banner */}
      <BangladeshInitiativeBanner
        currentMarket={targetMarket}
        onSelectMarket={(market) => setTargetMarket(market)}
        onLoadBangladeshSample={() => handleLoadSample('bangladesh')}
        isAutoDetected={isDhakaTimezone}
      />

      {/* Top Banner / Toolbar */}
      <div className="bg-paper border-b border-line sticky top-20 z-30 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Suite Identification */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs font-mono">
                ATS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-lg font-bold text-ink leading-none">
                    ATS Career Workspace
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-ink border border-line">
                    OPEN SOURCE POWERED
                  </span>
                </div>
                <p className="text-xs text-muted/80 mt-0.5">
                  Single-Column RenderCV · Resume Matcher · ATS Screener · LinkedIn Optimizer
                </p>
              </div>
            </div>

            {/* Middle: Tool Segmented Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-line">
              <button
                type="button"
                onClick={() => setActiveTab('builder')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'builder'
                    ? 'bg-paper text-ink shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-accent" />
                Live Builder
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('matcher')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'matcher'
                    ? 'bg-paper text-ink shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-accent" />
                Job Matcher
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-100 text-accent font-mono">
                  {jobMatch.matchPercentage}%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('auditor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'auditor'
                    ? 'bg-paper text-ink shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <SearchCheck className="w-3.5 h-3.5 text-accent" />
                ATS Screener
                <span className={`ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full font-mono ${
                  atsAudit.score >= 80 ? 'bg-emerald-100 text-accent' : 'bg-amber-100 text-amber-700'
                }`}>
                  {atsAudit.score}/100
                </span>
              </button>
            </div>

            {/* Right: Actions & 1-Click Upgrade */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSaveToCloud}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                  savedNotification
                    ? 'bg-soft text-emerald-800 border-emerald-300'
                    : userAccount?.isLoggedIn
                    ? 'bg-paper text-ink/90 hover:bg-soft border-line'
                    : 'bg-soft text-emerald-800 hover:bg-emerald-100 border-emerald-300 font-bold'
                }`}
                title="Save master resume and versions to cloud"
              >
                <UploadCloud className="w-3.5 h-3.5 text-accent" />
                {savedNotification ? 'Saved to Cloud!' : userAccount?.isLoggedIn ? 'Save to Cloud' : 'Sign Up to Save'}
              </button>

              <button
                type="button"
                onClick={() => setIsLinkedInModalOpen(true)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#0A66C2] bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors flex items-center gap-1"
                title="LinkedIn & Easy Apply format sync"
              >
                <Share2 className="w-3.5 h-3.5" />
                LinkedIn Sync
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-ink/90 hover:bg-slate-100 border border-line transition-colors flex items-center gap-1"
                title="Print vector PDF with standard ATS margins"
              >
                <Printer className="w-3.5 h-3.5 text-muted/80" />
                Print / Vector PDF
              </button>

              <button
                type="button"
                onClick={() => exportResumeAsJson(resumeData)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-ink/90 hover:bg-slate-100 border border-line transition-colors hidden sm:flex items-center gap-1"
                title="Download JSON backup"
              >
                <Download className="w-3.5 h-3.5 text-muted/80" />
                JSON
              </button>

              <button
                type="button"
                onClick={() => setIsConsultationModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-accent hover:bg-accent/90 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                1-on-1 Review ($10)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* ========================================================================= */}
        {/* TAB 1: LIVE BUILDER (OpenResume / Reactive Resume) */}
        {/* ========================================================================= */}
        {activeTab === 'builder' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 6 Columns: Interactive Structured Editor / Ingestion */}
            <div className="lg:col-span-6 space-y-5 print:hidden">
              
              {/* Dual Mode Switch & Sample Presets */}
              <div className="bg-paper rounded-2xl border border-line p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setInputMode('form')}
                      className={`text-xs font-medium px-3 py-1 rounded-md transition-colors ${
                        inputMode === 'form' ? 'bg-paper text-ink shadow-2xs font-bold' : 'text-muted'
                      }`}
                    >
                      Structured Form
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('upload')}
                      className={`text-xs font-medium px-3 py-1 rounded-md transition-colors ${
                        inputMode === 'upload' ? 'bg-paper text-ink shadow-2xs font-bold' : 'text-muted'
                      }`}
                    >
                      Upload File (.pdf / .docx)
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('paste')}
                      className={`text-xs font-medium px-3 py-1 rounded-md transition-colors ${
                        inputMode === 'paste' ? 'bg-paper text-ink shadow-2xs font-bold' : 'text-muted'
                      }`}
                    >
                      Quick Paste
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold text-muted/60 uppercase tracking-wider">Presets:</span>
                    <button
                      type="button"
                      onClick={() => handleLoadSample('developer')}
                      className="text-xs px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-ink/90 font-medium"
                    >
                      Global Dev
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadSample('bangladesh')}
                      className="text-xs px-2 py-0.5 rounded bg-soft hover:bg-emerald-100 text-emerald-800 border border-line font-semibold"
                    >
                      🇧🇩 BD Tech
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadSample('product')}
                      className="text-xs px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-ink/90 font-medium"
                    >
                      Product
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLoadSample('devops')}
                      className="text-xs px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-ink/90 font-medium"
                    >
                      DevOps
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-muted/80">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    100% Client-Side Privacy — Nothing uploaded to external ad trackers
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="text-accent font-semibold hover:underline flex items-center gap-1"
                  >
                    {copiedNotification ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedNotification ? 'Copied!' : 'Copy Plain Text'}
                  </button>
                </div>
              </div>

              {/* Upload File Mode */}
              {inputMode === 'upload' && (
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={handleDrop}
                  className={`bg-paper rounded-2xl border-2 border-dashed p-8 text-center transition-all shadow-xs ${
                    isDraggingFile ? 'border-emerald-500 bg-soft/40' : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.json"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(f);
                    }}
                    className="hidden"
                  />
                  <div className="w-14 h-14 mx-auto rounded-full bg-soft text-accent flex items-center justify-center mb-3">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-sm font-bold text-ink">
                    Drag and Drop Your Existing CV / Resume
                  </h3>
                  <p className="text-xs text-muted/80 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
                    Supports <strong>PDF, Word (.docx), and Plain Text</strong>. Our client-side engine extracts your career data, checks for outdated bio-data bloat, and auto-populates the editor.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingFile}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors inline-flex items-center gap-2"
                  >
                    {isProcessingFile ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                        Extracting Document Streams...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        Select File from Computer
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Paste / Raw Text Mode */}
              {inputMode === 'paste' && (
                <div className="bg-paper rounded-2xl border border-line p-6 space-y-4 shadow-xs">
                  <div className="space-y-1">
                    <h3 className="font-heading text-sm font-bold text-ink">
                      Import or Paste Existing Resume Text
                    </h3>
                    <p className="text-xs text-muted/80">
                      Paste raw text from Google Docs or LinkedIn. Our parser extracts contact details, experience, and competencies into standardized single-column fields.
                    </p>
                  </div>
                  <textarea
                    rows={12}
                    value={rawPasteText}
                    onChange={(e) => setRawPasteText(e.target.value)}
                    placeholder="Paste full resume text here..."
                    className="w-full text-xs font-mono p-3.5 bg-soft border border-line rounded-xl focus:bg-paper focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setRawPasteText(plainTextResume)}
                      className="px-3 py-1.5 rounded-lg border border-line text-xs font-medium text-muted hover:bg-soft"
                    >
                      Load Current Form Text
                    </button>
                    <button
                      type="button"
                      onClick={handleParsePaste}
                      className="px-4 py-2 rounded-lg bg-accent hover:bg-accent/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Auto-Populate Structured Form
                    </button>
                  </div>
                </div>
              )}

              {/* Structured Form Mode */}
              {inputMode === 'form' && (
                <div className="space-y-6">
                  {/* Photo Uploader Component (International / Europass CV standard) */}
                  <PhotoUploader
                    photoUrl={resumeData.photoUrl}
                    photoShape={resumeData.photoShape || 'circle'}
                    isAntiBiasMode={targetMarket === 'us_uk'}
                    onUpdatePhoto={(url, shape) => {
                      setResumeData(prev => ({
                        ...prev,
                        photoUrl: url,
                        photoShape: shape
                      }));
                    }}
                  />

                  {/* 1. Contact Information */}
                  <div className="bg-paper rounded-2xl border border-line p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-ink/90 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-soft0" />
                        1. Contact Header (ATS Verified)
                      </h3>
                      <span className="text-[11px] text-muted/60">Single-line ATS format</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-muted block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={resumeData.fullName}
                          onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-muted block mb-1">Target Professional Title</label>
                        <input
                          type="text"
                          value={resumeData.targetTitle}
                          onChange={(e) => setResumeData({ ...resumeData, targetTitle: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-muted block mb-1">Email</label>
                        <input
                          type="email"
                          value={resumeData.email}
                          onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-muted block mb-1">Phone (+Country Code)</label>
                        <input
                          type="text"
                          value={resumeData.phone}
                          onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-muted block mb-1">Location (City, Country)</label>
                        <input
                          type="text"
                          value={resumeData.location}
                          onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-muted block mb-1">LinkedIn Profile</label>
                        <input
                          type="text"
                          value={resumeData.linkedin}
                          onChange={(e) => setResumeData({ ...resumeData, linkedin: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-muted block mb-1">GitHub / Portfolio URL</label>
                        <input
                          type="text"
                          value={resumeData.portfolio}
                          onChange={(e) => setResumeData({ ...resumeData, portfolio: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-muted block mb-1">Work Authorization / Visa</label>
                        <input
                          type="text"
                          value={resumeData.visaStatus || ''}
                          placeholder="e.g. Authorized to work / Open to remote"
                          onChange={(e) => setResumeData({ ...resumeData, visaStatus: e.target.value })}
                          className="w-full text-xs px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Professional Summary */}
                  <div className="bg-paper rounded-2xl border border-line p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-ink/90 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-soft0" />
                        2. Professional Summary
                      </h3>
                      <span className="text-[11px] text-muted/60">2–3 sentences with key metrics</span>
                    </div>

                    <textarea
                      rows={3}
                      value={resumeData.summary}
                      onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                      className="w-full text-xs p-3 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                    />
                  </div>

                  {/* 3. Work Experience */}
                  <div className="bg-paper rounded-2xl border border-line p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-ink/90 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-soft0" />
                          3. Work Experience (Google XYZ Metric Format)
                        </h3>
                        <p className="text-[11px] text-muted/80 mt-0.5">
                          Format: "Accomplished [X] measured by [Y] by doing [Z]"
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddExperience}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Position
                      </button>
                    </div>

                    <div className="space-y-6">
                      {resumeData.experience.map((exp, expIdx) => (
                        <div key={exp.id} className="p-4 bg-soft/70 border border-line rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-ink/90">Role #{expIdx + 1}</span>
                            {resumeData.experience.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveExperience(exp.id)}
                                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Remove Position
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <input
                              type="text"
                              placeholder="Job Title / Role"
                              value={exp.role}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience];
                                newExp[expIdx].role = e.target.value;
                                setResumeData({ ...resumeData, experience: newExp });
                              }}
                              className="px-3 py-1.5 bg-paper border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                            />
                            <input
                              type="text"
                              placeholder="Company Name"
                              value={exp.company}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience];
                                newExp[expIdx].company = e.target.value;
                                setResumeData({ ...resumeData, experience: newExp });
                              }}
                              className="px-3 py-1.5 bg-paper border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <input
                              type="text"
                              placeholder="Location (e.g. Remote / City, Country)"
                              value={exp.location}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience];
                                newExp[expIdx].location = e.target.value;
                                setResumeData({ ...resumeData, experience: newExp });
                              }}
                              className="px-3 py-1.5 bg-paper border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <input
                              type="text"
                              placeholder="Dates (e.g. 2021 – Present)"
                              value={exp.dates}
                              onChange={(e) => {
                                const newExp = [...resumeData.experience];
                                newExp[expIdx].dates = e.target.value;
                                setResumeData({ ...resumeData, experience: newExp });
                              }}
                              className="px-3 py-1.5 bg-paper border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          {/* Bullets */}
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-muted/80 uppercase">Impact Bullets:</span>
                              <button
                                type="button"
                                onClick={() => handleAddBullet(exp.id)}
                                className="text-[11px] text-accent font-semibold hover:underline flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" /> Add Bullet
                              </button>
                            </div>

                            {exp.bullets.map((bullet, bIdx) => {
                              const hasMetric = /\b(\d+[%$kKmMbB]?|\d+x|\d+\s*(users|clients|ms|seconds|minutes|hours|days|percent))\b/i.test(bullet);
                              return (
                                <div key={bIdx} className="space-y-1">
                                  <div className="flex items-start gap-1.5">
                                    <span className="text-muted/60 mt-2 text-xs font-mono">•</span>
                                    <textarea
                                      rows={2}
                                      value={bullet}
                                      onChange={(e) => handleUpdateBullet(exp.id, bIdx, e.target.value)}
                                      className="flex-1 text-xs p-2 bg-paper border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                                    />
                                    {exp.bullets.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveBullet(exp.id, bIdx)}
                                        className="text-slate-300 hover:text-red-500 p-1 mt-1"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                  <div className="pl-4 flex items-center gap-2">
                                    {hasMetric ? (
                                      <span className="text-[10px] text-accent bg-soft px-1.5 py-0.5 rounded border border-line font-medium inline-flex items-center gap-1 font-mono">
                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                        Metric quantified
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-medium inline-flex items-center gap-1 font-mono">
                                        <AlertTriangle className="w-2.5 h-2.5" />
                                        Add % or $ metric
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Technical Skills */}
                  <div className="bg-paper rounded-2xl border border-line p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-ink/90 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-soft0" />
                        4. Core Competencies & Skills
                      </h3>
                      <span className="text-[11px] text-muted/60">Comma-separated keywords</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-semibold text-muted block mb-1">Languages</label>
                        <input
                          type="text"
                          value={resumeData.skills.languages}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            skills: { ...resumeData.skills, languages: e.target.value }
                          })}
                          className="w-full px-3 py-1.5 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-muted block mb-1">Frameworks & Libraries</label>
                        <input
                          type="text"
                          value={resumeData.skills.frameworks}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            skills: { ...resumeData.skills, frameworks: e.target.value }
                          })}
                          className="w-full px-3 py-1.5 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-muted block mb-1">Tools, Cloud & Databases</label>
                        <input
                          type="text"
                          value={resumeData.skills.toolsAndCloud}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            skills: { ...resumeData.skills, toolsAndCloud: e.target.value }
                          })}
                          className="w-full px-3 py-1.5 border border-line rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. International Languages (CEFR Standards) */}
                  <div className="bg-paper rounded-2xl border border-line p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-ink/90 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-accent" />
                          5. Spoken Languages (CEFR Standard)
                        </h3>
                        <p className="text-[11px] text-muted/80">Crucial for international & remote jobs</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddLanguage}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Language
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(resumeData.languages || []).map((lang, lIdx) => (
                        <div key={lang.id} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={lang.name}
                            placeholder="Language Name (e.g. English, Bengali, German)"
                            onChange={(e) => {
                              const newL = [...(resumeData.languages || [])];
                              newL[lIdx].name = e.target.value;
                              setResumeData({ ...resumeData, languages: newL });
                            }}
                            className="flex-1 text-xs px-3 py-1.5 border border-line rounded-lg"
                          />
                          <select
                            value={lang.level}
                            onChange={(e) => {
                              const newL = [...(resumeData.languages || [])];
                              newL[lIdx].level = e.target.value as any;
                              setResumeData({ ...resumeData, languages: newL });
                            }}
                            className="text-xs px-3 py-1.5 border border-line rounded-lg bg-paper"
                          >
                            <option value="Native">Native</option>
                            <option value="Fluent">Fluent</option>
                            <option value="C2 (Mastery)">C2 (Mastery)</option>
                            <option value="C1 (Advanced)">C1 (Advanced)</option>
                            <option value="B2 (Upper Intermediate)">B2 (Upper Intermediate)</option>
                            <option value="B1 (Intermediate)">B1 (Intermediate)</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleRemoveLanguage(lang.id)}
                            className="p-1.5 text-muted/60 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 6. Competitive Programming & Developer Ranks (Crucial for BD & Global Devs) */}
                  <div className="bg-paper rounded-2xl border border-line p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div>
                        <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-ink/90 flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-accent" />
                          6. Competitive Programming & Developer Profiles
                        </h3>
                        <p className="text-[11px] text-muted/80">
                          Codeforces, LeetCode, GitHub — proves pure algorithmic problem-solving
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddCpProfile}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Profile
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(resumeData.competitiveProgramming || []).map((cp, cpIdx) => (
                        <div key={cp.id} className="flex flex-wrap items-center gap-2 bg-soft p-2.5 rounded-lg border border-line">
                          <select
                            value={cp.platform}
                            onChange={(e) => {
                              const newCp = [...(resumeData.competitiveProgramming || [])];
                              newCp[cpIdx].platform = e.target.value as any;
                              setResumeData({ ...resumeData, competitiveProgramming: newCp });
                            }}
                            className="text-xs px-2 py-1 border border-line rounded bg-paper font-semibold"
                          >
                            <option value="Codeforces">Codeforces</option>
                            <option value="LeetCode">LeetCode</option>
                            <option value="GitHub">GitHub</option>
                            <option value="HackerRank">HackerRank</option>
                            <option value="Kaggle">Kaggle</option>
                            <option value="Other">Other</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Username / Handle"
                            value={cp.handle}
                            onChange={(e) => {
                              const newCp = [...(resumeData.competitiveProgramming || [])];
                              newCp[cpIdx].handle = e.target.value;
                              setResumeData({ ...resumeData, competitiveProgramming: newCp });
                            }}
                            className="flex-1 min-w-[120px] text-xs px-2 py-1 border border-line rounded bg-paper font-mono"
                          />
                          <input
                            type="text"
                            placeholder="Rating / Stars"
                            value={cp.rating || ''}
                            onChange={(e) => {
                              const newCp = [...(resumeData.competitiveProgramming || [])];
                              newCp[cpIdx].rating = e.target.value;
                              setResumeData({ ...resumeData, competitiveProgramming: newCp });
                            }}
                            className="w-24 text-xs px-2 py-1 border border-line rounded bg-paper font-mono"
                          />
                          <input
                            type="text"
                            placeholder="Rank Badge (e.g. Knight)"
                            value={cp.badgeOrRank || ''}
                            onChange={(e) => {
                              const newCp = [...(resumeData.competitiveProgramming || [])];
                              newCp[cpIdx].badgeOrRank = e.target.value;
                              setResumeData({ ...resumeData, competitiveProgramming: newCp });
                            }}
                            className="w-28 text-xs px-2 py-1 border border-line rounded bg-paper"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveCpProfile(cp.id)}
                            className="p-1 text-muted/60 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right 6 Columns: RenderCV Strict Single-Column Canvas OR "What the ATS Reads" Terminal */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Preview View Mode Switcher & Dynamic Color Picker */}
              <div className="bg-paper rounded-2xl border border-line p-4 shadow-xs space-y-3 print:hidden">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setPreviewMode('visual')}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                        previewMode === 'visual' ? 'bg-paper text-ink shadow-2xs' : 'text-muted'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-accent" />
                      RenderCV Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('terminal')}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                        previewMode === 'terminal' ? 'bg-paper text-ink shadow-2xs' : 'text-muted'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5 text-accent" />
                      What the ATS Reads
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-muted/80">
                      ATS Score: <strong className="text-accent font-bold">{atsAudit.score}/100</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsConsultationModalOpen(true)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-soft hover:bg-red-100 text-accent font-bold border border-line transition-colors flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5 text-accent" />
                      1-on-1 Consultation ($10)
                    </button>
                  </div>
                </div>

                {/* Accent Color Palette Selector */}
                {previewMode === 'visual' && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-ink/90">
                      <Palette className="w-3.5 h-3.5 text-accent" />
                      <span>Template Accent Color:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {[
                        { label: 'Editorial Red', color: '#C82333' },
                        { label: 'Executive Navy', color: '#1E3A8A' },
                        { label: 'Classic Slate', color: '#334155' },
                        { label: 'Crisp Emerald', color: '#059669' },
                      ].map((preset) => (
                        <button
                          key={preset.color}
                          type="button"
                          onClick={() => setAccentColor(preset.color)}
                          title={preset.label}
                          className={`w-5 h-5 rounded-full border transition-transform ${
                            accentColor === preset.color
                              ? 'scale-125 ring-2 ring-slate-900 border-white'
                              : 'border-slate-300 hover:scale-110'
                          }`}
                          style={{ backgroundColor: preset.color }}
                        />
                      ))}
                      <div className="flex items-center gap-1 pl-1.5 border-l border-line">
                        <label className="text-[10px] font-mono font-medium text-muted/80 cursor-pointer">
                          Custom:
                        </label>
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-5 h-5 rounded cursor-pointer border border-slate-300 p-0 bg-transparent"
                          title="Pick custom hex color"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* View 1: Terminal Mode ("What the ATS Reads") */}
              {previewMode === 'terminal' && (
                <div className="print:hidden">
                  <AtsTerminalView
                    plainText={plainTextResume}
                    onApplyCleanedText={(cleaned) => {
                      const parsed = parseRawResumeText(cleaned);
                      setResumeData(parsed);
                    }}
                  />
                </div>
              )}

              {/* View 2: Visual Single-Column ATS Resume Canvas with Dynamic Accents */}
              {previewMode === 'visual' && (
                <div 
                  id="printable-ats-resume"
                  className="bg-paper rounded-2xl border border-slate-300 shadow-sm p-8 sm:p-10 font-sans text-ink text-xs leading-relaxed space-y-5 print:border-none print:shadow-none print:p-0 print:m-0"
                >
                  {/* Header */}
                  <div style={{ borderBottomColor: accentColor }} className="border-b-2 pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 text-center sm:text-left space-y-1">
                        <h1 style={{ color: accentColor }} className="font-heading text-2xl font-black uppercase tracking-wide">
                          {resumeData.fullName}
                        </h1>
                        <p style={{ color: accentColor }} className="text-xs font-bold uppercase tracking-wider opacity-90">
                          {resumeData.targetTitle}
                        </p>
                        <div className="text-[11px] text-muted flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5">
                          {resumeData.phone && <span>{resumeData.phone}</span>}
                          {resumeData.email && <span>• {resumeData.email}</span>}
                          {resumeData.location && <span>• {resumeData.location}</span>}
                          {resumeData.linkedin && <span>• {resumeData.linkedin}</span>}
                          {resumeData.portfolio && <span>• {resumeData.portfolio}</span>}
                          {resumeData.visaStatus && targetMarket !== 'us_uk' && (
                            <span className="font-medium text-ink">• {resumeData.visaStatus}</span>
                          )}
                        </div>
                      </div>

                      {/* Photo if enabled and not hidden */}
                      {resumeData.photoUrl && resumeData.photoShape !== 'hidden' && targetMarket !== 'us_uk' && (
                        <div className="shrink-0 hidden sm:block">
                          <img
                            src={resumeData.photoUrl}
                            alt={resumeData.fullName}
                            className={`w-16 h-16 object-cover border border-slate-400 ${
                              resumeData.photoShape === 'circle' ? 'rounded-full' : 'rounded-md'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. Professional Summary */}
                  {resumeData.summary && (
                    <div className="space-y-1">
                      <h2 
                        style={{ color: accentColor, borderBottomColor: accentColor + '40' }}
                        className="font-heading text-xs font-bold uppercase tracking-wider border-b pb-0.5"
                      >
                        Professional Summary
                      </h2>
                      <p className="text-ink/90 text-[11px] leading-relaxed">
                        {resumeData.summary}
                      </p>
                    </div>
                  )}

                  {/* 3. Work Experience */}
                  <div className="space-y-2.5">
                    <h2 
                      style={{ color: accentColor, borderBottomColor: accentColor + '40' }}
                      className="font-heading text-xs font-bold uppercase tracking-wider border-b pb-0.5"
                    >
                      Professional Experience
                    </h2>
                    <div className="space-y-3.5">
                      {resumeData.experience.map(exp => (
                        <div key={exp.id} className="space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                            <span className="font-bold text-ink text-xs">
                              {exp.role} <span className="font-normal text-muted">| {exp.company}</span>
                            </span>
                            <span className="text-[11px] text-muted/80 font-medium font-mono">
                              {exp.dates} · {exp.location}
                            </span>
                          </div>
                          <ul className="list-disc list-outside pl-4 space-y-0.5 text-[11px] text-ink/90">
                            {exp.bullets.map((b, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Skills Block */}
                  <div className="space-y-1">
                    <h2 
                      style={{ color: accentColor, borderBottomColor: accentColor + '40' }}
                      className="font-heading text-xs font-bold uppercase tracking-wider border-b pb-0.5"
                    >
                      Technical & Professional Competencies
                    </h2>
                    <div className="space-y-0.5 text-[11px] text-ink/90">
                      {resumeData.skills.languages && (
                        <p><strong className="text-ink">Languages:</strong> {resumeData.skills.languages}</p>
                      )}
                      {resumeData.skills.frameworks && (
                        <p><strong className="text-ink">Frameworks:</strong> {resumeData.skills.frameworks}</p>
                      )}
                      {resumeData.skills.toolsAndCloud && (
                        <p><strong className="text-ink">Cloud & Tools:</strong> {resumeData.skills.toolsAndCloud}</p>
                      )}
                    </div>
                  </div>

                  {/* 5. Competitive Programming Profiles (If present) */}
                  {resumeData.competitiveProgramming && resumeData.competitiveProgramming.length > 0 && (
                    <div className="space-y-1">
                      <h2 
                        style={{ color: accentColor, borderBottomColor: accentColor + '40' }}
                        className="font-heading text-xs font-bold uppercase tracking-wider border-b pb-0.5"
                      >
                        Competitive Programming & Algorithmic Problem Solving
                      </h2>
                      <div className="text-[11px] text-ink/90 flex flex-wrap gap-x-4 gap-y-1">
                        {resumeData.competitiveProgramming.map(cp => (
                          <span key={cp.id}>
                            <strong className="text-ink">{cp.platform}:</strong> {cp.handle}
                            {cp.rating ? ` (${cp.rating})` : ''} {cp.badgeOrRank ? `[${cp.badgeOrRank}]` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. Spoken Languages */}
                  {resumeData.languages && resumeData.languages.length > 0 && (
                    <div className="space-y-1">
                      <h2 
                        style={{ color: accentColor, borderBottomColor: accentColor + '40' }}
                        className="font-heading text-xs font-bold uppercase tracking-wider border-b pb-0.5"
                      >
                        Languages
                      </h2>
                      <div className="text-[11px] text-ink/90 flex flex-wrap gap-x-4 gap-y-1">
                        {resumeData.languages.map(l => (
                          <span key={l.id}>
                            <strong className="text-ink">{l.name}:</strong> {l.level}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 7. Education */}
                  {resumeData.education.length > 0 && (
                    <div className="space-y-1.5">
                      <h2 
                        style={{ color: accentColor, borderBottomColor: accentColor + '40' }}
                        className="font-heading text-xs font-bold uppercase tracking-wider border-b pb-0.5"
                      >
                        Education
                      </h2>
                      <div className="space-y-1">
                        {resumeData.education.map(edu => (
                          <div key={edu.id} className="flex justify-between items-baseline text-[11px]">
                            <span className="font-bold text-ink">
                              {edu.degree} – <span className="font-normal text-ink/90">{edu.institution}</span>
                            </span>
                            <span className="text-muted/80 font-mono">{edu.dates}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 8. Featured Projects */}
                  {resumeData.projects && resumeData.projects.length > 0 && (
                    <div className="space-y-1.5">
                      <h2 
                        style={{ color: accentColor, borderBottomColor: accentColor + '40' }}
                        className="font-heading text-xs font-bold uppercase tracking-wider border-b pb-0.5"
                      >
                        Featured Projects
                      </h2>
                      {resumeData.projects.map(proj => (
                        <div key={proj.id} className="space-y-0.5 text-[11px]">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-ink">{proj.name}</span>
                            <span className="text-muted/80 text-[10px] font-mono">{proj.roleOrTech}</span>
                          </div>
                          <ul className="list-disc list-outside pl-4 space-y-0.5 text-ink/90">
                            {proj.bullets.map((b, idx) => (
                              <li key={idx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 9. Certifications */}
                  {resumeData.certifications && resumeData.certifications.length > 0 && (
                    <div className="space-y-1">
                      <h2 
                        style={{ color: accentColor, borderBottomColor: accentColor + '40' }}
                        className="font-heading text-xs font-bold uppercase tracking-wider border-b pb-0.5"
                      >
                        Certifications & Honors
                      </h2>
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-[11px] text-ink/90">
                        {resumeData.certifications.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* RenderCV Typographic Guarantee Callout */}
              <div className="p-4 bg-slate-100 rounded-2xl border border-line text-xs space-y-1.5 print:hidden">
                <div className="flex items-center gap-2 text-ink font-bold">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  RenderCV Typographic Integrity Guarantee
                </div>
                <p className="text-muted leading-relaxed text-[11px]">
                  Renders strictly single-column layout with unboxed contact lines. Compatible with Workday, Greenhouse, Lever, and Taleo parsing algorithms.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: JOB MATCHER (Resume Matcher) */}
        {/* ========================================================================= */}
        {activeTab === 'matcher' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 6 Cols: Job Description Input */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-paper rounded-2xl border border-line p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="font-heading text-base font-bold text-ink flex items-center gap-2">
                      <Target className="w-4 h-4 text-accent" />
                      Target Job Description
                    </h2>
                    <p className="text-xs text-muted/80 mt-0.5">
                      Paste the employer's posting to extract required keywords and calculate alignment.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setJobDescription(
                      `Seeking Senior React/Node Developer. Must have: TypeScript, AWS, Docker, GraphQL, Jest, CI/CD pipelines, and agile scrum experience.`
                    )}
                    className="text-xs text-accent font-semibold hover:underline"
                  >
                    Load Sample JD
                  </button>
                </div>

                <textarea
                  rows={14}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste full job description from LinkedIn, Indeed, or company careers page..."
                  className="w-full text-xs font-mono p-3 bg-soft border border-line rounded-xl focus:bg-paper focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />

                <div className="p-3 bg-soft border border-line rounded-xl flex items-center justify-between">
                  <div className="text-xs text-emerald-950">
                    <span className="font-bold">Algorithmic Match Score:</span> {jobMatch.matchPercentage}% Alignment
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenOrder('boost', { resume: plainTextResume, jd: jobDescription })}
                    className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Tailor For This Job ($25)
                  </button>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Gap Analysis */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-paper rounded-2xl border border-line p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-heading text-base font-bold text-ink">
                    Keyword Gap Analysis (Resume Matcher)
                  </h3>
                  <span className="text-xs font-mono font-bold text-accent bg-soft px-2 py-0.5 rounded border border-line">
                    {jobMatch.matchedKeywords.length} Matched / {jobMatch.missingHardSkills.length} Missing
                  </span>
                </div>

                {/* Matched Keywords */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-ink/90 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    Keywords Evidenced in Your Resume ({jobMatch.matchedKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {jobMatch.matchedKeywords.map((kw, i) => (
                      <span key={i} className="text-xs font-mono px-2 py-0.5 rounded bg-soft text-emerald-800 border border-line">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Critical Skills Missing from Resume ({jobMatch.missingHardSkills.length})
                  </h4>
                  <p className="text-[11px] text-muted/80">
                    If you have hands-on experience with these, incorporate them into your work experience bullets:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {jobMatch.missingHardSkills.map((sk, i) => (
                      <span key={i} className="text-xs font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                        + {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Bullets */}
                {jobMatch.recommendedBullets.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-ink/90 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Recommended Bullet Additions
                    </h4>
                    <ul className="space-y-2 text-xs text-ink/90">
                      {jobMatch.recommendedBullets.map((rb, idx) => (
                        <li key={idx} className="p-2.5 bg-soft rounded-lg border border-line leading-relaxed font-mono text-[11px]">
                          {rb}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ATS SCREENER (ATS Screener Audit) */}
        {/* ========================================================================= */}
        {activeTab === 'auditor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-12 space-y-6">
              <div className="bg-paper rounded-2xl border border-line p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-ink flex items-center gap-2">
                      <SearchCheck className="w-5 h-5 text-accent" />
                      ATS Diagnostic Audit Report
                    </h2>
                    <p className="text-xs text-muted/80 mt-0.5">
                      Multi-vector audit analyzing metric density, action verb strength, layout safety, and contact clarity.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-black font-mono text-accent leading-none">
                        {atsAudit.score}/100
                      </div>
                      <span className="text-[10px] text-muted/60 font-semibold uppercase">Overall Score</span>
                    </div>
                  </div>
                </div>

                {/* Score Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                  <div className="p-3 bg-soft rounded-xl border border-line">
                    <span className="text-[10px] text-muted/80 uppercase font-semibold block">Quantified Metrics</span>
                    <span className="text-lg font-mono font-bold text-ink">{atsAudit.categoryScores.quantifiedMetrics}/100</span>
                  </div>
                  <div className="p-3 bg-soft rounded-xl border border-line">
                    <span className="text-[10px] text-muted/80 uppercase font-semibold block">Action Verbs</span>
                    <span className="text-lg font-mono font-bold text-ink">{atsAudit.categoryScores.actionVerbs}/100</span>
                  </div>
                  <div className="p-3 bg-soft rounded-xl border border-line">
                    <span className="text-[10px] text-muted/80 uppercase font-semibold block">ATS Readability</span>
                    <span className="text-lg font-mono font-bold text-ink">{atsAudit.categoryScores.atsReadability}/100</span>
                  </div>
                  <div className="p-3 bg-soft rounded-xl border border-line">
                    <span className="text-[10px] text-muted/80 uppercase font-semibold block">Skills Relevance</span>
                    <span className="text-lg font-mono font-bold text-ink">{atsAudit.categoryScores.skillsRelevance}/100</span>
                  </div>
                  <div className="p-3 bg-soft rounded-xl border border-line col-span-2 md:col-span-1">
                    <span className="text-[10px] text-muted/80 uppercase font-semibold block">Formatting Safety</span>
                    <span className="text-lg font-mono font-bold text-ink">{atsAudit.categoryScores.structureFormatting}/100</span>
                  </div>
                </div>

                {/* Findings & Action Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Critical Attention Needed ({atsAudit.criticalIssues.length})
                    </h3>
                    <ul className="space-y-2 text-xs text-ink/90">
                      {atsAudit.criticalIssues.map((issue, idx) => (
                        <li key={idx} className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-lg flex items-start gap-2">
                          <span className="text-rose-600 font-bold">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                      Quick Wins & Verified Compliances ({atsAudit.quickWins.length})
                    </h3>
                    <ul className="space-y-2 text-xs text-ink/90">
                      {atsAudit.quickWins.map((win, idx) => (
                        <li key={idx} className="p-2.5 bg-soft/70 border border-line rounded-lg flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                          <span>{win}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Consultation Upsell Callout */}
                <div className="p-5 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-heading font-bold text-sm">Want a Senior Developer to Guarantee 90%+ Score?</h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      Book a personal 1-on-1 review. We will manually rewrite your top 5 bullets using Google XYZ metrics, format for your dream company, and deliver in 24 hours.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsConsultationModalOpen(true)}
                    className="px-4 py-2 bg-soft0 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Get 1-on-1 Review ($10)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LinkedIn Sync Modal */}
      <LinkedInSyncModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
        resumeData={resumeData}
      />

      {/* Personal 1-on-1 Consultation Modal */}
      <PersonalConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        resumeData={resumeData}
        onProceedOrder={(pkg, notes, url) => {
          onOpenOrder(pkg, {
            resume: plainTextResume,
            jd: url ? `Target Job URL: ${url}\n\nCandidate Notes: ${notes || ''}` : (jobDescription + `\n\nNotes: ${notes || ''}`)
          });
        }}
      />
    </div>
  );
};
