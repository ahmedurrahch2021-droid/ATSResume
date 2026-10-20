import React, { useState } from 'react';
import { analyzeResumeText } from '../utils/atsScanner';
import { SAMPLE_WEAK_RESUMES, SAMPLE_JOB_DESCRIPTIONS } from '../data/mockData';
import { AtsScanResult } from '../types';
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
  BarChart3
} from 'lucide-react';

interface FreeScorePageProps {
  onSelectPlan: (packageId: 'starter' | 'boost' | 'full', preloadedData?: { resume: string; jd: string }) => void;
}

export const FreeScorePage: React.FC<FreeScorePageProps> = ({ onSelectPlan }) => {
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescriptionText, setJobDescriptionText] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<AtsScanResult | null>(null);

  const handleRunScan = () => {
    if (!resumeText.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      const result = analyzeResumeText(resumeText, jobDescriptionText);
      setScanResult(result);
      setIsScanning(false);
      // scroll to results
      const resultsEl = document.getElementById('scan-results');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 700);
  };

  const handleLoadSample = (sampleKey: 'marketing' | 'developer' | 'sales') => {
    setResumeText(SAMPLE_WEAK_RESUMES[sampleKey]);
    setJobDescriptionText(SAMPLE_JOB_DESCRIPTIONS[sampleKey]);
    setScanResult(null);
  };

  const getScoreColor = (score: number) => {
    if (score < 50) return 'text-red-600 bg-red-50 border-red-200';
    if (score < 75) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
            <SearchCheck className="w-4 h-4 text-emerald-600" />
            100% Free · No Sign-Up Required
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Free ATS Resume Score Checker
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            See exactly what is triggering automated rejections. Get an instant score breakdown across quantified impact, action verbs, and ATS keyword calibration.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Quick sample loader toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Try with an unoptimized sample resume:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleLoadSample('marketing')}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                Marketing Sample
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('developer')}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                Developer Sample
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('sales')}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                Sales Sample
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resume Text Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Paste Resume Content (Required)
                </label>
                <span className="text-xs text-slate-400">
                  {resumeText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={10}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your current resume text here (Summary, Experience, Education, Skills)..."
                className="w-full p-3.5 text-xs sm:text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none leading-relaxed resize-y"
              />
            </div>

            {/* Target Job Description Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-600" />
                  Target Job Description (Recommended)
                </label>
                <span className="text-[11px] text-emerald-600 font-medium">
                  Enables Keyword Gap Analysis
                </span>
              </div>
              <textarea
                rows={10}
                value={jobDescriptionText}
                onChange={(e) => setJobDescriptionText(e.target.value)}
                placeholder="Paste the target job posting / requirements here to test keyword compatibility..."
                className="w-full p-3.5 text-xs sm:text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none leading-relaxed resize-y bg-slate-50/50"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Scans for 25 ATS rejection triggers & Google XYZ formula metrics</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {resumeText && (
                <button
                  type="button"
                  onClick={() => {
                    setResumeText('');
                    setJobDescriptionText('');
                    setScanResult(null);
                  }}
                  className="px-3 py-2.5 text-xs text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
              <button
                type="button"
                disabled={!resumeText.trim() || isScanning}
                onClick={handleRunScan}
                className="flex-1 sm:flex-none px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                {isScanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing ATS Criteria...</span>
                  </>
                ) : (
                  <>
                    <SearchCheck className="w-4 h-4" />
                    <span>Get Free Score & Diagnostic</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Container */}
        {scanResult && (
          <div id="scan-results" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Top Score Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
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
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Overall ATS Readiness
                    </span>
                    <h3 className="font-heading text-xl font-bold text-slate-900 mt-0.5">
                      {scanResult.score < 50
                        ? 'High Rejection Risk (75%+ Filtering Likelihood)'
                        : scanResult.score < 75
                        ? 'Average Rating (Needs Metric & Keyword Elevation)'
                        : 'Strong Foundation (Ready for Executive Polish)'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                      {scanResult.summaryFeedback}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => onSelectPlan('starter', { resume: resumeText, jd: jobDescriptionText })}
                    className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Fix These Issues Now — From $10</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 5 Category Metric Breakdown */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Numbers & Metrics</span>
                    <span className="font-bold text-slate-900">{scanResult.categoryScores.quantifiedMetrics}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${scanResult.categoryScores.quantifiedMetrics}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {scanResult.quantifiedCount} quantified lines
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Action Verbs</span>
                    <span className="font-bold text-slate-900">{scanResult.categoryScores.actionVerbs}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${scanResult.categoryScores.actionVerbs}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {scanResult.strongVerbsCount} strong leadership verbs
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Keywords Relevance</span>
                    <span className="font-bold text-slate-900">{scanResult.categoryScores.skillsRelevance}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${scanResult.categoryScores.skillsRelevance}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {scanResult.detectedKeywords.length} core keywords found
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">ATS Layout</span>
                    <span className="font-bold text-slate-900">{scanResult.categoryScores.atsReadability}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${scanResult.categoryScores.atsReadability}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Clean plain-text parsing
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Section Structure</span>
                    <span className="font-bold text-slate-900">{scanResult.categoryScores.structureFormatting}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-700 rounded-full" 
                      style={{ width: `${scanResult.categoryScores.structureFormatting}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Standard heading checks
                  </span>
                </div>
              </div>
            </div>

            {/* Red Flags & Quick Wins Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Critical Rejection Issues */}
              <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-red-900 font-heading font-bold text-base">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h4>Critical Issues Detected (Rejection Factors)</h4>
                </div>
                <div className="space-y-2.5">
                  {scanResult.criticalIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-red-50/70 border border-red-200/60 text-xs text-red-800 flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="text-red-500 font-bold shrink-0">✕</span>
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Quick Wins */}
              <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-emerald-950 font-heading font-bold text-base">
                  <Zap className="w-5 h-5 text-emerald-600" />
                  <h4>High-Impact Recommended Fixes</h4>
                </div>
                <div className="space-y-2.5">
                  {scanResult.quickWins.map((win, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-900 flex items-start gap-2.5 leading-relaxed"
                    >
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span>{win}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Keyword Extraction Details */}
            {(scanResult.detectedKeywords.length > 0 || scanResult.missingCrucialKeywords.length > 0) && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-sm text-slate-900">
                    ATS Keyword Matrix Comparison
                  </h4>
                  <span className="text-xs text-slate-400">
                    Matches against your provided role
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 block mb-2">
                      Detected in Resume ({scanResult.detectedKeywords.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {scanResult.detectedKeywords.length > 0 ? (
                        scanResult.detectedKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 font-mono"
                          >
                            ✓ {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">None detected</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-red-700 block mb-2">
                      Missing from Target JD ({scanResult.missingCrucialKeywords.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {scanResult.missingCrucialKeywords.length > 0 ? (
                        scanResult.missingCrucialKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 bg-red-50 text-red-800 rounded-md border border-red-200 font-mono"
                          >
                            ✕ {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No missing high-frequency keywords</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Big Conversion Callout */}
            <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="text-xs uppercase font-semibold text-emerald-400 tracking-wider">
                  Guaranteed 24-Hour Solution
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-bold">
                  Want us to rebuild this resume to 95+ score?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  We'll pre-load your pasted text right into the order form so you don't have to retype anything. Complete developer rewrite with 100% money-back guarantee.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onSelectPlan('starter', { resume: resumeText, jd: jobDescriptionText })}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-500/20"
                >
                  Rewrite For $10 (Starter)
                </button>
                <button
                  onClick={() => onSelectPlan('boost', { resume: resumeText, jd: jobDescriptionText })}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md"
                >
                  Get Career Boost ($25)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
