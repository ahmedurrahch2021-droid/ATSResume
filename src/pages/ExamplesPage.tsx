import React, { useState } from 'react';
import { RESUME_EXAMPLES } from '../data/mockData';
import { ExampleResume } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  SlidersHorizontal, 
  Layers, 
  FileCheck,
  Award
} from 'lucide-react';

interface ExamplesPageProps {
  onSelectPlan: (packageId: 'starter' | 'boost' | 'full') => void;
}

export const ExamplesPage: React.FC<ExamplesPageProps> = ({ onSelectPlan }) => {
  const [selectedExampleId, setSelectedExampleId] = useState<string>(RESUME_EXAMPLES[0].id);
  const [viewMode, setViewMode] = useState<'split' | 'critique'>('split');

  const currentExample: ExampleResume = 
    RESUME_EXAMPLES.find(ex => ex.id === selectedExampleId) || RESUME_EXAMPLES[0];

  return (
    <div className="min-h-screen bg-soft py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Portfolio Case Studies
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Real Resumes, Real Results
          </h1>
          <p className="text-base text-muted leading-relaxed">
            See exactly how generic, task-focused drafts get transformed into quantified, ATS-dominating resumes that secure interviews.
          </p>
        </div>

        {/* Case Study Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {RESUME_EXAMPLES.map((ex) => {
            const isSelected = ex.id === currentExample.id;
            return (
              <button
                key={ex.id}
                onClick={() => setSelectedExampleId(ex.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                  isSelected
                    ? 'bg-[#0F172A] text-white shadow-slate-900/10 ring-2 ring-blue-500'
                    : 'bg-paper text-ink/90 hover:bg-slate-100 border border-line'
                }`}
              >
                <span>{ex.title}</span>
              </button>
            );
          })}
        </div>

        {/* Case Study Overview Banner */}
        <div className="bg-paper rounded-2xl border border-line p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-muted/80 uppercase tracking-wide">
                <span>{currentExample.industry}</span>
                <span>·</span>
                <span className="text-blue-600 font-semibold">{currentExample.role}</span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-ink mt-1">
                {currentExample.title}
              </h2>
            </div>

            {/* Impact Metric Badge */}
            <div className="bg-soft border border-line rounded-xl p-3.5 sm:text-right shrink-0">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                Verified Outcome
              </span>
              <p className="text-sm font-bold text-emerald-950 flex items-center gap-1.5 sm:justify-end mt-0.5">
                <TrendingUp className="w-4 h-4 text-accent" />
                {currentExample.result}
              </p>
              <p className="text-xs text-accent font-mono mt-0.5">
                {currentExample.metricsHighlight}
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-xs font-medium text-muted/80">
              Compare Before & After:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'split' ? 'bg-paper text-ink shadow-xs' : 'text-muted hover:text-ink'
                }`}
              >
                Side-by-Side Comparison
              </button>
              <button
                onClick={() => setViewMode('critique')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'critique' ? 'bg-paper text-ink shadow-xs' : 'text-muted hover:text-ink'
                }`}
              >
                Recruiter Diagnostic
              </button>
            </div>
          </div>
        </div>

        {/* View Mode: Split Comparison */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* The BEFORE Resume (Red/Grey) */}
            <div className="bg-paper rounded-2xl border-2 border-line shadow-sm overflow-hidden flex flex-col">
              <div className="bg-soft/80 px-5 py-3.5 border-b border-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="font-heading font-bold text-sm text-red-900">
                    BEFORE — Unoptimized (75% Rejection)
                  </span>
                </div>
                <span className="text-xs font-mono text-red-700 bg-red-100 px-2 py-0.5 rounded">
                  Score: 38/100
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1">
                <div>
                  <h4 className="text-xs uppercase font-bold text-muted/60 tracking-wider">
                    Target Header & Summary
                  </h4>
                  <div className="mt-2 p-3 bg-soft rounded-lg border border-slate-100 text-xs text-muted leading-relaxed italic">
                    "{currentExample.before.summary}"
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold text-muted/60 tracking-wider mb-2">
                    Work Experience Bullets
                  </h4>
                  <div className="space-y-2">
                    {currentExample.before.experience.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-ink/90 p-2.5 rounded-lg bg-soft/70 border border-line/60 leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-red-400 font-bold shrink-0">✕</span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Problems Callout */}
                <div className="pt-2">
                  <h5 className="text-xs font-semibold text-red-900 mb-1.5">
                    Why recruiters and ATS filter this out:
                  </h5>
                  <ul className="space-y-1">
                    {currentExample.before.critique.map((crit, idx) => (
                      <li key={idx} className="text-[11px] text-red-700 flex items-start gap-1.5">
                        <span className="text-red-400 mt-0.5">•</span>
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* The AFTER Resume (Emerald/Blue) */}
            <div className="bg-paper rounded-2xl border-2 border-emerald-300 shadow-md overflow-hidden flex flex-col">
              <div className="bg-soft/80 px-5 py-3.5 border-b border-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  <span className="font-heading font-bold text-sm text-emerald-950">
                    AFTER — ATS Resume Maker Overhaul
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Score: 98/100
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1">
                <div>
                  <h4 className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
                    Optimized Executive Summary
                  </h4>
                  <div className="mt-2 p-3 bg-soft/40 rounded-lg border border-emerald-100 text-xs text-ink leading-relaxed font-medium">
                    "{currentExample.after.summary}"
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold text-emerald-800 tracking-wider mb-2">
                    Accomplishment Bullets (Quantified Impact)
                  </h4>
                  <div className="space-y-2">
                    {currentExample.after.experience.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-ink p-2.5 rounded-lg bg-soft/30 border border-line/80 leading-relaxed flex items-start gap-2 shadow-xs"
                      >
                        <span className="text-accent font-bold shrink-0">✓</span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Improvements Callout */}
                <div className="pt-2">
                  <h5 className="text-xs font-semibold text-emerald-950 mb-1.5">
                    Strategic Developer Enhancements:
                  </h5>
                  <ul className="space-y-1">
                    {currentExample.after.improvements.map((imp, idx) => (
                      <li key={idx} className="text-[11px] text-emerald-800 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode: Deep Recruiter Critique */}
        {viewMode === 'critique' && (
          <div className="bg-paper rounded-2xl border border-line p-8 shadow-sm space-y-6">
            <h3 className="font-heading text-lg font-bold text-ink">
              Senior Developer Editorial Audit for {currentExample.role}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-soft border border-line space-y-2">
                <span className="text-xs font-semibold uppercase text-muted/80">1. Action Verbs</span>
                <p className="text-sm font-bold text-ink">Passive Duties vs Leadership Ownership</p>
                <p className="text-xs text-muted leading-relaxed">
                  Recruiters spend 6 seconds looking for verbs. Replacing phrases like "was tasked with" with "architected" or "spearheaded" immediately sets an executive tone.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-soft border border-line space-y-2">
                <span className="text-xs font-semibold uppercase text-muted/80">2. Metric Rigour</span>
                <p className="text-sm font-bold text-ink">The 40% Numbers Rule</p>
                <p className="text-xs text-muted leading-relaxed">
                  Every job seeker claims to be hardworking. We extract actual percentages, dollar amounts, time saved, and team sizes so your claims are verified facts.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-soft border border-line space-y-2">
                <span className="text-xs font-semibold uppercase text-muted/80">3. ATS Calibration</span>
                <p className="text-sm font-bold text-ink">Zero Multi-Column Scrambling</p>
                <p className="text-xs text-muted leading-relaxed">
                  We use single-column hierarchy that parses flawlessly through Workday, Lever, and Greenhouse without misaligned dates or lost contact fields.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs font-bold text-blue-900">
                  Ready to transform your own resume like Sarah, David, and Alex?
                </p>
                <p className="text-xs text-blue-700 mt-0.5">
                  Delivered in 24 hours with full ATS optimization and money-back guarantee.
                </p>
              </div>
              <button
                onClick={() => onSelectPlan('boost')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Choose Career Boost ($25)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="bg-[#0F172A] rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-heading text-xl sm:text-2xl font-bold">
              Want Your Resume Rebuilt Like These?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Send us your current background and your dream job description. We’ll generate the targeted draft and personally hand-edit every line in 24 hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectPlan('starter')}
              className="w-full sm:w-auto px-5 py-3 bg-soft0 hover:bg-accent text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-500/20"
            >
              Start For $10 (Starter)
            </button>
            <button
              onClick={() => onSelectPlan('boost')}
              className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md"
            >
              Get Career Boost ($25) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
