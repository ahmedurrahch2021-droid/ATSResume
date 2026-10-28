/** Render the real document model; no separate mockup, stock image or external service. */
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium } from '@playwright/test';
import { ATS_TEMPLATES } from '../src/data/mockData';
import { RESUME_LAYOUTS } from '../src/data/resumeLayouts';
import { resumeFromTemplate } from '../src/utils/templateResume';
import { buildResumeDocx, buildResumePrintHtml } from '../src/utils/resumeExporter';
import { getResumeDocumentBlocks } from '../src/utils/resumeDocument';
import { paginateResumeBlocks } from '../src/utils/resumePagination';

await mkdir('public/images/templates', { recursive: true });
await mkdir('.qa/template-previews', { recursive: true });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL ?? (process.platform === 'win32' ? 'msedge' : undefined) });
try {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const manifest: Array<{ layout: string; sourceHash: string; image: string; previewPages: number }> = [];
  for (const layout of RESUME_LAYOUTS) {
    const template = ATS_TEMPLATES.find((item) => item.layout === layout.id)!;
    const resume = resumeFromTemplate(template);
    const blocks = getResumeDocumentBlocks(resume, 'global', layout.id);
    const sourceHtml = buildResumePrintHtml(resume, layout.settings);
    await page.setContent(sourceHtml);
    await page.evaluate(() => document.fonts.ready);
    const heights = await page.locator('.page').first().evaluate((article) => Array.from(article.children).map((child) => child.getBoundingClientRect().height));
    const pages = paginateResumeBlocks(blocks, heights);
    const html = buildResumePrintHtml(resume, layout.settings, pages);
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `public${template.previewImage}`, clip: { x: 0, y: 0, width: 794, height: 1123 } });
    await writeFile(`.qa/template-previews/${layout.id}.html`, html);
    await writeFile(`.qa/template-previews/${layout.id}.docx`, await buildResumeDocx(resume, layout.settings, pages));
    await page.pdf({ path: `.qa/template-previews/${layout.id}.pdf`, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
    manifest.push({ layout: layout.id, sourceHash: createHash('sha256').update(sourceHtml).digest('hex'), image: template.previewImage, previewPages: pages.length });
    console.log(`${layout.name}: ${pages.length} preview page(s), ${template.previewImage}`);
  }
  await writeFile('public/images/templates/manifest.json', JSON.stringify({ renderer: 'Shared resume print renderer', width: 794, height: 1123, templates: manifest }, null, 2) + '\n');
} finally { await browser.close(); }
