# ATS Resume Lab — Locked Product & Design Strategy

**Status:** locked. Implementation follows this document. If a decision changes, it changes here first.
**Research base:** 44 verified sources (catalog v2) + 4 synthesis reports + master audit v2.
**Design base:** Warm Paper palette (ATSresume-site) × Enhancv structural discipline. Colour comes from the first; layout, spacing, type and component anatomy from the second. Neither brand's assets are copied.

### Implementation decisions — 28 October 2026 (supersede roadmap assumptions below)

- The former score engine has been replaced by `resumeAudit.ts`. There is no 27-check pass guarantee, overall ATS score or hiring prediction.
- The checker maps fields heuristically; “not recognised” is not the same as “absent from the document.” Original extracted text is available for manual correction.
- `/suite` now restores the same local draft and job description, offers section-specific fix links, and never auto-loads a sample based on timezone. Samples remain explicit, fictional examples.
- The free guided rewrite helper uses only facts supplied by the candidate. No remote AI is connected. Provider research and a limited opt-in pilot design are in `AI_ASSISTANCE.md`; fine-tuning is not required to start.
- DOCX is an actual OPC package and the PDF path uses the browser print engine. A4 page measurement is implemented; identical pagination in Word is not claimed.
- Public pricing remains the existing one-time $10 / $25 / $35 human-service packages, with availability and scope confirmed before payment. Proposed subscriptions, quotas, cloud accounts and payment integrations below are roadmap items, not shipped entitlements.
- Country controls do not assert universal photo or biography requirements. Follow the particular employer or application portal; government forms are not interchangeable with corporate resumes.
- The owner will delete the AI Studio app when the replacement is complete. No staging `noindex` change is requested.
- Mobile/reliability sign-off is tracked in `QUALITY_REVIEW.md`. The full ecosystem is not complete; roadmap copy must not describe planned integrations as shipped.
- Warning ink is now `#7b5c24` (same Warm Paper hue family) to pass small-text contrast on the warning surface. The prior `#8a6a2f` measured below 4.5:1.

---

## 0. The claim we are allowed to make

Every competitor says "beat the ATS." The research says that is the wrong promise, and it is also **false**:

- ATS software does not auto-reject on resume text, keywords or formatting. Auto-rejection runs only on human-configured knockout questions (Yes/No, single-select, multi-select) [S23, S39, A-EV-02].
- The "75% rejected before a human sees them" figure came from a 2011/12 press release by Preptel, a vendor that closed in 2013, with no published method or sample [A-EV-01, C1].
- The "6 seconds" figure is a **human** eye-tracking triage number (TheLadders 2012; 7.4s in 2018), not software processing time [A-EV-06, C2].
- What actually goes wrong is **misallocation**: 43% of real resumes contain at least one parsing error, and data lands in the wrong field [S19, S31, C1].
- Clearer, simpler writing raises hiring rates by ~8% in a randomised field experiment (NBER 30886) [A-EV-16].

So the promise is not "get past the robot." It is:

> **Your resume gets read correctly — by the parser, the recruiter, and the hiring manager — and it says the right thing for this specific job.**

That is provable. "Beat the ATS" is not.

**We never say:** "75% of resumes are rejected by ATS", "our score guarantees interviews", "ATS-proof", "95% accuracy", or any number we cannot attribute.

---

## 1. The product spine: the Job Kit

One job description in → one complete application kit out.

```
Paste job description
   ↓
Tailored resume  +  matching cover letter
   ↓
Readiness report (parse · format · content · match)
   ↓
Application record  →  interview prep
```

The homepage sells the outcome. The workspace holds the tools. Nobody is shown a directory of 20 features.

**Four invariants that keep the breadth from becoming chaos**

1. **One data model** — `ResumeData` is the spine. Cover letter, checks, match, tracker and interview prep all read from it.
2. **One design system** — one Button, Card, Input, Badge, Section. No page invents its own.
3. **One navigation** — Build · Check · Learn · Pricing · Workspace. Five items, never more.
4. **One workspace** — signed-in users see *their* kit, not a feature list.

