/**
 * Prerender public routes to static HTML after `vite build`.
 *
 * This script is run by the `ats-prerender` plugin in vite.config.ts, which
 * fires on every build, so a host that calls `vite build` directly still gets
 * one real HTML file per route, with its own metadata. Do not move it back
 * into an npm script — that is how the site previously shipped as a shell.
 *
 * For each route in PRERENDER_ROUTES this writes dist/<path>/index.html.
 * The file is the built dist/index.html with:
 *   - the route's <title> and meta description,
 *   - the rendered page content placed inside <div id="root">.
 * The built <script> and <link> tags are kept, so the client app still
 * loads and takes over the page.
 *
 * Scope of this step: page content only. The Navbar and Footer are not
 * rendered here yet; they use buttons, not links, and are handled in a
 * later step.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { PRERENDER_ROUTES, ROUTE_PATHS, ROUTE_META, SITE_ORIGIN } from '../src/routes';
import { SITE_JSON_LD, faqPageJsonLd } from '../src/seo';
import { FAQ_ITEMS } from '../src/data/mockData';
import type { PageRoute } from '../src/types';
import { HomePage } from '../src/pages/HomePage';
import { TemplatesPage } from '../src/pages/TemplatesPage';
import { PricingPage } from '../src/pages/PricingPage';
import { ExamplesPage } from '../src/pages/ExamplesPage';
import { FreeScorePage } from '../src/pages/FreeScorePage';
import { HowItWorksPage } from '../src/pages/HowItWorksPage';
import { AboutPage } from '../src/pages/AboutPage';
import { FaqPage } from '../src/pages/FaqPage';
import { ContactPage } from '../src/pages/ContactPage';
import { SuitePage } from '../src/pages/SuitePage';
import { CoverLetterPage } from '../src/pages/CoverLetterPage';
import { CountryGuidesPage } from '../src/pages/CountryGuidesPage';
import { Navbar } from '../src/components/Navbar';
import { Footer } from '../src/components/Footer';
import { INITIAL_GUEST_ACCOUNT } from '../src/types/auth';

const DIST = 'dist';
const noop = () => {};

// Each page gets no-op handlers. The prerendered markup is static; the
// client app supplies the real handlers after it loads.
const ELEMENTS: Record<PageRoute, React.ReactElement | null> = {
  home: <HomePage onNavigate={noop} onOpenOrder={noop} onOpenChecklist={noop} />,
  templates: <TemplatesPage onNavigate={noop} onOpenOrder={noop} />,
  pricing: <PricingPage onSelectPlan={noop} />,
  examples: <ExamplesPage onSelectPlan={noop} />,
  'free-resume-score': <FreeScorePage onSelectPlan={noop} onNavigate={noop} />,
  'how-it-works': <HowItWorksPage onSelectPlan={noop} />,
  about: <AboutPage onSelectPlan={noop} />,
  faq: <FaqPage onSelectPlan={noop} onNavigateContact={noop} />,
  contact: <ContactPage onSelectPlan={noop} />,
  'cover-letter': <CoverLetterPage />,
  'country-guides': <CountryGuidesPage />,
  suite: <SuitePage onNavigate={noop} onOpenOrder={noop} />,
  // Not prerendered: order is transactional; editor is the same page as suite.
  order: null,
  editor: null,
};

// Same frame as App.tsx: the wrapper div, Navbar, <main>, Footer. Keeping it
// identical lets the client hydrate the prerendered markup without a mismatch.
// Modals (auth, checklist) render nothing while closed, so they are omitted.
function renderPage(route: PageRoute): string {
  const element = ELEMENTS[route];
  if (!element) throw new Error(`No prerender element for route "${route}"`);
  return renderToString(
    <StaticRouter location={ROUTE_PATHS[route]}>
      <div className="min-h-screen flex flex-col bg-paper text-ink font-sans antialiased selection:bg-accent selection:text-white">
        <Navbar
          currentPage={route}
          setCurrentPage={noop}
          onOpenOrder={noop}
          userAccount={INITIAL_GUEST_ACCOUNT}
          onOpenAuth={noop}
          onSignOut={noop}
        />
        <main className="flex-1">
          <Routes>
            <Route path={ROUTE_PATHS[route]} element={element} />
          </Routes>
        </main>
        <Footer setCurrentPage={noop} onOpenChecklist={noop} onOpenOrder={noop} />
      </div>
    </StaticRouter>,
  );
}

function withHead(template: string, route: PageRoute, body: string): string {
  const meta = ROUTE_META[route];
  if (!meta) throw new Error(`No metadata for route "${route}"`);

  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const url = `${SITE_ORIGIN}${ROUTE_PATHS[route] === '/' ? '/' : ROUTE_PATHS[route]}`;

  const titleTag = `<title>${esc(meta.title)}</title>`;
  const robotsTag = meta.noindex
    ? '<meta name="robots" content="noindex,follow" />'
    : '<meta name="robots" content="index,follow,max-image-preview:large" />';
  const canonicalTag = `<link rel="canonical" href="${url}" />`;
  const descTag = `<meta name="description" content="${esc(meta.description)}" />`;

  // Social crawlers do not run JavaScript, so OG/Twitter tags must be in the
  // served HTML for every route, not just the home page.
  const socialTags = [
    `<meta property="og:site_name" content="ATS Resume Lab" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
  ].join('\n    ');

  let html = template;
  if (!/<title>[^<]*<\/title>/.test(html)) throw new Error('Template has no <title>');
  html = html.replace(/<title>[^<]*<\/title>/, titleTag);
  if (!/<meta name="description"[^>]*\/>/.test(html)) throw new Error('Template has no description meta');
  html = html.replace(/<meta name="description"[^>]*\/>/, descTag);

  // The base template carries home-page social tags; replace them per route.
  html = html.replace(/<meta property="og:title"[^>]*\/>/, `<meta property="og:title" content="${esc(meta.title)}" />`);
  html = html.replace(/<meta property="og:description"[^>]*\/>/, `<meta property="og:description" content="${esc(meta.description)}" />`);

  const emptyRoot = '<div id="root"></div>';
  if (!html.includes(emptyRoot)) throw new Error('Template has no empty #root element');
  html = html.replace(emptyRoot, `<div id="root">${body}</div>`);
  // JSON-LD is built from a fixed object, so it cannot inject markup.
  const jsonLdTag = `<script type="application/ld+json">${JSON.stringify(SITE_JSON_LD)}</script>`;
  // FAQPage markup is only emitted for approved items on the FAQ page.
  const faqData = route === 'faq' ? faqPageJsonLd(FAQ_ITEMS) : null;
  const faqTag = faqData ? `<script type="application/ld+json">${JSON.stringify(faqData)}</script>` : '';
  const extraHead = [canonicalTag, robotsTag, socialTags, jsonLdTag, faqTag]
    .filter(Boolean)
    .map((t) => `    ${t}`)
    .join('\n');
  return html.replace('</head>', `${extraHead}\n  </head>`);
}

const template = readFileSync(join(DIST, 'index.html'), 'utf8');

let failures = 0;
for (const route of PRERENDER_ROUTES) {
  try {
    const body = renderPage(route);
    if (!body.includes('<h1')) throw new Error('rendered page has no <h1>');
    const html = withHead(template, route, body);

    const path = ROUTE_PATHS[route];
    const dir = join(DIST, path === '/' ? '' : path);
    mkdirSync(dir, { recursive: true });
    const file = join(dir, 'index.html');
    writeFileSync(file, html, 'utf8');
    console.log(`PASS  ${path.padEnd(18)} -> ${file} (${html.length} bytes)`);
  } catch (err) {
    failures++;
    console.error(`FAIL  ${ROUTE_PATHS[route]}: ${(err as Error).message}`);
  }
}

if (failures > 0) {
  console.error(`${failures} route(s) failed to prerender.`);
  process.exit(1);
}
// sitemap.xml lists only indexable pages: not noindex.
const indexable = PRERENDER_ROUTES.filter((r) => !ROUTE_META[r]?.noindex);
const urls = indexable
  .map((r) => `  <url><loc>${SITE_ORIGIN}${ROUTE_PATHS[r]}</loc></url>`)
  .join('\n');
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  'utf8',
);
console.log(`Wrote sitemap.xml with ${indexable.length} URLs.`);

// robots.txt is generated, not copied from public/, so the sitemap URL always
// matches SITE_ORIGIN. Moving to a new domain is then a one-line change in
// src/routes.ts, with no second place to forget.
writeFileSync(
  join(DIST, 'robots.txt'),
  [
    '# Crawl rules for ATS Resume Lab. Sitemap lists the indexable public pages.',
    'User-agent: *',
    '# Transactional order form: not for search results and not worth crawling.',
    'Disallow: /order',
    '',
    '# /suite is not disallowed on purpose. It is marked noindex in its page',
    '# head, and a crawler must be able to read that tag to honour it.',
    '',
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    '',
  ].join('\n'),
  'utf8',
);
console.log(`Wrote robots.txt pointing at ${SITE_ORIGIN}/sitemap.xml.`);
console.log(`Prerendered ${PRERENDER_ROUTES.length} routes.`);
