import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  ChevronDown,
  FileText,
  LayoutTemplate,
  Mail,
  Menu,
  ScanSearch,
  Sparkles,
  X,
} from 'lucide-react';
import { PageRoute } from '../types';
import { ROUTE_PATHS } from '../routes';
import { UserAccount } from '../types/auth';

interface NavbarProps {
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  onOpenOrder: (packageId?: 'starter' | 'boost' | 'full') => void;
  userAccount?: UserAccount;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

interface NavLink {
  label: string;
  description: string;
  route: PageRoute;
  icon: React.ReactNode;
}

interface NavGroup {
  id: string;
  label: string;
  route?: PageRoute;
  items?: NavLink[];
}

/**
 * Five navigation groups only. The breadth of the product lives in the
 * Job Kit and the workspace, never in this bar.
 */
const GROUPS: NavGroup[] = [
  {
    id: 'build',
    label: 'Build',
    items: [
      {
        label: 'Resume editor',
        description: 'Live A4 canvas, country presets, DOCX and PDF export.',
        route: 'suite' as PageRoute,
        icon: <FileText className="h-4 w-4" />,
      },
      {
        label: 'Templates',
        description: 'Nine single-column layouts, tagged by parsing safety.',
        route: 'templates' as PageRoute,
        icon: <LayoutTemplate className="h-4 w-4" />,
      },
      {
        label: 'Cover letters',
        description: 'A letter that matches the resume and the job post.',
        route: 'cover-letter' as PageRoute,
        icon: <Mail className="h-4 w-4" />,
      },
    ],
  },
  {
    id: 'check',
    label: 'Check',
    items: [
      {
        label: 'Resume checker',
        description: 'See what a parser extracts, and what a recruiter sees.',
        route: 'free-resume-score' as PageRoute,
        icon: <ScanSearch className="h-4 w-4" />,
      },
      {
        label: 'How it works',
        description: 'The method, the evidence, and the limits.',
        route: 'how-it-works' as PageRoute,
        icon: <Sparkles className="h-4 w-4" />,
      },
    ],
  },
  {
    id: 'learn',
    label: 'Learn',
    items: [
      {
        label: 'Resume examples',
        description: 'Real before-and-after rewrites by role.',
        route: 'examples' as PageRoute,
        icon: <FileText className="h-4 w-4" />,
      },
      {
        label: 'FAQ',
        description: 'The questions everyone gets wrong, answered plainly.',
        route: 'faq' as PageRoute,
        icon: <FileText className="h-4 w-4" />,
      },
      {
        label: 'About',
        description: 'Who builds this, and why it is nearly free.',
        route: 'about' as PageRoute,
        icon: <FileText className="h-4 w-4" />,
      },
    ],
  },
  { id: 'pricing', label: 'Pricing', route: 'pricing' as PageRoute },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, userAccount, onSignOut }) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenGroup(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenGroup(null), 140);
  };
  const closeAll = () => {
    setOpenGroup(null);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-page">
        <div className="flex h-[72px] items-center justify-between gap-6">
          {/* Wordmark */}
          <Link
            to={ROUTE_PATHS.home}
            onClick={closeAll}
            className="flex shrink-0 items-center gap-2.5"
            aria-label="ATS Resume Lab — home"
          >
            <span className="grid h-8 w-8 place-items-center rounded-[7px] border border-accent-line bg-accent-soft text-[13px] font-semibold text-accent">
              AR
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-ink">
              ATS Resume <span className="font-normal text-muted">Lab</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div ref={navRef} className="hidden items-center gap-0.5 lg:flex">
            {GROUPS.map((group) =>
              group.items ? (
                <div
                  key={group.id}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenGroup(group.id);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    aria-expanded={openGroup === group.id}
                    aria-haspopup="true"
                    onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
                    className={[
                      'inline-flex h-9 items-center gap-1.5 rounded-[8px] px-3 text-[13.5px] font-medium transition-colors',
                      openGroup === group.id ? 'bg-soft text-ink' : 'text-muted hover:bg-soft hover:text-ink',
                    ].join(' ')}
                  >
                    {group.label}
                    <ChevronDown
                      className={[
                        'h-3.5 w-3.5 transition-transform duration-150',
                        openGroup === group.id ? 'rotate-180' : '',
                      ].join(' ')}
                      aria-hidden="true"
                    />
                  </button>

                  {openGroup === group.id && (
                    <div className="absolute left-0 top-[calc(100%+8px)] w-[520px] rounded-[8px] border border-line bg-surface p-2 shadow-[0_8px_24px_rgba(32,33,31,0.10)]">
                      {group.items.map((item) => (
                        <Link
                          key={item.route}
                          to={ROUTE_PATHS[item.route]}
                          onClick={closeAll}
                          className="flex items-start gap-3 rounded-[6px] px-3 py-2.5 transition-colors hover:bg-soft"
                        >
                          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-[6px] border border-line bg-paper text-accent">
                            {item.icon}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[13.5px] font-medium text-ink">{item.label}</span>
                            <span className="block text-[12.5px] leading-snug text-muted">
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={group.id}
                  to={ROUTE_PATHS[group.route as PageRoute]}
                  onClick={closeAll}
                  className="inline-flex h-9 items-center rounded-[8px] px-3 text-[13.5px] font-medium text-muted transition-colors hover:bg-soft hover:text-ink"
                >
                  {group.label}
                </Link>
              ),
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {userAccount?.isLoggedIn ? (
              <>
                <Link
                  to={ROUTE_PATHS.suite}
                  onClick={closeAll}
                  className="hidden h-9 items-center gap-2 rounded-[8px] border border-line bg-surface px-3 text-[13px] font-medium text-ink transition-colors hover:border-accent-line hover:bg-soft sm:inline-flex"
                >
                  {userAccount.photoUrl ? (
                    <img src={userAccount.photoUrl} alt="" className="h-5 w-5 rounded-full object-cover" />
                  ) : (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-accent-soft text-[10px] font-semibold text-accent">
                      {userAccount.displayName?.charAt(0)?.toUpperCase() ?? 'A'}
                    </span>
                  )}
                  <span className="max-w-[120px] truncate">{userAccount.displayName?.split(' ')[0]}</span>
                </Link>
                <button type="button" onClick={onSignOut} className="btn btn-ghost h-9">
                  Sign out
                </button>
              </>
            ) : (
              <button type="button" onClick={onOpenAuth} className="btn btn-ghost h-9 hidden sm:inline-flex">
                Sign in
              </button>
            )}

            <Link
              to={ROUTE_PATHS['free-resume-score']}
              onClick={closeAll}
              className="btn btn-primary hidden h-10 sm:inline-flex"
            >
              Check my resume
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="grid h-11 w-11 place-items-center rounded-[8px] border border-line bg-surface text-ink lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 right-0 flex w-full max-w-[380px] flex-col bg-paper shadow-xl"
          >
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-line px-5">
              <span className="text-[15px] font-semibold text-ink">Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-[8px] border border-line bg-surface text-ink"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-4">
              {GROUPS.map((group) =>
                group.items ? (
                  <div key={group.id} className="mb-5">
                    <p className="eyebrow mb-2">{group.label}</p>
                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <Link
                          key={item.route}
                          to={ROUTE_PATHS[item.route]}
                          onClick={closeAll}
                          className="flex items-center justify-between rounded-[6px] px-3 py-3 text-[14px] font-medium text-ink transition-colors hover:bg-soft"
                        >
                          {item.label}
                          <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={group.id}
                    to={ROUTE_PATHS[group.route as PageRoute]}
                    onClick={closeAll}
                    className="mb-2 flex items-center justify-between rounded-[6px] px-3 py-3 text-[14px] font-medium text-ink transition-colors hover:bg-soft"
                  >
                    {group.label}
                    <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
                  </Link>
                ),
              )}
            </nav>

            <div className="shrink-0 space-y-2 border-t border-line p-5 pb-6">
              <Link
                to={ROUTE_PATHS['free-resume-score']}
                onClick={closeAll}
                className="btn btn-primary w-full"
              >
                Check my resume free
              </Link>
              {!userAccount?.isLoggedIn && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenAuth();
                  }}
                  className="btn btn-secondary w-full"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
