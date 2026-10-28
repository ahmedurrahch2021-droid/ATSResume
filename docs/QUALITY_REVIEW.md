# Release review — mobile, reliability and product honesty

Review date: 28 October 2026. Scope: the repository build, not a claim that the AI Studio deployment is current.

## 29 October — Cloud Run and optional coach update

The supplied AI Studio ZIP added an optional Gemini coach but started with `node server.ts`; its extensionless imports reproduced `ERR_MODULE_NOT_FOUND` before binding a port. The build now creates `dist-server/server.mjs`, with `npm start`, a multi-stage Dockerfile and a health route. The server binds `0.0.0.0:$PORT` and starts without an AI key.

The coach now uses reviewed source/country context, selected-field application, stale-response protection and last-edit undo/redo in both editors. Offline/provider-error paths retain the original wording rather than replacing assistance with invented leadership or impact. Country guidance is separate from explicit document/photo controls. Requests use server attempt limits with the per-instance/restart limitation disclosed. Runtime configuration and exact verification scope are in `DEPLOYMENT.md` and `AI_ASSISTANCE.md`.

The owner's subsequent request selects Gemini's free tier. The paid-project app gate was removed: a server-only key enables the coach, and Google's project tier/quotas govern its API use. The UI explains free-tier data handling, while the setup guide records the existing provider restrictions. No cloud billing or API project settings were changed by this source update.

This update supersedes the historical “AI not connected” implementation status below. The core pricing, support and paused domain work are unaffected. Live Cloud Run publication and a real Gemini request require the operator's deployment/project configuration; local tests use synthetic data and mocked AI responses.

**Verified:** TypeScript and the production build passed; all **25 document/parser/service-policy tests**, **11 server tests** and **50 browser tests** passed. The new browser cases cover both editors' selected-field application, empty letter openings, undo/redo, persistence and DOCX output; cancelled/stale requests; offline/blocked-storage operation; quota/malformed-response fallback; and dialog geometry/focus/accessibility. The production server also preserves the existing slash-free route URLs and country-guide fragments.

A separate clean production-dependency install ran the compiled JavaScript from outside the repository on **0.0.0.0:3000**, with optional `tsx`/TypeScript peers excluded and native type stripping disabled. Health, prerendered route delivery and missing-key fallback passed. This was a Windows/Node 24 runtime check, not a Docker/Linux or live Cloud Run deployment. Reports are in ignored `.qa/browser-report-cloudrun-full.json` and `.qa/cloud-run-runtime-report.json`.

**Free-tier follow-up:** TypeScript, a fresh production build, **12 server tests** and all **6 focused coach browser tests** passed after removing the paid-project gate. The additional compiled-startup test verifies that a runtime key enables the coach without a paid-tier flag. No real Gemini request or Google billing change was made. The focused browser report is `.qa/browser-report.json`.

## Verdict

**The full planned ecosystem is not complete.** The free check → edit → export loop is implemented, but a successful TypeScript/build run does not establish responsive behaviour, accessibility, working integrations or launch readiness.

The earlier statement that only deployment remained was incorrect. This review adds browser-level acceptance tests and separates actual capabilities from roadmap items.

## Owner-approved launch scope update

The owner's latest direction in `SOLO_LAUNCH_PLAN.md` is no-paid-AI, free core worldwide, paid human help in Bangladesh and other countries, email/WhatsApp support and voluntary feedback. The free-Bangladesh-human-evaluation proposal is superseded. Approved prices are ৳499/৳1,999/৳3,499 for Bangladesh and US$10/US$35/US$59 internationally. Replies are within 24 hours; document delivery is agreed separately. Remote AI, subscriptions, cloud accounts and automated checkout are not launch requirements.

The latest live check after the owner republished now shows the revised headline and native full-height menu. Targeted live checks passed at 375×812 and 667×375 landscape, including Pricing navigation and closing. This supersedes the old 72px-panel observation. The new regional-pricing/contact revision still needs publication and live verification; broader document/device sign-off remains open.

Domain/DNS/HTTPS, canonical/sitemap migration, new 404 handling and the social-sharing image are deferred at the owner's request. Do not treat those paused items as work authorized in this revision.

## Defects addressed in this review

