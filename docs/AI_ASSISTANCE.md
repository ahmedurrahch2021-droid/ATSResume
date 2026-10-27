# Optional AI assistance — implementation decision

Status: **proposal; no provider connected**. Updated 28 October 2026.

The core product is usable without an API: local file extraction → findings → the same draft in the editor → guided edits → DOCX/PDF/TXT export → check the new file. AI should help with wording after this loop works.

## What “training it with our data” should mean initially

Use curated, source-linked guidance and example edits as context for each request, rather than fine-tuning a model. Retrieve only the relevant rule, country guidance and profession-specific examples. This is easier to correct, cheaper to maintain and easier to audit than fine-tuning. An API key grants access; it does not train a model or guarantee factual output.

The request contains the user-selected bullet/paragraph, facts the user supplies, the relevant job-posting excerpt, and the applicable writing guidance. Treat resumes and job postings as data, never as system instructions. Instruct the model to ask a question when an essential fact is missing; preserve titles, dates, skills, employers and numbers unless the user supplies a correction.

Return structured proposed edits: original text, suggested text, explanation and any unresolved questions. Show before/after; allow accept, edit, reject and undo. Re-run the deterministic checks after acceptance. Never generate an interview guarantee, an employer ATS score or fabricated achievements.

## Provider facts checked against official documentation

| Provider | Current constraint | Implication |
|---|---|---|
| Groq | Free limits are model- and organisation-specific; request and token limits both apply. Customer inference data is not retained by default, with reliability/abuse exceptions. All customers can enable zero data retention. | Worth evaluating with synthetic/anonymised examples and ZDR enabled. Review current model quality, terms and dashboard limits before choosing it. |
| Gemini Developer API | Unpaid-service terms permit product improvement and human review, and explicitly say not to submit sensitive, confidential or personal information. API clients serving the EEA, Switzerland or UK must use paid services. | Do not use an unpaid key for personal CVs. Removing the email alone does not make career history anonymous. A paid-service setup has different data terms. |
| OpenRouter | Free models: 20 requests/minute and 50/day; the daily allowance increases to 1,000 after at least $10 in credit purchases. Failed attempts count. The underlying provider's policy also matters. | An app-wide quota, not an allowance for each visitor. Pin the model/provider, require appropriate retention controls and disable silent routing to a different data policy. |
| Cerebras | Current public offer is a $5 trial after a verified payment method, expiring in 30 days; no automatically renewing permanent free tier. | Useful for evaluation, not a perpetual zero-cost production plan. |

Sources:
- Groq limits: https://console.groq.com/docs/rate-limits
- Groq data controls: https://console.groq.com/docs/your-data
- Gemini terms: https://ai.google.dev/gemini-api/terms
- OpenRouter limits/pricing: https://openrouter.ai/pricing
- OpenRouter ZDR: https://openrouter.ai/docs/guides/features/zdr
- Cerebras limits/trial: https://inference-docs.cerebras.ai/support/rate-limits

These are hosted services. Open-source/open-weight model licensing is a separate question from whether hosted inference is free, private or permitted for commercial use. A downloaded model also has compute and operating costs.

## Small-pilot architecture

1. Keep ordinary checking and editing local. No AI call on upload or on each keystroke.
2. The user explicitly requests an AI suggestion and sees which provider will receive which text. Update privacy wording to distinguish local tools from optional remote assistance. Human review is a separate sharing action too.
3. A Cloudflare Worker/Pages Function or Hostinger backend holds the key in a server secret. Never place it in a `VITE_*` variable, public bundle, localStorage or Git.
4. Enforce usage on the server: per-user daily limit, app-wide daily token budget, request size/output caps, timeouts and concurrency limits. Client-only counters are not enforcement.
5. Process the selected section rather than repeatedly sending the entire CV and research library. Cache reusable public guidance; avoid logging private prompts or returning provider credentials/errors.
6. Handle quota exhaustion honestly: keep the draft and local helper available; show when AI can be retried. Do not manufacture a successful rewrite or cycle keys to evade quotas.
7. Test factual preservation and usefulness on synthetic or explicitly authorised examples spanning Bangladesh, Gulf and other target roles. Track acceptance, corrections, latency and actual token usage before setting a public allowance.

Capacity is bounded by the smallest of request, token and budget limits. For example, **if** an account has 200,000 tokens/day and a rewrite averages 2,000 input+output tokens, the theoretical ceiling is about 100 rewrites/day before retries and burst limits. That is an illustration, not a promised quota or measured workload.

## Business positioning

Free: check, understand, edit, guided rewriting, download. Optional AI: a limited convenience pilot once a provider is configured. Human review: separately priced expertise and time. A future paid AI offer needs predictable capacity and a disclosed service scope; promotional free quotas cannot support an unlimited paid promise.

The defensible outcome is a clearer, accurate, job-relevant document with inspectable changes. “Perfect CV” and guaranteed interviews are not defensible outcomes.