---

## 2. Design system

### 2.1 Colour — Warm Paper

| Token | Hex | Use |
|---|---|---|
| `paper` | `#fbfaf7` | Page background |
| `surface` | `#ffffff` | Cards, header, paper preview |
| `soft` | `#f2f0e9` | Section bands, inset panels |
| `line` | `#e7e4dc` | Borders, dividers |
| `ink` | `#20211f` | Headings, body |
| `muted` | `#62645f` | Secondary text, captions |
| `accent` | `#8e533c` | Primary CTA, links, active state |
| `accent-hover` | `#6f4233` | Hover / pressed |
| `accent-soft` | `#f5e9e3` | Selected rows, badges |
| `accent-line` | `#c5a99a` | Decorative rules, input borders |
| `success` | `#34614d` | Pass, checkmarks |
| `success-soft` | `#e9f0e9` | Pass backgrounds |
| `warning` | `#7b5c24` | Caution; contrast-corrected for small text |
| `warning-soft` | `#f6efdf` | Caution backgrounds |
| `danger` | `#8c3b32` | Fail |
| `danger-soft` | `#f7e8e5` | Fail backgrounds |
| `neutral` | `#50514c` | Quiet labels |

No purple, no green brand gradient, no blue. Accent is used for **action**, not decoration — maximum two accent surfaces per viewport.

### 2.2 Type

| Role | Font | Size / weight |
|---|---|---|
| Display (H1) | Rubik | 56/60 → 40 mobile, 600 |
| H2 | Rubik | 40/44 → 32 mobile, 600 |
| H3 | Rubik | 24/32, 500 |
| H4 / card title | Rubik | 18/26, 500 |
| Body | Inter | 16/26, 400 |
| Body small | Inter | 14/22, 400 |
| Label / UI | Inter | 13/18, 500, +0.01em |
| Micro | Inter | 12/16, 500, uppercase +0.06em |
| Bangla UI | Noto Sans Bengali | inherits scale |
| **Resume canvas** | template font (Calibri, Arial, Georgia) | **never** Inter/Rubik |

Rule: UI type never appears inside the resume paper. The paper is a document, not a web page.

### 2.3 Space, radius, elevation

- 4px grid. Scale: `4 8 12 16 24 32 40 48 64 80 96`.
- Max width **1200px**, gutter **24px** (16 mobile). Editor uses full width with its own 320px form rail.
- Section padding **80px** desktop / **48px** mobile.
- Radius: card **8**, button **8**, input **6**, chip **5**, avatar **999**.
- Exactly **one** shadow: `0 1px 3px rgba(0,0,0,.08)`. Cards get it; sections do not.
- Focus: `3px solid accent`, `2px offset` — never removed.
- Motion: 150ms micro, 250ms panels, `prefers-reduced-motion` honoured.
- Breakpoints: **480 / 768 / 1024 / 1200**. Four, not eight.

### 2.4 Components (the complete set)

| Component | Spec |
|---|---|
| Button primary | accent bg, white text, 600, 44px, 8px radius, `8px 16px`, hover accent-hover |
| Button secondary | white bg, 1px line, ink text, hover soft bg |
| Button ghost | transparent, muted text, hover soft |
| Button danger-quiet | transparent, danger text — used only for delete |
| Input | white, 1px `accent-line`, 6px radius, 44px, focus ring accent |
| Select | as input, chevron, native on mobile |
| Textarea | as input, min 96px, auto-grow |
| Card | white, 1px line, 8px radius, 24px padding, one shadow |
| Card interactive | above + hover lift 1px + border accent-line |
| Chip | 5px radius, 11/16 500, soft bg, muted text; selected → accent-soft/accent |
| Badge status | pass/warn/fail variants from semantic pairs, always with text + icon |
| Section header | eyebrow (micro, accent) + H2 + one-sentence lede, max 60ch |
| Step indicator | 4 nodes, 1px connectors, current = accent fill |
| Paper sheet | A4 ratio, white, 1px line, shadow; page break indicator at 297mm |
| Table | only in UI, never in resume output; 44px rows, 1px dividers |
| Toast | bottom-centre, 8px radius, ink bg, white text, 4s |
| Modal | 24px radius-top on mobile sheet, 12px on desktop, max 560px |

