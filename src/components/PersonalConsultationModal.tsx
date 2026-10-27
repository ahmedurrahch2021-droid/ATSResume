import React, { useState } from 'react';
import { X, ShieldCheck, Clock, CheckCircle2, MessageSquare, ArrowRight, Star, Sparkles } from 'lucide-react';
import { ResumeData } from '../types';

interface PersonalConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  onProceedOrder: (pkg: 'starter' | 'boost' | 'full', notes?: string, targetJobUrl?: string) => void;
}

export const PersonalConsultationModal: React.FC<PersonalConsultationModalProps> = ({
  isOpen,
  onClose,
  resumeData,
  onProceedOrder
}) => {
  const [selectedTier, setSelectedTier] = useState<'starter' | 'boost'>('starter');
  const [targetJobUrl, setTargetJobUrl] = useState<string>('');
  const [careerGoalsNotes, setCareerGoalsNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceedOrder(selectedTier, careerGoalsNotes, targetJobUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-paper rounded-xl shadow-2xl border border-line w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line flex items-center justify-between bg-soft">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-success-soft text-success font-mono">
                1-on-1 Human Expert
              </span>
              <span className="text-xs text-muted/80 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-muted/60" /> 24-Hour Turnaround
              </span>
            </div>
            <h3 className="text-lg font-bold text-ink mt-1">
              Personalized Consultation & Developer Overhaul
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Work directly with an experienced tech lead and resume specialist to guarantee your interview invitations.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted/60 hover:text-muted rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Tier Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink uppercase tracking-wide">
              Select Your Consultation Package
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedTier('starter')}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  selectedTier === 'starter'
                    ? 'border-emerald-600 bg-soft/50 shadow-sm ring-1 ring-emerald-500'
                    : 'border-line hover:border-line bg-paper'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-ink">Developer Polish</span>
                  <span className="text-base font-extrabold text-accent font-mono">$10</span>
                </div>
                <p className="text-xs text-muted mt-1.5 leading-snug">
                  Personal review, rewrite of 5 core bullets with Google XYZ metrics, and verified ATS parser pass report.
                </p>
              </div>

              <div
                onClick={() => setSelectedTier('boost')}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  selectedTier === 'boost'
                    ? 'border-emerald-600 bg-soft/50 shadow-sm ring-1 ring-emerald-500'
                    : 'border-line hover:border-line bg-paper'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-ink">Complete Overhaul</span>
                  <span className="text-base font-extrabold text-accent font-mono">$25</span>
                </div>
                <p className="text-xs text-muted mt-1.5 leading-snug">
                  Complete resume rewrite + tailored alignment for 1 dream job + editable Word DOCX + LinkedIn profile optimization.
                </p>
              </div>
            </div>
          </div>

          {/* Dream Job URL / Company */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink flex items-center justify-between">
              <span>Target Role & Company URL (Optional)</span>
              <span className="text-[11px] text-muted/80 font-normal">e.g. Google, Revolut, Pathao</span>
            </label>
            <input
              type="text"
              value={targetJobUrl}
              onChange={(e) => setTargetJobUrl(e.target.value)}
              placeholder="https://jobs.lever.co/company/job-title or Job Description"
              className="w-full px-3 py-2 text-xs border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Personal Questions / Specific Concerns */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink">
              Specific Goals or Career Questions for Your Consultant
            </label>
            <textarea
              rows={3}
              value={careerGoalsNotes}
              onChange={(e) => setCareerGoalsNotes(e.target.value)}
              placeholder="e.g. I have a 1-year employment gap; I am transitioning from QA to backend engineering; I want to ensure my resume beats European ATS systems..."
              className="w-full px-3 py-2 text-xs border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Guarantee Badges */}
          <div className="bg-soft border border-line rounded-lg p-3 space-y-1.5">
            <div className="text-xs font-medium text-ink flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent" />
              100% Satisfaction Guarantee
            </div>
            <ul className="text-[11px] text-muted space-y-1">
              <li className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-accent" />
                Reviewed by a senior technical developer, not an automated generic bot.
              </li>
              <li className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-accent" />
                Delivered within 24 hours with 1 complimentary revision cycle.
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-muted hover:text-ink font-medium px-3 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-ink hover:bg-ink text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              Proceed to Consultation Details ({selectedTier === 'starter' ? '$10' : '$25'})
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
