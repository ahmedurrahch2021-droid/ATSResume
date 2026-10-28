import assert from 'node:assert/strict';
import test from 'node:test';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createEmptyCoverLetter, getCoverLetterBlocks, isCoverLetterData } from '../src/utils/coverLetterDocument';
import { buildCoverLetterDocx, buildCoverLetterPrintHtml } from '../src/utils/coverLetterExporter';
import { draftWithTemplate, resumeFromTemplate } from '../src/utils/templateResume';
import { ATS_TEMPLATES } from '../src/data/mockData';
import { RESUME_LAYOUTS } from '../src/data/resumeLayouts';
import { RESUME_SOURCES } from '../src/data/resumeSources';
import { COUNTRY_GUIDES } from '../src/data/countryGuides';
import { draftForResume } from '../src/utils/resumeDraft';
import { createEmptyResume, documentPlainText, getResumeDocumentBlocks, normalizeDocumentSettings } from '../src/utils/resumeDocument';
import { buildResumeDocx, buildResumePrintHtml } from '../src/utils/resumeExporter';

test('a new cover letter contains no fictional person, employer or achievement', () => {
  const letter = createEmptyCoverLetter();
  assert.equal(letter.sender.fullName, '');
  assert.equal(letter.opening, '');
  assert.deepEqual(letter.keyHighlights, []);
  assert.equal(isCoverLetterData(letter), true);
  assert.equal(isCoverLetterData({ ...letter, bodyParagraphs: 'not an array' }), false);
  assert.doesNotMatch(JSON.stringify(getCoverLetterBlocks(letter)), /Alex|Stripe|42%/);
});

test('cover letter DOCX preserves every section, uses lists and respects font size', async () => {
  const letter = createEmptyCoverLetter();
  letter.sender.fullName = 'Mina Rahman';
  letter.sender.email = 'mina@example.com';
  letter.opening = 'Used <internal> & external invoice records.';
  letter.bodyParagraphs = ['Prepared reports for the finance team.'];
  letter.keyHighlights = ['Reconciled supplier invoices.'];
  letter.closing = 'I would welcome a conversation about the role.';
  letter.fontFamily = 'mono'; letter.fontSize = 'spacious';
  const bytes = await buildCoverLetterDocx(letter);
  const zip = await JSZip.loadAsync(bytes);
  const xml = await zip.file('word/document.xml')!.async('string');
  const styles = await zip.file('word/styles.xml')!.async('string');
  assert.match(xml, /&lt;internal&gt; &amp; external/);
  assert.match(xml, /w:numPr/);
  assert.match(styles, /Courier New/);
  assert.match(styles, /w:sz w:val="24"/);
  const raw = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
  assert.match(raw.value, /Mina Rahman/);
  assert.match(raw.value, /welcome a conversation/);
});

test('cover letter PDF markup is A4, escapes input and has no inline scripts', () => {
  const letter = createEmptyCoverLetter();
  letter.opening = '<script>bad()</script>';
  letter.accentColor = 'red;}body{display:none}';
  const html = buildCoverLetterPrintHtml(letter);
  assert.match(html, /size:A4/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>|display:none/);
});

test('template handoff copies sample facts without injecting a generic tech portfolio', () => {
  const template = ATS_TEMPLATES.find((item) => item.id === 'finance-ops')!;
  const resume = resumeFromTemplate(template);
  assert.equal(resume.fullName, template.sampleContent.name);
  assert.equal(resume.email, 'david.vance@email.com');
  assert.equal(resume.projects.length, 0);
  assert.equal(resume.skills.methodologies, '');
  assert.deepEqual(resume.certifications, template.sampleContent.certifications);
  assert.equal(resume.experience[0].location, 'Chicago, IL');
  assert.equal(resume.location, 'Chicago, IL');
  assert.equal(resume.phone, '(555) 345-6789');
  assert.equal(resume.education[0].dates, '');
});