**Forbidden in UI:** more than one primary button per viewport; more than two accent surfaces; icon-only buttons without `aria-label`; gradients; glassmorphism; animated counters that misrepresent data.

### 2.5 What we take from Enhancv, and what we refuse

Take: card anatomy, generous whitespace, one-CTA-per-section, template gallery pattern, pricing hierarchy, soft elevation, disciplined z-index (`10 / 90 / 100`), focus ring.

Refuse: green/purple brand, black→purple gradient, 58px H1 on mobile, 1351px max width with 8px gutters, eight breakpoints, their copy, illustrations, or layouts.

---

## 3. Information architecture

```
/                     Home — the promise + Job Kit + proof
/resume-checker       Free check (no signup)
/resume-templates     Gallery, 9 templates
/resume-examples     By role and level
/suite                Editor (build + check + export)
/cover-letter         Cover letter builder
/job-match            JD match (inside editor, standalone URL for SEO)
/guides               Learn hub
/guides/[slug]        20 launch articles
/pricing              Free · Pass · Pro · Human review
/how-it-works         Method + evidence
/faq                  Grouped FAQ
/about  /contact
```

Nav (5 items, max):

1. **Build** → Editor, Templates, Cover letter
2. **Check** → Resume checker, Job match
3. **Learn** → Guides, Examples, FAQ
4. **Pricing**
5. **Start free** (primary CTA)

Mobile: 44px hamburger, full-height sheet, same five groups, CTA pinned bottom. No horizontal scroll, ever.

---

## 4. Page blueprints

### 4.1 Home

1. **Hero** — H1: *"Your resume, read the way recruiters and software actually read it."* Sub: one line on parse + human + job fit. Primary CTA `Check my resume free`, secondary `See templates`. No signup. Right side: a live paper sheet with the check overlay.
2. **Truth strip** — three short, sourced facts (43% parse-error rate; no auto-rejection on text; 6–7s human triage). Links to `/how-it-works`. This is the differentiation, placed above the fold-equivalent.
3. **Job Kit** — four steps, one row, numbered.
4. **Six pillars** — Build · Tailor · Check · Apply · Learn · Expert. Each one card, one link. Never list 20 features.
5. **Template gallery** — 3 visible + "all 9". Each card shows engine badge (`ATS-safe` / `Designed`).
6. **Country presets** — BD · Gulf · UK · US · EU. Flag + one-line rule (photo, length, personal fields).
7. **Proof** — evidence cards with source count and dates, not fake testimonials.
8. **Pricing preview** — free core, paid human review.
9. **FAQ** — 6 items, the myth questions first.
10. **Final CTA** — single button.

### 4.2 Resume checker (the acquisition page)

- Drop zone accepts PDF, DOCX, TXT. On-device extraction; nothing uploaded.
- Result = **Readiness report**, not a score. Three parts:
  - **Parse report** — what a parser would extract: name, email, phone, roles, dates, education. Show the extracted values. Missing fields are the finding.
  - **Format report** — columns, tables, text boxes, images, headers/footers, fonts, file type, hyphenated breaks, letter-spacing.
  - **Content report** — dates present, quantified bullets, action verbs, section headings, length vs. country preset, first-person pronouns, vague quantifiers.
- Every finding: severity, plain-English reason, **one-click fix** or a link to the guide, and a **source tag**.
- Bottom: "This is not a rejection prediction" — explicit, permanent.

### 4.3 Editor (`/suite`)

- Two panes: form rail 360px (sticky, scrolls independently) + paper canvas.
- Sticky toolbar: template switcher · country preset · page indicator · **Export** split-button (PDF / DOCX).
- Paper: true A4 (210×297mm), 2–3 pages supported, page break markers, overflow warning when a bullet crosses a page badly.
- ATS-safe templates: single column, no tables, no text boxes, contact block in body, standard headings.
- Right rail (collapsible): live readiness findings, filtered by section.
- Autosave to localStorage; explicit "Export data" JSON; no account required to build.

