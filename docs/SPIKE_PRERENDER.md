# Spike: per-route prerendering (Step 2)

Branch: `spike/prerender-check` (throwaway; not for merge)
Question: Can this stack (Vite 8, React 19, react-router v7) produce a separate HTML file per public route, with its own title and H1, without running JavaScript?

## Method
- `react-router` v7 `StaticRouter` + `react-dom/server` `renderToString`.
- `scripts/spike-prerender.tsx` renders `/` (HomePage) and `/faq` (FaqPage).
- Writes `dist-spike/index.html` and `dist-spike/faq/index.html` (kept out of `dist/`).
- Each file gets its own `<title>`, meta description and canonical.

## Result: PASS
| Route | Output | Title | H1 present |
|---|---|---|---|
| `/` | `dist-spike/index.html` | ATSresume \| Free ATS Resume Checker & Templates | Yes |
| `/faq` | `dist-spike/faq/index.html` | Resume FAQ \| ATSresume | Yes |

- Each file contains its own page text, with no JavaScript required to read it.
- `tsc --noEmit` and `vite build` pass.

## Findings
1. **Routing works in SSR** with the existing components. No browser-only code was hit on these two pages.
2. **Shared content:** the home page renders the first five FAQ items (`FAQ_ITEMS.slice(0, 5)`), so the same answers appear on `/` and `/faq`. Before launch, the home page should either show a short teaser or link to `/faq`, so the two indexable pages don't compete for the same answers.
3. **Head tags are hard-coded in the spike.** The real version needs a single per-route metadata source (see the plan, §8).
4. **Hydration is not tested.** The spike renders HTML only. Phase 1 must confirm the client attaches to the prerendered markup without warnings.

## Limits of this spike
- Only two routes. The remaining routes (templates, pricing, about, contact, etc.) are not tested.
- No Vite plugin is used; the script runs after `vite build` as a separate step.
- No canonical domain yet.

## Decision
**Continue with Option A** (per-route prerendering) in Phase 1, pending owner approval of the next step. The spike found no blocker. Hydration checks and the full route list are required in Phase 1.
