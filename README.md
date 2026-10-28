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
| Four original layouts and preview generation | `src/data/resumeLayouts.ts` + `scripts/generate-template-previews.ts` |
| Country/layout guidance and source scope | `docs/TEMPLATE_GUIDE.md` + `src/data/resumeSources.ts` |
| Optional AI architecture and provider research | `docs/AI_ASSISTANCE.md` |
| Release gaps and mobile/reliability audit | `docs/QUALITY_REVIEW.md` |
| Owner-approved email-first solo launch and priorities | `docs/SOLO_LAUNCH_PLAN.md` |

## Commands

```bash
npm install
npm run dev        # local dev server on :3000
npm run build      # production build — prerenders every public route
npm run lint       # tsc --noEmit
npm run test:resume # import, audit, persistence and export regression checks
npm run test:browser # production-browser tests; run npm run build first
npm run previews:templates # refresh real gallery PNGs after changing paper styles or samples
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

### Dependency lockfiles

Both `package-lock.json` and `bun.lock` describe the required app, document-reader and test packages. The npm lock is the version baseline; regenerate the Bun lock with `bun pm migrate --force` after a deliberate npm dependency change, then verify a frozen install. Do not replace either lock with an older AI Studio starter-project lockfile.

The current Bun version 1 lockfile was generated and tested using Bun 1.3.14. A clean `bun install --frozen-lockfile --ignore-scripts`, `bun run lint`, `bun run test:resume`, `bun run build` and `bun run test:browser` passed. Node remains required for the build scripts. See `docs/QUALITY_REVIEW.md` for verification scope.

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
- Four original layouts share the document model and paper styles. Gallery images come from the actual print renderer. Applying a layout keeps your existing career fields and target job; fictional sample replacement is an explicit action.
- Optional photos sit top-right beside body-text contact details and are right-margin anchored in DOCX. Photos can still affect parsing; US/UK mode and Hide photo exclude them from document exports.
- Twelve country cards open source-linked guidance, not automatic national requirements. The country page explains source scope and access limitations and links the original institutional examples.
- Download the revised file and re-upload it to verify its actual extraction. Editing fields does not recheck the original file’s layout.
- The mobile menu uses a full-height native dialog with keyboard containment. The browser test suite covers phone, landscape, tablet and desktop widths.
- Cover letters start blank, import actual resume contact fields, and export genuine DOCX plus PDF printing/text. Fictional examples require explicit selection.
- Local profile is not authentication. Contact and review inquiry forms prepare emails; subscriptions, server submission and checkout are not connected.
- The full roadmap is not complete. Read `docs/QUALITY_REVIEW.md` before describing the product as launch-ready.
- The owner-approved human-support model is implemented in the repository: free core worldwide; paid human help at ৳499/৳1,999/৳3,499 in Bangladesh or US$10/US$35/US$59 internationally. Pricing region carries into the inquiry and its email/downloaded quote.
- Email and WhatsApp `+8801748755209` support have a 24-hour reply policy, not a document-delivery guarantee. No paid AI, checkout or automatic message/file submission is connected. Public comments/reviews remain optional.
- Domain/search migration, new 404 handling and a social-sharing image are deferred. See `docs/SOLO_LAUNCH_PLAN.md`; leave `SITE_ORIGIN` and indexing behaviour unchanged until the owner reopens that work.

For manual browser verification, `npx tsx scripts/qa-resume-fixtures.ts` and `npx tsx scripts/qa-resume-print.ts` generate **synthetic** files in `dist/_qa` after a build. Remove that directory before deploying; a fresh production build also clears it.
