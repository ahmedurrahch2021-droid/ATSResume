import React, { useState } from 'react';
import { RESUME_EXAMPLES } from '../data/mockData';

interface ExamplesPageProps { onSelectPlan: (packageId: 'starter' | 'boost' | 'full') => void }

export function ExamplesPage({ onSelectPlan }: ExamplesPageProps) {
  const [selected, setSelected] = useState(RESUME_EXAMPLES[0].id);
  const [view, setView] = useState<'compare' | 'notes'>('compare');
  const example = RESUME_EXAMPLES.find((item) => item.id === selected)!;
  return <div className="section bg-soft"><div className="container-page space-y-8">
    <div className="max-w-2xl"><p className="eyebrow">Illustrative wording examples</p><h1 className="mt-3 text-3xl sm:text-4xl">Compare vague duties with specific contributions.</h1><p className="mt-4 text-muted">These are fictional examples, not customer case studies. The fuller versions include assumed facts and metrics to illustrate the writing approach. Those details cannot be inferred from the shorter draft or copied into your own resume.</p></div>
    <div className="flex flex-wrap gap-2" aria-label="Example roles">{RESUME_EXAMPLES.map((item) => <button type="button" key={item.id} className={`btn ${selected === item.id ? 'btn-secondary' : 'btn-ghost'}`} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>{item.role}</button>)}</div>
    <div className="card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><p className="eyebrow">{example.industry}</p><h2 className="mt-2 text-xl">{example.title}</h2></div><div className="flex flex-wrap gap-2"><button type="button" className="btn btn-secondary" aria-pressed={view === 'compare'} onClick={() => setView('compare')}>Compare wording</button><button type="button" className="btn btn-ghost" aria-pressed={view === 'notes'} onClick={() => setView('notes')}>Writing notes</button></div></div>
    {view === 'compare' ? <div className="grid gap-6 lg:grid-cols-2">{[
      ['Shorter draft', example.before.summary, example.before.experience], ['Fuller fictional example', example.after.summary, example.after.experience],
    ].map(([title, summary, bullets]) => <section key={title as string} className="card p-5 sm:p-6"><h2 className="text-xl">{title as string}</h2><h3 className="mt-5 text-sm">Summary</h3><p className="mt-2 rounded-input bg-soft p-3 text-sm text-muted">{summary as string}</p><h3 className="mt-5 text-sm">Contribution bullets</h3><ul className="mt-3 list-disc space-y-3 pl-5 text-sm text-muted">{(bullets as string[]).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></section>)}</div> : <section className="card p-5 sm:p-6 space-y-4"><h2 className="text-xl">Facts must come before stronger wording</h2><p className="text-muted">Ask the candidate what they actually did, the scope of the work, how they did it and the outcome. Do not upgrade a job title, invent a certification or fill in a percentage from context.</p><ul className="list-disc space-y-3 pl-5 text-sm text-muted"><li>Use a specific example rather than a list of general responsibilities.</li><li>Use the employer’s terminology only when it accurately describes the candidate’s work.</li><li>Numbers can clarify scale when known. A qualitative result is valid when it is accurate.</li><li>Review the proposed change and keep an undo path. No wording can guarantee an interview.</li></ul></section>}
    <section className="card p-5"><h2 className="text-xl">Want help reviewing your own wording?</h2><p className="mt-2 text-sm text-muted">Human review is optional. Confirm the scope and availability before payment.</p><button type="button" className="btn btn-secondary mt-4" onClick={() => onSelectPlan('starter')}>View review options</button></section>
  </div></div>;
}
