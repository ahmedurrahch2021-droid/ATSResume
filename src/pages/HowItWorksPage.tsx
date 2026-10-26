import React from 'react';
import { 
  FileEdit, 
  Cpu, 
  UserCheck, 
  MailCheck, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  FileCode,
  FileText
} from 'lucide-react';

interface HowItWorksPageProps {
  onSelectPlan: (packageId: 'starter' | 'boost' | 'full') => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onSelectPlan }) => {
  const steps = [
    {
      step: '01',
      title: 'Share Your Details & Target Job',
      time: 'Takes ~2 minutes',
      icon: <FileEdit className="w-6 h-6 text-blue-600" />,
      description: 'Fill out our streamlined order form with your current experience and paste the job description you are targeting. The job description is crucial — it reveals the exact skills and keywords recruiters filter for.',
      deliverable: 'Form inputs submitted securely & encrypted'
    },
    {
      step: '02',
      title: 'AI Drafts & Keyword Calibration',
      time: 'Hour 1 – 2',
      icon: <Cpu className="w-6 h-6 text-indigo-600" />,
      description: 'Our proprietary LLM engine parses the target company requirements, benchmarks your background against ATS filtering patterns, and generates an achievement-driven first draft with the Google XYZ formula.',
      deliverable: 'Keyword frequency mapping & initial structure'
    },
    {
      step: '03',
      title: 'Senior Developer Human Editorial QA',
      time: 'Hour 3 – 18',
      icon: <UserCheck className="w-6 h-6 text-accent" />,
      description: 'I personally read and edit your resume twice. First, to eliminate any AI fluff, robotic words, or exaggerated claims. Second, to tighten the typography, ensure clean single-column ATS hierarchy, and elevate impact.',
      deliverable: 'Human judgment, technical accuracy & zero fluff'
    },
    {
      step: '04',
      title: 'Receive, Review & Apply',
      time: 'Hour 24 Delivery',
      icon: <MailCheck className="w-6 h-6 text-amber-500" />,
      description: 'Your polished resume (PDF + editable DOCX) arrives in your inbox ready to apply immediately. Need any adjustments? Your package includes a free revision round within 7 days.',
      deliverable: 'Crisp ATS PDF + Editable Word (.docx)'
    }
  ];

  const deliverables = [
    { name: 'ATS-Optimized Resume (PDF)', desc: 'Clean single-column layout formatted to pass Taleo, Greenhouse, and Workday.' },
    { name: 'Editable Source Document (.docx)', desc: 'Easily tweak bullet points on your own computer for future job variations.' },
    { name: 'Targeted Cover Letter (PDF)', desc: 'Personalized to the hiring team and company mission (Career Boost+).' },
    { name: 'LinkedIn Headline & Bio Copy', desc: 'Plug-and-play profile text that attracts inbound recruiters (Career Boost+).' },
    { name: 'ATS Keyword Match Matrix', desc: 'Reference sheet detailing the high-frequency keywords woven into your bullets.' },
    { name: '10 Interview Prep Questions', desc: 'STAR technique prompts predicting what interviewers will ask (Full Package).' }
  ];

  return (
    <div className="min-h-screen bg-soft py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent 4-Step Process
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Your Resume, Handled End-to-End
          </h1>
          <p className="text-base text-muted leading-relaxed">
            How we blend modern AI precision with senior developer craftsmanship to deliver an interview-winning application in 24 hours.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="space-y-6">
          {steps.map((s, idx) => (
            <div
              key={s.step}
              className="bg-paper rounded-2xl border border-line p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  {s.icon}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      STEP {s.step}
                    </span>
                    <span className="text-xs text-muted/60">· {s.time}</span>
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-ink">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-2xl">
                    {s.description}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-soft rounded-xl border border-slate-100 text-xs text-ink/90 shrink-0 w-full md:w-56 text-left">
                <span className="text-[10px] font-bold uppercase text-muted/60 block mb-0.5">
                  Deliverable:
                </span>
                {s.deliverable}
              </div>
            </div>
          ))}
        </div>

        {/* 24-Hour Timeline Bar */}
        <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">
              Production Velocity
            </span>
            <h3 className="font-heading text-xl font-bold mt-1">
              Guaranteed 24-Hour Delivery Roadmap
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Traditional resume agencies take 7 to 10 days. Here is how your order progresses:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="font-mono text-xs text-blue-400 block">00:00 Hours</span>
              <p className="text-xs font-bold text-white mt-1">Order Received</p>
              <p className="text-[11px] text-muted/60 mt-0.5">Payment verified & brief queued</p>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="font-mono text-xs text-indigo-400 block">02:00 Hours</span>
              <p className="text-xs font-bold text-white mt-1">AI JD Synthesis</p>
              <p className="text-[11px] text-muted/60 mt-0.5">Keywords & metrics drafted</p>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="font-mono text-xs text-emerald-400 block">14:00 Hours</span>
              <p className="text-xs font-bold text-white mt-1">Developer Deep Review</p>
              <p className="text-[11px] text-muted/60 mt-0.5">Line-by-line editorial rewrite</p>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="font-mono text-xs text-amber-400 block">24:00 Hours</span>
              <p className="text-xs font-bold text-white mt-1">Inbox Delivery</p>
              <p className="text-[11px] text-muted/60 mt-0.5">PDF + DOCX sent to your email</p>
            </div>
          </div>
        </div>

        {/* Deliverables Breakdown */}
        <div className="bg-paper rounded-2xl border border-line p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="font-heading text-xl font-bold text-ink">
              What You Will Receive In Your Delivery Email
            </h3>
            <p className="text-xs text-muted/80 mt-1">
              Every document is yours to keep forever, with zero recurring charges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {deliverables.map((d, i) => (
              <div key={i} className="p-4 rounded-xl bg-soft border border-slate-100 space-y-1.5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-ink">{d.name}</h4>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-6 space-y-4">
          <h3 className="font-heading text-2xl font-bold text-ink">
            Ready To Get Your Resume In 24 Hours?
          </h3>
          <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto">
            Choose your package and submit your target job. We’ll handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onSelectPlan('starter')}
              className="w-full sm:w-auto px-6 py-3 bg-accent hover:bg-accent/90 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm"
            >
              Start For $10 (Starter)
            </button>
            <button
              onClick={() => onSelectPlan('boost')}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Get Career Boost ($25)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
