import assert from 'node:assert/strict';
import test from 'node:test';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import { parseResumeText, formatResumeAsPlainText } from '../src/utils/resumeParser';
import { auditResume, buildKeywordReport } from '../src/utils/resumeAudit';
import { createEmptyResume, DEFAULT_DOCUMENT_SETTINGS, getResumeDocumentBlocks, isResumeData } from '../src/utils/resumeDocument';
import { buildResumeDocx, buildResumePrintHtml } from '../src/utils/resumeExporter';
import { clearDraft, loadDraft, saveDraft, type ResumeDraft } from '../src/utils/resumeDraft';
import { makeGuidedBullet } from '../src/utils/resumeActions';
import { paginateResumeBlocks } from '../src/utils/resumePagination';

export const TEST_RESUME = `Mina Rahman
Accounts Officer
mina@example.com | +880 1712 345678 | Dhaka, Bangladesh
linkedin.com/in/mina-example

Summary
Accounts officer supporting monthly reporting for a local distribution business. Experienced in invoice reconciliation and preparing supporting documents for the finance team.

Experience
Accounts Officer at Example Distribution
Jan 2022 - Present
- Responsible for reconciling supplier invoices and preparing monthly reports.
- Worked with colleagues to investigate discrepancies in records.

Accounts Assistant at Example Trading
Jul 2020 - Dec 2021
- Prepared 200 supplier invoices per month.

Education
Bachelor of Business Administration
Example University
2016 - 2020
GPA: 3.62

Skills
Financial reporting, Excel, QuickBooks, IFRS

Certifications
Spreadsheet training certificate
`;

test('import keeps two role/date records together, attaches GPA, and reads the contact line', () => {
  const { resume, report } = parseResumeText(TEST_RESUME);
  assert.equal(resume.fullName, 'Mina Rahman');
  assert.equal(resume.location, 'Dhaka, Bangladesh');
  assert.equal(resume.phone, '+880 1712 345678');
  assert.deepEqual(resume.experience.map((role) => [role.role, role.company, role.dates, role.bullets.length]), [
    ['Accounts Officer', 'Example Distribution', 'Jan 2022 – Present', 2],
    ['Accounts Assistant', 'Example Trading', 'Jul 2020 – Dec 2021', 1],
  ]);
  assert.equal(resume.education.length, 1);
  assert.equal(resume.education[0].gpa, '3.62');
  assert.equal(report.found, 11);
});

test('unrecognised documents and blank exports never gain sample career data', () => {
  const blank = parseResumeText('1234\n@@@\nhttps://example.org/research').resume;
  assert.equal(blank.fullName, '');
  assert.equal(blank.experience.length, 0);
  assert.equal(blank.education.length, 0);
  assert.equal(formatResumeAsPlainText(createEmptyResume()), '');
  assert.deepEqual(getResumeDocumentBlocks(createEmptyResume()), []);
});

test('numbered and wrapped bullets stay in the correct role', () => {
  const { resume } = parseResumeText('Mina Rahman\nExperience\nAnalyst at Example\n2021 - Present\n1. Prepared monthly reporting for the team\nand shared the findings at the review meeting.\n2. Reconciled supplier invoices.');
  assert.equal(resume.experience.length, 1);
  assert.equal(resume.experience[0].bullets.length, 2);
  assert.match(resume.experience[0].bullets[0], /review meeting/);
});

test('heading, location and duty findings update after actual edits, not navigation', () => {
  const { resume } = parseResumeText(TEST_RESUME);
  const before = auditResume({ text: formatResumeAsPlainText(resume) });
  assert.equal(before.format.some((finding) => finding.id === 'FMT-10'), false);
  assert.equal(before.content.find((finding) => finding.id === 'CNT-03')?.severity, 'check');
  resume.experience[0].bullets = ['Reconciled supplier invoices and prepared monthly reports.', 'Investigated discrepancies with colleagues.'];
  const after = auditResume({ text: formatResumeAsPlainText(resume) });
  assert.equal(after.content.find((finding) => finding.id === 'CNT-03')?.severity, 'pass');
  assert.equal(after.facts.bullets, before.facts.bullets);
});

test('keyword boundaries handle C++ and avoid substring matches and invented counts', () => {
  const report = buildKeywordReport('C++ and reactive systems', 'C++ C++ React React accounting accounting reporting reporting');
  assert.equal(report.terms.find((term) => term.term === 'c++')?.hits, 1);
  assert.equal(report.terms.find((term) => term.term === 'react')?.hits, 0);
  assert.equal(report.covered, 1);
  assert.equal(buildKeywordReport('anything', '').hasJobDescription, false);
});

