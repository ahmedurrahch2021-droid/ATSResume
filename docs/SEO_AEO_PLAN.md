# SEO and AEO Plan — ATSresume

Status: **Plan only. No application code is changed by this document.**
Repo state audited: `main` @ `ec648af`
Owner decisions still needed are listed in §10.

---

## 1. Short answer

No, the site does not have to be rewritten as hand-built HTML, CSS and JavaScript.

Search engines need **a separate, fully rendered HTML document for each public URL**, containing its own title, description, headings, text and structured data. The current app ships one HTML file (`index.html`) and builds every page in the browser with React, switching pages in memory. Google sees one page at `/`.

The fix is to make each page exist as real HTML at its own URL. There are three ways to do that (§4). The recommended route keeps the React code and adds a build step that writes static HTML for each public page. A full rewrite to plain HTML/CSS/JS is possible but is the most expensive option and is not required for SEO.

---

## 2. Current state (evidence from the audit)

| Area | Finding | Where |
|---|---|---|
| Routing | Pages switch by `useState`. No URL changes. | `src/App.tsx` (`currentPage`, `handleNavigate`) |
| URLs | One URL (`/`). Pricing, FAQ, Templates, Examples, About, Contact are not addressable. | `App.tsx` |
| Head tags | `<title>`, description, OG only in `index.html`. | `index.html` |
| Structured data | None. | — |
| Sitemap / robots | None. `public/` holds only `assets/aistudio/` leftovers. | `public/` |
| Canonical | None. | — |
| Images | Three hero JPEGs of 0.7–0.8 MB each, unoptimised. | `src/assets/images/` |
| Fonts | Three Google Font families, blocking render. | `index.html` |
| Analytics | Event attributes exist, but no analytics SDK is loaded. | `Navbar`, `Footer` |
| Build | Vite 8 + React 19 SPA. `tsc` and `vite build` pass after dependencies install. | `package.json` |

Consequence: none of the public pages except the homepage can rank, and no page gives answer engines a clean, citable answer.

---

## 3. Goals and success measures

**Goals**
1. Each public page is indexable at its own URL with unique, accurate metadata.
2. Answer engines (Google AI Overviews, ChatGPT search, Perplexity) can extract and cite clear answers from the site.
3. The site loads fast on mobile networks, including in Bangladesh.
4. Claims on every page are accurate and supported (see the Phase 0 branch).

**Measures (checked after launch)**
- Google Search Console: every public URL indexed; no "Crawled — not indexed" for core pages.
- Rich Results Test passes for `Organization`, `FAQPage`, `SoftwareApplication`.
- Lighthouse on mobile: SEO 100; Performance ≥ 85; Accessibility ≥ 95. Core Web Vitals "good" for LCP, CLS, INP.
- Organic impressions and clicks for the target queries (§6) measured at 30, 60 and 90 days.

---

## 4. Options

### Option A — Keep Vite + React, add per-route prerendering (**recommended**)
- Add `react-router` with real URLs for each public page.
- Add a build step that renders each route to static HTML (`vite-plugin-prerender` or a small custom script using `react-dom/server`).
- Each HTML file contains the full page text, metadata and JSON-LD. React hydrates on the client for interactivity.
- **Pros:** keeps the existing components, pages and styling; smallest change to the code; fast to ship.
- **Cons:** prerendering needs care for pages that read browser-only state (e.g. `localStorage`).
- **Effort:** about 1–2 weeks.

### Option B — Migrate to Next.js (App Router, static generation)
- Each page becomes a route with `generateMetadata`; JSON-LD is rendered server-side.
- **Pros:** the strongest and most standard SEO setup; built-in image optimisation and sitemap support.
- **Cons:** largest change; every interactive component needs a `'use client'` boundary review; the editor and order flow need care.
- **Effort:** about 3–5 weeks.

### Option C — Hand-built static HTML/CSS/JS for marketing pages, React app kept for the tool
- Marketing pages (Home, Templates, Pricing, FAQ, About, Contact, How it works) rebuilt as plain HTML/CSS with minimal JavaScript.
- The interactive suite (`/app` or `/suite`) stays React and is `noindex`.
- **Pros:** fastest pages; simplest hosting; full control over markup.
- **Cons:** duplicates the design system; two build pipelines; content updates become manual edits in HTML.
- **Effort:** about 3–4 weeks, mostly reproducing the existing layout.

**Recommendation:** Option A now. Revisit Option B if the editor later needs server rendering. Option C is only worth it if the marketing pages must be hand-controlled for performance; the performance goals are reachable with Option A plus image and font work.

---

## 5. Target URL map

