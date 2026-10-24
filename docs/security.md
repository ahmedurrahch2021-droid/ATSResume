# Security

The app has no server, so most controls that apply to a typical web app do not exist yet. This file states what is true today, what is missing, and what must be done before any sensitive feature is turned on.

## Authentication

**Not implemented.** `src/components/AuthModal.tsx` accepts any input and marks the visitor as signed in. No password is checked, and the account is stored in `localStorage`. Do not present this as real sign-in, and do not put any data behind it.

Before real accounts: choose a provider (Firebase Auth, Supabase or Clerk), use its sessions, and remove the stub.

## Authorization

**Not implemented.** There is nothing to authorise because all data is local to the visitor's browser. Once accounts and server data exist, every endpoint must check that the signed-in user owns the record it touches.

## Input validation

- **Uploads** (`src/utils/fileExtractor.ts`): files are read in the browser. Image uploads (`PhotoUploader.tsx`) check the file type only. Resume files are read as raw bytes; see `architecture.md` §8 for the parsing problem. Limit file size before reading (not implemented).
- **Forms**: the auth form requires a valid email and a name. The order form has no validation beyond HTML fields, and submitting it does not send anything.
- **Output into HTML**: React escapes text by default. Exceptions:
  - `src/pages/TemplatesPage.tsx` builds a full HTML string from template content and writes it into a new window with `document.write`. Values are **not escaped**. A value containing `<img onerror=...>` would run script in that window. **Open issue, high priority.** Fix with an escape function applied to every interpolated value, and add `noopener,noreferrer` to `window.open`.

## Secrets and config

- No secrets are in the repository's source. Confirm with a search before each release.
- `.env.example` lists `GEMINI_API_KEY`. Vite exposes only variables prefixed `VITE_` to the browser. Do not add a model key this way: anything in the bundle is public.
- Do not commit `.env` (ignored by `.gitignore`).

## Transport and headers

- HTTPS is provided by the host (AI Studio). Confirm on the production URL.
- No Content-Security-Policy, `X-Frame-Options` or `Referrer-Policy` is set. The host decides these; check what it sends.
- Google Fonts and the DiceBear avatar service are loaded from third-party origins.

## Personal data and sensitive information

- Resume content (contact details, work history, and in some fields salary, visa and nationality) is entered by the visitor and stored in `localStorage`. It is not sent to a server.
- The About page says resume data is "never shared, sold, or published." That is true for the current code, but it must be re-checked whenever a server is added.
- No payment card data is collected. Checkout is disabled. The order form still has card fields, which are empty by default (the test card number was removed in Phase 0). No order is taken until a processor is connected (see `phases.md`, Phase 2). Card data must never be stored by this app; use the processor's hosted fields or redirect.
- Fabricated testimonials and case studies (`src/data/mockData.ts`) are personal-data-adjacent content presented as real. Remove or label before launch.

## Dependencies

- Run `npm audit` before each release and record the result here.
- Remove unused dependencies (`@google/genai`, `express`, `dotenv`), which widen the attack surface for no benefit.

## Pre-launch checklist

- [ ] Escape all interpolated values in the template print window; `noopener,noreferrer` on `window.open`
- [ ] Remove the card test number and CVV defaults from `OrderPage.tsx` (done in Phase 0; re-check)
- [ ] Confirm no secret strings in `dist/` (`grep -ri "api[_-]key\|secret" dist`)
- [ ] Confirm the host sends HSTS and a Content-Security-Policy, or document why not
- [ ] `npm audit` reviewed and recorded
- [ ] Privacy page matches what the code does
- [ ] Fabricated testimonials, statistics and guarantees removed or labelled
- [ ] Payment and sign-in providers chosen, or the features stay disabled
