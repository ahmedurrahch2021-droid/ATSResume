/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChecklistModal } from './components/ChecklistModal';
import { HomePage } from './pages/HomePage';
import { TemplatesPage } from './pages/TemplatesPage';
import { PricingPage } from './pages/PricingPage';
import { ExamplesPage } from './pages/ExamplesPage';
import { FreeScorePage } from './pages/FreeScorePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { OrderPage } from './pages/OrderPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [checklistModalOpen, setChecklistModalOpen] = useState<boolean>(false);
  const [orderPackageId, setOrderPackageId] = useState<'starter' | 'boost' | 'full'>('boost');
  const [preloadedOrderData, setPreloadedOrderData] = useState<{ resume: string; jd: string } | undefined>(undefined);

  const handleNavigate = (route: PageRoute) => {
    setCurrentPage(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOrder = (
    packageId: 'starter' | 'boost' | 'full' = 'boost',
    preloadedData?: { resume: string; jd: string }
  ) => {
    setOrderPackageId(packageId);
    if (preloadedData) {
      setPreloadedOrderData(preloadedData);
    }
    setCurrentPage('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-emerald-600 selection:text-white">
      {/* Sticky Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handleNavigate}
        onOpenOrder={(pkg) => handleOpenOrder(pkg || 'starter')}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
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
          />
        )}

        {currentPage === 'pricing' && (
          <PricingPage
            onSelectPlan={(pkg) => handleOpenOrder(pkg)}
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

        {currentPage === 'order' && (
          <OrderPage
            initialPackageId={orderPackageId}
            preloadedData={preloadedOrderData}
            onBackToPricing={() => handleNavigate('pricing')}
          />
        )}
      </main>

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
    </div>
  );
}