### 4.4 Templates

Nine templates in two engines:

| Engine | Count | Guarantee |
|---|---|---|
| **ATS-safe** | 6 | Single column, body-flow text, standard headings, no tables/text boxes/images, DOCX-native |
| **Designed** | 3 | Still single-column text flow; typographic emphasis only; flagged as "not for strict parsers" |

Each card: engine badge, best-for, page count, and a "why this is safe" line. No "ATS score 98%" badges — that is a fake metric.

### 4.5 Guides

MDX in repo, prerendered. 20 launch articles, each with author, `lastUpdated`, sources, and a tool CTA. The first six are the myth series, because they earn trust and traffic.

### 4.6 Pricing

Four columns: **Free** · **Pass (BDT 299/mo)** · **Pro (USD 9/mo)** · **Human review (BDT 1,490+)**. One table, no hidden rows. Every limit stated numerically.

---

## 5. The check engine (the actual product)

Deterministic, in-browser, explainable. No "AI score."

### 5.1 Parse layer

| ID | Check | Severity | Evidence |
|---|---|---|---|
| P1 | Text extractable from file (not image-only) | fail | [S5, S31 D1] |
| P2 | Name detected in first 5 lines of body flow | fail | [D1 headers] |
| P3 | Email detected | fail | [S5] |
| P4 | Phone detected (with country format hint) | warn | [S5] |
| P5 | ≥1 role with start and end date | fail | [S5] |
| P6 | Education institution detected | warn | [S5] |
| P7 | Section headings match a standard vocabulary | warn | [S5, S3] |

### 5.2 Format layer

| ID | Check | Severity | Evidence |
|---|---|---|---|
| F1 | Multi-column layout detected | fail | [D1; 67% vs 89% iCIMS direction] |
| F2 | Table used for layout | fail | [D1, S30] |
| F3 | Text box / floating frame | fail | [D1] |
| F4 | Contact details inside header/footer | fail | [D1] |
| F5 | Image or icon carrying information | fail | [D1] |
| F6 | File > 2.5 MB | warn | [D1 Greenhouse] |
| F7 | Font not in the safe set | warn | [S30, S6] |
| F8 | Body text below 10pt | warn | [S30] |
| F9 | Hyphenated line break inside a keyword | warn | [S30, D1] |
| F10 | Artificial letter spacing | warn | [D1] |
| F11 | Decorative Unicode (→ ✓ emoji) in body | warn | [D1] |
| F12 | Scanned PDF | fail | [S5] |

### 5.3 Content layer

| ID | Check | Severity | Evidence |
|---|---|---|---|
| C1 | Summary present and 2–4 lines | warn | [S3, S22] |
| C2 | ≥50% of bullets contain a number | warn | [S22, S20] |
| C3 | Bullets start with a strong verb | warn | [S22, S30] |
| C4 | No first-person pronouns | warn | [S22] |
| C5 | No vague quantifiers ("various", "several", "etc.") | warn | [S30] |
| C6 | No duplicated bullet text | warn | [S22] |
| C7 | Page length matches country preset | warn | §6 |
| C8 | Date format consistent across entries | warn | [S5] |
| C9 | No unexplained abbreviations | warn | [S5, S30] |
| C10 | Spell/grammar pass (local dictionary) | warn | [S6] |

### 5.4 Match layer

| ID | Check | Severity | Evidence |
|---|---|---|---|
| M1 | Top JD skills present verbatim | warn | [S3, S6] |
| M2 | Skill appears in a bullet, not only in a list | warn | [S3, S5] |
| M3 | Title alignment (resume title vs JD title) | warn | [D2 40.8% title mismatch] |
| M4 | Keyword density ceiling (no stuffing) | warn | [S6] |
| M5 | Seniority signal (years, scope, ownership) | warn | [S22] |

