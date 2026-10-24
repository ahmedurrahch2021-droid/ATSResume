# Phases

Each phase is shippable on its own. A phase is done when its checklist is complete and `npm run build:prerender` passes.

Note: these are **product** phases. The SEO plan (`docs/SEO_AEO_PLAN.md`) uses its own phase numbers for SEO work. Step numbers in commit messages (for example "Phase 1 step 5") refer to the SEO plan.

## Phase 1 — Trustworthy public site (current)

Goal: the public pages are accurate, indexable and readable.

Done on branches (not yet merged to `main`):
- [x] Real URLs for each public page (`phase1/routing-urls`)
- [x] Static HTML per public route, with title, description, canonical and H1 (`phase1/prerender-build`)
- [x] Crawlable links between pages (`phase1/crawlable-links`)
- [x] `sitemap.xml` and `robots.txt` (`phase1/crawl-files`)
- [x] Brand renamed to ATS Resume Maker (`brand/ats-resume-maker`)
- [x] Organisation and website structured data (`seo/structured-data`)
- [x] FAQ shows all answers in the HTML; FAQ markup generator with no approved items (`seo/faq-schema`)
- [x] FAQ items 3, 4, 7 reworded; page-length guidance corrected (`content/faq-pagelength`)

Remaining:
- [ ] Owner decision on the refund policy, then align the homepage, pricing, order and footer copy
- [ ] Remove or label fabricated stats and case studies (`atsScore: 99`, `5,400 downloads`, the made-up case study)
- [ ] Fix the logo text ("ATSresume" split across spans) in the header and footer
- [ ] Simplify the homepage design (see the design review)
- [ ] Approve FAQ items by ID once the owner confirms their wording
- [ ] Verify the host serves `dist/<route>/index.html` before the root fallback
- [ ] Remove or confirm the paste files in `public/assets/aistudio/`
- [ ] Test PDF and DOCX upload parsing with real files
- [ ] Hydration and Lighthouse checks on the deployed URL

## Phase 2 — Working order flow

Goal: a visitor can pay and receive a resume.

- [ ] Choose payment processor (PayPal, Stripe, or a Bangladesh gateway)
- [ ] Server-side order record (requires a backend decision; see `architecture.md` §9)
- [ ] Real payment confirmation before any "order confirmed" message
- [ ] Order emails sent from the server, not from the browser
- [ ] Refund flow matching the approved policy
- [ ] Re-enable the order button only after the above

## Phase 3 — Accounts and saved resumes

Goal: visitors keep their work between visits.

- [ ] Real sign-in (Firebase, Supabase or Clerk), replacing the stub in `AuthModal.tsx`
- [ ] Saved resumes stored server-side, with a migration from `localStorage`
- [ ] Delete account and export data (privacy requirement)

## Phase 4 — Content and growth

Goal: organic search and AI answer engines find and cite the site.

- [ ] Blog pages under `/blog/<slug>` with `Article` markup
- [ ] Answers for the question list in `SEO_AEO_PLAN.md` §6
- [ ] Analytics (GA4 or Plausible) wired to the funnel events
- [ ] Search Console verification on the production origin

## Backlog (not scheduled)

- Resume template gallery with real, licensed templates
- Image optimisation (WebP/AVIF) for hero and template previews
- Custom domain, when the owner chooses one
- Real 404 page
- Cleanup of unused dependencies (`@google/genai`, `express`, `dotenv`)
