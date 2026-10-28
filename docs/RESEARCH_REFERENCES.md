# Research carousel and source provenance

Added 29 October 2026. The homepage carousel appears immediately after the hero. MIT CAPD, Harvard, Greenhouse and NBER lead the sequence, followed by Bdjobs, Imperial College London, NYU Abu Dhabi and IIT Madras.

The source URL comes from `src/data/resumeSources.ts`; the source-to-product explanation and logo metadata live in `src/data/researchHighlights.ts`. Each logo/card opens the specific supporting document, rather than the publisher's homepage. All eight document URLs returned HTTP 200 when checked on 29 October 2026; NYU and IIT links returned PDFs.

## What each reference contributes

| Source ID | Used for | Boundary |
| --- | --- | --- |
| `mit-ats` | Conventional structure, linear body text and rechecking extracted text | Guidance is not validation of our parser or a universal hiring rule. |
| `harvard-bullet` | Section hierarchy and concise contribution bullets | Our layouts are independent; we do not resell the university's template. |
| `greenhouse-parse` | Inspecting complex structure and keeping contact details in body text | The vendor documents its own parser; other systems can differ. |
| `nber-writing` | Attention to writing clarity and careful wording assistance | Working paper 30886 studies another intervention and labor market. Its results are not ATS Resume Lab's performance or a predicted outcome for an individual. |
| `bdjobs-resume` | Bangladesh application context and the distinction between profile fields and a separate uploaded resume | A platform's fields are not a country-wide CV requirement. |
| `imperial-cv` | Relevant evidence, section order and CV presentation | We do not adopt its broader ATS-scoring statements. |
| `nyuad-cv` | Early-career projects, skills and evidence-based contributions | Student-focused length advice is contextual; our linear document structure differs from its table suggestion. |
| `iitm-internship` | Substantiating claims and identifying academic projects | Logo/contact rules in its internship process are not national rules. |

The carousel explicitly says **“References, not endorsements.”** It contains no partner badges, institutional certification, customer testimonials or product hiring-success claims. Government employment resources and all other source-registry entries are accessible at `/country-guides#source-library`, including clearly identified further-reading entries whose direct access was not verified. The method page also opens the Greenhouse and NBER documents alongside the relevant evidence cards.

## Official logo assets

Files are served locally from `public/images/research/`. The SVG drawings and PNG pixels were obtained from the publishers' own websites; no logo was AI-generated, traced, stretched or recolored. The two Harvard marks share one card. NYU's supplied white mark is displayed on a dark background.

| File | Official asset or extraction source |
| --- | --- |
| `mit-capd.svg` | [MIT CAPD asset](https://capd.mit.edu/wp-content/themes/uConnect_MIT/images/mit-capd-left.svg?v=2), also linked by the source page via `https://cdn.uconnectlabs.com/wp-content/themes/uConnect_MIT/images/mit-capd-left.svg?v=2` |
| `harvard-fas.svg` | [Harvard FAS asset](https://careerservices.fas.harvard.edu/wp-content/themes/uConnect_Harvard_Arts_Science/images/harvard-fas-logo.svg); its source page uses the equivalent `cdn-careerservices.fas.harvard.edu` URL |
| `harvard-mignone.svg` | [Harvard Mignone Center asset](https://careerservices.fas.harvard.edu/wp-content/themes/uConnect_Harvard_Arts_Science/images/mignone-center-logo.svg); same official CDN host as above |
| `greenhouse.svg` | [Greenhouse Support asset](https://support.greenhouse.io/hc/theming_assets/01KBZEY1J36XE7J09QJQV64J5K), used by the desktop `.nav__logo` rule in its published support-site stylesheet |
| `nber.svg` | Verbatim inline SVG inside `.header__branding` on [the NBER paper page](https://www.nber.org/papers/w30886), rendered with its standalone default black fill |
| `imperial.svg` | Verbatim inline SVG inside `.header__logo` on [the Imperial CV page](https://www.imperial.ac.uk/careers/applications-and-interviews/cv/), with its original `currentcolor` paths rendered in standalone black |
| `nyu-abu-dhabi.svg` | [NYU Abu Dhabi white logo](https://nyuad.nyu.edu/apps/nyuad/docroot/icons/nyuad-logo-white.svg), linked by its Career Development page |
| `bdjobs.svg` | [Bdjobs logo](https://bdjobs.com/images/bdjobsLogo.svg) |
| `iit-madras.png` | [IIT Madras header logo](https://www.iitm.ac.in/themes/custom/iitm/assets/images/iitm_logo.png), linked by its official homepage; intrinsic size 272 × 60 px |

Retrieved 29 October 2026. Publisher names and marks remain their respective owners' property and identify cited documents. The copied SVGs contain no scripts, event handlers, foreign objects or external-resource dependencies. Logos are loaded as images with explicit intrinsic dimensions and text alternatives.

## Interaction and maintenance

- Native horizontal scrolling and scroll snap support touch/trackpad use. Previous/next buttons provide a keyboard alternative; ordinary Tab navigation reaches every source link.
- The source count updates after scrolling and resizing. The carousel does not rotate automatically. Manual scrolling respects reduced-motion preferences.
- The public source library and the method links use the same registry, avoiding competing source URLs.
- When changing a citation, check the actual document and its scope, not merely whether the logo or homepage still loads. Update the recorded provenance if a publisher replaces its mark.

## Private beta feedback

`src/components/home/FeedbackSection.tsx` provides the homepage `#feedback` section; every page's footer links to it. A comment is required, while a name is optional. Bangla/English, newlines and special characters are preserved in the preview, email and WhatsApp drafts.

Preparing feedback creates an editable message on the page. The visitor chooses email, WhatsApp or copying, then sends it from their own app. The site does not POST the feedback, store it in a database/browser storage, publish it, attach a resume/conversation, or claim delivery. Editing the original fields invalidates an older prepared draft. Blocked clipboard access offers manual selection instead.

The canonical contact and 24-hour reply policy come from `src/data/servicePolicy.ts`. The owner receives only messages the visitor actually sends. Receiving private feedback does not grant permission to publish it as a testimonial.
