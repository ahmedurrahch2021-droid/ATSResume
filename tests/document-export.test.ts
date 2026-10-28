import assert from 'node:assert/strict';
import test from 'node:test';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import { createEmptyCoverLetter, getCoverLetterBlocks, isCoverLetterData } from '../src/utils/coverLetterDocument';
import { buildCoverLetterDocx, buildCoverLetterPrintHtml } from '../src/utils/coverLetterExporter';
import { resumeFromTemplate } from '../src/utils/templateResume';
import { ATS_TEMPLATES } from '../src/data/mockData';

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
  assert.equal(resume.education[0].dates, '');
});
