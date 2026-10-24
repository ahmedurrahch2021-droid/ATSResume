import React, { useState } from 'react';
import { 
  PACKAGES, 
  RESUME_EXAMPLES, 
  TESTIMONIALS, 
  FAQ_ITEMS, 
  ATS_CASE_STUDY_DATA, 
  ATS_PIPELINE_STEPS,
  ATS_IMAGES,
  ATS_TEMPLATES
} from '../data/mockData';
import { PageRoute } from '../types';
import { 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Users, 
  SearchCheck, 
  FileDown,
  Terminal,
  Layers,
  Building2,
  FileSearch,
  Check,
  Eye,
  AlertCircle,
  Target,
  Sparkles,
  Zap
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
  onOpenOrder: (packageId?: 'starter' | 'boost' | 'full') => void;
  onOpenChecklist: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  onOpenOrder, 
  onOpenChecklist 
}) => {
  const [leadEmail, setLeadEmail] = useState('');
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(FAQ_ITEMS[0].id);
  const [zoomPreviewOpen, setZoomPreviewOpen] = useState(false);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadEmail.trim()) {
      setLeadCaptured(true);
      onOpenChecklist();
    }
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="space-y-0 bg-white text-slate-900">
      {/* SECTION 1: HERO (High-Whitespace Clean Editorial White) */}
      <section className="relative bg-white py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 text-left">
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-50 border border-red-200/80 text-xs text-[#C82333] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#C82333]" />
                <span>Single-Column Layout · Plain-Text Friendly</span>
              </div>

              {/* Main Headline with balanced measure */}
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight text-balance leading-[1.12]">
                Your Resume, Rebuilt for the{' '}
                <span className="text-[#C82333]">Algorithms That Decide</span>
              </h1>

              {/* Value Proposition */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light max-w-2xl">
                Applicant tracking systems silently disqualify multi-column and poorly formatted resumes. We combine algorithmic keyword alignment, live single-column editing, and human developer review so your qualifications actually reach interviews.
              </p>

              {/* Primary & Secondary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('suite')}
                  className="px-7 py-4 bg-[#C82333] hover:bg-[#A71D2A] text-white font-bold text-base rounded-xl transition-all shadow-md shadow-red-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-red-200" />
                  <span>Launch Live CV Editor (Free)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenOrder('starter')}
                  className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <span>1-on-1 Review — $10</span>
                </button>

                <button
                  onClick={() => onNavigate('templates')}
                  className="px-5 py-4 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-base rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <FileDown className="w-4 h-4 text-[#C82333]" />
                  <span>Free Templates</span>
                </button>
              </div>

              {/* Clean Unboxed Trust Markers */}
              <div className="pt-6 flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-slate-600 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-700">24-Hour Turnaround</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-700">100% Money-Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-700">500+ Resumes Optimized</span>
                </div>
              </div>
            </div>

            {/* Right Visual Column: Real Authentic ATS Verified Resume Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none group">
                {/* Paper Glow Shadow */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-emerald-100 via-slate-100 to-emerald-50 blur-lg opacity-70 -z-10" />

                {/* Main Physical Resume Showcase Container */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden p-3 sm:p-4">
                  {/* Top Bar with System Verification Badge */}
                  <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-800 tracking-tight">
                        Example profile (illustrative)
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      99.4% ATS SCORE
                    </span>
                  </div>

                  {/* Real Image of the Verified ATS Resume */}
                  <div className="relative mt-3 rounded-xl overflow-hidden bg-slate-50 border border-slate-200/70">
                    <img
                      src={ATS_IMAGES.verifiedResume}
                      alt="Example single-column resume layout"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover cursor-pointer hover:scale-[1.01] transition-transform duration-300"
                      onClick={() => setZoomPreviewOpen(true)}
                    />

                    {/* Interactive Zoom Overlay */}
                    <button
                      onClick={() => setZoomPreviewOpen(true)}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-bold shadow-md border border-slate-200 flex items-center gap-1.5 hover:bg-white transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Inspect Layout</span>
                    </button>
                  </div>

                  {/* System Compatibility Verification Pills (Clean Unboxed Grid) */}
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-mono">Workday</span>
                      <span className="font-bold text-emerald-700">Illustrative only</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-mono">Greenhouse</span>
                      <span className="font-bold text-emerald-700">Illustrative only</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-mono">Taleo / Lever</span>
                      <span className="font-bold text-emerald-700">Illustrative only</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM (High Whitespace + Clear Stats) */}
      <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1 rounded-md border border-red-200">
              The Reality of Automated Hiring
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
              Most Resumes Are Rejected in 6 Seconds by Software
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
              92% of resumes never reach a human hiring manager. They get scrambled by multi-column PDF parsers, discarded for missing keyword synonyms, or buried on page 14 of applicant portals. You are not unqualified — your resume just isn't formatted for machine ingestion.
            </p>
          </div>

          {/* Stat Bars in Clean White Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-xs">
              <span className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 block tabular-nums">
                6 sec
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                Average recruiter scan time
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                If the ATS passes you, a human spends 6 seconds checking company names, metrics, and dates.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-red-50/50 border border-red-200 text-center space-y-2 shadow-xs">
              <span className="font-heading text-4xl sm:text-5xl font-extrabold text-red-600 block tabular-nums">
                75%
              </span>
              <p className="text-xs sm:text-sm font-semibold text-red-900">
                Filtered out by ATS bots
              </p>
              <p className="text-xs text-red-700 leading-relaxed">
                Canva multi-column layouts and graphical skill bars trigger immediate algorithmic rejection.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2 shadow-xs">
              <span className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 block tabular-nums">
                1 in 50
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                Unoptimized response rate
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Standard resumes yield an average 2% callback rate without tailored keyword density.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2.5: WHAT IS ATS & REAL CASE STUDY (Light Editorial Architecture) */}
      <section className="bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>Technical Intelligence & Candidate Case Study</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight text-balance">
              What is an ATS, and Why Optimization is Non-Negotiable
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
              Many employers use applicant tracking systems (ATS) such as Workday, Greenhouse, Taleo, and Lever to screen applications before a recruiter reads them. Clear formatting and relevant keywords help your resume get through that step.
            </p>
          </div>

          {/* Under the Hood: 4-Step Software Pipeline */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-600" />
                  How ATS Software Evaluates Your Uploaded Document
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  The deterministic machine pipeline from file ingestion to ranked recruiter dashboard
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 font-semibold self-start sm:self-auto">
                Deterministic Parsing Pipeline
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ATS_PIPELINE_STEPS.map((pipe) => (
                <div key={pipe.step} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        STAGE {pipe.step}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{pipe.subtitle}</span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">
                      {pipe.name}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pipe.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REALISTIC CASE STUDY CARD (Clean White Container) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-sm">
            {/* Case Study Header with Dashboard Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-slate-100">
              <div className="lg:col-span-7 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded">
                    Example case study
                  </span>
                  <span className="text-xs text-slate-500">· Illustrative example</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
                  The 38-Application Wakeup Call: How a Top Performer Got Filtered Out
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Candidate: <strong>{ATS_CASE_STUDY_DATA.candidate}</strong> ({ATS_CASE_STUDY_DATA.background}) targeting <strong>{ATS_CASE_STUDY_DATA.targetRole}</strong>
                </p>
                <div className="pt-2 flex items-center gap-4 text-xs">
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-red-700 block">Initial Attempt</span>
                    <span className="font-mono font-bold text-red-800 text-sm">38 Apps · 35 Rejections · 0 Calls</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">After ATS Resume Maker Overhaul</span>
                    <span className="font-mono font-bold text-emerald-800 text-sm">10 Apps · 6 Calls · $82k Offer</span>
                  </div>
                </div>
              </div>

              {/* Real Screen Image of ATS Dashboard */}
              <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                <img
                  src={ATS_IMAGES.scannerDashboard}
                  alt="Enterprise ATS screening software dashboard"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Why the Software Discarded Her (The 3 Flaws) */}
            <div className="space-y-4">
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Why the ATS System Auto-Rejected Her Initial Resume:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ATS_CASE_STUDY_DATA.technicalFlawsFound.map((flaw, i) => (
                  <div key={i} className="p-4 rounded-xl bg-red-50/40 border border-red-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-900">{flaw.title}</span>
                      <span className="text-[9px] font-mono uppercase bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">
                        {flaw.impact}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {flaw.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* What ATS Resume Maker Did + The Verified Outcome */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-3">
                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  The ATS Resume Maker Technical Overhaul:
                </h4>
                <div className="space-y-2.5">
                  {ATS_CASE_STUDY_DATA.theOptimizationFixes.map((fix, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-xs font-bold text-slate-900 block">
                        ✓ {fix.action}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {fix.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* The Real-World Outcome */}
              <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    The Real-World Transformation
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-emerald-200/80">
                      <span className="text-slate-600">New Targeted Applications:</span>
                      <span className="font-bold text-slate-900 font-mono">{ATS_CASE_STUDY_DATA.theResult.newApplications}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-emerald-200/80">
                      <span className="text-slate-600">Recruiter Screening Calls:</span>
                      <span className="font-bold text-emerald-800 font-mono">{ATS_CASE_STUDY_DATA.theResult.recruiterScreeningCalls} (60% callback rate)</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-emerald-200/80">
                      <span className="text-slate-600">Final Round On-Sites:</span>
                      <span className="font-bold text-slate-900 font-mono">{ATS_CASE_STUDY_DATA.theResult.finalRoundInterviews}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-slate-600">Time from Overhaul to Offer:</span>
                      <span className="font-bold text-emerald-800 font-mono">{ATS_CASE_STUDY_DATA.theResult.timeToOffer}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center">
                  <span className="text-xs font-bold text-slate-900">
                    Landed: {ATS_CASE_STUDY_DATA.theResult.offerLanded}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2.5: ALL-IN-ONE ATS POWER SUITE SHOWCASE */}
      <section className="bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-md border border-emerald-300 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Open-Source Innovation · 100% Free & Private
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
              The All-in-One ATS Resume Suite
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
              We synthesized the core breakthroughs of the top 5 open-source resume projects—<strong>Reactive Resume</strong>, <strong>Resume Matcher</strong>, <strong>RenderCV</strong>, <strong>OpenResume</strong>, and <strong>ATS Screener</strong>—into a single high-speed in-browser workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tool 1: Live Builder */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Reactive Resume + OpenResume</span>
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    Live ATS Resume Builder
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dual-mode input with structured forms or instant raw text importing. Generates single-column ATS layouts adhering strictly to <strong>RenderCV</strong> typographic discipline with real-time metric checks and instant PDF export.
                </p>
              </div>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5 text-slate-700">✓ In-line Google XYZ formula audit</li>
                <li className="flex items-center gap-1.5 text-slate-700">✓ Developer, PM & DevOps presets</li>
                <li className="flex items-center gap-1.5 text-slate-700">✓ Instant ATS PDF print & JSON export</li>
              </ul>
            </div>

            {/* Tool 2: Job Matcher */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Target className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Resume Matcher Technology</span>
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    Job Description Matcher
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Paste any job description to compute your real-time semantic alignment score. Identifies missing hard tech skills, soft skills, and keyword frequencies with 1-click bullet injections.
                </p>
              </div>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5 text-slate-700">✓ Real-time % match calculation</li>
                <li className="flex items-center gap-1.5 text-slate-700">✓ 1-click add missing skills</li>
                <li className="flex items-center gap-1.5 text-slate-700">✓ Targeted bullet recommendations</li>
              </ul>
            </div>

            {/* Tool 3: ATS Screener */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <SearchCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">ATS Screener Engine</span>
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    Automated Diagnostic Auditor
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Deep multi-vector parser evaluating contact header readability, action verb strength, quantified metrics ratio, and formatting traps before you submit to Workday or Greenhouse.
                </p>
              </div>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5 text-slate-700">✓ 5-vector category score breakdown</li>
                <li className="flex items-center gap-1.5 text-slate-700">✓ Detects column & table traps</li>
                <li className="flex items-center gap-1.5 text-slate-700">✓ Actionable pass/fail checklist</li>
              </ul>
            </div>
          </div>

          {/* Unified Action Strip */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xs">
            <div className="space-y-1 max-w-xl">
              <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
                Ready to engineer your job-winning resume?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Use the full interactive suite 100% free with zero registration, or upgrade to our 24-hour developer overhaul service for $10.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('suite')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Launch Free ATS Suite</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onOpenOrder('starter')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                <span>Hire Developer ($10)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FREE TEMPLATES SHOWCASE TEASER */}
      <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                100% Free Resources
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Download Authentic ATS-Tested Templates
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                Need a solid foundation to write your own resume? Download our verified single-column templates in Word (.docx) and PDF for free. Zero paywalls.
              </p>
            </div>

            <button
              onClick={() => onNavigate('templates')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0 self-start md:self-auto"
            >
              <span>View All 4 Free Templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick 2-Card Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ATS_TEMPLATES.slice(0, 2).map((tpl) => (
              <div
                key={tpl.id}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-5 hover:border-emerald-500/60 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                      {tpl.categoryLabel}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700">
                      {tpl.atsScore}% ATS Verified
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-slate-900">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {tpl.recommendedFor}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    {tpl.highlightPoints.slice(0, 3).map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{tpl.downloadCount}</span>
                  <button
                    onClick={() => onNavigate('templates')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>Download Free Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW WE'RE DIFFERENT (Comparison Matrix) */}
      <section className="bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
              The Quality Differentiator
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance">
              AI Speed. Senior Developer Quality Control. Zero Template Fluff.
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
              Why we outperform automated drag-and-drop builders and generic ChatGPT prompts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Generic Builders */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                ❌ Generic Template Builders
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pre-made aesthetic templates with 2-column tables and skill rating icons that get completely scrambled by Workday and Greenhouse parsers.
              </p>
              <ul className="text-xs space-y-2 text-slate-500 pt-2 border-t border-slate-100">
                <li>• No target job description tailoring</li>
                <li>• You do all the difficult writing yourself</li>
                <li>• Subscription traps ($29/mo renewal)</li>
              </ul>
            </div>

            {/* Cheap AI Tools */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                ❌ Raw ChatGPT / AI Wrappers
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spits out robotic buzzwords ("spearheaded", "synergy") and hallucinates metrics that crumble under recruiter interview scrutiny.
              </p>
              <ul className="text-xs space-y-2 text-slate-500 pt-2 border-t border-slate-100">
                <li>• Zero human fact-checking or quality QA</li>
                <li>• Generic, easily spotted phrasing</li>
                <li>• No money-back guarantee</li>
              </ul>
            </div>

            {/* ATS Resume Maker */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border-2 border-emerald-600 space-y-4 shadow-sm relative">
              <div className="absolute -top-3 right-6">
                <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Our Method
                </span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                ✅ ATS Resume Maker Dual Engine
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                AI tailors achievements directly to your target job description, followed by personal line-by-line editing by a senior web developer.
              </p>
              <ul className="text-xs space-y-2 text-slate-800 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Guaranteed Workday & Greenhouse pass</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>24-Hour delivery turnaround</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Money-back guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: PRICING PREVIEW ($10 ENTRY) */}
      <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
              Clear Upfront Pricing
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              One-Time Flat Fee. No Hidden Subscriptions.
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
              Pay once, receive your polished ATS-compliant resume within 24 hours. Free revisions and 100% refund guarantee included.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-6 sm:p-7 rounded-2xl bg-white border flex flex-col justify-between transition-all ${
                  pkg.popular
                    ? 'border-emerald-600 shadow-md ring-2 ring-emerald-600/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg font-bold text-slate-900">{pkg.name}</h3>
                    {pkg.popular && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        MOST POPULAR
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900">
                      ${pkg.price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium ml-1">/ one-time</span>
                  </div>

                  <p className="text-xs text-slate-500 min-h-[36px]">{pkg.description}</p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {pkg.features.slice(0, 5).map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => onOpenOrder(pkg.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                      pkg.popular
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    Select {pkg.name} — ${pkg.price}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS */}
      <section className="bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
              Example outcomes
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Real Applicants Who Beat the ATS Filter
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{t.name}</span>
                    <span className="text-slate-500 text-[11px]">{t.role}</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {t.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ PREVIEW */}
      <section className="bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Direct, transparent answers regarding ATS compatibility and turnaround guarantees.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.slice(0, 5).map((faq) => {
              const isExpanded = expandedFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-white"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-slate-900">
                      {faq.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.directAnswer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 8: FINAL HIGH-WHITESPACE CTA */}
      <section className="bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Stop Sending Resumes into the Black Hole
          </h2>
          <p className="text-sm text-slate-600 font-light leading-relaxed">
            Get an ATS-tested, single-column resume personally reviewed by a developer in 24 hours. Starting at $10.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onOpenOrder('starter')}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Build My Resume — $10</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('templates')}
            className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <FileDown className="w-4 h-4 text-emerald-600" />
            <span>Download Free Templates</span>
          </button>
        </div>
      </section>

      {/* Full Document Inspect Zoom Modal */}
      {zoomPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-heading font-bold text-sm text-slate-900">
                  Single-column layout example
                </h3>
              </div>
              <button
                onClick={() => setZoomPreviewOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-100 flex justify-center">
              <img
                src={ATS_IMAGES.verifiedResume}
                alt="Full ATS specimen resume"
                referrerPolicy="no-referrer"
                className="max-w-2xl w-full h-auto rounded-lg shadow-sm border border-slate-200"
              />
            </div>
            <div className="p-4 px-6 border-t border-slate-200 bg-white flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Single-column layout · Standardized headings · Quantified impact metrics
              </span>
              <button
                onClick={() => {
                  setZoomPreviewOpen(false);
                  onOpenOrder('starter');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
              >
                Order This Format For My Resume — $10
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
