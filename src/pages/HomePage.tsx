import React, { useState } from 'react';
import { PACKAGES, RESUME_EXAMPLES, TESTIMONIALS, FAQ_ITEMS, ATS_CASE_STUDY_DATA, ATS_PIPELINE_STEPS } from '../data/mockData';
import { PageRoute } from '../types';
import { 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Star, 
  Users, 
  Target, 
  SearchCheck, 
  Zap, 
  Flame,
  Cpu,
  AlertTriangle,
  Terminal,
  Layers,
  Building2,
  FileSearch,
  Check
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
    <div className="space-y-0">
      {/* SECTION 1: HERO (Navy Background) */}
      <section className="bg-[#0F172A] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-blue-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Speed + Senior Developer Human Editorial QA</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Get A Professional Resume In <span className="text-blue-400">24 Hours</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
            AI-generated, then personally reviewed and edited by a senior web developer. No generic templates. Just a resume that gets you interviews.
          </p>

          {/* Primary & Secondary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenOrder('starter')}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-base rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Build My Resume — $10</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('examples')}
              className="w-full sm:w-auto px-7 py-4 bg-transparent hover:bg-slate-800 text-white font-semibold text-base rounded-xl border border-slate-700 hover:border-slate-600 transition-colors flex items-center justify-center gap-2"
            >
              <span>See Resume Examples →</span>
            </button>
          </div>

          {/* Trust strip */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400 border-t border-slate-800/80 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>24-Hour Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>100% Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>500+ Resumes Crafted</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM (White Background) */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-md border border-red-200">
              The Application Bottleneck
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Most Resumes Get Rejected In 6 Seconds
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              92% of resumes never reach a human. They get filtered by ATS systems, stuffed into generic templates, and never mention what the job actually wants. You're not unqualified — your resume just isn't optimized for the people who decide.
            </p>
          </div>

          {/* Stat Bars Visual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <span className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 block">
                6 sec
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                Average recruiter scan time
              </p>
              <p className="text-xs text-slate-500">
                They glance only at your verbs, metrics, and most recent role.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-red-50/60 border border-red-200 text-center space-y-2">
              <span className="font-heading text-4xl sm:text-5xl font-extrabold text-red-600 block">
                75%
              </span>
              <p className="text-xs sm:text-sm font-semibold text-red-900">
                Auto-rejected by ATS robots
              </p>
              <p className="text-xs text-red-700">
                Multi-column tables and missing keywords trigger automatic drops.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <span className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 block">
                1 in 50
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                Unoptimized callback rate
              </p>
              <p className="text-xs text-slate-500">
                Sending 100 applications yields 2 interviews without tailoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2.5: WHAT IS ATS & WHY IT MATTERS (Technical Breakdown & Real Case Study) */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-900/60 border border-blue-700/60 text-xs font-semibold text-blue-300 uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>ATS Technical Intelligence & Reality Check</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              What is an ATS, and Why Optimization is Non-Negotiable
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              Over <strong>98.4% of Fortune 500 corporations</strong> and <strong>70%+ of growing tech companies</strong> use Applicant Tracking Systems (ATS) like Workday, Greenhouse, Taleo, and Lever. You are not being rejected by human recruiters—you are being rejected by parsing algorithms before a human ever clicks your name.
            </p>
          </div>

          {/* Under the Hood: 4-Step Software Pipeline */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  How ATS Software Actually Evaluates Your Resume
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  The technical pipeline behind modern hiring platforms from upload to recruiter view
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/80">
                Deterministic Parsing Pipeline
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ATS_PIPELINE_STEPS.map((pipe) => (
                <div key={pipe.step} className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                        STAGE {pipe.step}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{pipe.subtitle}</span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-white">
                      {pipe.name}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {pipe.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REALISTIC CASE STUDY CARD */}
          <div className="bg-slate-950 rounded-3xl border-2 border-slate-800 p-6 sm:p-10 space-y-8 shadow-2xl">
            {/* Case Study Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/70 border border-amber-800/70 px-2.5 py-0.5 rounded">
                    Verified Case Study
                  </span>
                  <span className="text-xs text-slate-400">· Real Candidate Diagnostic</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mt-1">
                  The 38-Application Wakeup Call: How a Top Performer Got Filtered Out
                </h3>
                <p className="text-xs text-slate-400">
                  Candidate: <strong>{ATS_CASE_STUDY_DATA.candidate}</strong> ({ATS_CASE_STUDY_DATA.background}) targeting <strong>{ATS_CASE_STUDY_DATA.targetRole}</strong>
                </p>
              </div>

              <div className="p-3 bg-red-950/60 border border-red-800/70 rounded-2xl shrink-0 text-left md:text-right">
                <span className="text-[10px] uppercase font-bold text-red-300 block">Initial Real-World Result</span>
                <span className="text-xl font-extrabold text-red-400 font-mono">35 Rejections / 0 Calls</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">38 corporate tech applications</span>
              </div>
            </div>

            {/* Why the Software Discarded Her (The 3 Flaws) */}
            <div className="space-y-4">
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Why the ATS System Auto-Rejected a Qualified 98% CSAT Lead:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ATS_CASE_STUDY_DATA.technicalFlawsFound.map((flaw, i) => (
                  <div key={i} className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-400">{flaw.title}</span>
                      <span className="text-[9px] font-mono uppercase bg-red-900/50 text-red-200 px-1.5 py-0.5 rounded">
                        {flaw.impact}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {flaw.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* What ResumeRevive Did + The Verified Outcome */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              {/* Overhaul Steps */}
              <div className="space-y-3">
                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  The ResumeRevive Technical Overhaul:
                </h4>
                <div className="space-y-2.5">
                  {ATS_CASE_STUDY_DATA.theOptimizationFixes.map((fix, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <span className="text-xs font-bold text-white block">
                        ✓ {fix.action}
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {fix.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* The Result Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-slate-900 border border-emerald-800/80 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    The Real-World Transformation
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs py-1 border-b border-emerald-900/60">
                      <span className="text-slate-300">New Targeted Applications:</span>
                      <span className="font-bold text-white font-mono">{ATS_CASE_STUDY_DATA.theResult.newApplications}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-emerald-900/60">
                      <span className="text-slate-300">Recruiter Screening Calls:</span>
                      <span className="font-bold text-emerald-400 font-mono">{ATS_CASE_STUDY_DATA.theResult.recruiterScreeningCalls} (60% response rate)</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-emerald-900/60">
                      <span className="text-slate-300">Final Round On-Sites:</span>
                      <span className="font-bold text-white font-mono">{ATS_CASE_STUDY_DATA.theResult.finalRoundInterviews}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-slate-300">Time from Overhaul to Offer:</span>
                      <span className="font-bold text-emerald-300 font-mono">{ATS_CASE_STUDY_DATA.theResult.timeToOffer}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-900/40 border border-emerald-700/60 rounded-xl mt-3">
                    <span className="text-[10px] uppercase font-bold text-emerald-300 block">Offer Accepted:</span>
                    <p className="text-sm font-extrabold text-white mt-0.5">
                      {ATS_CASE_STUDY_DATA.theResult.offerLanded}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenOrder('starter')}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Get Your Resume Rebuilt Like Elena's — $10</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Why Optimization is Non-Negotiable Grid */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                4 Concrete Benefits of ATS Optimization in Today's Job Sector
              </h3>
              <p className="text-xs text-slate-400">
                Why tailoring your resume format and syntax determines your career velocity in 2026
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center mb-1">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="font-heading font-bold text-sm text-white">
                  1. Defeats the Auto-Reject Gate
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Stops your resume from being discarded during the initial file conversion step before any recruiter logs in.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center mb-1">
                  <SearchCheck className="w-4 h-4" />
                </div>
                <h4 className="font-heading font-bold text-sm text-white">
                  2. Top-Ranked Keyword Match
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Places your profile on page 1 of recruiter search queries by matching required technical taxonomy and density.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center mb-1">
                  <FileSearch className="w-4 h-4" />
                </div>
                <h4 className="font-heading font-bold text-sm text-white">
                  3. Clean Executive Formatting
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When passed to the VP or Hiring Manager, your resume prints and renders cleanly with zero broken lines or awkward gaps.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600/30 text-amber-400 flex items-center justify-center mb-1">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-heading font-bold text-sm text-white">
                  4. Cuts Search Time by 80%
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Shift from blasting 200 generic applications with silence to securing 3–5 screening calls from 15 targeted sends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW WE'RE DIFFERENT (Comparison Table) */}
      <section className="bg-[#F8FAFC] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
              The Core Differentiator
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              AI Speed. Human Quality Control. No Template Fluff.
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Why our hybrid approach beats both generic template builders and cheap raw AI prompts.
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Generic Builders */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-heading font-bold text-base">
                <XCircle className="w-5 h-5 text-red-500" />
                <h3>Generic Template Builders</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 shrink-0 font-bold">✕</span>
                  <span>Pre-made templates where you fill in the blanks manually</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 shrink-0 font-bold">✕</span>
                  <span>Zero human review — just another generic PDF</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 shrink-0 font-bold">✕</span>
                  <span>Decorative columns that break inside ATS software</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 shrink-0 font-bold">✕</span>
                  <span>Trap you in hidden $29/mo recurring subscriptions</span>
                </li>
              </ul>
            </div>

            {/* Column 2: Cheap AI Tools */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-heading font-bold text-base">
                <XCircle className="w-5 h-5 text-red-500" />
                <h3>Raw AI Chat Tools</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 shrink-0 font-bold">✕</span>
                  <span>Raw AI output with zero accuracy checks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 shrink-0 font-bold">✕</span>
                  <span>Hallucinates promotions or fake skills you never possessed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 shrink-0 font-bold">✕</span>
                  <span>Robotic buzzwords ("spearheaded synergy") obvious to recruiters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 shrink-0 font-bold">✕</span>
                  <span>Revisions cost extra every single time</span>
                </li>
              </ul>
            </div>

            {/* Column 3: ResumeRevive (US) */}
            <div className="bg-white p-6 rounded-2xl border-2 border-emerald-400 shadow-md space-y-4 ring-2 ring-emerald-500/10">
              <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-emerald-950">ResumeRevive (Us)</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>AI tailors every bullet to YOUR target job description</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Every resume personally reviewed & edited by a developer</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>ATS-compliant single-column formatting that passes scanners</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>100% money-back guarantee with guaranteed 24h delivery</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Highlight Box */}
          <div className="bg-[#3B82F6] text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm sm:text-base leading-relaxed font-medium">
              "Unlike automated builders, I read your resume twice — once for accuracy, once for impact. You get AI efficiency with human judgment. No template fluff."
            </p>
            <span className="text-xs uppercase tracking-wider bg-white/20 px-3 py-1.5 rounded-lg shrink-0 font-semibold">
              Developer Pledge
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS (4-Step Visual) */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              From Draft To Interview in 4 Simple Steps
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              No endless questionnaires or complicated software to learn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center font-heading text-base shadow-sm">
                1
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Tell Me About You
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fill our simple 2-minute form with your work history and target job description.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center font-heading text-base shadow-sm">
                2
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                AI Generates Draft
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your resume is tailored to the job: keyword density, tone, and achievements matched to their requirements.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center font-heading text-base shadow-sm">
                3
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                I Review & Polish
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                I personally edit every bullet for accuracy, quantifiable numbers, and clean ATS-friendly layout.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center font-heading text-base shadow-sm">
                4
              </div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Receive & Apply
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get your polished PDF + editable DOCX in 24 hours, ready to apply immediately.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onOpenOrder('starter')}
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-500/20 inline-flex items-center gap-2"
            >
              <span>Start My Resume →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: PRICING PREVIEW (3 Cards) */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Simple Pricing. No Hidden Fees.
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              One-time payment upfront. 100% money-back guarantee.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-6 rounded-2xl bg-white border flex flex-col justify-between transition-all ${
                  pkg.popular
                    ? 'border-2 border-blue-500 shadow-xl ring-2 ring-blue-500/10'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-lg text-slate-900">{pkg.name}</h3>
                    {pkg.popular && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-full">
                        MOST POPULAR
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading text-3xl font-extrabold text-slate-900">${pkg.price}</span>
                    <span className="text-xs text-slate-500 font-medium">/ one-time</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[32px]">
                    {pkg.description}
                  </p>
                  <ul className="space-y-2 pt-2 border-t border-slate-100">
                    {pkg.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <button
                    onClick={() => onOpenOrder(pkg.id)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-colors ${
                      pkg.popular
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    CHOOSE PLAN — {pkg.name.toUpperCase()}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-slate-500">
            All packages include a 100% money-back guarantee. Payments via PayPal, Cards, and PhonePe / UPI.
          </div>
        </div>
      </section>

      {/* SECTION 6: EXAMPLES TEASER */}
      <section className="bg-[#F8FAFC] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              See The Difference
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Don't take our word for it. Here's what a real rewrite looks like — before, after, and what changed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RESUME_EXAMPLES.slice(0, 2).map((ex) => (
              <div key={ex.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {ex.industry}
                  </span>
                  <span className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    {ex.result}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {ex.title}
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-red-50/70 border border-red-100 text-slate-700">
                    <strong className="text-red-700 block text-[11px] mb-0.5">BEFORE:</strong>
                    {ex.before.experience[0]}
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-slate-900">
                    <strong className="text-emerald-800 block text-[11px] mb-0.5">AFTER (ResumeRevive):</strong>
                    {ex.after.experience[0]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate('examples')}
              className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors shadow-xs inline-flex items-center gap-2"
            >
              <span>View All Resume Examples & Diff Highlights →</span>
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              Names anonymized to protect client privacy. Results typical, not guaranteed.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: LEAD MAGNET (Email Capture) */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-3xl mx-auto bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            Free Recruiter Resource
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">
            Not Ready to Buy? Get My Free 25-Point Resume Checklist
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Download my 25-point resume checklist — used to review 500+ resumes. Learn exactly what gets you interviewed and what quietly triggers automated rejections.
          </p>

          {!leadCaptured ? (
            <form onSubmit={handleLeadSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
              >
                SEND ME THE CHECKLIST
              </button>
            </form>
          ) : (
            <div className="p-4 bg-emerald-950/80 border border-emerald-700 rounded-xl max-w-md mx-auto text-emerald-200 text-xs sm:text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Checklist unlocked! Check your download modal.</span>
            </div>
          )}

          <p className="text-[11px] text-slate-400">
            Free. No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* SECTION 8: TESTIMONIALS */}
      <section className="bg-[#F8FAFC] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              What Job Seekers Say
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Real professionals who transitioned from 0 callbacks to multiple screening calls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((t, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{t.name}</h4>
                    <span className="text-[10px] text-slate-500 block">{t.role}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {t.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ TEASER */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600">
              Clear answers to the most common questions before ordering.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.slice(0, 3).map((faq) => {
              const isExpanded = expandedFaq === faq.id;
              return (
                <div key={faq.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 text-left font-heading text-sm font-bold text-slate-900 flex items-center justify-between hover:bg-slate-50"
                  >
                    <span>{faq.question}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isExpanded && (
                    <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.directAnswer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('faq')}
              className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <span>See All 40+ Questions & Answers →</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 10: FINAL CTA (Electric Accent Background) */}
      <section className="bg-[#3B82F6] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
            Your Next Interview Starts Here
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-xl mx-auto font-light">
            Join 500+ job seekers who got hired with a professionally crafted resume. Delivered in 24 hours.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onOpenOrder('starter')}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-base rounded-xl transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]"
            >
              Build My Resume Now — $10
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
