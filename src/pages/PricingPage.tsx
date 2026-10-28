import React, { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { PACKAGES } from '../data/mockData';
import { ROUTE_PATHS } from '../routes';
import type { ServicePricingRegion } from '../types';
import { ServicePricingRegionSelect } from '../components/ServicePricingRegionSelect';
import { DELIVERY_POLICY, REPLY_POLICY, SERVICE_CONTACT } from '../data/servicePolicy';
import { formatPackagePrice, rushQuoteNote, rushRequestLabel } from '../utils/servicePricing';

interface PricingPageProps { onSelectPlan: (packageId: 'starter' | 'boost' | 'full', urgent?: boolean, region?: ServicePricingRegion) => void }

export function PricingPage({ onSelectPlan }: PricingPageProps) {
  const [rushDelivery, setRushDelivery] = useState(false);
  const [pricingRegion, setPricingRegion] = useState<ServicePricingRegion>('international');
  return (
    <div className="section bg-soft">
      <div className="container-page space-y-10">
        <div className="max-w-2xl"><p className="eyebrow">Free tools · paid human help</p><h1 className="mt-3 text-3xl sm:text-4xl">Pay for a second pair of eyes.</h1><p className="mt-4 text-muted">Resume checking, editing and downloads are free worldwide. Human help is a separate, one-time paid service for Bangladesh and other countries. Confirm scope, availability and terms before paying.</p><p className="mt-3 text-sm text-muted">{REPLY_POLICY} {DELIVERY_POLICY}</p></div>
        <section className="card p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-xl">Start with the free workspace</h2><p className="mt-2 text-sm text-muted">Import your file, inspect the findings, edit your draft and export DOCX, PDF or text. No account or card required.</p></div>
          <Link to={ROUTE_PATHS['free-resume-score']} className="btn btn-secondary shrink-0">Check my resume <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </section>
        <div className="max-w-2xl space-y-4"><ServicePricingRegionSelect id="pricing-region" value={pricingRegion} onChange={setPricingRegion} /><label className="flex min-h-11 items-start gap-3 rounded-card border border-line bg-paper p-4 cursor-pointer"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-accent" checked={rushDelivery} onChange={(event) => setRushDelivery(event.target.checked)} /><span><span className="block text-sm font-medium">{rushRequestLabel(pricingRegion)}</span><span className="mt-1 block text-xs text-muted">Subject to availability and confirmation before payment. This does not change the 24-hour reply policy.</span></span></label></div>
        <div className="grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((pkg) => <section key={pkg.id} className={`card flex min-w-0 flex-col p-5 sm:p-6 ${pkg.popular ? 'border-accent-line' : ''}`}>
            <h2 className="text-xl">{pkg.name}</h2><p className="mt-2 text-sm text-muted">{pkg.description}</p>
            <p className="mt-5 flex flex-wrap items-baseline gap-2"><span className="text-4xl font-semibold text-ink">{formatPackagePrice(pkg, pricingRegion, rushDelivery)}</span><span className="text-sm text-muted">{pricingRegion === 'bangladesh' ? 'BDT' : 'USD'} · one-time</span></p>
            <p className="mt-2 text-xs text-muted">{pricingRegion === 'bangladesh' ? 'International' : 'Bangladesh'}: {formatPackagePrice(pkg, pricingRegion === 'bangladesh' ? 'international' : 'bangladesh')} base price</p>
            <p className="mt-3 text-xs text-muted">{rushDelivery ? rushQuoteNote(pricingRegion) : 'Document delivery date confirmed before payment.'}</p>
            <p className="mt-4 rounded-input bg-soft p-3 text-sm text-muted">{pkg.recommendedFor}</p>
            <ul className="my-5 space-y-3">{pkg.features.map((feature) => <li key={feature} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" /><span>{feature}</span></li>)}</ul>
            <button type="button" className="btn btn-secondary mt-auto w-full" onClick={() => onSelectPlan(pkg.id, rushDelivery, pricingRegion)}>Inquire about {pkg.name}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></button>
          </section>)}
        </div>
        <section className="card overflow-hidden">
          <div className="border-b border-line p-5"><h2 className="text-xl">Compare the package scope</h2><p className="mt-2 text-sm text-muted">The scope is agreed with you before work starts. On a small screen, scroll the table sideways.</p></div>
          <div className="overflow-x-auto" role="region" aria-label="Package comparison" tabIndex={0}>
            <table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-soft"><tr><th scope="col" className="p-4">Included work</th>{PACKAGES.map((pkg) => <th scope="col" className="p-4" key={pkg.id}>{pkg.name}</th>)}</tr></thead><tbody className="divide-y divide-line">{[
              ['Written review and focused edits', 'Yes', 'Yes', 'Yes'],
              ['Targeted resume rewrite', '—', 'Yes', 'Yes'],
              ['Editable DOCX and PDF', 'Yes', 'Yes', 'Yes'],
              ['Target-role review', 'One role', 'One role', 'One role'],
              ['Matching cover letter', '—', '—', 'One'],
              ['LinkedIn headline and About wording', '—', '—', 'Yes'],
              ['Revision rounds', ...PACKAGES.map((pkg) => pkg.revisionRounds === 1 ? 'One' : 'Two')],
            ].map(([label, ...values]) => <tr key={label}><th scope="row" className="p-4 font-medium">{label}</th>{values.map((value, index) => <td className="p-4 text-muted" key={index}>{value}</td>)}</tr>)}</tbody></table>
          </div>
        </section>
        <section className="grid gap-6 sm:grid-cols-2">
          {[
            ['How do I pay?', 'Online checkout is not connected. Prepare an inquiry and contact us by email or WhatsApp to confirm an available payment method and the agreed scope.'],
            ['Does a review guarantee an interview?', 'No. A review can help you make accurate, relevant edits. Employers make their own decisions.'],
            ['What are the revision and refund terms?', 'Confirm the revision window, delivery date and cancellation or refund terms in writing before paying. No automatic refund service is connected to this site.'],
            ['Can I use a two- or three-page resume?', 'Yes. The free workspace and human review support longer resumes. Keep relevant information and follow the vacancy’s instructions.'],
          ].map(([question, answer]) => <div key={question}><h2 className="text-lg">{question}</h2><p className="mt-2 text-sm text-muted">{answer}</p></div>)}
        </section>
        <section className="card p-5 sm:p-6 space-y-3"><h2 className="text-xl">Ask before choosing a package</h2><p className="text-sm text-muted">{REPLY_POLICY} {DELIVERY_POLICY}</p><a className="btn btn-secondary" href={SERVICE_CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer"><MessageCircle className="h-4 w-4" aria-hidden="true" />Message on WhatsApp</a><p className="text-xs text-muted">{SERVICE_CONTACT.whatsappDisplay} · You choose what to share. Opening WhatsApp does not submit an order.</p></section>
      </div>
    </div>
  );
}
