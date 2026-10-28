import React from 'react';
import { Link } from 'react-router';
import { ArrowRight, BookOpen, ImageOff } from 'lucide-react';
import { COUNTRY_GUIDES } from '../data/countryGuides';
import { ATS_TEMPLATES } from '../data/mockData';
import { RESUME_LAYOUTS, resumeLayout } from '../data/resumeLayouts';
import { SOURCE_REVIEW_DATE } from '../data/resumeSources';
import { SourceLinks } from '../components/resume/SourceLinks';
import { ROUTE_PATHS } from '../routes';

export function CountryGuidesPage() {
  return (
    <div className="section bg-paper">
      <div className="container-page space-y-12">
        <header className="max-w-3xl space-y-4">
          <p className="eyebrow">Application context · original layouts · primary sources</p>
          <h1 className="text-3xl sm:text-4xl">Choose a structure. Check the local instructions.</h1>
          <p className="lede">A country label is not a universal CV rule. These cards explain practical starting points, photo choices and the limits of the sources we reviewed.</p>
          <p className="text-sm text-muted">Source review: {SOURCE_REVIEW_DATE}. Our four designs are original and source-informed, not university templates or institutional endorsements. Country suggestions do not automatically alter your draft.</p>
          <Link to={ROUTE_PATHS.templates} className="btn btn-secondary">Browse the four free layouts <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </header>

        <section id="photo-guidance" className="card scroll-mt-6 p-5 sm:p-6" aria-labelledby="photo-guidance-title">
          <div className="flex items-start gap-3"><ImageOff className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" /><div className="min-w-0"><h2 id="photo-guidance-title" className="text-xl">Optional photo does not mean universally ATS-safe</h2><p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted">Our default layouts contain no photo. If you enable one, it sits at the top right beside body-text contact details. Right alignment is a visual choice: MIT and Greenhouse identify images and photographs as possible parsing problems. Keep an image-free version for applications that do not request a photo.</p><p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted">The US / UK editor preset omits the photo and nationality from document exports, while retaining the fields in your draft. In other modes, use Hide photo or Remove. Preview and print use the same layout rules; an anchored image can move when edited in Word or Google Docs, so inspect the actual file.</p><SourceLinks ids={['mit-ats', 'greenhouse-parse', 'us-eeoc', 'canada-jobbank']} /></div></div>
        </section>

        <nav aria-label="Country guidance" className="space-y-3">
          <p className="eyebrow">Jump to a country</p>
          <div className="flex flex-wrap gap-2">{COUNTRY_GUIDES.map((country) => <a key={country.id} href={`#${country.id}`} className="btn btn-secondary text-xs">{country.code} · {country.name}</a>)}</div>
        </nav>

        <div className="space-y-6">
          {COUNTRY_GUIDES.map((country) => {
            const template = ATS_TEMPLATES.find((item) => item.layout === country.layout)!;
            return <section key={country.id} id={country.id} className="card scroll-mt-6 p-5 sm:p-7" aria-labelledby={`${country.id}-title`}>
              <div className="grid gap-6 md:grid-cols-[148px_minmax(0,1fr)]">
                <div className="flex items-start gap-4 md:block">
                  <img src={template.previewImage} width={794} height={1123} loading="lazy" decoding="async" alt={`First page of our ${template.title} layout, with fictional example text`} className="w-24 shrink-0 border border-line shadow-card md:w-full" />
                  <div className="min-w-0 md:mt-3"><p className="text-xs text-muted">Suggested structure</p><a href={`#layout-${country.layout}`} className="inline-flex min-h-11 items-center text-sm font-medium text-accent underline underline-offset-4">{resumeLayout(country.layout).name}</a><p className="text-xs text-muted">Not a country-mandated template.</p></div>
                </div>
                <div className="min-w-0 space-y-5">
                  <div><p className="eyebrow">{country.code} · {country.zone}</p><h2 id={`${country.id}-title`} className="mt-2 text-2xl">{country.name}</h2></div>
                  <dl className="grid gap-5 lg:grid-cols-2">
                    <div><dt className="text-sm font-semibold">Useful structure</dt><dd className="mt-2 text-sm leading-relaxed text-muted">{country.structure}</dd></div>
                    <div><dt className="text-sm font-semibold">Photo & personal details</dt><dd className="mt-2 text-sm leading-relaxed text-muted">{country.photo}</dd></div>
                    <div className="lg:col-span-2"><dt className="text-sm font-semibold">Before applying</dt><dd className="mt-2 text-sm leading-relaxed text-muted">{country.application}</dd></div>
                  </dl>
                  <div className="rounded-card border border-line bg-soft p-4"><p className="text-xs font-semibold text-ink">What the evidence supports</p><p className="mt-1 text-sm leading-relaxed text-muted">{country.evidenceNote}</p><SourceLinks ids={country.sourceIds} /></div>
                </div>
              </div>
            </section>;
          })}
        </div>

        <section aria-labelledby="layout-reference-title" className="space-y-6">
          <div className="max-w-3xl"><p className="eyebrow">The design decisions</p><h2 id="layout-reference-title" className="mt-3 text-2xl sm:text-3xl">Four original layouts, one readable body-text model.</h2><p className="mt-3 text-sm leading-relaxed text-muted">No table-based text layout, skill bars or contact text in page headers. Change the visual style without replacing your facts. The example shown is fictional; it does not establish that one template gets better hiring results.</p></div>
          <div className="grid items-start gap-6 lg:grid-cols-2">
            {RESUME_LAYOUTS.map((layout) => {
              const template = ATS_TEMPLATES.find((item) => item.layout === layout.id)!;
              return <article key={layout.id} id={`layout-${layout.id}`} className="card scroll-mt-6 overflow-hidden" aria-labelledby={`layout-${layout.id}-title`}>
                <div className="flex items-start gap-5 p-5 sm:p-6"><img src={template.previewImage} width={794} height={1123} loading="lazy" decoding="async" alt="" className="w-24 shrink-0 border border-line shadow-card" /><div className="min-w-0"><h3 id={`layout-${layout.id}-title`} className="text-xl">{layout.name}</h3><p className="mt-2 text-sm text-muted">{layout.description}</p><p className="mt-2 text-xs text-muted">{template.format}</p></div></div>
                <div className="space-y-4 border-t border-line p-5 sm:p-6"><ul className="list-disc space-y-2 pl-5 text-sm text-muted">{template.highlightPoints.map((point) => <li key={point}>{point}</li>)}</ul><h4 className="text-sm font-semibold">Sources behind the structure</h4><SourceLinks ids={layout.sourceIds} detailed /><Link to={`${ROUTE_PATHS.templates}#template-${template.id}`} className="btn btn-secondary">Open this layout in the gallery <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
              </article>;
            })}
          </div>
        </section>

        <section className="card p-5 sm:p-6" aria-labelledby="original-reference-title">
          <div className="flex items-start gap-3"><BookOpen className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" /><div className="min-w-0"><h2 id="original-reference-title" className="text-xl">Want to see the published institutional examples?</h2><p className="mt-2 text-sm text-muted">Harvard’s page links its original Word, accessible Word and Google Docs versions. Imperial and NYU Abu Dhabi provide further CV guidance and examples. These stay on their publishers’ sites; we have not republished them as our templates.</p><SourceLinks ids={['harvard-bullet', 'imperial-cv', 'nyuad-cv']} /></div></div>
        </section>
      </div>
    </div>
  );
}
