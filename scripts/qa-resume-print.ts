/** Generate an isolated multi-page print fixture for headless-browser verification. */
import { readFile, writeFile } from 'node:fs/promises';
import { parseResumeText } from '../src/utils/resumeParser';
import { DEFAULT_DOCUMENT_SETTINGS, getResumeDocumentBlocks } from '../src/utils/resumeDocument';
import { buildResumeDocx, buildResumePrintHtml } from '../src/utils/resumeExporter';

const directory = new URL('../dist/_qa/', import.meta.url);
const text = await readFile(new URL('resume.txt', directory), 'utf8');
const resume = parseResumeText(text).resume;
resume.experience = Array.from({ length: 5 }, (_, roleIndex) => ({
  ...resume.experience[0], id: `qa-role-${roleIndex}`, role: `Test Role ${roleIndex + 1}`,
  bullets: Array.from({ length: 8 }, (_, index) => `Synthetic contribution ${roleIndex + 1}.${index + 1}: prepared reporting documents for the finance team and reconciled the supporting purchase and supplier records.`),
}));
await writeFile(new URL('long-resume.json', directory), JSON.stringify(resume));
// Pass the first block IDs of subsequent pages, measured in the actual browser preview.
const blocks = getResumeDocumentBlocks(resume);
const starts = process.argv.slice(2).map((id) => blocks.findIndex((block) => block.id === id));
if (starts.some((index) => index < 1)) throw new Error('Unknown page-start block ID');
const bounds = [0, ...starts, blocks.length];
const pages = starts.length ? bounds.slice(0, -1).map((start, index) => blocks.slice(start, bounds[index + 1])) : undefined;
await writeFile(new URL('print.html', directory), buildResumePrintHtml(resume, DEFAULT_DOCUMENT_SETTINGS, pages));
await writeFile(new URL('print.docx', directory), await buildResumeDocx(resume, DEFAULT_DOCUMENT_SETTINGS, pages));
console.log(`Created print fixtures with ${pages?.length ?? 'automatic'} pages and a long resume JSON.`);