| Defect | Change |
| --- | --- |
| Mobile menu was only 72px tall | Native full-height dialog in the browser top layer. The old fixed child was constrained by the header’s backdrop filter, not by sticky positioning alone. |
| Menu keyboard focus could leave the controls | Explicit Tab/Shift+Tab containment, Escape/close/backdrop handling, focus return and body-scroll restoration. Resize to desktop closes the sheet. |
| Small controls, cramped/oversized document previews | Phone-sized inputs, wrapping buttons, locally scrollable document viewports and fit-width preview. Paper remains A4 rather than shrinking the exported document. |
| Low-contrast secondary text and warning chips | Removed text-opacity dilution; warning ink darkened from `#8a6a2f` to `#7b5c24`. Warm Paper branding remains. |
| Fake Google/email sign-in and password capture | Optional local profile, explicitly not authentication or cloud sync. No password field or external avatar request. |
| Contact “Message Received” without delivery | Prepare/copy/open an email draft. No delivery claim; sending happens in the user’s email app. |
| Newsletter “dispatched” without sending an email | Direct checklist download, no email required. Future subscriptions are explicitly not connected. |
| Inactive checkout still asked for card/CVV information | Five-step review inquiry with a downloadable brief and mailto action. No card entry, payment success, order ID or receipt. |
| Pricing and other pages promised unverified outcomes | Initial review removed false guarantees; the subsequent owner-approved regional prices and scopes are documented above. Availability, delivery and terms are confirmed before payment. |
| Template handoff injected unrelated tech projects | Copies only the selected fictional sample’s fields. No fallback portfolio, invented degree dates, certifications or methodologies. Confirmation before replacing an existing draft. |
| Gallery cards had placeholder graphics and unsupported compatibility claims | Four original styles, renderer-generated PNG previews, full live previews and source-linked feature descriptions. Layout-only selection preserves the current draft; fictional example loading remains explicit. |
| Optional export photo appeared below the identity text | Top-right browser/print identity group and right-margin DOCX image anchor. Contact fields stay ordinary body text with reserved right space. New photos are cropped/resized locally; parser and Word/Google Docs limitations are disclosed. |
| Hidden preview measurements could contain old export text/photo data | Content-aware validation rejects stale measured blocks. Current fields and selected section order supply text, print and DOCX. |
| Country labels did not explain structures or sources | Twelve new-tab guidance links with suggested layout thumbnails, source scope and evidence limitations. National photo/biography rules are not inferred from a portal or one institution. |
| Cover letter loaded a fictional candidate automatically | New drafts are blank. Examples remain explicit, labelled choices; existing valid saved drafts are retained. Contact import reads the real resume draft. |
| Cover-letter Word export was HTML named `.doc` | Actual DOCX package, shared paragraph/list writer, A4 print document and escaped text. Word pagination is not guaranteed to match the browser. |
| Entire editor loaded on the homepage | Route-level code splitting, a loading state and a route error boundary. Static prerendered page content is retained. |
| Dependency audit reported a high-severity issue | Compatible patch update to transitive `body-parser`; no new payment or server service connected. |

## Acceptance checks

Latest template/country revision: **44/44 browser tests passed**, **25/25 document/parser/service-policy tests passed**, TypeScript passed, all **12 routes prerendered**, and `npm audit` reported **0 known vulnerabilities**. The layout sweep covers **91 route/viewport combinations** (13 routes × 7 sizes). The full browser report is preserved in ignored `.qa/browser-report-templates-full.json`. After a final heading-wrap and caption-position polish, the rebuilt app also passed five focused tests: the 375px/1440px route sweeps, Home/gallery accessibility baselines and gallery-image checks.

The main JavaScript file is now approximately 385 KB / 122 KB gzip, compared with approximately 715 KB / 202 KB gzip before route splitting. That is a bundle-size reduction, not a measured loading-time guarantee. PDF and DOCX libraries still load when those tools are used.

The service tests verify both regional price catalogs, matching package scopes/revision rounds, pricing-to-inquiry selection restoration after reload, BDT/USD amounts in downloaded briefs and email drafts, the owner-confirmed WhatsApp URL, the 24-hour reply distinction and small-phone human-help dialog focus. Browser tests inspect WhatsApp link targets; they do not send real customer messages or confirm that the recipient account is active.

The new template tests verify all four export styles and section ordering; layout-only preservation of career fields, original text and the job posting; explicit fictional replacement/cancellation; local persistence; current preview asset hashes; source resolution; new-tab links landing at the correct section; photo crop dimensions and top-right non-overlapping geometry; US/UK/hidden-photo omission; and stale-measurement protection. A multi-page synthetic PDF preserved all **30 contribution bullets** and matched the measured page count; the matching DOCX package retained every contribution and the right-margin anchor. This is browser/PDF geometry and DOCX package/text verification, not a Word/Google Docs visual sign-off. Detailed scope is in `TEMPLATE_GUIDE.md`.

