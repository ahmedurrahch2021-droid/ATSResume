import React, { useState, useRef, useEffect } from 'react';
import { PageRoute } from '../types';
import { Link } from 'react-router';
import { ROUTE_PATHS } from '../routes';
import { 
  Menu, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  ChevronDown,
  PenTool,
  FileText,
  FileDown,
  SearchCheck,
  Target,
  TrendingUp,
  Sparkles
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
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileToolsExpanded, setMobileToolsExpanded] = useState(true);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close mega menu on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMegaMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 150);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Primary top-level links (decluttered: no raw FAQ or Examples in top row)
  const primaryLinks: { label: string; route: PageRoute }[] = [
    { label: 'Pricing', route: 'pricing' },
    { label: 'How It Works', route: 'how-it-works' },
    { label: 'About', route: 'about' },
    { label: 'Contact', route: 'contact' },
  ];

  interface NavToolItem {
    title: string;
    description: string;
    route: PageRoute;
    badge?: string;
    icon: React.ReactNode;
    iconBg: string;
  }

  // Tools & Builders Mega Menu Items
  const creationTools: NavToolItem[] = [
    {
      title: 'Live CV Editor',
      description: 'Dual-mode in-browser builder with real-time scoring and vector PDF export.',
      route: 'suite' as PageRoute,
      badge: 'FREE',
      icon: <PenTool className="w-4 h-4 text-accent" />,
      iconBg: 'bg-soft border-red-100',
    },
    {
      title: 'Cover Letter Studio',
      description: 'Targeted matching letterhead, modular cards, and Word (.docx) export.',
      route: 'cover-letter' as PageRoute,
      badge: 'NEW',
      icon: <FileText className="w-4 h-4 text-accent" />,
      iconBg: 'bg-soft border-emerald-100',
    },
    {
      title: 'Free ATS Resume Templates',
      description: 'Single-column formats verified against Workday, Greenhouse & Lever.',
      route: 'templates' as PageRoute,
      icon: <FileDown className="w-4 h-4 text-blue-700" />,
      iconBg: 'bg-blue-50 border-blue-100',
    },
  ];

  const diagnosticTools: NavToolItem[] = [
    {
      title: 'ATS Resume Score Scanner',
      description: 'Instant 27-point multi-vector audit checking format, keywords & metrics.',
      route: 'free-resume-score' as PageRoute,
      icon: <SearchCheck className="w-4 h-4 text-purple-700" />,
      iconBg: 'bg-purple-50 border-purple-100',
    },
    {
      title: 'Job Description Matcher',
      description: 'Paste any job posting to compute semantic keyword alignment & gap analysis.',
      route: 'suite' as PageRoute,
      icon: <Target className="w-4 h-4 text-amber-700" />,
      iconBg: 'bg-amber-50 border-amber-100',
    },
    {
      title: 'Before & After Examples',
      description: 'Role-by-role resume transformations and verified callback case studies.',
      route: 'examples' as PageRoute,
      icon: <TrendingUp className="w-4 h-4 text-ink/90" />,
      iconBg: 'bg-slate-100 border-line',
    },
  ];

  const isToolsActive = ['suite', 'editor', 'cover-letter', 'templates', 'free-resume-score', 'examples'].includes(currentPage);

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-md border-b border-line text-ink shadow-xs">
      {/* Main navigation: Clean, spacious bar with expanded height */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark with Verified ATS Emblem in Editorial Red */}
          <Link to={ROUTE_PATHS['home']} 
            onClick={handleNavClick}
            className="flex items-center gap-2.5 text-left group focus:outline-none whitespace-nowrap shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-xs group-hover:bg-accent/90 transition-colors">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-black text-2xl tracking-tight text-accent">
                ATS <span className="text-ink font-bold">Resume Maker</span>
              </span>
            </div>
          </Link>

          {/* Zone 2: Decluttered Nav with Senior Mega Menu Trigger */}
          <nav className="hidden lg:flex items-center gap-2">
            {/* Mega Menu Dropdown Container */}
            <div 
              ref={megaMenuRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                aria-expanded={megaMenuOpen}
                aria-haspopup="true"
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 focus:outline-none ${
                  isToolsActive || megaMenuOpen
                    ? 'bg-soft text-accent font-bold border border-line'
                    : 'text-ink/90 hover:text-ink hover:bg-soft border border-transparent'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Tools & Builders</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180 text-accent' : 'text-muted/60'}`} />
              </button>

              {/* Two-Column Rich Mega Menu Panel */}
              {megaMenuOpen && (
                <div 
                  className="absolute left-0 mt-2 w-[720px] bg-paper rounded-2xl border border-line/90 shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  role="menu"
                >
                  <div className="grid grid-cols-2 gap-6">
                    {/* Column 1: Creation & Editors */}
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted/60">
                          Creation & Editors
                        </span>
                      </div>
                      <div className="space-y-1">
                        {creationTools.map((tool) => (
                          <Link
                            key={tool.title}
                            to={ROUTE_PATHS[tool.route]}
                            onClick={handleNavClick}
                            role="menuitem"
                            className="p-3 rounded-xl hover:bg-soft transition-all flex items-start gap-3 group border border-transparent hover:border-line/80"
                          >
                            <div className={`p-2 rounded-lg border ${tool.iconBg} mt-0.5 shrink-0 group-hover:scale-105 transition-transform`}>
                              {tool.icon}
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-heading font-bold text-xs text-ink group-hover:text-accent transition-colors">
                                  {tool.title}
                                </span>
                                {tool.badge && (
                                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-soft text-accent border border-line">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted/80 leading-relaxed line-clamp-2">
                                {tool.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Diagnostics & Insights */}
                    <div>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted/60">
                          Diagnostics & Analysis
                        </span>
                      </div>
                      <div className="space-y-1">
                        {diagnosticTools.map((tool) => (
                          <Link
                            key={tool.title}
                            to={ROUTE_PATHS[tool.route]}
                            onClick={handleNavClick}
                            role="menuitem"
                            className="p-3 rounded-xl hover:bg-soft transition-all flex items-start gap-3 group border border-transparent hover:border-line/80"
                          >
                            <div className={`p-2 rounded-lg border ${tool.iconBg} mt-0.5 shrink-0 group-hover:scale-105 transition-transform`}>
                              {tool.icon}
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-heading font-bold text-xs text-ink group-hover:text-accent transition-colors">
                                  {tool.title}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted/80 leading-relaxed line-clamp-2">
                                {tool.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mega Menu Footer Callout */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-muted/80 bg-soft/70 -mx-6 -mb-6 p-4 rounded-b-2xl">
                    <span className="flex items-center gap-1.5 font-medium text-ink/90">
                      <span>🇧🇩</span> Bangladesh Talent Initiative: 100% Free Forever DIY builder & downloads.
                    </span>
                    <Link
                      to={ROUTE_PATHS['free-resume-score']}
                      onClick={handleNavClick}
                      className="font-bold text-accent hover:text-[#A71D2A] flex items-center gap-1 transition-colors"
                    >
                      <span>Check Score Free</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Clean Primary Links */}
            {primaryLinks.map((item) => {
              const isActive = currentPage === item.route;
              return (
                <Link 
                  to={ROUTE_PATHS[item.route]}
                  key={item.route}
                  onClick={handleNavClick}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-soft text-accent font-bold border border-line'
                      : 'text-ink/90 hover:text-ink hover:bg-soft'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Account Status & Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {userAccount?.isLoggedIn ? (
              <div className="flex items-center gap-2 bg-soft border border-line py-1.5 px-3 rounded-xl text-xs">
                {userAccount.photoUrl && (
                  <img src={userAccount.photoUrl} alt="" className="w-5 h-5 rounded-full" />
                )}
                <div className="hidden sm:block text-left leading-none">
                  <span className="font-semibold text-ink block text-[11px] truncate max-w-[100px]">
                    {userAccount.displayName.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-accent font-medium">
                    {userAccount.isBangladeshTalentPass ? '🇧🇩 Free Forever' : '1 Free CV'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="text-muted/60 hover:text-muted text-[10px] ml-1 font-medium hover:underline"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-line text-ink/90 hover:bg-soft transition-colors whitespace-nowrap shrink-0"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => onOpenOrder('starter')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent/90 text-white font-bold text-xs rounded-xl transition-all shadow-xs active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <span>Review — $10</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-muted hover:text-ink hover:bg-soft focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Clean Light Theme with Grouped Sections) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-paper border-b border-line px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 shadow-lg max-h-[calc(100vh-80px)] overflow-y-auto">
          {/* Tools & Builders Accordion */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setMobileToolsExpanded(!mobileToolsExpanded)}
              className="w-full flex items-center justify-between py-2 text-xs font-bold uppercase tracking-wider text-muted/80 border-b border-slate-100"
            >
              <span className="flex items-center gap-1.5 text-ink font-bold">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Tools & Builders
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileToolsExpanded ? 'rotate-180 text-accent' : 'text-muted/60'}`} />
            </button>

            {mobileToolsExpanded && (
              <div className="space-y-1 pt-1.5 pl-2">
                {[...creationTools, ...diagnosticTools].map((tool) => (
                  <Link
                    key={tool.title}
                    to={ROUTE_PATHS[tool.route]}
                    onClick={handleNavClick}
                    className="w-full text-left p-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between text-ink/90 hover:bg-soft"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded border ${tool.iconBg} shrink-0`}>
                        {tool.icon}
                      </div>
                      <span className="font-semibold">{tool.title}</span>
                    </div>
                    {tool.badge && (
                      <span className="text-[9px] uppercase font-bold text-accent bg-soft border border-line px-1.5 py-0.2 rounded">
                        {tool.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Primary Links */}
          <div className="pt-2 space-y-1 border-t border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted/60 px-2 py-1">
              General
            </div>
            {primaryLinks.map((item) => {
              const isActive = currentPage === item.route;
              return (
                <Link 
                  to={ROUTE_PATHS[item.route]}
                  key={item.route}
                  onClick={handleNavClick}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-soft text-accent font-bold'
                      : 'text-ink/90 hover:bg-soft'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrder('starter');
              }}
              className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>1-on-1 Review — $10</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
