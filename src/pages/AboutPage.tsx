import React from 'react';
import { Link } from 'react-router';
import { ROUTE_PATHS } from '../routes';
import { PACKAGES } from '../data/mockData';
import { DELIVERY_POLICY, REPLY_POLICY, SERVICE_CONTACT } from '../data/servicePolicy';
import { describePackagePrices } from '../utils/servicePricing';

interface AboutPageProps { onSelectPlan: (packageId: 'starter' | 'boost' | 'full') => void }

export function AboutPage({ onSelectPlan }: AboutPageProps) {
  return <div className="section bg-soft"><div className="container-page max-w-4xl space-y-8">
    <div className="max-w-2xl"><p className="eyebrow">About ATS Resume Lab</p><h1 className="mt-3 text-3xl sm:text-4xl">A clearer way to inspect your resume.</h1><p className="mt-4 text-muted">The project focuses on a practical loop: read a file, inspect what was extracted, make accurate edits and check the document you will send.</p></div>
    <section className="card p-5 sm:p-7 space-y-5"><h2 className="text-xl">What the software does</h2><p className="text-muted">PDF, DOCX and text extraction run in your browser. The field mapper can miss information, so the original extracted text remains available for comparison. The editor and downloads use one body-flow document model.</p><p className="text-muted">Findings are explained review prompts. They do not simulate an employer’s ATS, measure your probability of an interview or score you against other candidates.</p><Link to={ROUTE_PATHS['how-it-works']} className="btn btn-secondary">Read the method and limitations</Link></section>
    <div className="grid gap-6 sm:grid-cols-2">
      <section className="card p-5"><h2 className="text-xl">Free core tools</h2><p className="mt-3 text-sm text-muted">Checking, editing and document downloads are free for candidates in Bangladesh and elsewhere. There is no account or payment requirement for these tools.</p></section>
      <section className="card p-5"><h2 className="text-xl">Honest changes</h2><p className="mt-3 text-sm text-muted">The guided helper assembles facts you provide. No AI provider is connected. Examples are fictional and must not be presented as your own career history.</p></section>
      <section className="card p-5"><h2 className="text-xl">Local does not mean a cloud backup</h2><p className="mt-3 text-sm text-muted">Browser storage can be cleared or blocked. Keep a downloaded backup. If you email a resume for human review, that is a separate sharing action you choose.</p></section>
      <section className="card p-5"><h2 className="text-xl">No invented track record</h2><p className="mt-3 text-sm text-muted">There are no verified user counts, callback rates or customer testimonials published here. The product should be judged by the changes and documents you can inspect.</p></section>
    </div>
    <section className="card p-5 space-y-3"><h2 className="text-xl">Optional paid human help</h2><p className="text-sm text-muted">Human services are paid in Bangladesh and other countries. The core tools remain free. Confirm scope, availability and terms before paying.</p><ul className="space-y-2 text-sm text-muted">{PACKAGES.map((pkg) => <li key={pkg.id}><span className="font-medium text-ink">{pkg.name}</span> — {describePackagePrices(pkg)}</li>)}</ul><p className="text-sm text-muted">{REPLY_POLICY} {DELIVERY_POLICY}</p><button type="button" className="btn btn-secondary" onClick={() => onSelectPlan('starter')}>Prepare a review inquiry</button><p className="text-sm"><a href={`mailto:${SERVICE_CONTACT.email}`} className="break-all text-accent underline">{SERVICE_CONTACT.email}</a></p><p className="text-sm"><a href={SERVICE_CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="text-accent underline">WhatsApp {SERVICE_CONTACT.whatsappDisplay}</a></p></section>
  </div></div>;
}
