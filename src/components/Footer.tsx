import React from 'react';
import { PageRoute } from '../types';
import { FileText, ShieldCheck, Clock, CheckCircle2, Mail, ExternalLink } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: PageRoute) => void;
  onOpenChecklist: () => void;
  onOpenOrder: (packageId?: 'starter' | 'boost' | 'full') => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, onOpenChecklist, onOpenOrder }) => {
  const handleNav = (route: PageRoute) => {
    setCurrentPage(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1120] text-slate-400 border-t border-slate-800 text-sm">
      {/* Upper trust strip */}
      <div className="border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-slate-800/80 text-emerald-400 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">24-Hour Guaranteed Turnaround</h4>
              <p className="text-xs text-slate-400 mt-1">
                Delivered straight to your inbox in both ready-to-send PDF and fully editable Microsoft Word (.docx).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-slate-800/80 text-blue-400 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Money-Back Guarantee</h4>
              <p className="text-xs text-slate-400 mt-1">
                Free revision round included. If you are not completely satisfied, email us for a full immediate refund.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-slate-800/80 text-amber-400 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Senior Developer Human QA</h4>
              <p className="text-xs text-slate-400 mt-1">
                Zero AI hallucinations or robotic templates. Personally edited twice for technical accuracy and recruiter impact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-lg text-white">
                Resume<span className="text-blue-400">Revive</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your Career, Rebuilt. Professionally. Combining AI generation speed with senior web developer human review to get you interviews.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <a href="mailto:hello@resumerevive.ai" className="hover:text-white transition-colors">
                  hello@resumerevive.ai
                </a>
              </p>
              <p className="text-[11px] text-slate-400">
                Support response: under 2 hours
              </p>
            </div>
          </div>

          {/* Quick Pages */}
          <div>
            <h5 className="text-xs uppercase font-semibold text-white tracking-wider mb-3">
              Explore Service
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-white transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('pricing')} className="hover:text-white transition-colors">
                  Transparent Pricing ($10–$35)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('examples')} className="hover:text-white transition-colors">
                  Before & After Transformations
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-it-works')} className="hover:text-white transition-colors">
                  How It Works (4 Steps)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('free-resume-score')} className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  Free ATS Score Scanner
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Trust */}
          <div>
            <h5 className="text-xs uppercase font-semibold text-white tracking-wider mb-3">
              Trust & Transparency
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors">
                  About Developer Founder
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors">
                  Direct Contact & Support
                </button>
              </li>
              <li>
                <button onClick={onOpenChecklist} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Download Free 25-Point Checklist
                </button>
              </li>
              <li>
                <span className="text-slate-400">100% Privacy — Never Shared With Third Parties</span>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase font-semibold text-white tracking-wider">
              Secure Checkout & Fulfillment
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              We accept VISA, MasterCard, international PayPal payments, and UPI (PhonePe / GPay) for Indian applicants.
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Starter Package</span>
                <span className="font-semibold text-emerald-400">$10</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Career Boost (Most Popular)</span>
                <span className="font-semibold text-emerald-400">$25</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Full Career Package</span>
                <span className="font-semibold text-emerald-400">$35</span>
              </div>
            </div>
            <button
              onClick={() => onOpenOrder('boost')}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs rounded-md transition-colors"
            >
              Order Your Resume Now
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 ResumeRevive. All rights reserved. ATS-optimized resume & career positioning.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => handleNav('faq')} className="hover:text-slate-400">Privacy Policy</button>
            <span>·</span>
            <button onClick={() => handleNav('faq')} className="hover:text-slate-400">Terms of Service</button>
            <span>·</span>
            <button onClick={() => handleNav('faq')} className="hover:text-slate-400">Money-Back Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
