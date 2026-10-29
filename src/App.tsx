/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { PageRoute, type ServicePricingRegion } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChecklistModal } from './components/ChecklistModal';
import { HomePage } from './pages/HomePage';
import { PageErrorBoundary } from './components/PageErrorBoundary';
import { UserAccount, INITIAL_GUEST_ACCOUNT } from './types/auth';
import { AuthModal } from './components/AuthModal';
import { useLocation, useNavigate } from 'react-router';
import { ROUTE_META, ROUTE_PATHS, routeFromPath } from './routes';
import { type ResumeDraft } from './utils/resumeDraft';
import { editorSearch, type EditorTarget } from './utils/resumeActions';
import { GeminiChatWidget } from './components/ai/GeminiChatWidget';

// Tools and document libraries are loaded when needed, not on every phone's
// first visit. Prerender imports the page components directly, preserving HTML.
const TemplatesPage = lazy(() => import('./pages/TemplatesPage').then((module) => ({ default: module.TemplatesPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then((module) => ({ default: module.PricingPage })));
const ExamplesPage = lazy(() => import('./pages/ExamplesPage').then((module) => ({ default: module.ExamplesPage })));
const FreeScorePage = lazy(() => import('./pages/FreeScorePage').then((module) => ({ default: module.FreeScorePage })));
const SuitePage = lazy(() => import('./pages/SuitePage').then((module) => ({ default: module.SuitePage })));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage').then((module) => ({ default: module.HowItWorksPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((module) => ({ default: module.AboutPage })));
const FaqPage = lazy(() => import('./pages/FaqPage').then((module) => ({ default: module.FaqPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })));
const OrderPage = lazy(() => import('./pages/OrderPage').then((module) => ({ default: module.OrderPage })));
const CoverLetterPage = lazy(() => import('./pages/CoverLetterPage').then((module) => ({ default: module.CoverLetterPage })));
const CountryGuidesPage = lazy(() => import('./pages/CountryGuidesPage').then((module) => ({ default: module.CountryGuidesPage })));

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPage: PageRoute = routeFromPath(location.pathname);
  const [checklistModalOpen, setChecklistModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [orderPackageId, setOrderPackageId] = useState<'starter' | 'boost' | 'full'>('boost');
  const [orderUrgent, setOrderUrgent] = useState(false);
  const [orderPricingRegion, setOrderPricingRegion] = useState<ServicePricingRegion>('international');
  const [preloadedOrderData, setPreloadedOrderData] = useState<{ resume: string; jd: string } | undefined>(undefined);
  const [draftImport, setDraftImport] = useState<ResumeDraft | null>(null);

  // Prerendered HTML carries the right title, but a client-side navigation
  // would otherwise leave the previous route's title in the tab and in the
  // history entry. Keep them in step.
  useEffect(() => {
    const meta = ROUTE_META[currentPage];
    if (meta?.title) document.title = meta.title;
  }, [currentPage]);

  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // User Account state
  const [userAccount, setUserAccount] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem('atsresume_user_account');
      if (saved) {
        const account = JSON.parse(saved);
        if (account && typeof account.displayName === 'string' && typeof account.email === 'string' && typeof account.country === 'string' && Array.isArray(account.savedResumes)) return { ...account, photoUrl: undefined, isLoggedIn: account.isLoggedIn === true };
      }
    } catch {
      // fallback
    }
    return INITIAL_GUEST_ACCOUNT;
  });

  const handleLoginSuccess = (account: UserAccount) => {
    setUserAccount(account);
    try {
      localStorage.setItem('atsresume_user_account', JSON.stringify(account));
      return true;
    } catch {
      return false;
    }
  };

  const handleSignOut = () => {
    setUserAccount(INITIAL_GUEST_ACCOUNT);
    try {
      localStorage.removeItem('atsresume_user_account');
    } catch {
      // ignore
    }
  };

  const handleNavigate = (route: PageRoute) => {
    if (route === 'editor' || route === 'suite') {
      setDraftImport(null);
    }
    navigate(ROUTE_PATHS[route]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEditor = (draft: ResumeDraft, target?: EditorTarget) => {
    setDraftImport(draft);
    navigate(`${ROUTE_PATHS.editor}${editorSearch(target)}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleOpenOrder = (
    packageId: 'starter' | 'boost' | 'full' = 'boost',
    preloadedData?: { resume: string; jd: string },
    urgent = false,
    pricingRegion: ServicePricingRegion = 'international',
  ) => {
    setOrderPackageId(packageId);
    setPreloadedOrderData(preloadedData);
    setOrderUrgent(urgent);
    setOrderPricingRegion(pricingRegion);
    const selection = new URLSearchParams({ package: packageId, region: pricingRegion });
    if (urgent) selection.set('urgent', 'true');
    navigate(`${ROUTE_PATHS.order}?${selection}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans antialiased selection:bg-accent selection:text-white">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* Sticky Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handleNavigate}
        onOpenOrder={(pkg) => handleOpenOrder(pkg || 'starter')}
        userAccount={userAccount}
        onOpenAuth={() => setAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Page Routing */}
      <main id="main-content" tabIndex={-1} className="min-w-0 flex-1">
        <PageErrorBoundary key={location.pathname}>
        <Suspense fallback={<div role="status" className="container-page py-12 text-muted">Opening page…</div>}>
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenOrder={(pkg) => handleOpenOrder(pkg || 'starter')}
            onOpenChecklist={() => setChecklistModalOpen(true)}
          />
        )}

        {currentPage === 'templates' && (
          <TemplatesPage
            onNavigate={handleNavigate}
            onOpenOrder={(pkg) => handleOpenOrder(pkg || 'starter')}
            onOpenInEditor={(draft) => {
              setDraftImport(draft);
              navigate(ROUTE_PATHS.suite);
              window.scrollTo({ top: 0, behavior: 'auto' });
            }}
          />
        )}

        {(currentPage === 'suite' || currentPage === 'editor') && (
          <SuitePage
            onNavigate={handleNavigate}
            onOpenOrder={(pkg, preloaded) => handleOpenOrder(pkg || 'starter', preloaded)}
            userAccount={userAccount}
            onOpenAuth={() => setAuthModalOpen(true)}
            draftImport={draftImport}
            onConsumeInitialData={() => setDraftImport(null)}
          />
        )}

        {currentPage === 'pricing' && (
          <PricingPage
            onSelectPlan={(pkg, urgent, region) => handleOpenOrder(pkg, undefined, urgent, region)}
          />
        )}

        {currentPage === 'examples' && (
          <ExamplesPage
            onSelectPlan={(pkg) => handleOpenOrder(pkg)}
          />
        )}

        {currentPage === 'free-resume-score' && (
          <FreeScorePage
            onSelectPlan={(pkg, preloaded) => handleOpenOrder(pkg, preloaded)}
            onNavigate={handleNavigate}
            onOpenEditor={handleOpenEditor}
          />
        )}

        {currentPage === 'how-it-works' && (
          <HowItWorksPage
            onSelectPlan={(pkg) => handleOpenOrder(pkg)}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onSelectPlan={(pkg) => handleOpenOrder(pkg)}
          />
        )}

        {currentPage === 'faq' && (
          <FaqPage
            onSelectPlan={(pkg) => handleOpenOrder(pkg)}
            onNavigateContact={() => handleNavigate('contact')}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onSelectPlan={(pkg) => handleOpenOrder(pkg)}
          />
        )}

        {currentPage === 'cover-letter' && (
          <CoverLetterPage />
        )}

        {currentPage === 'country-guides' && (
          <CountryGuidesPage />
        )}

        {currentPage === 'order' && (
          <OrderPage
            initialPackageId={orderPackageId}
            initialUrgent={orderUrgent}
            initialPricingRegion={orderPricingRegion}
            preloadedData={preloadedOrderData}
            onBackToPricing={() => handleNavigate('pricing')}
          />
        )}
        <RouteAnchor hash={location.hash} />
        </Suspense>
        </PageErrorBoundary>
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        account={userAccount}
      />

      {/* Lead Magnet Checklist Modal */}
      <ChecklistModal
        isOpen={checklistModalOpen}
        onClose={() => setChecklistModalOpen(false)}
        onSelectPlan={(pkg) => handleOpenOrder(pkg)}
      />

      {/* Persistent Footer */}
      <Footer
        setCurrentPage={handleNavigate}
        onOpenChecklist={() => setChecklistModalOpen(true)}
        onOpenOrder={(pkg) => handleOpenOrder(pkg || 'boost')}
      />

      {/* Global Multi-Turn AI Career & Writing Coach */}
      <GeminiChatWidget mode="floating" />
    </div>
  );
}

/** Runs after a lazy page mounts, so new-tab country/layout links land at their section. */
function RouteAnchor({ hash }: { hash: string }) {
  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => {
      try { document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start', behavior: 'instant' }); }
      catch { /* An invalid fragment must not prevent the page opening. */ }
    });
    return () => cancelAnimationFrame(frame);
  }, [hash]);
  return null;
}
