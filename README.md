# ATS Resume Lab

A resume and job-application workspace for candidates who want to know what actually happens to their file: what a parser extracts, what breaks, and what the job description asks for.

Live preview: **https://atsresumemaker.ai.studio** (Google AI Studio). Intended public domain: **https://atsresume.co.uk** — set in `SITE_ORIGIN` once DNS points there.

## What is in here

| Area | Where |
| --- | --- |
| Product and design spec | `docs/STRATEGY.md` |
| Evidence register behind every public claim | `src/data/evidence.ts` |
| Route table, titles, canonical origin | `src/routes.ts` |
| Prerender step (runs automatically) | `scripts/prerender.tsx` + `vite.config.ts` |
| Static HTML output | `dist/` (generated, not committed) |

## Commands

```bash
npm install
npm run dev        # local dev server on :3000
npm run build      # production build — prerenders every public route
npm run lint       # tsc --noEmit
npm run build:spa  # single-page shell only; do NOT deploy this output
```

## How the build works

`vite build` writes the bundle, then the `ats-prerender` plugin in `vite.config.ts` runs `scripts/prerender.tsx`. That step writes one real HTML file per public route into `dist/<path>/index.html`, each with its own `<title>`, description, canonical, `robots`, Open Graph and Twitter tags, plus JSON-LD.

Because the prerender step lives inside the Vite config, **any** build command produces crawlable output — `npm run build`, `vite build`, or a host's default build. It fails the build rather than shipping an empty `<div id="root">`.

`/suite` is prerendered but marked `noindex` and excluded from `sitemap.xml`. `/order` is `Disallow`ed in `robots.txt`.

## Deploying

The host must serve the files in `dist/` as static files, not rewrite every path to `/index.html`. Any static host or CDN does this by default; a catch-all rewrite rule would discard the prerendered pages.

`SITE_ORIGIN` in `src/routes.ts` is the single source for canonical URLs, `sitemap.xml`, `robots.txt` and structured data. Moving to another domain is one line there, then a rebuild — there is no second place to update.

## Changing the domain

1. Edit `SITE_ORIGIN` in `src/routes.ts`.
2. Run `npm run build`.
3. Confirm `dist/robots.txt` and `dist/sitemap.xml` show the new host.
4. Re-publish the site, then verify a deep page (e.g. `/pricing`) serves a `<link rel="canonical">` with the new host.

Keep the old host serving a 301 redirect to the new one for at least a year, so existing links and search results transfer instead of 404ing.

## Hosting

The output is static files. Any host that serves `dist/` as files works.

**Cloudflare Pages** (recommended — free TLS, CDN edge in Dhaka, builds from GitHub):

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 20 or 22 |

**Hostinger** (static/ Git deploy): build with `npm run build` and upload the contents of `dist/` to `public_html`.

In both cases: **do not add a catch-all rewrite to `/index.html`**. That rule would replace every prerendered page with the shell and throw away the per-route titles and canonicals. Some "SPA hosting" presets add it by default — remove it.

`dist/` is generated and gitignored; it must be built on every deploy, never committed.

## Honesty rules for this codebase

- No invented testimonials, user counts, scores or success rates.
- Every public numeric claim must trace to a row in `src/data/evidence.ts` with a source grade (A/B/C).
- The checker reports findings, never a single ATS "score", and never predicts rejection.
- ATS-safety statements describe parser behaviour, not hiring outcomes.
