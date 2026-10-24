# Architecture

Source of truth for how ATS Resume Maker is built. Describes the code as it is on this branch. Where the code and this file disagree, fix one of them the same day.

## 1. Overview

ATS Resume Maker is a client-only React single-page app that helps job seekers check and improve resumes for applicant tracking systems (ATS). It is sold as a free checker plus paid human-reviewed resume packages.

- **Live (AI Studio):** https://atsresumemaker.ai.studio
- **Canonical origin in code:** `SITE_ORIGIN` in `src/routes.ts`
- **Contact:** ahmedur.rahch2021@gmail.com

There is no backend. All resume analysis runs in the browser. Saved state lives in `localStorage`.

## 2. Tech stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 19 | Existing components; interactive editor |
| Build | Vite 8 | Fast builds; prerender step runs after it |
| Routing | react-router 7 (`BrowserRouter`) | Real URLs per page, needed for SEO |
| Styling | Tailwind CSS 4 | Existing styles |
| Icons | lucide-react | Existing components |
| Prerender | `scripts/prerender.tsx` (react-dom/server + StaticRouter) | Static HTML per public page for crawlers |
| Type check | TypeScript (`tsc --noEmit`) | `npm run lint` |
| Fonts | Google Fonts (Inter, Plus Jakarta Sans, Poppins) | Loaded from `index.html` |

Declared but not imported anywhere in `src/` or `scripts/`: `@google/genai`, `express`, `dotenv`. Treat them as unused until removed or used.

## 3. System diagram (data flow)

```
Build time
  vite build  ->  dist/ (SPA shell + assets)
  prerender   ->  dist/<route>/index.html  (10 routes, title/description/canonical/JSON-LD)
              ->  dist/sitemap.xml  (9 indexable URLs)
  public/robots.txt copied to dist/

Browser (runtime)
  URL -> routeFromPath() -> page component
  Resume text/file -> fileExtractor / resumeParser -> ResumeData (in memory)
  ResumeData -> atsScanner (27 checks, in memory) -> score and findings
  Account   <-> localStorage 'atsresume_user_account'
  Email     -> localStorage 'atsresume_subscribers'

No server calls. No analytics. No payments.
```

## 4. APIs (contract)

None. The app makes no HTTP requests to its own origin and has no API routes.

Outbound, from the browser:
- Google Fonts CSS and font files (`index.html`).
- `https://api.dicebear.com/...` avatar image, built in `AuthModal.tsx` for the local sign-in stub.

## 5. Third-party integrations

| Integration | Status | Notes |
|---|---|---|
| Google Fonts | Live | Render-blocking; reduce to two families (plan Phase 5) |
| DiceBear avatars | Live, stub | Only used by the fake sign-in; remove with real auth |
| Payments (PayPal, cards, UPI) | **Not connected** | Checkout is disabled. The order button shows a notice and creates nothing. |
| Email | `mailto:` links only | No sending from the app |
| Analytics | **Not connected** | `data-amplitude-*` attributes exist but no SDK loads |
| Gemini / AI | **Not connected** | Dependency declared, no calls. See `prompts.md` |

## 6. Non-negotiables / constraints

1. Every public page has its own URL, title, description, canonical and H1 in the built HTML (`npm run build:prerender`).
2. No claim on any page that the site cannot back up. Guarantees, pass rates and payment methods need evidence or wording that is true today.
3. Private data stays in the browser. Do not send resume content anywhere without a documented decision and a privacy update.
4. `localStorage` keys are not renamed without a migration. Renaming signs out and drops saved data for existing visitors.
5. Structured data (JSON-LD) must match visible page text. FAQ markup only for items in `FAQ_SCHEMA_APPROVED_IDS`.
6. `/order` is `noindex` and disallowed in `robots.txt`. `/suite` is `noindex` but crawlable.

## 7. Routes

| Path | Page | Indexed | Prerendered |
|---|---|---|---|
| `/` | HomePage | yes | yes |
| `/resume-checker` | FreeScorePage | yes | yes |
| `/resume-templates` | TemplatesPage | yes | yes |
| `/resume-examples` | ExamplesPage | yes | yes |
| `/pricing` | PricingPage | yes | yes |
| `/how-it-works` | HowItWorksPage | yes | yes |
| `/faq` | FaqPage | yes | yes |
| `/about` | AboutPage | yes | yes |
| `/contact` | ContactPage | yes | yes |
| `/suite` | SuitePage (editor) | noindex | yes |
| `/order` | OrderPage | disallowed | no |

`/editor` is an alias of `/suite` (same page). Unknown paths show the home page for now; a real 404 is planned.

## 8. Constraints and known gaps

- **Resume upload parsing is unverified.** `src/utils/fileExtractor.ts` reads PDF and DOCX as raw bytes and searches for text. Compressed PDF streams and DOCX (a zip archive) are unlikely to yield text. Test with real files before relying on uploads.
- **Sign-in is a stub.** It accepts any input and marks the user as logged in.
- **Print path is unescaped.** `TemplatesPage.tsx` writes user-editable text into a new window's HTML without escaping.

## 9. Open questions

1. Refund policy: the site says "100% money-back guarantee" in about 15 places. The FAQ no longer does. Which is true?
2. Payment processor and sign-in provider: not chosen.
3. Fabricated numbers on template cards (`atsScore: 99`, `downloadCount: '5,400 downloads'`) and the made-up case study in `src/data/mockData.ts`: remove or label as examples?
4. Logo: the header and footer still show "ATSresume" split across two spans. The brand rename did not reach them.
5. Hosting: AI Studio must serve `dist/<route>/index.html` before falling back to the root file. Not yet confirmed.
6. Public paste files in `public/assets/aistudio/` are copied into the build and are reachable. Delete?