**Scoring policy.** We show *counts and states*, not a percentage, except for job match — and job match is clearly labelled "keyword coverage against this description" with the method disclosed. Rationale: a single opaque number is exactly the thing the research says is misleading.

---

## 6. Country presets

Twelve presets, each changing: photo, personal fields, length, section names, spelling, date format, and file-type advice.

| Country | Photo | Personal fields | Length | Name | Notes |
|---|---|---|---|---|---|
| **Bangladesh** | Required, 300×300 JPEG | DOB, father, mother, NID, religion, blood group, marital status, full address | 2–3 | CV / Resume | Teletalk AllJobs standard; SSC/HSC detail expected [A-EV-09] |
| **India** | Optional (govt: required) | DOB, address common | 1–2 | Resume / CV | Single-source flag [A-Country] |
| **UAE** | Expected | Nationality, visa status | 2 | CV | Sponsorship logistics [A-EV-10] |
| **Saudi Arabia** | Expected | Nationality, visa status | 2 | CV | Nitaqat/Saudization context [A-Country] |
| **Qatar** | Expected | QID / visa status | 1–2 | CV | Single-source flag [A-Country] |
| **United States** | **Omit** | None (city/state/ZIP only) | 1–2 | Resume | EEOC pre-offer guidance [A-EV-07] |
| **United Kingdom** | **Omit** | None | 2 | CV | Equality Act 2010, blind screening [A-EV-08] |
| **Canada** | **Omit** | None | 1–2 | Resume | Human rights codes [G4] |
| **Australia** | **Omit** | Work rights statement | 2–3 | Resume | [A-Country] |
| **Germany** | Expected (`Bewerbungsfoto`) | DOB traditional | 2 | Lebenslauf | Tabular; AGG applies [A-Country] |
| **France** | Common, declining | — | 1 | CV | 1 page strongly preferred [A-Country] |
| **Netherlands** | Optional, declining | — | 1–2 | CV | Direct tone [A-Country] |

**Conflict handling.** Photo inclusion is jurisdiction-dependent, and the UI says so. Selecting US/UK/CA silently strips the photo block and shows a one-line reason with a source link. Selecting BD/Gulf adds it and explains why. We never pick a side silently.

**Qatar and India are flagged single-source.** The UI labels them "limited sourcing" rather than presenting them as verified.

---

## 7. Export

| Format | Requirement | Why |
|---|---|---|
| **DOCX** | Valid OPC zip: `[Content_Types].xml`, `_rels/.rels`, `word/document.xml`, `word/_rels/document.xml.rels`, styles, sectPr | Best parse fidelity; bypasses OCR coordinate scanning [D3] |
| **PDF** | Real text layer, embedded fonts, `@page` via paged.js or print CSS | 89→84 vs DOCX on iCIMS direction; still required for humans [D3] |
| **TXT** | Plain, plain-text test | Mirrors the free self-test the sources recommend [S30] |

Rules:
- DOCX default for ATS submissions; PDF for email/human; both offered, with a one-line "which and why".
- Fonts embedded so layout never reflows [H4].
- Max output 2.5 MB (Greenhouse parity) [D1].
- Page count must equal the paper preview. Verified in tests.

---

## 8. Cover letter spec

Structure from the cover-letter sources [S14, S15, S16, S22, S24, S44]:

1. Header matching the resume (name, contact, date).
2. Salutation — named person when the JD exposes one, otherwise role-based, never "To Whom It May Concern" [S14].
3. Hook — one specific sentence tying the candidate to the company's problem [S22].
4. Body 1 — the single strongest, quantified match.
5. Body 2 — a second match plus why this company.
6. Close — clear next step, no begging [S44].
7. 250–350 words, one page, same font family as the resume.

Builder behaviour: pulls `ResumeData`, offers modular paragraph cards, warns on generic phrasing, exports DOCX and PDF. Never invents experience.

---

## 9. Freemium and pricing