| Public URL | Current source | Index? | Notes |
|---|---|---|---|
| `/` | `HomePage` | Yes | Primary commercial page |
| `/resume-checker` | `FreeScorePage` | Yes | Free tool; the main SEO landing page |
| `/resume-templates` | `TemplatesPage` | Yes | ATS template library |
| `/resume-examples` | `ExamplesPage` | Yes | Examples by role |
| `/pricing` | `PricingPage` | Yes | Offers and prices |
| `/how-it-works` | `HowItWorksPage` | Yes | Process explainer |
| `/faq` | `FaqPage` | Yes | Source for AEO answers |
| `/about` | `AboutPage` | Yes | E-E-A-T: who is behind it |
| `/contact` | `ContactPage` | Yes | |
| `/blog/<slug>` | new | Yes | Phase 4, see §7 |
| `/order` | `OrderPage` | **No** (`noindex`) | Transactional |
| `/suite` | `SuitePage` (editor) | **No** (`noindex`) | App, not a content page |
| `/checklist` | `ChecklistModal` | No | Modal today; keep as modal, not a page |

Notes:
- Redirect old query or state links where they exist.
- Trailing-slash policy: pick one and enforce it with redirects (recommend no trailing slash).

---

## 6. Keyword and answer plan

Primary and supporting queries, mapped to pages. Confirm volumes with a keyword tool before writing copy; treat the list below as intent groups, not measured data.

| Page | Primary intent | Supporting intent |
|---|---|---|
| `/resume-checker` | "free ATS resume checker" | "resume score", "check resume for ATS" |
| `/resume-templates` | "ATS resume template" | "single column resume template", "free resume template" |
| `/resume-examples` | "resume examples by job" | "[role] resume example" |
| `/` | "ATS resume builder" / "resume help" | "resume review service" |
| `/pricing` | "resume writing service price" | "resume review cost" |
| `/faq` | "does ATS reject resumes" | "can ATS read PDF", "is a photo on a resume bad" |

**AEO content rules (apply to every page)**
- Open each major section with a direct answer of 40–60 words, then detail.
- Use question-form H2s that match real queries.
- State facts with a source or date where possible.
- Avoid unverifiable claims (see Phase 0). Answer engines penalise and omit them.

**Answer blocks to publish first** (drawn from existing FAQ content, rewritten to be accurate):
1. What is an ATS-friendly resume?
2. Can an ATS read PDF resumes? (Accurate answer: modern systems usually can read text-based PDFs; scanned images and complex graphics are the usual cause of failure. Do not promise pass rates.)
3. How long should a resume be?
4. Should I include a photo?
5. How do I tailor a resume to a job description?

---

## 7. Phased implementation plan

Each phase is a separate branch and PR. Typecheck and build must pass before each commit. No phase merges until reviewed.

### Phase 0 — Accuracy and stop-ship (already on branch `phase0/remove-false-claims-and-fake-flows`)
- Disable simulated checkout; remove test card defaults.
- Remove owner PII defaults and the fake sign-in path.
- Remove unsupported claims and fictional "verified" labels.
- **Acceptance:** grep finds none of the listed claim strings; `tsc` and `vite build` pass; manual check that checkout cannot create an order.

### Phase 1 — Routing and per-page HTML (Option A)
1. Add `react-router`; define the routes in §5.
2. Move page-level state (`currentPage`) to URLs; keep Navbar and Footer links as real `<Link>`s.
3. Add a per-route metadata component (title, description, canonical, OG, robots) — one source of truth, e.g. a `routes.ts` file.
4. Add the prerender step; output `dist/<route>/index.html` for each public route.
5. Guard browser-only code (`localStorage`, `window`) so it does not break prerendering.
6. Mark `/order` and `/suite` `noindex,follow` in both prerendered and client metadata.
- **Acceptance:** `curl` of each public URL returns its own `<title>`, description, canonical and the page's main text without running JavaScript; back button and deep links work.

### Phase 2 — Structured data and crawl files
1. `Organization`, `WebSite` (site-wide, once).
2. `SoftwareApplication` with `offers` only if the free checker is accurately described (price 0).
3. `FAQPage` on `/faq` and on any page with visible FAQ text. Markup must match visible text exactly.
4. `Product`/`Offer` on `/pricing` only after prices are confirmed.
5. `HowTo` on `/how-it-works` only if the steps are visible on the page.
6. Generate `sitemap.xml` at build from the route list (lastmod from git or content date).
7. `robots.txt` pointing to the sitemap; disallow `/order`. **Correction:** `/suite` is not disallowed, because a crawler must fetch the page to see its `noindex` tag. Disallowing it would hide the tag without removing the page from search.
- **Acceptance:** Rich Results Test and the Schema.org validator report no errors; sitemap contains only indexable URLs.

### Phase 3 — Content and E-E-A-T
1. Rewrite each page's H1/H2 structure around §6 queries; add the AEO answer blocks.
2. Replace fictional case studies with clearly labelled examples, or remove them.
3. `/about` names real people responsible for content, with real credentials, or uses the company name only. Do not invent credentials.
4. Add a visible "last updated" date to content pages.
5. Add a real privacy policy and terms (currently linked from the footer; confirm they exist and match what the site does).
- **Acceptance:** each indexable page has one H1, unique title (≤ 60 chars) and description (≤ 160 chars), and at least one answer block.

