import React from 'react';
import { PageRoute } from '../types';
import { ShieldCheck, Clock, CheckCircle2, FileDown, ArrowRight } from 'lucide-react';

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
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 text-sm">
      {/* Upper trust strip */}
      <div className="border-b border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 mt-0.5 border border-emerald-100">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-900 font-semibold text-sm">24-Hour Guaranteed Turnaround</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Delivered straight to your inbox in both print-ready PDF and fully editable Microsoft Word (.docx).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 mt-0.5 border border-emerald-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-900 font-semibold text-sm">100% Money-Back Guarantee</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Free revision round included. If our draft does not pass your standard, email us for a full immediate refund.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 mt-0.5 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-900 font-semibold text-sm">Senior Developer Human QA</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Zero AI hallucinations or robotic filler phrases. Every resume is checked twice for technical parsing and hiring manager impact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-heading font-black text-xl tracking-tight text-emerald-700">
                ATS<span className="text-slate-900 font-bold">resume</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Algorithmic resume optimization and human senior developer review. Built to pass Workday, Greenhouse, Taleo, and Lever.
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <p className="font-medium text-slate-700">Direct Support:</p>
              <p>hello@atsresume.ai · 24/7 Monitoring</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs uppercase font-bold text-slate-900 tracking-wider mb-3">
              Explore & Tools
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('templates')} className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors flex items-center gap-1">
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Free ATS Templates (.docx)</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('free-resume-score')} className="hover:text-slate-900 transition-colors">
                  Free ATS Resume Score Scanner
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('examples')} className="hover:text-slate-900 transition-colors">
                  Before & After Transformations
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('pricing')} className="hover:text-slate-900 transition-colors">
                  Pricing Plans (From $10)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-it-works')} className="hover:text-slate-900 transition-colors">
                  How The 4-Step Process Works
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div>
            <h5 className="text-xs uppercase font-bold text-slate-900 tracking-wider mb-3">
              Trust & Transparency
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-slate-900 transition-colors">
                  About Developer Founder
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq')} className="hover:text-slate-900 transition-colors">
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-slate-900 transition-colors">
                  Direct Contact & Support
                </button>
              </li>
              <li>
                <button onClick={onOpenChecklist} className="text-emerald-700 hover:text-emerald-800 font-medium transition-colors">
                  Download Free 25-Point Checklist
                </button>
              </li>
              <li>
                <span className="text-slate-400">100% Privacy — Never Shared or Resold</span>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase font-bold text-slate-900 tracking-wider">
              Secure Checkout & Fulfillment
            </h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              We accept VISA, MasterCard, PayPal, and instant UPI (PhonePe / GPay).
            </p>
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-700">
                <span>Starter Package</span>
                <span className="font-bold text-emerald-700">$10</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-700">
                <span>Career Boost (Most Popular)</span>
                <span className="font-bold text-emerald-700">$25</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-700">
                <span>Full Career Package</span>
                <span className="font-bold text-emerald-700">$35</span>
              </div>
            </div>
            <button
              onClick={() => onOpenOrder('boost')}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
            >
              Order Your Resume Now
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 ATSresume. All rights reserved. ATS-verified resume templates & career optimization.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => handleNav('faq')} className="hover:text-slate-800">Privacy Policy</button>
            <span>·</span>
            <button onClick={() => handleNav('faq')} className="hover:text-slate-800">Terms of Service</button>
            <span>·</span>
            <button onClick={() => handleNav('faq')} className="hover:text-slate-800">Money-Back Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