| | Guest | Free | Pass (BDT 299/mo · 2,499/yr) | Pro (USD 9/mo) |
|---|---|---|---|---|
| ATS check | 3/day | 10/day | 50/day | Fair use 500/day |
| PDF export | 3/day | 10/day | 50/day | 500/day |
| DOCX export | 1/day | 5/day | 30/day | 200/day |
| Templates | 3 | 6 | 9 | 9 |
| Cover letters | preview | 2 | 15 | unlimited |
| Job match | 1/day | 5/day | 25/day | 200/day |
| AI rewrite | — | 5/mo | 30/mo | 300/mo |
| Cloud sync | — | 1 resume | 10 | unlimited |
| Human review | — | — | add-on | add-on |

Human review: BDT 1,490 / 2,990 / 4,990 against USD 19 / 39 / 69.

**BD Talent Fund:** 20 free human reviews per month for students, funded by paid packages. Published, capped, honest.

**Positioning line:** *Free core. Paid expertise. Optional convenience.*

Cost logic: software and checks run in the browser (≈zero marginal cost); content is written once; human time and AI tokens are metered because they cost money.

---

## 10. Technical architecture

```
src/
  core/        ResumeData schema, storage, migrations, analytics
  ui/          Button, Card, Input, Badge, Section, Modal, Toast, Paper
  features/
    resume/    editor, sections, pagination
    checker/   parse, format, content, match rules
    export/    docx, pdf, txt
    cover-letter/
    templates/
    guides/
    tracker/
    interview/
  pages/       composition only
```

**Feature registry** (`src/features/registry.ts`) — one row per feature: id, route, nav group, status (`live | beta | hidden`), data dependencies, cost class. This is how 20 features stay manageable and how unfinished work hides without being deleted.

**Data model** — extend the existing `ResumeData`, do not fork it:

```ts
ResumeData
 ├ identity        fullName, targetTitle, email, phone, location, links
 ├ personal        photoUrl, dob, nationality, visaStatus, nid, parents[]  (preset-gated)
 ├ sections[]      experience | education | projects | certifications | custom
 ├ skills          grouped, ordered by JD relevance
 └ meta            targetMarket, templateId, pageTarget, version
```

**Pagination** — measure rendered block heights against A4 content box (297mm − margins). Never split a bullet mid-line; keep a role header with at least one bullet ("keep-with-next"). Show real page count, block export on mismatch.

**Storage** — localStorage first, optional account sync. Files never leave the device unless the user chooses. This is a feature, and it goes in the hero.

**Performance budget** — first paint < 1.5s on 3G-fast; editor interactive < 2.5s; no dependency > 100KB gzip without justification; no web fonts blocking the resume paper.

**Accessibility** — WCAG 2.2 AA: contrast ≥ 4.5:1, visible focus, 44px targets, labelled controls, `aria-live` on check results, full keyboard path through the editor, no colour-only status.

**SEO** — every public page prerendered; one H1; schema (`SoftwareApplication`, `FAQPage`, `HowTo`); internal links from every guide to a tool; no thin template pages.

---

## 11. What is already built (keep, don't rebuild)

| Existing | Fate |
|---|---|
| `SuitePage` editor + live preview | Keep, extend to multi-page |
| `atsScanner.ts` | Keep the heuristics, re-map to the rule IDs in §5, add parse/format layers |
| `jobMatcher.ts` | Keep, add title normalisation and density ceiling |
| `fileExtractor.ts` | Keep; add image-only PDF detection |
| `coverLetter` editor + exporter | Keep; replace `.doc`-HTML export with real DOCX |
| Templates (4) | Expand to 9, tag by engine |
| Pricing/Order/Consultation | Keep, restructure around Free/Pass/Pro/Review |
| FAQ, Examples, About, Contact, How it works | Keep, rewrite copy to the evidence |
| `mockData.ts` | Keep; add `sources` metadata for evidence cards |

Nothing is removed. Everything is re-seated into the Job Kit.

---

## 12. Roadmap

