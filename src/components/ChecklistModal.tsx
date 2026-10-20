import React, { useState } from 'react';
import { CHECKLIST_ITEMS } from '../data/mockData';
import { X, CheckCircle2, Download, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (packageId: 'starter' | 'boost' | 'full') => void;
}

export const ChecklistModal: React.FC<ChecklistModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'ATS Architecture', 'Content & Impact', 'Keyword Calibration', 'Header & Contact', 'Formatting'];

  const filteredItems = filterCategory === 'All' 
    ? CHECKLIST_ITEMS 
    : CHECKLIST_ITEMS.filter(item => item.category === filterCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  const handleDownload = () => {
    const textContent = `RESUMEREVIVE — 25-POINT ATS RESUME AUDIT CHECKLIST
Used to review 500+ resumes by Senior Web Developers.

${CHECKLIST_ITEMS.map((item, idx) => `[ ] ${idx + 1}. [${item.category}] ${item.title}\n    ${item.description}\n`).join('\n')}

Visit ResumeRevive.ai to get your resume professionally rebuilt in 24 hours starting at $10!`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ResumeRevive-25-Point-ATS-Checklist.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-5 sm:p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <Sparkles className="w-4 h-4" />
              Free Recruiter Lead Magnet
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold">
              The 25-Point ATS Resume Checklist
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              The exact auditing framework used to review 500+ resumes and pass ATS scanners.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {!submitted ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Enter your email to unlock and instantly download the checklist:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm"
                  >
                    <span>Get Free Checklist</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Free. No spam. Instant access.
                </p>
              </form>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-emerald-800 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Checklist unlocked for <strong>{email}</strong>!</span>
              </div>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shrink-0 shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download as Text File</span>
              </button>
            </div>
          )}

          {/* Category Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Auditing Checklist Items
              </span>
              <span className="text-xs text-slate-400">
                {filteredItems.length} of {CHECKLIST_ITEMS.length} points
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    filterCategory === cat
                      ? 'bg-slate-900 text-white font-medium'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Checklist rows */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg border border-slate-100 bg-white hover:border-slate-200 transition-colors flex items-start gap-2.5"
                >
                  <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center text-slate-400 mt-0.5 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800">
                        {item.id}. {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">
                        · {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upsell box */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-blue-900">
                Prefer not to spend 6 hours fixing this yourself?
              </p>
              <p className="text-xs text-blue-700 mt-0.5">
                Get an ATS-optimized rewrite personally reviewed by a developer in 24 hours.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onSelectPlan('starter');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              Build My Resume — $10
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
