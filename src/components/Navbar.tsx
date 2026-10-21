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

import { UserAccount } from '../types/auth';

interface NavbarProps {
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  onOpenOrder: (packageId?: 'starter' | 'boost' | 'full') => void;
  userAccount?: UserAccount;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  onOpenOrder,
  userAccount,
  onOpenAuth,
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; route: PageRoute; highlight?: boolean; badge?: string }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Live CV Editor', route: 'suite', badge: 'EDITOR', highlight: true },
    { label: 'Free Templates', route: 'templates', badge: 'FREE' },
    { label: 'Pricing', route: 'pricing' },
    { label: 'Examples', route: 'examples' },
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 text-stone-900 shadow-xs">
      {/* Top micro-trust announcement bar with distinctive editorial tone */}
      <div className="bg-stone-50 text-xs text-stone-600 py-1.5 px-4 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-[#C82333] font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#C82333]" />
              Guaranteed 24-Hour Turnaround
            </span>
            <span className="hidden sm:inline text-stone-300">·</span>
            <span className="hidden sm:flex items-center gap-1 text-stone-600">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C82333]" />
              100% Money-Back Guarantee
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-stone-500">
            <span className="text-[#C82333] font-medium">Free Single-Column Vector ATS Templates</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Visa, Mastercard, PayPal & UPI</span>
          </div>
        </div>
      </div>

      {/* Main navigation: Strict 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Wordmark with Verified ATS Emblem in Editorial Red */}
          <button 
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 text-left group focus:outline-none whitespace-nowrap shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-[#C82333] flex items-center justify-center text-white shadow-xs group-hover:bg-[#A71D2A] transition-colors">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-black text-xl tracking-tight text-[#C82333]">
                ATS<span className="text-stone-900 font-bold">resume</span>
              </span>
            </div>
          </button>

          {/* Zone 2: Clean single-line Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.route || (item.route === 'suite' && currentPage === 'editor');
              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-red-50 text-[#C82333] font-bold border border-red-200'
                      : item.highlight
                      ? 'text-[#C82333] hover:text-[#A71D2A] hover:bg-red-50/60 flex items-center gap-1 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {item.highlight && <SearchCheck className="w-3.5 h-3.5 text-[#C82333]" />}
                  {item.badge && (
                    <span className="mr-1 text-[9px] uppercase font-bold text-[#C82333] bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                      {item.badge}
                    </span>
                  )}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Account Status & Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            {userAccount?.isLoggedIn ? (
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 py-1 px-2.5 rounded-lg text-xs">
                {userAccount.photoUrl && (
                  <img src={userAccount.photoUrl} alt="" className="w-5 h-5 rounded-full" />
                )}
                <div className="hidden sm:block text-left leading-none">
                  <span className="font-semibold text-stone-800 block text-[11px] truncate max-w-[100px]">
                    {userAccount.displayName.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#C82333] font-medium">
                    {userAccount.isBangladeshTalentPass ? '🇧🇩 Free Forever' : '1 Free CV'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="text-stone-400 hover:text-stone-600 text-[10px] ml-1 font-medium hover:underline"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors whitespace-nowrap shrink-0"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => onOpenOrder('starter')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C82333] hover:bg-[#A71D2A] text-white font-semibold text-xs rounded-lg transition-all shadow-xs active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <span>Review — $10</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none"
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
