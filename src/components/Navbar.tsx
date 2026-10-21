import React, { useState } from 'react';
import { PageRoute } from '../types';
import { 
  Menu, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  SearchCheck,
  FileDown
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  onOpenOrder: (packageId?: 'starter' | 'boost' | 'full') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, onOpenOrder }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; route: PageRoute; highlight?: boolean; badge?: string }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Free Templates', route: 'templates', badge: 'FREE' },
    { label: 'Pricing', route: 'pricing' },
    { label: 'Examples', route: 'examples' },
    { label: 'Free ATS Checker', route: 'free-resume-score', highlight: true },
    { label: 'How It Works', route: 'how-it-works' },
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-900 shadow-xs">
      {/* Top micro-trust announcement bar with light editorial tone */}
      <div className="bg-slate-50 text-xs text-slate-600 py-1.5 px-4 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Guaranteed 24-Hour Turnaround
            </span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Money-Back Guarantee
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="text-emerald-700 font-medium">Free ATS Single-Column Templates Available</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Visa, Mastercard, PayPal & UPI</span>
          </div>
        </div>
      </div>

      {/* Main navigation: Strict 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Wordmark with Verified ATS Emblem */}
          <button 
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 text-left group focus:outline-none whitespace-nowrap shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-black text-xl tracking-tight text-emerald-700">
                ATS<span className="text-slate-900 font-bold">resume</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mb-1" />
            </div>
          </button>

          {/* Zone 2: 4-5 Clean single-line Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : item.highlight
                      ? 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 flex items-center gap-1 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.highlight && <SearchCheck className="w-3.5 h-3.5 text-emerald-600" />}
                  {item.badge && (
                    <span className="mr-1 text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                      {item.badge}
                    </span>
                  )}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action & Mobile Menu Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenOrder('starter')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <span>Build My Resume — $10</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Clean Light Theme) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200 shadow-lg">
          {navItems.map((item) => {
            const isActive = currentPage === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : item.highlight
                    ? 'text-emerald-700 bg-emerald-50/60 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.highlight && <SearchCheck className="w-4 h-4 text-emerald-600" />}
                  {item.route === 'templates' && <FileDown className="w-4 h-4 text-emerald-600" />}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrder('starter');
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Build My Resume — $10</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
