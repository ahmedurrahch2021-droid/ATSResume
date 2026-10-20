import React, { useState } from 'react';
import { PageRoute } from '../types';
import { 
  FileText, 
  Menu, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  SearchCheck
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  onOpenOrder: (packageId?: 'starter' | 'boost' | 'full') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, onOpenOrder }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; route: PageRoute; highlight?: boolean }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Pricing', route: 'pricing' },
    { label: 'Examples', route: 'examples' },
    { label: 'How It Works', route: 'how-it-works' },
    { label: 'Free ATS Checker', route: 'free-resume-score', highlight: true },
    { label: 'About', route: 'about' },
    { label: 'FAQ', route: 'faq' },
    { label: 'Contact', route: 'contact' },
  ];

  const handleNav = (route: PageRoute) => {
    setCurrentPage(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A] border-b border-slate-800 text-white shadow-md">
      {/* Top micro-trust announcement bar */}
      <div className="bg-slate-900/90 text-xs text-slate-300 py-1.5 px-4 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Guaranteed 24-Hour Delivery
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              100% Money-Back Guarantee
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="text-amber-400 font-medium">Limited slots: 4 remaining this week</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Payment via PayPal & UPI</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button 
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-lg tracking-tight text-white">
                  Resume<span className="text-blue-400">Revive</span>
                </span>
                <span className="text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                  AI + Human QA
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                Your Career, Rebuilt. Professionally.
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold'
                      : item.highlight
                      ? 'text-emerald-300 hover:text-emerald-200 hover:bg-slate-800/60 flex items-center gap-1'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {item.highlight && <SearchCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Button & Mobile toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenOrder('starter')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs sm:text-sm rounded-lg transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.98]"
            >
              <span>Build My Resume — $10</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const isActive = currentPage === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-left ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.highlight && <SearchCheck className="w-4 h-4 text-emerald-400" />}
                  {item.label}
                </span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrder('boost');
              }}
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm rounded-lg flex items-center justify-center gap-2 shadow-md"
            >
              <span>Start My Resume Now ($10–$35)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