test('layout-only handoff retains the entire draft and never injects fictional facts', () => {
  const current = draftForResume({ ...createEmptyResume(), fullName: 'Mina Rahman', email: 'mina@example.com', additionalInformation: 'Original unmapped text' }, 'paste');
  current.jobDescription = 'An actual target job description';
  current.rawText = 'The original imported body text';
  current.source.fileName = 'My actual resume.docx';
  const before = structuredClone(current);
  for (const template of ATS_TEMPLATES) {
    const draft = draftWithTemplate(template, 'layout', current);
    assert.deepEqual(draft.resume, before.resume);
    assert.equal(draft.jobDescription, before.jobDescription);
    assert.equal(draft.rawText, before.rawText);
    assert.deepEqual(draft.source, before.source);
    assert.equal(draft.settings?.layout, template.layout);
    const blank = draftWithTemplate(template, 'layout');
    assert.equal(documentPlainText(blank.resume), '');
    assert.equal(blank.source.origin, 'blank');
    const example = draftWithTemplate(template, 'example', current);
    assert.equal(example.resume.fullName, template.sampleContent.name);
    assert.equal(example.source.origin, 'template');
    assert.equal(example.settings?.layout, template.layout);
  }
  assert.deepEqual(current, before);
});

test('saved pre-layout settings and incomplete style selections remain usable', () => {
  assert.deepEqual(normalizeDocumentSettings({ font: 'Georgia', spacing: 'compact', accent: '#123456' }), { layout: 'modern', font: 'Georgia', spacing: 'compact', accent: '#123456' });
  assert.deepEqual(normalizeDocumentSettings({ layout: 'classic' }), RESUME_LAYOUTS.find((layout) => layout.id === 'classic')!.settings);
  const corrupt = JSON.parse('{"layout":"unrecognised","font":"bad","spacing":"bad","accent":"red;}body{display:none}"}');
  assert.deepEqual(normalizeDocumentSettings(corrupt), RESUME_LAYOUTS[0].settings);
});

test('each layout preserves the supplied facts and section order in DOCX, PDF markup and text', async () => {
  const resume = resumeFromTemplate(ATS_TEMPLATES.find((template) => template.layout === 'graduate')!);
  for (const layout of RESUME_LAYOUTS) {
    const txt = documentPlainText(resume, layout.settings);
    const printHtml = buildResumePrintHtml(resume, layout.settings);
    const zip = await JSZip.loadAsync(await buildResumeDocx(resume, layout.settings));
    const xml = await zip.file('word/document.xml')!.async('string');
    const styles = await zip.file('word/styles.xml')!.async('string');
    const raw = (await mammoth.extractRawText({ buffer: Buffer.from(await buildResumeDocx(resume, layout.settings)) })).value;
    for (const output of [txt, printHtml, raw]) {
      assert.ok(output.includes('Jordan Miller'));
      assert.ok(output.includes('jordan.miller@email.com'));
      assert.ok(output.includes('Campus event reservation app'));
      const educationFirst = output.toLowerCase().indexOf('education') < output.toLowerCase().indexOf('work experience');
      // HTML's stylesheet also describes layout rules; compare document text below.
      if (output !== printHtml) assert.equal(educationFirst, layout.educationFirst);
    }
    const htmlBody = printHtml.split('<body>')[1];
    assert.equal(htmlBody.indexOf('data-block-id="education-heading"') < htmlBody.indexOf('data-block-id="experience-heading"'), layout.educationFirst);
    assert.match(styles, new RegExp(`w:ascii="${layout.settings.font}"`));
    assert.doesNotMatch(xml, /<w:tbl\b|<w:txbxContent|<w:headerReference|<w:drawing>/);
  }
  assert.equal(resume.experience.length, 1, 'a course project must not be presented as employment');
  assert.match(resume.projects[0].name, /course project/);
});

const PHOTO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/GQsAAAAASUVORK5CYII=';