### Phase 4 — Blog (optional, after Phases 1–3 are live)
- Add `/blog/<slug>` pages, each with its own metadata, `Article` schema, author and date.
- Start with 5–10 pages that answer the §6 question list. Quality over volume.

### Phase 5 — Performance and images
1. Convert the three hero JPEGs to WebP/AVIF; produce 640/1024/1920 px sizes; add `srcset` and `sizes`.
2. Use `loading="lazy"` for images below the fold and `fetchpriority="high"` for the LCP hero image.
3. Reduce Google Fonts to two families; add `font-display: swap`; preload the primary weight only.
4. Code-split the editor (`SuitePage`) and order flow so the marketing pages do not load them. The current bundle is 604 kB minified; target under 300 kB for the marketing entry.
5. Set width and height on all images to prevent layout shift.
- **Acceptance:** mobile Lighthouse Performance ≥ 85; LCP < 2.5 s and CLS < 0.1 on a throttled mid-range profile.

### Phase 6 — Accessibility (supports SEO and AEO)
1. Associate every form label with its input (`htmlFor` / `id`).
2. Fix skipped heading levels (e.g. `FaqPage` has h1 but no h2 structure).
3. Give icon-only buttons an `aria-label`; give decorative images `alt=""`; give meaningful images real alt text.
4. Confirm colour contrast meets WCAG AA for the emerald and slate text used on small labels.
- **Acceptance:** axe or Lighthouse accessibility ≥ 95 on all public pages.

### Phase 7 — Measurement and launch
1. Add GA4 or Plausible; wire the existing `data-amplitude-*` events to the chosen tool, or remove the attributes.
2. Verify the domain in Google Search Console and Bing Webmaster Tools; submit the sitemap.
3. Set 301 redirects from any old URLs (none exist as public URLs today, but check any shared links).
4. Monitor index coverage, impressions and AI-answer citations at 30/60/90 days.

---

## 8. Metadata template (per page)

Every indexable route defines:

```
path:        /resume-checker
title:       Free ATS Resume Checker | ATSresume            (≤ 60 chars)
description: Check your resume against ATS filters for free, see clear fixes, and get an ATS-readable template. (≤ 160 chars)
canonical:   https://<domain>/resume-checker
og:image:    /og/resume-checker.jpg   (1200×630)
robots:      index,follow
jsonld:      [SoftwareApplication, FAQPage (if visible FAQ)]
h1:          Is your resume good enough for ATS?
```

`/order` and `/suite`: `robots: noindex,follow`, no JSON-LD, canonical to self.

---

## 9. Verification checklist (run before each merge)

- [ ] `npm run lint` (`tsc --noEmit`) passes
- [ ] `npm run build` passes; prerendered HTML exists for each route in §5
- [ ] `curl -s <url>` shows the page's own title, description, canonical and H1 without JavaScript
- [ ] Rich Results Test: no errors on changed pages
- [ ] Lighthouse mobile on changed pages: SEO 100, Accessibility ≥ 95, Performance ≥ 85
- [ ] No unsupported claims (grep list from Phase 0)
- [ ] `robots.txt` and `sitemap.xml` reachable and correct
- [ ] Manual check on a real phone: navigation, back button, checker upload

---

## 10. Decisions needed from the owner

1. **Brand:** ATSresume or ResumeRevive? One domain, one name, one contact email.
2. **Domain:** the production domain, for canonical URLs, sitemap and Search Console.
3. **Option:** A (recommended), B, or C.
4. **Payments:** which processor; checkout stays disabled until chosen.
5. **Auth:** which provider; sign-in stays a local stub until chosen.
6. **Content owner:** who writes and signs off the copy and the "About" credentials.
7. **Blog:** in scope for Phase 4, or defer.

---

## 11. Risks

| Risk | Mitigation |
|---|---|
| Prerendering breaks on browser-only code | Guard with `typeof window`; test each route in the build |
| Changing URLs loses any existing ranking | Site has no indexed pages beyond `/` today; set redirects for any new URLs that replace old ones |
| Unverified claims get the site penalised or removed from AI answers | Phase 0 removes them; the verification checklist blocks their return |
| Scope creep into a full rewrite | Option A is fixed as the default; a switch to B or C needs a written decision |
| Slow results (SEO takes months) | Set 30/60/90-day measures; do not judge in the first 2 weeks |

---

## 12. Timeline (indicative, one developer)

| Phase | Effort |
|---|---|
| 0 — Accuracy | Done on branch; review and merge |
| 1 — Routing and prerender | 1–2 weeks |
| 2 — Structured data and crawl files | 2–3 days |
| 3 — Content and E-E-A-T | 1–2 weeks, depends on copy |
| 4 — Blog (optional) | Ongoing |
| 5 — Performance and images | 3–5 days |
| 6 — Accessibility | 2–3 days |
| 7 — Measurement and launch | 1 day, plus ongoing monitoring |

Phases 2, 5 and 6 can run in parallel with Phase 3 once Phase 1 is merged.
