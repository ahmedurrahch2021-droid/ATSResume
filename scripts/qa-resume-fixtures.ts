/** Local browser fixtures only. Run after build; remove dist/_qa before deployment. */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { parseResumeText } from '../src/utils/resumeParser';
import { buildResumeDocx } from '../src/utils/resumeExporter';

const tests = await readFile(new URL('../tests/resume-flow.test.ts', import.meta.url), 'utf8');
const text = tests.match(/export const TEST_RESUME = `([\s\S]*?)`;/)?.[1];
if (!text) throw new Error('Resume fixture not found.');
const directory = new URL('../dist/_qa/', import.meta.url);
await mkdir(directory, { recursive: true });
await writeFile(new URL('resume.txt', directory), text);
await writeFile(new URL('resume.docx', directory), await buildResumeDocx(parseResumeText(text).resume));
const incomplete = text.replace('mina@example.com | ', '');
await writeFile(new URL('missing-email.docx', directory), await buildResumeDocx(parseResumeText(incomplete).resume));

function pdf(objects: string[]): Buffer {
  let contents = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(contents, 'latin1')); contents += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(contents, 'latin1');
  contents += `xref\n0 ${offsets.length}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(contents, 'latin1');
}
const imageStream = 'q 250 0 0 350 72 300 cm /Im0 Do Q';
await writeFile(new URL('image-only.pdf', directory), pdf([
  '<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>',
  '<< /Type /XObject /Subtype /Image /Width 1 /Height 1 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Length 3 >>\nstream\n\xff\xff\xff\nendstream',
  `<< /Length ${imageStream.length} >>\nstream\n${imageStream}\nendstream`,
]));
const textStream = `BT /F1 10 Tf 14 TL 50 790 Td ${text.split('\n').map((line) => `(${line.replace(/[^\x20-\x7e]/g, '-').replace(/([\\()])/g, '\\$1')}) Tj T*`).join('\n')} ET`;
await writeFile(new URL('text-resume.pdf', directory), pdf([
  '<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${textStream.length} >>\nstream\n${textStream}\nendstream`,
]));
console.log('Created synthetic DOCX, TXT, text-PDF and image-only PDF fixtures in dist/_qa.');