**Phase 1 — Foundation (design + truth)**
Tokens, primitives, nav, footer, home. Evidence strip wired to real source data. Build stays green.
*Done when:* all five nav groups work on mobile and desktop; home passes contrast and keyboard checks; `tsc` and `build` pass.

**Phase 2 — The checker**
Parse/format/content/match layers with rule IDs, severity, source tags. Standalone `/resume-checker`. No score.
*Done when:* a single-column DOCX passes all F-checks; a two-column PDF fails F1 with the correct explanation; results are keyboard readable.

**Phase 3 — Editor and export**
Multi-page, country presets, 9 templates, real DOCX export, PDF with embedded fonts.
*Done when:* a 3-page BD resume exports to DOCX that opens in Word with identical page count; US preset strips photo and personal fields.

**Phase 4 — Job Kit**
JD paste → match report + cover letter + tracker + interview questions.
*Done when:* one paste produces resume match, cover letter draft, and a tracker record.

**Phase 5 — Content and trust**
Guides, myth series, evidence page, methodology, source register.

**Phase 6 — Accounts and billing**
Sync, limits enforcement, Pass/Pro, bKash + SSLCommerz.

---

## 13. Source register and confidence

| Grade | Meaning | Use in product |
|---|---|---|
| **A — Primary** | Government, statute, standards body, vendor documentation, peer-reviewed | State as fact |
| **B — Institutional** | University career centre, established research org | State with attribution |
| **C — Secondary** | Commercial tool citing primary docs | Use as direction, never as a guarantee |
| **D — Unreliable** | Unsourced marketing | Cite only as a myth being corrected |

Key grades:

| Claim | Grade | Source |
|---|---|---|
| No auto-rejection on resume text | **A** | Greenhouse docs, iCIMS, Workday [S23, S39] |
| 43% of resumes have ≥1 parse error | **B** | Sovren/Textkernel [S19, S31] |
| iCIMS 89/84/67% field accuracy | **C** | Third-party batch test citing vendor docs — direction only |
| Workday 68% ghosting on 2-col PDFs | **C** | Technical teardown — direction only |
| Greenhouse 2.5 MB parse limit | **A** | Vendor documentation |
| 40.8% of job titles are non-standard | **B** | 1.8M-profile audit |
| 6–7.4s recruiter triage | **B** | TheLadders 2012/2018 |
| 92% of recruiters report no auto-reject | **C** | 25-recruiter survey — small sample, say so |
| 8% hiring lift from clearer writing | **A** | NBER 30886 |
| EEOC / Equality Act / GDPR / LL144 / EU AI Act | **A** | Statute and regulator |
| BD portal requirements | **A** | Teletalk AllJobs, Labour Rules 2015 |
| Country norms for 9 non-US/UK nations | **B/C** | Mixed; Qatar and India flagged single-source |

**Known unknowns, stated publicly:** no independent public benchmark for parser accuracy exists (GDPR blocks it); AI auto-ranking adoption percentages are unpublished; mobile-vs-desktop completion data for Bdjobs does not exist. The site says this on `/how-it-works` rather than hiding it.

---

## 14. The bar for "best"

"Best in the world" is not a design decision, it is a distribution claim. What we can build and defend:

1. **Most honest** — the only resume tool that publicly corrects the 75% myth and refuses a fake score.
2. **Most accurate for Bangladesh** — the only tool with a Teletalk/Bdjobs-aware preset and a Gulf preset.
3. **Most trustworthy on privacy** — files never leave the browser.
4. **Most complete** — resume, letter, match, tracker, interview, guides, in one flow.
5. **Fastest to a finished application** — one JD paste, one kit.

Those five are achievable and testable. "Best" as a slogan is not, and using it would contradict everything in §0.

---

## 15. Non-negotiables

1. No claim without a source.
2. No score without a disclosed method.
3. No file upload without consent.
4. No feature removed to make room for a new one.
5. No page invents its own components.
6. No preset silently changes a user's document — every change is explained.
7. No fabricated testimonials, user counts, or success rates.
8. Build and typecheck stay green after every change.
