/**
 * Prerender public routes to static HTML after `vite build`.
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
      <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-emerald-600 selection:text-white">
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

  const titleTag = `<title>${meta.title}</title>`;
  const robotsTag = meta.noindex ? '<meta name="robots" content="noindex,follow" />' : '';
  const canonicalTag = `<link rel="canonical" href="${SITE_ORIGIN}${ROUTE_PATHS[route]}" />`;
  const descTag = `<meta name="description" content="${meta.description}" />`;

  let html = template;
  if (!/<title>[^<]*<\/title>/.test(html)) throw new Error('Template has no <title>');
  html = html.replace(/<title>[^<]*<\/title>/, titleTag);
  if (!/<meta name="description"[^>]*\/>/.test(html)) throw new Error('Template has no description meta');
  html = html.replace(/<meta name="description"[^>]*\/>/, descTag);

  const emptyRoot = '<div id="root"></div>';
  if (!html.includes(emptyRoot)) throw new Error('Template has no empty #root element');
  html = html.replace(emptyRoot, `<div id="root">${body}</div>`);
  // JSON-LD is built from a fixed object, so it cannot inject markup.
  const jsonLdTag = `<script type="application/ld+json">${JSON.stringify(SITE_JSON_LD)}</script>`;
  // FAQPage markup is only emitted for approved items on the FAQ page.
  const faqData = route === 'faq' ? faqPageJsonLd(FAQ_ITEMS) : null;
  const faqTag = faqData ? `<script type="application/ld+json">${JSON.stringify(faqData)}</script>` : '';
  const extraHead = [canonicalTag, robotsTag, jsonLdTag, faqTag].filter(Boolean).map((t) => `    ${t}`).join('\n');
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
console.log(`Prerendered ${PRERENDER_ROUTES.length} routes.`);
