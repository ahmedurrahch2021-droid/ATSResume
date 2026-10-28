import React from 'react';
import { ExternalLink } from 'lucide-react';
import { COUNTRY_GUIDES } from '../../data/countryGuides';
import { ATS_TEMPLATES } from '../../data/mockData';
import { resumeLayout } from '../../data/resumeLayouts';
import { ROUTE_PATHS } from '../../routes';

export function CountryGuideCards() {
  return (
    <div id="country-guide-cards" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {COUNTRY_GUIDES.map((country) => {
        const template = ATS_TEMPLATES.find((item) => item.layout === country.layout)!;
        return <a key={country.id} href={`${ROUTE_PATHS['country-guides']}#${country.id}`} target="_blank" rel="noopener noreferrer" className="card card-hover group flex min-w-0 items-start gap-4 p-4">
          <img src={template.previewImage} width={794} height={1123} loading="lazy" decoding="async" alt="" className="w-16 shrink-0 border border-line bg-surface shadow-card" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold tracking-wide text-accent">{country.code} · {country.zone}</span><ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" /></div>
            <h3 className="mt-1 text-sm font-semibold">{country.name}</h3>
            <p className="mt-1 text-xs text-muted">{country.note}</p>
            <p className="mt-2 text-xs text-muted">Suggested: {resumeLayout(country.layout).name}</p>
            <span className="mt-2 inline-block text-xs font-medium text-accent underline underline-offset-4">Read guidance & sources <span className="sr-only">(opens in a new tab)</span></span>
          </div>
        </a>;
      })}
    </div>
  );
}
