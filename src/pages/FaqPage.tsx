import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/mockData';
import { FaqItem } from '../types';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  Mail
} from 'lucide-react';

interface FaqPageProps {
  onSelectPlan: (packageId: 'starter' | 'boost' | 'full') => void;
  onNavigateContact: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onSelectPlan, onNavigateContact }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'quality', label: 'Quality & Process' },
    { id: 'pricing', label: 'Pricing & Guarantee' },
    { id: 'delivery', label: 'Delivery & Turnaround' },
    { id: 'ats', label: 'ATS & Formatting' },
    { id: 'revisions', label: 'Revisions & Privacy' }
  ];

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.directAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.extendedAnswer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });


  return (
    <div className="min-h-screen bg-soft py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent bg-accent-soft px-3 py-1 rounded-md border border-accent-line">
            <HelpCircle className="w-3.5 h-3.5" />
            Transparent Answers · AEO Verified
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-muted leading-relaxed">
            Everything you need to know about our AI-assisted, senior-developer reviewed resume service. Direct answers upfront.
          </p>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any question (e.g., ATS format, refund, turn-around time, revisions)..."
              className="w-full pl-12 pr-4 py-3 bg-paper border border-line rounded-xl shadow-xs text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3.5 py-1.5 rounded-lg transition-colors font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-ink text-white shadow-xs'
                    : 'bg-paper text-muted hover:bg-soft border border-line'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              return (
                <details
                  key={faq.id}
                  open={faq.id === FAQ_ITEMS[0].id}
                  className="group bg-paper rounded-xl border border-line shadow-xs overflow-hidden transition-all duration-150"
                >
                  <summary className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-soft/50 transition-colors focus:outline-none cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span className="font-heading text-sm sm:text-base font-bold text-ink">
                      {faq.question}
                    </span>
                    <span className="p-1 rounded-md text-muted/60 shrink-0">
                      <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180 group-open:text-accent" />
                    </span>
                  </summary>

                <div className="px-5 pb-5 pt-0 space-y-3 border-t border-line text-ink/90">
                  {/* Direct Answer Paragraph (AEO target) */}
                  <div className="p-3.5 bg-accent-soft/60 rounded-lg border border-accent-line text-xs sm:text-sm font-medium text-ink leading-relaxed">
                    <span className="font-bold text-accent mr-1">Direct Answer:</span>
                    {faq.directAnswer}
                  </div>

                  {/* Extended Explanation */}
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {faq.extendedAnswer}
                  </p>
                </div>
                </details>
              );
            })
          ) : (
            <div className="p-12 text-center bg-paper rounded-xl border border-line">
              <p className="text-sm text-muted/80">No questions matched your search query.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-2 text-xs font-semibold text-accent hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Contact fallback */}
        <div className="p-6 bg-soft/70 border border-line rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-heading text-sm font-bold text-ink flex items-center gap-2 justify-center sm:justify-start">
              <Mail className="w-4 h-4 text-accent" />
              Have a question not listed here?
            </h4>
            <p className="text-xs text-muted/80">
              We respond to inquiries within 2 hours. Email ahmedur.rahch2021@gmail.com
            </p>
          </div>
          <button
            onClick={onNavigateContact}
            className="px-4 py-2 bg-paper hover:bg-soft border border-line text-ink text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            Contact Support
          </button>
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#0F172A] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-heading text-lg font-bold">
              Ready to land more interviews?
            </h3>
            <p className="text-xs text-slate-300">
              Pick your package and get your resume delivered in 24 hours.
            </p>
          </div>
          <button
            onClick={() => onSelectPlan('boost')}
            className="px-5 py-2.5 bg-soft0 hover:bg-accent text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-500/20"
          >
            Start For $10–$35 →
          </button>
        </div>
      </div>
    </div>
  );
};
