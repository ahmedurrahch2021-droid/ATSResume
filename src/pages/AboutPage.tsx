import React from 'react';
import { 
  Code, 
  Terminal, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Users, 
  ArrowRight,
  HeartHandshake
} from 'lucide-react';

interface AboutPageProps {
  onSelectPlan: (packageId: 'starter' | 'boost' | 'full') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onSelectPlan }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
            <Terminal className="w-3.5 h-3.5" />
            Founder & Lead Reviewer
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            I Build Web Platforms & Optimize Resumes. Here's Why I Do Both.
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            The philosophy behind ResumeRevive: Why automated tools alone fail job seekers, and how technical screening insight turns cold applications into interviews.
          </p>
        </div>

        {/* Story Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          {/* Founder Intro Row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-100">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-slate-900 to-blue-700 text-white flex flex-col items-center justify-center font-heading font-extrabold text-2xl shadow-md shrink-0">
              <span>RR</span>
              <span className="text-[10px] font-sans font-normal text-blue-200 mt-0.5">DEV & QA</span>
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="font-heading text-xl font-bold text-slate-900">
                Hi, I'm the Lead Engineer behind ResumeRevive.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                As a senior full-stack web developer, I build and maintain live web applications and eCommerce systems. Over the years, I've sat on the hiring side of the table, screening hundreds of engineering, product, marketing, and corporate resumes.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium">
                  500+ Resumes Audited
                </span>
                <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium">
                  Full-Stack Architecture
                </span>
                <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md font-medium">
                  94% Interview Callback Rate
                </span>
              </div>
            </div>
          </div>

          {/* Why Resumes are Broken */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold text-slate-900">
              Why 92% of Resumes Fail In 6 Seconds
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When screening candidates for our engineering and growth teams, I noticed a heartbreaking pattern: qualified, brilliant people were being silently rejected before a human ever spoke to them.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-red-50/60 border border-red-200/80 space-y-1.5">
                <span className="text-xs font-bold text-red-900">Problem 1: The ATS Robot Filter</span>
                <p className="text-xs text-red-700 leading-relaxed">
                  People use fancy Canva templates with 2-column tables, photos, or weird fonts. Applicant Tracking Systems (ATS) like Workday scramble these into unreadable gibberish.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-red-50/60 border border-red-200/80 space-y-1.5">
                <span className="text-xs font-bold text-red-900">Problem 2: Duty Lists vs Accomplishments</span>
                <p className="text-xs text-red-700 leading-relaxed">
                  People write "Responsible for managing tasks" instead of quantifying their commercial impact. Recruiters don't want job descriptions; they want proof of results.
                </p>
              </div>
            </div>
          </div>

          {/* The AI + Human Philosophy */}
          <div className="space-y-4 pt-2">
            <h3 className="font-heading text-lg font-bold text-slate-900">
              Why Raw AI Tools Are Not Enough
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              When ChatGPT came out, thousands of job seekers pasted prompts and submitted the raw text. But hiring managers now spot unedited AI output in 3 seconds: robotic filler words like <em>"spearheaded synergized paradigms"</em>, hallucinated job titles, and fabricated metrics.
            </p>
            <div className="p-5 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-950 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800">
                The ResumeRevive Pledge:
              </h4>
              <p className="text-xs sm:text-sm italic leading-relaxed">
                "Unlike automated builders, I personally read every resume twice — once for technical accuracy and domain truth, and once for recruiter impact. You get AI efficiency with senior human judgment. No template fluff. No hallucinated nonsense."
              </p>
            </div>
          </div>

          {/* Credibility & Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Total Confidentiality</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your resume, salary history, and personal contact details are never shared, sold, or published.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="text-blue-600">
                <Code className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Technical Rigour</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We understand modern frameworks, tools, and corporate hierarchies across Tech, Finance, Marketing, and Operations.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="text-amber-500">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">Fair Pricing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Agencies charge $250+ because of bloated overhead. We charge $10–$35 because we leverage efficient AI alongside smart human review.
              </p>
            </div>
          </div>

          {/* Founder Action CTA */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-900">
                Let's get your career moving forward.
              </p>
              <p className="text-xs text-slate-500">
                Turnaround is 24 hours. Your first revision is free.
              </p>
            </div>
            <button
              onClick={() => onSelectPlan('boost')}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <span>Build My Resume Now — From $10</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
