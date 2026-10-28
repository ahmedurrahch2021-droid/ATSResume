import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  ArrowRight,
  ChevronDown,
  FileText,
  Globe,
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
import { trapDialogFocus } from '../utils/dialogFocus';

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
        description: 'Live A4 canvas, layout and region controls, DOCX and PDF export.',
        route: 'suite' as PageRoute,
        icon: <FileText className="h-4 w-4" />,
      },
      {
        label: 'Templates',
        description: 'Starting points for an editable, single-column resume.',
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
        description: 'Inspect the text and fields our reader extracts.',
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
        label: 'Country & layout guides',
        description: 'Application context, photo choices and template sources.',
        route: 'country-guides',
        icon: <Globe className="h-4 w-4" aria-hidden="true" />,
      },
      {
        label: 'Resume examples',
        description: 'Illustrative before-and-after wording by role.',
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

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onOpenAuth, userAccount, onSignOut }) => {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileDialogRef = useRef<HTMLDialogElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const isCurrent = (route: PageRoute) => ROUTE_PATHS[currentPage] === ROUTE_PATHS[route];

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    };
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onBreakpointChange = () => {
      setOpenGroup(null);
      if (desktop.matches) setMobileOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    desktop.addEventListener('change', onBreakpointChange);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      desktop.removeEventListener('change', onBreakpointChange);
    };
  }, []);

  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const dialog = mobileDialogRef.current;
    if (!dialog) return;
    if (!mobileOpen) {
      if (dialog.open) dialog.close();
      return;
    }
    // The native top layer escapes the header's backdrop-filter containing
    // block, makes the page inert and keeps keyboard focus in the menu.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLButtonElement>('[aria-label="Close menu"]')?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [mobileOpen]);

  const closeAll = () => {
    setOpenGroup(null);
    setMobileOpen(false);
  };

  return (
    <>
    <header className="sticky top-0 z-[100] border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-page">
        <div className="flex min-h-[72px] items-center justify-between gap-2 sm:gap-4">
          {/* Wordmark */}
          <Link
            to={ROUTE_PATHS.home}
            onClick={closeAll}
            className="flex min-h-11 shrink-0 items-center gap-2.5"
          >
            <span className="grid h-8 w-8 place-items-center rounded-[7px] border border-accent-line bg-accent-soft text-[13px] font-semibold text-accent">
              AR
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-ink">
              ATS Resume <span className="font-normal text-muted">Lab</span>
            </span>
            <span className="sr-only">— home</span>
          </Link>

          {/* Desktop navigation */}
          <nav ref={navRef} aria-label="Main navigation" className="hidden items-center gap-0.5 lg:flex">
            {GROUPS.map((group) =>
              group.items ? (
                <div
                  key={group.id}
                  className="relative"
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenGroup(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setOpenGroup(null);
                      event.currentTarget.querySelector('button')?.focus();
                    }
                  }}
                >
                  <button
                    type="button"
                    id={`nav-trigger-${group.id}`}
                    aria-expanded={openGroup === group.id}
                    aria-controls={`nav-links-${group.id}`}
                    onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        setOpenGroup(group.id);
                        requestAnimationFrame(() => document.querySelector<HTMLAnchorElement>(`#nav-links-${group.id} a`)?.focus());
                      }
                    }}
                    className={[
                      'inline-flex min-h-11 items-center gap-1.5 rounded-btn px-3 text-sm font-medium transition-colors',
                      openGroup === group.id || group.items.some((item) => isCurrent(item.route)) ? 'bg-soft text-ink' : 'text-muted hover:bg-soft hover:text-ink',
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
                    <div id={`nav-links-${group.id}`} aria-labelledby={`nav-trigger-${group.id}`} className="absolute left-1/2 top-[calc(100%+8px)] w-[min(420px,calc(100vw-32px))] -translate-x-1/2 rounded-card border border-line bg-surface p-2 shadow-lift">
                      {group.items.map((item) => (
                        <Link
                          key={item.route}
                          to={ROUTE_PATHS[item.route]}
                          onClick={closeAll}
                          aria-current={isCurrent(item.route) ? 'page' : undefined}
                          className="flex min-h-11 items-start gap-3 rounded-input px-3 py-2.5 transition-colors hover:bg-soft aria-[current=page]:bg-accent-soft"
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
                  aria-current={isCurrent(group.route as PageRoute) ? 'page' : undefined}
                  className="inline-flex min-h-11 items-center rounded-btn px-3 text-sm font-medium text-muted transition-colors hover:bg-soft hover:text-ink aria-[current=page]:bg-soft aria-[current=page]:text-ink"
                >
                  {group.label}
                </Link>
              ),
            )}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            {userAccount?.isLoggedIn ? (
              <>
                <Link
                  to={ROUTE_PATHS.suite}
                  onClick={closeAll}
                    className="hidden min-h-11 items-center gap-2 rounded-btn border border-line bg-surface px-3 text-sm font-medium text-ink transition-colors hover:border-accent-line hover:bg-soft xl:inline-flex"
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
                <button type="button" onClick={onSignOut} className="btn btn-ghost hidden sm:inline-flex">
                  Clear profile
                </button>
              </>
            ) : (
              <button type="button" onClick={onOpenAuth} className="btn btn-ghost hidden sm:inline-flex">
                Local profile
              </button>
            )}

            <Link
              to={ROUTE_PATHS['free-resume-score']}
              onClick={closeAll}
              className="btn btn-primary hidden sm:inline-flex"
            >
              Check my resume
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <button
              type="button"
              ref={mobileTriggerRef}
              onClick={() => { setOpenGroup(null); setMobileOpen(true); }}
              aria-label="Open menu"
              aria-controls="mobile-navigation"
              aria-haspopup="dialog"
              aria-expanded={mobileOpen}
              className="grid h-11 w-11 place-items-center rounded-[8px] border border-line bg-surface text-ink lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </header>

      {/* Mobile sheet */}
      <dialog
        ref={mobileDialogRef}
        id="mobile-navigation"
        aria-labelledby="mobile-navigation-title"
        className="mobile-nav-dialog"
        onKeyDown={trapDialogFocus}
        onCancel={() => setMobileOpen(false)}
        onClose={() => {
          // Ignore a queued close event if the menu has already reopened.
          if (!mobileDialogRef.current?.open) setMobileOpen(false);
        }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setMobileOpen(false);
        }}
      >
          <div className="mobile-nav-layout">
            <div className="mobile-nav-heading flex min-h-[72px] shrink-0 items-center justify-between border-b border-line px-5">
              <h2 id="mobile-navigation-title" className="text-base">Menu</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-[8px] border border-line bg-surface text-ink"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mobile-nav-content">
            <nav aria-label="Mobile navigation" className="px-5 py-4">
              {GROUPS.map((group) =>
                group.items ? (
                  <div key={group.id} className="mb-5">
                    <h3 className="eyebrow mb-2">{group.label}</h3>
                    <div className="space-y-1">
                      {group.items.map((item) => (
                        <Link
                          key={item.route}
                            to={ROUTE_PATHS[item.route]}
                            onClick={closeAll}
                            aria-current={isCurrent(item.route) ? 'page' : undefined}
                            className="flex min-h-11 items-center justify-between gap-3 rounded-input px-3 py-3 text-sm font-medium text-ink transition-colors hover:bg-soft aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent"
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
                    aria-current={isCurrent(group.route as PageRoute) ? 'page' : undefined}
                    className="mb-2 flex min-h-11 items-center justify-between gap-3 rounded-input px-3 py-3 text-sm font-medium text-ink transition-colors hover:bg-soft aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent"
                  >
                    {group.label}
                    <ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" />
                  </Link>
                ),
              )}
            </nav>

            <div className="mobile-nav-actions space-y-2 border-t border-line bg-paper p-5">
              <Link
                to={ROUTE_PATHS['free-resume-score']}
                onClick={closeAll}
                className="btn btn-primary w-full"
              >
                Check my resume free
              </Link>
              {userAccount?.isLoggedIn ? (
                <button type="button" className="btn btn-secondary w-full" onClick={() => { closeAll(); onSignOut(); }}>Clear local profile</button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenAuth();
                  }}
                  className="btn btn-secondary w-full"
                >
                  Local profile
                </button>
              )}
            </div>
            </div>
          </div>
      </dialog>
    </>
  );
};
