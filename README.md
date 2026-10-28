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
| Checker → editor draft bridge | `src/utils/resumeDraft.ts` |
| Editable sections, guided fixes, A4 preview | `src/pages/ResumeWorkspacePage.tsx` + `src/components/resume/` |
| DOCX / PDF-print / TXT export | `src/utils/resumeExporter.ts` |
| Optional AI architecture and provider research | `docs/AI_ASSISTANCE.md` |
| Release gaps and mobile/reliability audit | `docs/QUALITY_REVIEW.md` |

## Commands

```bash
npm install
npm run dev        # local dev server on :3000
npm run build      # production build — prerenders every public route
npm run lint       # tsc --noEmit
npm run test:resume # import, audit, persistence and export regression checks
npm run test:browser # production-browser tests; run npm run build first
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

The owner will retire the AI Studio app when the replacement site is complete. There is no staging-host indexing change in this implementation.

## Hosting

The output is static files. Any host that serves `dist/` as files works.

**Cloudflare Pages** (recommended — free TLS, CDN edge in Dhaka, builds from GitHub):

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 22.18+ or 24 (verified locally on 24) |

**Hostinger** (static/ Git deploy): build with `npm run build` and upload the contents of `dist/` to `public_html`.

In both cases: **do not add a catch-all rewrite to `/index.html`**. That rule would replace every prerendered page with the shell and throw away the per-route titles and canonicals. Some "SPA hosting" presets add it by default — remove it.

`dist/` is generated and gitignored; it must be built on every deploy, never committed.

## Honesty rules for this codebase

- No invented testimonials, user counts, scores or success rates.
- Every public numeric claim must trace to a row in `src/data/evidence.ts` with a source grade (A/B/C).
- The checker reports findings, never a single ATS "score", and never predicts rejection.
- ATS-safety statements describe parser behaviour, not hiring outcomes.

## Current workspace behaviour

- Imports are local. Selecting a finding opens its section in the same draft; examples are explicitly selected and labelled fictional.
- Actual edits, the job description and document settings autosave locally. If storage fails, the in-memory handoff remains usable in the tab, with a session-only notice.
- Missing parsed fields are not proof they were absent in the original file. Original body/header/footer text remains available for comparison.
- Guided rewriting assembles user-supplied facts, previews the wording and supports undo. No AI provider is connected.
- A4 pages are measured in the browser. DOCX is a valid Word package with paragraph/list content. Word can reflow; preview parity is not guaranteed.
- Download the revised file and re-upload it to verify its actual extraction. Editing fields does not recheck the original file’s layout.
- The mobile menu uses a full-height native dialog with keyboard containment. The browser test suite covers phone, landscape, tablet and desktop widths.
- Cover letters start blank, import actual resume contact fields, and export genuine DOCX plus PDF printing/text. Fictional examples require explicit selection.
- Local profile is not authentication. Contact and review inquiry forms prepare emails; subscriptions, server submission and checkout are not connected.
- The full roadmap is not complete. Read `docs/QUALITY_REVIEW.md` before describing the product as launch-ready.

For manual browser verification, `npx tsx scripts/qa-resume-fixtures.ts` and `npx tsx scripts/qa-resume-print.ts` generate **synthetic** files in `dist/_qa` after a build. Remove that directory before deploying; a fresh production build also clears it.