The subsequent GitHub sync commit `519b69f` changed dependency lockfiles. Its npm lock omitted required parser/router/test packages and reverted `body-parser`; these entries were reconciled with the existing manifest and the tested `1.20.9` patch. A clean `npm ci --ignore-scripts --prefer-offline`, TypeScript, all 19 document/parser/service tests and a full production rebuild passed. That application bundle matches the one used by the 38 passing npm-installed browser tests.

**Bun compatibility follow-up — resolved:** the earlier unverified-Bun note is superseded. Bun 1.3.14 could not read the synced version 2 lockfile. `bun pm migrate` regenerated a version 1 lockfile from the verified `package-lock.json`, rather than simply changing its version marker. Direct package versions now agree with npm, including `react-router` 7.18.4 and `body-parser` 1.20.9. A separate clean installation in ignored `.qa/bun-lock-migration` passed `bun install --frozen-lockfile --ignore-scripts`, TypeScript, all **19** document/parser/service tests, the production build with **11** prerendered routes and all **38** browser tests. `npm audit` still reports **0** known vulnerabilities. This verifies the local Windows/Node build-tool path with dependencies installed by Bun; the host's actual deployment remains a separate check.

Run a fresh production build first:

```text
npm run lint
npm run test:resume
npm run build
npm run test:server
npm run test:browser
npm audit
```

`tests/browser/site.spec.ts` exercises all 13 routes at 320×568, 375×812, 390×844, 667×375 (landscape), 768×1024, 1024×768 and 1440×900. It checks page overflow and clipped button text, full-height menu geometry, keyboard boundaries, backdrop and route closing, desktop dropdowns, profile/contact/inquiry honesty, template handoff, checker-to-editor focus, storage failure and cover-letter DOCX content. `tests/browser/templates.spec.ts` adds the layout, source-link, real-preview and photo/export flows described above.

The automated accessibility baseline uses axe against WCAG 2.x A/AA tags. It is **not** a full WCAG conformance certification. Manual screen-reader, zoom, real-device keyboard and browser-specific print testing remain necessary. Local checks use installed Microsoft Edge/Chromium; actual iOS Safari and Android devices are not yet signed off.

The scripts keep traces, results and screenshots in `.qa/`, excluded from Git. Tests use synthetic candidate data only. No user resume is uploaded for testing.

## Outstanding plan gaps, in priority order

1. **Release/deployment verification:** publish the tested revision through the actual host workflow, check the live bundle and exercise the production phone flow. A GitHub push is not proof of a deployment. Validate the AI Studio workflow rather than assuming uploading `dist/` is the right publishing action.
2. **Real-device sign-off:** iPhone Safari, Android Chrome, landscape, browser zoom and virtual keyboard; printing/downloading and opening DOCX in Word and Google Docs.
3. **Public source traceability and policy pages:** template/country guidance now has public source links, review scopes and access limitations. The wider evidence register and owner-approved privacy/retention/service terms still require further work. FAQ answers are not a substitute for those policies.
4. **Template and regional breadth:** four genuinely distinct styles and twelve contextual, source-linked country guides are implemented. Nine layouts remain a roadmap goal. Region controls cover international/employer-specific, Bangladesh guidance and US/UK photo omission; the country guides are not twelve automatic national presets.
5. **Content:** `/guides` and the planned 20 source-linked articles, Bangla UI/content and `hreflang`, OG image and a meaningful unknown-route/404 experience are outstanding.
6. **Application ecosystem:** saved per-job versions, application tracker, interview-preparation workspace, deeper skills/title matching and fully linked Job Kit workflow remain roadmap items.
7. **Remote services:** the optional coach has a real server integration in this revision, with live provider configuration and durable scaled quotas still pending. Real authentication/cloud sync, subscriptions/job alerts, review-form submission and payments are not connected. Keys, credentials or card details must never be handled by a pretend client-only flow.
8. **Broader importer QA:** continue testing authorised, representative PDF/DOCX files; investigate the previously noted real-PDF page-count discrepancy. Our mapper does not inspect every PDF layout or verify spelling, facts or qualifications.

## Mentor recommendation

Ship in clearly named stages. First, stabilise and deploy the honest **free-core beta**: check → correct → download → recheck. Use real-device verification and inspectable output as release gates. Then deliver guides/regions/templates. Add tracker, accounts and AI only with a clear scope, privacy model and reliable capacity.

Do not market an unavailable feature as complete. Do not take payment through a disconnected interface. Keep tools, evidence and business promises consistent across the homepage, pricing, FAQs and order inquiry.
