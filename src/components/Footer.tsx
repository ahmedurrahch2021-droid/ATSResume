import React from 'react';
import { PageRoute } from '../types';
import { Link } from 'react-router';
import { ROUTE_PATHS } from '../routes';
import { ShieldCheck, Clock, CheckCircle2, FileDown, Sparkles, PenTool, HelpCircle, TrendingUp } from 'lucide-react';
import { EmailSubscriptionBox } from './EmailSubscriptionBox';

interface FooterProps {
  setCurrentPage: (page: PageRoute) => void;
  onOpenChecklist: () => void;
  onOpenOrder: (packageId?: 'starter' | 'boost' | 'full') => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, onOpenChecklist, onOpenOrder }) => {
  // The link itself navigates (real <a href>). This only scrolls.
  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 text-sm">
      {/* Email newsletter & free guide capture */}
      <div className="border-b border-slate-200/80 py-10 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <EmailSubscriptionBox variant="banner" />
        </div>
      </div>

      {/* Upper trust strip */}
      <div className="border-b border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 bg-slate-50/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-50 text-[#C82333] mt-0.5 border border-red-100 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-900 font-semibold text-sm">24-Hour Guaranteed Turnaround</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Personalized rewrite delivered in printable vector PDF & editable Word (.docx).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-50 text-[#C82333] mt-0.5 border border-red-100 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-900 font-semibold text-sm">100% Money-Back Guarantee</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Free revision rounds included. If our draft fails to earn interview callbacks, instant refund.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-50 text-[#C82333] mt-0.5 border border-red-100 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-slate-900 font-semibold text-sm">Senior Tech Recruiter & Dev QA</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Zero robotic AI hallucinations. Every resume passes Workday, Greenhouse, Taleo, and Lever.
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
              <div className="w-8 h-8 rounded-lg bg-[#C82333] flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-heading font-black text-xl tracking-tight text-slate-900">
                ATS <span className="text-[#C82333]">Resume Maker</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Algorithmic resume optimization, live printable vector PDF builder, and expert human review for global job markets.
            </p>
            <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-100 text-xs text-slate-700 space-y-1">
              <p className="font-semibold text-[#C82333] flex items-center gap-1.5">
                <span>🇧🇩</span> Bangladesh Talent Initiative
              </p>
              <p className="text-[11px] text-slate-600">
                100% Free Forever DIY builder, ATS scanner, and unlimited vector PDF downloads for all Bangladeshi job seekers.
              </p>
            </div>
            <div className="text-xs text-slate-500 space-y-0.5">
              <p className="font-medium text-slate-700">Founder Direct Support:</p>
              <p>ahmedur.rahch2021@gmail.com · 24/7 Monitoring</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs uppercase font-bold text-slate-900 tracking-wider mb-3">
              Tools & Builder
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={ROUTE_PATHS['editor']} onClick={handleNavClick} className="text-[#C82333] font-bold hover:text-[#A71D2A] transition-colors flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Live CV Editor (Free PDF)</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['templates']} onClick={handleNavClick} className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1">
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Free ATS Templates & Gallery</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['cover-letter']} onClick={handleNavClick} className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C82333]" />
                  <span>Cover Letter Studio (NEW)</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['free-resume-score']} onClick={handleNavClick} className="hover:text-slate-900 transition-colors">
                  Free ATS Resume Score Scanner
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['suite']} onClick={handleNavClick} className="hover:text-slate-900 transition-colors">
                  Job Matcher & Gap Analysis
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['examples']} onClick={handleNavClick} className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                  <span>Resume Examples & Before/After</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['pricing']} onClick={handleNavClick} className="hover:text-slate-900 transition-colors">
                  Pricing Plans ($10 / $25 / $35)
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Guides */}
          <div>
            <h5 className="text-xs uppercase font-bold text-slate-900 tracking-wider mb-3">
              Trust & Transparency
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={ROUTE_PATHS['how-it-works']} onClick={handleNavClick} className="hover:text-slate-900 transition-colors">
                  How The 4-Step Process Works
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['about']} onClick={handleNavClick} className="hover:text-slate-900 transition-colors">
                  About Senior Developer Founder
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['faq']} onClick={handleNavClick} className="text-slate-900 hover:text-[#C82333] font-semibold transition-colors flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#C82333]" />
                  <span>Frequently Asked Questions (FAQ)</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['contact']} onClick={handleNavClick} className="hover:text-slate-900 transition-colors">
                  Direct Contact & Support
                </Link>
              </li>
              <li>
                <button onClick={onOpenChecklist} className="text-[#C82333] hover:text-[#A71D2A] font-semibold transition-colors">
                  Download Free 25-Point Checklist
                </button>
              </li>
              <li>
                <span className="text-slate-400">100% Privacy — Never Shared or Sold</span>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase font-bold text-slate-900 tracking-wider">
              1-on-1 Personalized Review
            </h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              Want a senior recruiter to overhaul your resume personally? Includes unlimited revisions.
            </p>
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-700">
                <span>Starter 1-on-1 Review</span>
                <span className="font-bold text-[#C82333]">$10</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-700">
                <span>Career Boost (Most Popular)</span>
                <span className="font-bold text-[#C82333]">$25</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-700">
                <span>Full Career + LinkedIn</span>
                <span className="font-bold text-[#C82333]">$35</span>
              </div>
            </div>
            <button
              onClick={() => onOpenOrder('boost')}
              className="w-full py-2.5 bg-[#C82333] hover:bg-[#A71D2A] text-white font-semibold text-xs rounded-xl transition-all shadow-sm active:scale-[0.99]"
            >
              Order 1-on-1 Human Overhaul
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 ATS Resume Maker. All rights reserved. ATS-verified resume templates & career optimization.</p>
          <div className="flex items-center gap-4">
            <Link to={ROUTE_PATHS['faq']} onClick={handleNavClick} className="hover:text-slate-800">Privacy Policy</Link>
            <span>·</span>
            <Link to={ROUTE_PATHS['faq']} onClick={handleNavClick} className="hover:text-slate-800">Terms of Service</Link>
            <span>·</span>
            <Link to={ROUTE_PATHS['faq']} onClick={handleNavClick} className="hover:text-slate-800">Money-Back Guarantee</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

