import React from 'react';
import { PageRoute } from '../types';
import { Link } from 'react-router';
import { ROUTE_PATHS } from '../routes';
import { ShieldCheck, Clock, CheckCircle2, FileDown, Sparkles, PenTool, HelpCircle, TrendingUp } from 'lucide-react';
import { EmailSubscriptionBox } from './EmailSubscriptionBox';
import { PACKAGES } from '../data/mockData';
import { REPLY_POLICY, SERVICE_CONTACT } from '../data/servicePolicy';
import { formatPackagePrice } from '../utils/servicePricing';

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
    <footer className="bg-soft text-muted border-t border-line text-sm">
      {/* Email newsletter & free guide capture */}
      <div className="border-b border-line/80 py-10 px-4 sm:px-6 lg:px-8 bg-paper">
        <div className="max-w-5xl mx-auto">
          <EmailSubscriptionBox variant="banner" />
        </div>
      </div>

      {/* Upper trust strip */}
      <div className="border-b border-line/80 py-8 px-4 sm:px-6 lg:px-8 bg-soft/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-soft text-accent mt-0.5 border border-line shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-ink font-semibold text-sm">Free tools you can act on</h4>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Check your file, edit the same draft and download an editable DOCX or a PDF.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-soft text-accent mt-0.5 border border-line shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-ink font-semibold text-sm">Your draft stays in your browser</h4>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Local checking and editing require no upload to a server. You choose whether to share a file for human review.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-soft text-accent mt-0.5 border border-line shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-ink font-semibold text-sm">Specific findings, explained</h4>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                See what triggered a finding and where to edit it. This tool does not predict interviews or employer decisions.
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
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-heading font-black text-xl tracking-tight text-ink">
                ATS <span className="text-accent">Resume Lab</span>
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Read your resume’s extracted text, improve the draft and prepare a clearer job application.
            </p>
            <div className="p-2.5 rounded-xl bg-soft/70 border border-line text-xs text-ink/90 space-y-1">
              <p className="font-semibold text-accent flex items-center gap-1.5">
                <span>🇧🇩</span> Bangladesh Talent Initiative
              </p>
              <p className="text-[11px] text-muted">
                Free checking, editing and downloads for Bangladeshi job seekers and applicants elsewhere.
              </p>
            </div>
            <div className="text-xs text-muted space-y-0.5">
              <p className="font-medium text-ink/90">Founder Direct Support:</p>
              <p><a href={`mailto:${SERVICE_CONTACT.email}`} className="break-all hover:text-accent">{SERVICE_CONTACT.email}</a></p>
              <p><a href={SERVICE_CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="break-all hover:text-accent">WhatsApp: {SERVICE_CONTACT.whatsappDisplay}</a></p>
              <p>{REPLY_POLICY}</p>
              <p>Document delivery is agreed separately.</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs uppercase font-bold text-ink tracking-wider mb-3">
              Tools & Builder
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={ROUTE_PATHS['editor']} onClick={handleNavClick} className="text-accent font-bold hover:text-accent-hover transition-colors flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Live CV Editor (Free PDF)</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['templates']} onClick={handleNavClick} className="text-muted hover:text-ink transition-colors flex items-center gap-1">
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Free ATS Templates & Gallery</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['cover-letter']} onClick={handleNavClick} className="text-muted hover:text-ink transition-colors flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>Cover Letter Studio (NEW)</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['free-resume-score']} onClick={handleNavClick} className="hover:text-ink transition-colors">
                  Free Resume Checker
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['suite']} onClick={handleNavClick} className="hover:text-ink transition-colors">
                  Job Matcher & Gap Analysis
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['examples']} onClick={handleNavClick} className="text-muted hover:text-ink transition-colors flex items-center gap-1.5 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-muted" aria-hidden="true" />
                  <span>Resume Examples & Before/After</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['pricing']} onClick={handleNavClick} className="hover:text-ink transition-colors">
                  Human-help prices (BDT / USD)
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Guides */}
          <div>
            <h5 className="text-xs uppercase font-bold text-ink tracking-wider mb-3">
              Trust & Transparency
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={ROUTE_PATHS['country-guides']} onClick={handleNavClick} className="hover:text-ink transition-colors">
                  Country & layout guidance with sources
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['how-it-works']} onClick={handleNavClick} className="hover:text-ink transition-colors">
                  How The 4-Step Process Works
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['about']} onClick={handleNavClick} className="hover:text-ink transition-colors">
                  About ATS Resume Lab
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['faq']} onClick={handleNavClick} className="text-ink hover:text-accent font-semibold transition-colors flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-accent" />
                  <span>Frequently Asked Questions (FAQ)</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTE_PATHS['contact']} onClick={handleNavClick} className="hover:text-ink transition-colors">
                  Direct Contact & Support
                </Link>
              </li>
              <li>
                <Link to={`${ROUTE_PATHS.home}#feedback`} className="font-semibold text-accent hover:text-accent-hover transition-colors">
                  Leave private feedback
                </Link>
              </li>
              <li>
                <Link to={`${ROUTE_PATHS['country-guides']}#source-library`} className="hover:text-ink transition-colors">
                  Research source library
                </Link>
              </li>
              <li>
                <button onClick={onOpenChecklist} className="text-accent hover:text-accent-hover font-semibold transition-colors">
                  Open the Resume Checklist
                </button>
              </li>
              <li>
                <span className="text-muted">Local tools · optional human review</span>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase font-bold text-ink tracking-wider">
              1-on-1 Personalized Review
            </h5>
            <p className="text-xs text-muted leading-relaxed">
              Human help is paid in Bangladesh and other countries. Review the scope and confirm availability before paying.
            </p>
            <div className="p-3 rounded-xl bg-paper border border-line space-y-2">
              {PACKAGES.map((pkg) => <div key={pkg.id} className="space-y-1 text-xs text-ink"><p className="font-medium">{pkg.name}</p><p className="text-muted">Bangladesh <span className="font-semibold text-accent">{formatPackagePrice(pkg, 'bangladesh')}</span> · International <span className="font-semibold text-accent">{formatPackagePrice(pkg, 'international')}</span></p></div>)}
            </div>
            <button
              onClick={() => onOpenOrder('boost')}
              className="w-full py-2.5 bg-accent hover:bg-accent/90 text-white font-semibold text-xs rounded-xl transition-all shadow-sm active:scale-[0.99]"
            >
              Prepare a review inquiry
            </button>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© 2026 ATS Resume Lab. See what our reader sees.</p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Link to={ROUTE_PATHS['faq']} onClick={handleNavClick} className="hover:text-ink">Storage & privacy FAQ</Link>
            <span>·</span>
            <Link to={ROUTE_PATHS['faq']} onClick={handleNavClick} className="hover:text-ink">Review terms FAQ</Link>
            <span>·</span>
            <Link to={ROUTE_PATHS['contact']} onClick={handleNavClick} className="hover:text-ink">Order support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

