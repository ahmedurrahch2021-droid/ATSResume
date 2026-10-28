import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/mockData';

interface FaqPageProps { onSelectPlan: (packageId: 'starter' | 'boost' | 'full') => void; onNavigateContact: () => void }

export function FaqPage({ onSelectPlan, onNavigateContact }: FaqPageProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const categories = [['all', 'All questions'], ['quality', 'Tools & process'], ['ats', 'Checking & formats'], ['pricing', 'Pricing & terms'], ['delivery', 'Delivery'], ['revisions', 'Storage & privacy']];
  const items = FAQ_ITEMS.filter((item) => (category === 'all' || item.category === category) && `${item.question} ${item.directAnswer} ${item.extendedAnswer}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="section bg-soft"><div className="container-page max-w-4xl space-y-8">
    <div><p className="eyebrow">Answers and limits</p><h1 className="mt-3 text-3xl sm:text-4xl">Frequently asked questions</h1><p className="mt-4 text-muted">How the free tools work, what they cannot tell you and how optional human review is arranged.</p></div>
    <div className="space-y-4"><div className="space-y-2"><label htmlFor="faq-search" className="text-sm font-medium">Search questions</label><input id="faq-search" type="search" className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try formats, privacy or delivery…" /></div><div className="flex flex-wrap gap-2" aria-label="FAQ categories">{categories.map(([id, label]) => <button key={id} type="button" className={`btn ${category === id ? 'btn-secondary' : 'btn-ghost'}`} aria-pressed={category === id} onClick={() => setCategory(id)}>{label}</button>)}</div></div>
    <div className="space-y-3">{items.map((item) => <details key={item.id} className="card group"><summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 p-5 font-medium"><span>{item.question}</span><span className="text-accent" aria-hidden="true">+</span></summary><div className="space-y-3 border-t border-line p-5 text-sm"><p>{item.directAnswer}</p><p className="text-muted">{item.extendedAnswer}</p></div></details>)}{items.length === 0 && <div className="card p-5"><p role="status" className="text-muted">No questions match these filters.</p><button type="button" className="btn btn-secondary mt-3" onClick={() => { setQuery(''); setCategory('all'); }}>Reset filters</button></div>}</div>
    <section className="card p-5"><h2 className="text-xl">Need a more specific answer?</h2><p className="mt-2 text-sm text-muted">Use the contact page to prepare an email, or make a human-review inquiry. No message or payment is sent automatically.</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" className="btn btn-secondary" onClick={onNavigateContact}>Contact support</button><button type="button" className="btn btn-ghost" onClick={() => onSelectPlan('starter')}>Review inquiry</button></div></section>
  </div></div>;
}
