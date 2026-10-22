/**
 * SPIKE — not production code.
 *
 * Proves that two public routes can be rendered to real, separate HTML files
 * using react-router (StaticRouter) and react-dom/server, with per-route head
 * tags. Output goes to dist-spike/ so the SPA build in dist/ is untouched.
 *
 * Run after the normal build check:
 *   npx tsx scripts/spike-prerender.tsx
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Routes, Route } from 'react-router';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { HomePage } from '../src/pages/HomePage';
import { FaqPage } from '../src/pages/FaqPage';

const noop = () => {};

interface SpikeRoute {
  path: string;
  title: string;
  description: string;
  element: React.ReactElement;
  // Text that must appear in the rendered HTML for the check to pass.
  mustContain: string;
}

const ROUTES: SpikeRoute[] = [
  {
    path: '/',
    title: 'ATSresume | Free ATS Resume Checker & Templates',
    description: 'Free ATS resume checker with clear fixes, plus single-column resume templates.',
    element: <HomePage onNavigate={noop} onOpenOrder={noop} onOpenChecklist={noop} />,
    mustContain: '<h1',
  },
  {
    path: '/faq',
    title: 'Resume FAQ | ATSresume',
    description: 'Answers to common questions about ATS-friendly resumes.',
    element: <FaqPage onSelectPlan={noop} onNavigateContact={noop} />,
    mustContain: '<h1',
  },
];

function renderRoute(route: SpikeRoute): string {
  const body = renderToString(
    <StaticRouter location={route.path}>
      <Routes>
        {ROUTES.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
      </Routes>
    </StaticRouter>,
  );

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${route.title}</title>
    <meta name="description" content="${route.description}" />
    <link rel="canonical" href="https://YOUR-DOMAIN.com${route.path}" />
  </head>
  <body>
    <div id="root">${body}</div>
  </body>
</html>
`;
}

let failures = 0;
for (const route of ROUTES) {
  const html = renderRoute(route);
  const dir = join('dist-spike', route.path === '/' ? '' : route.path);
  mkdirSync(dir, { recursive: true });
  const file = join(dir, 'index.html');
  writeFileSync(file, html, 'utf8');

  const ok = html.includes(route.mustContain) && html.includes(`<title>${route.title}</title>`);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${route.path.padEnd(8)} -> ${file} (${html.length} bytes)`);
  if (!ok) failures++;
}

if (failures > 0) {
  console.error(`${failures} route(s) failed.`);
  process.exit(1);
}
console.log('All spike routes rendered.');