test('enabled photo is anchored at the right and contact details remain ordinary text', async () => {
  const resume = { ...createEmptyResume(), fullName: 'Mina Rahman', email: 'mina@example.com', photoUrl: PHOTO, photoShape: 'circle' as const, summary: 'A supplied summary.' };
  const settings = RESUME_LAYOUTS[1].settings;
  const bytes = await buildResumeDocx(resume, settings);
  const zip = await JSZip.loadAsync(bytes);
  const xml = await zip.file('word/document.xml')!.async('string');
  assert.match(xml, /<wp:anchor\b/);
  assert.match(xml, /<wp:positionH relativeFrom="margin"><wp:align>right<\/wp:align>/);
  assert.match(xml, /<w:ind w:right="1680"\/>/);
  assert.match(xml, /<a:prstGeom prst="ellipse"/);
  assert.doesNotMatch(xml, /<wp:inline|<w:tbl\b|<w:txbxContent|<w:headerReference/);
  const paragraphs = xml.match(/<w:p>[\s\S]*?<\/w:p>/g)!;
  assert.ok(paragraphs[0].includes('Mina Rahman') && paragraphs[0].includes('<wp:anchor'));
  const raw = (await mammoth.extractRawText({ buffer: Buffer.from(bytes) })).value;
  assert.match(raw, /^Mina Rahman/);
  assert.match(raw, /mina@example.com/);
  const txt = documentPlainText(resume, settings);
  assert.match(txt, /Mina Rahman\nmina@example.com/);
  assert.doesNotMatch(txt, /data:image/);
});

test('hidden and US/UK photos are excluded, including when measured preview data is stale', async () => {
  const resume = { ...createEmptyResume(), fullName: 'Original Name', photoUrl: PHOTO, photoShape: 'circle' as const, nationality: 'Test nationality' };
  const settings = RESUME_LAYOUTS[0].settings;
  const oldPages = [getResumeDocumentBlocks(resume)];
  for (const change of [{ photoShape: 'hidden' as const }, { targetMarket: 'us_uk' as const }]) {
    const edited = { ...resume, ...change, fullName: 'Updated Name' };
    const bytes = await buildResumeDocx(edited, settings, oldPages);
    const zip = await JSZip.loadAsync(bytes);
    const xml = await zip.file('word/document.xml')!.async('string');
    assert.equal(Object.keys(zip.files).some((file) => file.startsWith('word/media/')), false);
    assert.doesNotMatch(xml, /Original Name|<w:drawing>/);
    assert.match(xml, /Updated Name/);
    const html = buildResumePrintHtml(edited, settings, oldPages);
    assert.doesNotMatch(html, /Original Name|<img/);
    assert.match(html, /Updated Name/);
    if ('targetMarket' in change) {
      assert.doesNotMatch(xml, /Test nationality/);
      assert.doesNotMatch(documentPlainText(edited, settings), /Test nationality/);
    }
  }
  const textEdited = { ...resume, fullName: 'Latest Name' };
  const xml = await (await JSZip.loadAsync(await buildResumeDocx(textEdited, settings, oldPages))).file('word/document.xml')!.async('string');
  assert.match(xml, /Latest Name/);
  assert.doesNotMatch(xml, /Original Name/);
});

test('gallery previews come from the current renderer and every layout/country source resolves', async () => {
  const manifest = JSON.parse(await readFile('public/images/templates/manifest.json', 'utf8'));
  assert.equal(manifest.templates.length, RESUME_LAYOUTS.length);
  const sourceIds = new Set(RESUME_SOURCES.map((source) => source.id));
  for (const layout of RESUME_LAYOUTS) {
    const template = ATS_TEMPLATES.find((item) => item.layout === layout.id)!;
    const record = manifest.templates.find((item: { layout: string }) => item.layout === layout.id);
    const sourceHash = createHash('sha256').update(buildResumePrintHtml(resumeFromTemplate(template), layout.settings)).digest('hex');
    assert.equal(record.sourceHash, sourceHash, `${layout.id}: regenerate previews with npm run previews:templates`);
    const image = await readFile(`public${template.previewImage}`);
    assert.equal(image.readUInt32BE(0), 0x89504e47);
    assert.equal(image.readUInt32BE(16), 794);
    assert.equal(image.readUInt32BE(20), 1123);
    for (const id of [...layout.sourceIds, ...template.sourceIds]) assert.ok(sourceIds.has(id), id);
  }
  for (const country of COUNTRY_GUIDES) {
    assert.ok(RESUME_LAYOUTS.some((layout) => layout.id === country.layout));
    assert.ok(country.evidenceNote && country.sourceIds.length);
    for (const id of country.sourceIds) assert.ok(sourceIds.has(id), id);
  }
});
