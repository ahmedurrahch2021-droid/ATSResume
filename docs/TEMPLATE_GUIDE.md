# Template and country guidance revision

Updated: 28 October 2026.

## Implemented layouts

| Layout ID | Gallery name | Default presentation |
| --- | --- | --- |
| `modern` | Modern Professional | Arial, warm accent, left identity, thin section rules |
| `classic` | Classic Chronological | Georgia, black text, centred identity, uppercase ruled headings |
| `compact` | Compact Professional | Calibri, black uppercase headings, closer spacing, no rules |
| `graduate` | Education-first Graduate | Calibri, education before work experience, black ruled headings |

All use 11 pt body/contact text, A4, ordinary body paragraphs and real DOCX lists. Relevant content can continue across pages. The fictional graduate fixture keeps its course project in Projects rather than presenting it as employment.

`Use this layout` applies the default font, accent, spacing and order to the existing draft. It preserves career fields, the source text, import report and target job description. Without a draft it opens blank fields. `Edit this example` intentionally loads sample facts and asks before replacing an existing career draft. This uses the same local/session draft bridge as the checker, including the storage-blocked fallback.

The workspace selector is under **Layout & region → Document layout**. Subsequent font/colour/spacing changes persist locally. The legacy JSON backup still contains career fields only; document settings live in the browser draft. A template selection does not change the application region or invent personal fields.

## Actual preview assets

Images in `public/images/templates/` are original PNG screenshots of `buildResumePrintHtml`, using the same `resumeStyles.ts` rules as the live paper preview. They show the first page of the labelled fictional sample. The full preview can show additional pages. DOCX uses matching layout settings, but its typography/pagination can reflow in another application.

Regenerate whenever the document model, paper styles or sample facts change:

```text
npm run previews:templates
npm run test:resume
npm run build
npm run test:browser
```

The generator uses the installed Playwright browser (Microsoft Edge on this Windows workspace). On other environments, use the available Chromium browser or set `PLAYWRIGHT_CHANNEL`. It writes the PNGs and a source-hash manifest to `public/images/templates/`, plus HTML/PDF/DOCX inspection copies to ignored `.qa/template-previews/`. Only the actual public preview assets/manifest are committed. An acceptance test checks the manifest against the current renderer so stale previews cannot silently ship.

## Photo placement

- Optional; no sample gallery image contains a photo by default.
- The live/print identity block reserves 112 px on the right for an 80 px image and keeps contact text in the document body. The identity group stays together during measured pagination.
- New JPEG/PNG uploads are decoded, oriented, centre-cropped and resized to a 512×512 JPEG in the browser. This makes new-upload pixels consistent between CSS and DOCX without a server image service. Older rectangular PNG/JPEG draft images receive a DrawingML centre-crop where dimensions can be read.
- DOCX places only the image in a right-margin `wp:anchor`, attached to the first identity paragraph. Body-text identity paragraphs reserve space with right indentation; no layout table, text box or page header is introduced. Circle uses an ellipse geometry; square uses a rectangle.
- US/UK mode omits photo and nationality from document outputs while retaining them in the local draft. Hidden photos are also excluded. Stale page measurements are rejected if their content differs, preventing old text or a previously enabled photo from being exported.
- MIT and Greenhouse explicitly identify graphics/photos as possible parsing problems. Right alignment does not establish universal ATS safety. Word/Google Docs rendering still requires application-level inspection; current automated checks inspect the package, extract text and verify browser/PDF geometry.

## Research and country scope

`resumeSources.ts` records 15 public references with publisher, URL, applied scope and verification status. The core layout references are:

- [MIT CAPD — Make your resume ATS-friendly](https://capd.mit.edu/resources/make-your-resume-ats-friendly/): readable fonts, conventional headings, file instructions and graphic/layout risks.
- [Harvard — Bullet point resume template](https://careerservices.fas.harvard.edu/resources/bullet-point-resume-template/): links original Word, accessible Word and Google Docs examples. They are linked, not republished as our templates.
- [Imperial — Writing a CV](https://www.imperial.ac.uk/careers/applications-and-interviews/cv/): relevant evidence, consistent structure and graduate section ordering. Broad ATS-scoring assertions are not adopted.
- [Greenhouse — Unsuccessful resume parse](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse): vendor-specific limitations, not every employer's configuration.

`/country-guides` is a prerendered public page containing twelve application profiles and four layout explanations. Home/gallery country cards and layout-source links open the relevant section in a new tab. Links to original sources also open separately. Native fragments are restored after the lazy page mounts.

The reviewed sources do **not** justify a mandatory national photo template:

- Bdjobs profile fields and government forms are distinct from a personalized corporate resume.
- NYU Abu Dhabi's examples concern students; its table suggestion conflicts with the MIT/Greenhouse parser advice, so the text layout stays linear.
- IIT Madras's public 2025–26 internship guide concerns that specific process, including no-contact and photo/logo rules. No private resume archive is copied or linked.
- Saudi ministry material establishes work-permit context only. Qatar is explicitly labelled general guidance because no primary Qatar-wide CV/photo rule was verified.
- Germany's federal portal was identified but returned an access challenge. Werk.nl direct access failed certificate verification. Both are marked further reading, not fully reviewed sources; no local photo rule is imposed from them.
- Canadian Job Bank directly discourages photos; France's Service Public treats photos as optional. The US EEOC statement is advice to employers about pre-offer requests, not a blanket prohibition on applicants.

No institutional endorsement, employer rejection prediction, universal winning template, score or hiring outcome is claimed. Nine layouts, fully automatic national formats and the wider article/tracker ecosystem remain roadmap work.
