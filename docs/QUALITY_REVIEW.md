# Release review — mobile, reliability and product honesty

Review date: 28 October 2026. Scope: the repository build, not a claim that the AI Studio deployment is current.

## Verdict

**The full planned ecosystem is not complete.** The free check → edit → export loop is implemented, but a successful TypeScript/build run does not establish responsive behaviour, accessibility, working integrations or launch readiness.

The earlier statement that only deployment remained was incorrect. This review adds browser-level acceptance tests and separates actual capabilities from roadmap items.

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
| Pricing and other pages promised unverified outcomes | Existing one-time $10/$25/$35 scope retained; availability and terms confirmed before payment. No fake guarantees, customer results or ATS scores. |
| Template handoff injected unrelated tech projects | Copies only the selected fictional sample’s fields. No fallback portfolio, invented degree dates, certifications or methodologies. Confirmation before replacing an existing draft. |
| Cover letter loaded a fictional candidate automatically | New drafts are blank. Examples remain explicit, labelled choices; existing valid saved drafts are retained. Contact import reads the real resume draft. |
| Cover-letter Word export was HTML named `.doc` | Actual DOCX package, shared paragraph/list writer, A4 print document and escaped text. Word pagination is not guaranteed to match the browser. |
| Entire editor loaded on the homepage | Route-level code splitting, a loading state and a route error boundary. Static prerendered page content is retained. |
| Dependency audit reported a high-severity issue | Compatible patch update to transitive `body-parser`; no new payment or server service connected. |

## Acceptance checks

Latest production-build run: **33/33 browser tests passed**, **15/15 document/parser tests passed**, TypeScript passed, all **11 routes prerendered**, and `npm audit` reported **0 known vulnerabilities**. The layout sweep covers **84 route/viewport combinations** (12 routes × 7 sizes).

The main JavaScript file changed from approximately 715 KB / 202 KB gzip to 366 KB / 116 KB gzip. That is a bundle-size reduction, not a measured loading-time guarantee. PDF and DOCX libraries still load when those tools are used.

Run a fresh production build first:

```text
npm run lint
npm run test:resume
npm run build
npm run test:browser
npm audit
```

`tests/browser/site.spec.ts` exercises all 12 routes at 320×568, 375×812, 390×844, 667×375 (landscape), 768×1024, 1024×768 and 1440×900. It checks page overflow and clipped button text, full-height menu geometry, keyboard boundaries, backdrop and route closing, desktop dropdowns, profile/contact/inquiry honesty, template handoff, checker-to-editor focus, storage failure and cover-letter DOCX content.

The automated accessibility baseline uses axe against WCAG 2.x A/AA tags. It is **not** a full WCAG conformance certification. Manual screen-reader, zoom, real-device keyboard and browser-specific print testing remain necessary. Local checks use installed Microsoft Edge/Chromium; actual iOS Safari and Android devices are not yet signed off.

The scripts keep traces, results and screenshots in `.qa/`, excluded from Git. Tests use synthetic candidate data only. No user resume is uploaded for testing.

## Outstanding plan gaps, in priority order

1. **Release/deployment verification:** publish the tested revision through the actual host workflow, check the live bundle and exercise the production phone flow. A GitHub push is not proof of a deployment. Validate the AI Studio workflow rather than assuming uploading `dist/` is the right publishing action.
2. **Real-device sign-off:** iPhone Safari, Android Chrome, landscape, browser zoom and virtual keyboard; printing/downloading and opening DOCX in Word and Google Docs.
3. **Public source traceability and policy pages:** the current evidence register has research identifiers and caveats. Public source links, review of remaining country/legal wording, owner-approved privacy/retention and service terms are still required. FAQ answers are not a substitute for those policies.
4. **Template and regional breadth:** there are four profession starters using one document engine, not nine distinct templates. Region controls currently cover international/employer-specific, Bangladesh guidance and US/UK photo omission. Twelve fully implemented country presets are not shipped.
5. **Content:** `/guides` and the planned 20 source-linked articles, Bangla UI/content and `hreflang`, OG image and a meaningful unknown-route/404 experience are outstanding.
6. **Application ecosystem:** saved per-job versions, application tracker, interview-preparation workspace, deeper skills/title matching and fully linked Job Kit workflow remain roadmap items.
7. **Remote services:** real authentication/cloud sync, optional opt-in AI, subscriptions/job alerts, server-side submission and payments are not connected. Keys, credentials or card details must never be handled by a pretend client-only flow.
8. **Broader importer QA:** continue testing authorised, representative PDF/DOCX files; investigate the previously noted real-PDF page-count discrepancy. Our mapper does not inspect every PDF layout or verify spelling, facts or qualifications.

## Mentor recommendation

Ship in clearly named stages. First, stabilise and deploy the honest **free-core beta**: check → correct → download → recheck. Use real-device verification and inspectable output as release gates. Then deliver guides/regions/templates. Add tracker, accounts and AI only with a clear scope, privacy model and reliable capacity.

Do not market an unavailable feature as complete. Do not take payment through a disconnected interface. Keep tools, evidence and business promises consistent across the homepage, pricing, FAQs and order inquiry.