test('guidance uses only user-supplied facts and allows qualitative outcomes', () => {
  const bullet = makeGuidedBullet({ action: 'Prepared monthly accounts', scope: '', method: 'reconciling invoices', result: 'the team could investigate discrepancies earlier' });
  assert.equal(bullet, 'Prepared monthly accounts by reconciling invoices; the team could investigate discrepancies earlier.');
  assert.doesNotMatch(bullet, /\d/);
  assert.equal(makeGuidedBullet({ action: '', scope: '3 clients', method: '', result: '' }), '');
});

test('DOCX is an editable package with actual lists and escaped text; core content round-trips', async () => {
  const { resume } = parseResumeText(TEST_RESUME);
  resume.summary += ' Used <internal> & external records.';
  const bytes = await buildResumeDocx(resume);
  const zip = await JSZip.loadAsync(bytes);
  for (const part of ['[Content_Types].xml', '_rels/.rels', 'word/document.xml', 'word/styles.xml', 'word/numbering.xml', 'word/_rels/document.xml.rels']) assert.ok(zip.file(part), part);
  const xml = await zip.file('word/document.xml')!.async('string');
  assert.match(xml, /&lt;internal&gt; &amp; external/);
  assert.match(xml, /<w:numPr>/);
  assert.doesNotMatch(xml, /<w:tbl\b|<w:txbxContent|<w:headerReference/);
  const raw = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
  assert.match(raw.value, /Mina Rahman/);
  assert.match(raw.value, /200 supplier invoices/);
  const html = await mammoth.convertToHtml({ buffer: Buffer.from(bytes) });
  assert.equal((html.value.match(/<li>/g) ?? []).length, 4);
  const reimport = parseResumeText(raw.value).resume;
  assert.equal(reimport.fullName, resume.fullName);
  assert.equal(reimport.email, resume.email);
  assert.equal(reimport.education[0].institution, resume.education[0].institution);
  assert.equal(reimport.education[0].degree, resume.education[0].degree);
});

test('pagination preserves all blocks and keeps section headings with content', () => {
  const blocks = getResumeDocumentBlocks(parseResumeText(TEST_RESUME).resume);
  const pages = paginateResumeBlocks(blocks, blocks.map(() => 60), 400);
  assert.ok(pages.length >= 2);
  assert.deepEqual(pages.flat(), blocks);
  for (const page of pages.slice(0, -1)) assert.equal(page.at(-1)?.type === 'heading', false);
});

test('PDF print markup escapes resume input and omits disabled photos', () => {
  const resume = { ...createEmptyResume(), fullName: '<script>bad()</script>', photoUrl: 'data:image/png;base64,aGVsbG8=', photoShape: 'hidden' as const };
  const html = buildResumePrintHtml(resume, DEFAULT_DOCUMENT_SETTINGS);
  assert.doesNotMatch(html, /<script>|<img/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /size:A4/);
});

test('draft bridge keeps edits and the job description even when browser storage fails', () => {
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('quota'); }, removeItem: () => {} } });
  try {
    clearDraft();
    const parsed = parseResumeText(TEST_RESUME);
    const draft: ResumeDraft = { version: 1, ...parsed, rawText: TEST_RESUME, jobDescription: 'Accountant with reporting experience', source: { fileName: 'test.docx', kind: 'docx', size: 1000, importedAt: '2026-10-28T00:00:00Z', structure: { tables: 0, headers: 0, footers: 0, textBoxes: 0, images: 0, noTextLayer: false }, warnings: [] } };
    assert.equal(saveDraft(draft), false);
    assert.equal(loadDraft()?.resume.fullName, 'Mina Rahman');
    assert.equal(loadDraft()?.jobDescription, draft.jobDescription);
    assert.equal(saveDraft({ ...draft, resume: { ...draft.resume, targetTitle: 'Finance Analyst' } }), false);
    assert.equal(loadDraft()?.resume.targetTitle, 'Finance Analyst');
    clearDraft();
    assert.equal(loadDraft(), null);
  } finally {
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});

test('malformed JSON backups are rejected before they can replace a usable draft', () => {
  assert.equal(isResumeData(createEmptyResume()), true);
  assert.equal(isResumeData({ ...createEmptyResume(), github: 123 }), false);
  assert.equal(isResumeData({ ...createEmptyResume(), experience: [{ id: '1', role: 'Analyst', company: 'Example', location: '', dates: '', bullets: 'not an array' }] }), false);
  assert.equal(isResumeData({ ...createEmptyResume(), customSections: [{ id: '1', title: 'Other', items: [{ id: '2', title: 'Entry', description: 'Text', subtitle: 123 }] }] }), false);
});
