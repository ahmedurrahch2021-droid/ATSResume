# Solo-operator launch plan — ATS Resume Lab

Updated: 28 October 2026.

**Status:** the revised prices, package scopes and contact policy are approved by the owner and implemented in the repository. Validation passed: 38 browser tests, 19 document/parser/service-policy tests, TypeScript, the production build with 11 prerendered routes, and zero known vulnerabilities from `npm audit`. Publication and live verification of this revision are separate. The existing menu/homepage update is now observed live. This document supersedes the earlier subscription/AI-first and free-Bangladesh-human-evaluation proposals.

## Approved direction

- Keep local checking, editing, guided fact-based wording, cover-letter editing and downloads free worldwide.
- Do not purchase or connect a paid AI service. Remote AI is deferred; the existing guided helper is rule-based, not an AI or grammar engine.
- Human resume evaluation, rewriting and application kits are paid services in Bangladesh and other countries. There is no free human-review entitlement or account quota.
- Charge for clearly scoped human assistance, not access to the free core.
- Operate support through email and WhatsApp `+8801748755209`. Reply to messages within 24 hours. Document-delivery dates are agreed separately before payment.
- Collect voluntary feedback on the site or by email. Never require a public comment, positive review, testimonial or messaging-group membership for access.
- Use the owner's approved regional prices below. Prices are one-time, not subscriptions. Honour any already-agreed customer price/scope; do not silently change an accepted order.
- Keep domain/search basics deferred: custom-domain DNS/HTTPS, canonical/sitemap migration, new 404 handling and a social-sharing image. Do not change `SITE_ORIGIN` or add staging `noindex`.

## Approved human-service prices and scope

| Package | Scope | Bangladesh | International |
| --- | --- | --- | --- |
| Human Resume Review | Written review and focused edits; one resume, one role, one revision round | ৳499 BDT | US$10 |
| Targeted Resume Rewrite | Rewrite one resume using supplied facts; one role, one revision round | ৳1,999 BDT | US$35 |
| Application Kit | Targeted resume, one cover letter, LinkedIn headline/About wording; one role, two revision rounds | ৳3,499 BDT | US$59 |

Ordinary two-/three-page resumes are included. The rewrite package does not include cover-letter or LinkedIn work; the kit does not promise full LinkedIn account management or interview coaching. Revision windows, cancellation/refund terms, eligibility and delivery dates are agreed before payment. No account or compulsory review is required to use the free core.

The earlier five-free-evaluations/week and one-free-evaluation/three-months proposals are superseded. The owner manages the paid queue manually and accepts work according to availability. The 24-hour reply policy does not imply that any package will be completed in 24 hours.

Regional selection is explicit, not based on a guessed IP location, nationality or a currency conversion. The local profile is not authentication. Do not collect NID/passport documents merely to use free tools or request human assistance.

The existing optional international 12-hour request carries a US$10 fee only if confirmed. No Bangladesh rush fee has been approved; show its base price and explain that an additional rush fee must be quoted separately. No payment is taken by the inquiry form.

No service promises a perfect CV, universal ATS compatibility, factual background verification or an interview.

## Finish the first release

| Priority | Work remaining | Acceptance condition |
| --- | --- | --- |
| 1 | Verify each published application revision | The current headline and full-height menu are now observed live. Publish and verify the new regional pricing/contact revision separately; deep routes and exported files still need a full deployed-flow sign-off. |
| 2 | Keep the approved service policy consistent | Repository Home, Pricing, Contact, FAQs, review inquiry and editor human-help links now distinguish free tools from paid human help in both regions. No free-Bangladesh human entitlement, old subscription or AI entitlement is advertised. |
| 3 | Complete the email-led evaluation handoff | A user can prepare a brief with their target role and main question, then choose to send it and attach a CV from their email app. Opening a mailto link is never reported as receipt or acceptance. |
| 4 | Establish the owner's service operation | Inbox labels or a private queue record track requested, awaiting details, accepted, reviewed and closed items. The owner confirms availability, scope and timing manually. Do not show invented live queue counts. |
| 5 | Publish source and policy pages | Public research URLs and caveats are inspectable. Privacy, retention/deletion, service scope, revision/cancellation/refund terms and feedback-publication consent reflect actual operations. FAQ links are not substitutes for policy pages. |
| 6 | Add optional feedback | Use an email-first flow initially, with separate publication permission. A genuine comment may be added manually with a date and optional display name. No sample testimonials, reward-for-review, selective positive invitations or private CV details. A stored review form needs spam controls and moderation before it is advertised as connected. |
| 7 | Complete document and device QA | Resolve the previously recorded real-PDF extraction/page-count discrepancy. Exercise check → edit → export → re-import on real iPhone/Android devices and inspect two-/three-page documents in Word and Google Docs. Record browser reflow differences instead of promising identical pagination. |
| Deferred | Domain and search basics | Paused by the owner: custom-domain DNS/HTTPS, canonical/sitemap migration, new 404 handling and social-sharing image. Keep the AI Studio origin and existing indexing behaviour unchanged. |

An ordinary mailto URL cannot attach the user's CV automatically. The interface must explain that the user attaches the document in their email app. A direct upload/send system would be separate backend work with privacy and security review.

Manual payment arrangements can support the first release if a legitimate method is confirmed, the scope/terms are agreed before payment and the customer receives an accurate acknowledgment. An automated checkout integration is optional; never show a disconnected checkout or request card credentials in a local form.

## Public deployment observation

Checked on 28 October 2026:

- Before the new pricing/contact revision, local application HEAD and GitHub `origin/main` were `58e09ebf874af786c0eb5a34c11c0852d810ddd1`.
- Following the owner's latest republish, `https://atsresumemaker.ai.studio/` shows “See what our reader extracts. Make your resume clearer.”
- The observed live bundle is `/assets/index-D3KRYWb5.js`; `#mobile-navigation` is a native dialog.
- Live Chromium checks confirmed the menu at 375×812 (375×812 panel) and 667×375 landscape (380×375 panel), initial close-button focus, navigation to Pricing and closing afterward. Evidence is in ignored `.qa/live-release-check.json`.
- These are targeted live deployment checks, not a full real-device/end-to-end sign-off. The new prices and WhatsApp details need verification after this revision is published.
- The earlier old-menu observation is superseded. Domain work is now deferred; no further domain configuration was attempted.

Verify the AI Studio project/branch and actual publish action. Do not assume that a repository sync or uploading `dist/` is the correct deployment action for this host.

## Broader ecosystem — after the first release

The original full-product vision is still larger than the first launch:

1. Nine genuinely distinct resume layouts, not nine labels for one layout. Preview and exports must share each implemented document style.
2. Twelve source-linked regional guidance profiles. Employer/application instructions take priority; government-form biography requirements are not blanket corporate-CV rules.
3. A guides hub and the planned source-linked articles, prioritising Bangladesh, Gulf applications, file checks and practical edits.
4. Bangla content and interface support, including readable document output and appropriate language metadata.
5. Saved per-job versions, a local-first application tracker and a guided interview-preparation workspace based on supplied facts. These do not require AI or cloud accounts.
6. Better supported vocabulary/skills comparison without invented qualifications or an employer ATS score.

Remote AI, account/cloud sync, subscriptions, job alerts and automated chat/payment integrations are deferred conveniences, not conditions for completing the honest solo-operator release. Retain working features; mark future features as planned or unavailable rather than silently deleting them.

## Owner details still needed

- Resume/feedback retention period, deletion-request process and the actual tools used to store emailed documents.
- Available legitimate payment method, receipt process and cancellation/refund terms for paid human services in both regions.
- Final reviewer availability before accepting document-delivery commitments. The owner has confirmed a 24-hour initial-reply policy; no daily support-hours restriction has been inferred.

Confirmed contacts are `ahmedur.rahch2021@gmail.com` and WhatsApp `+8801748755209`. No account, AI provider, payment route, retention period or further privacy promise is inferred.
