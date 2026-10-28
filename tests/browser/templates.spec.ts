import { test, expect, type Page } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { COUNTRY_GUIDES } from '../../src/data/countryGuides';
import { createEmptyResume, getResumeDocumentBlocks } from '../../src/utils/resumeDocument';
import { draftForResume, type ResumeDraft } from '../../src/utils/resumeDraft';
import { RESUME_LAYOUTS } from '../../src/data/resumeLayouts';
import { buildResumePrintHtml } from '../../src/utils/resumeExporter';

async function seedDraft(page: Page, draft: ResumeDraft) {
  await page.goto('/suite');
  await expect(page.locator('#resume-fullName')).toBeVisible();
  await page.evaluate((value) => localStorage.setItem('atsresume:draft:v1', JSON.stringify(value)), draft);
  await page.reload();
  await expect(page.locator('#resume-fullName')).toHaveValue(draft.resume.fullName);
}

test('applying a gallery layout keeps the full draft and the chosen order survives reload and downloads', async ({ page }) => {
  const resume = { ...createEmptyResume(), fullName: 'Mina Rahman', email: 'mina@example.com',
    experience: [{ id: 'actual-role', role: 'Accounts Officer', company: 'Example Distribution', location: 'Dhaka', dates: '2022 – Present', bullets: ['Reconciled supplier invoices.'] }],
    education: [{ id: 'actual-degree', degree: 'BBA', institution: 'Example University', dates: '2020', location: 'Dhaka' }],
  };
  const draft = draftForResume(resume, 'paste');
  draft.jobDescription = 'Accounts Officer with financial reporting experience';
  draft.rawText = 'Original supplied document text';
  await seedDraft(page, draft);
  await page.goto('/resume-templates');
  await expect(page.locator('#template-early-career')).toBeVisible();
  let dialogs = 0;
  page.on('dialog', async (dialog) => { dialogs++; await dialog.dismiss(); });
  await page.locator('#template-early-career').getByRole('button', { name: 'Use this layout', exact: true }).click();
  await expect(page.locator('#resume-fullName')).toHaveValue('Mina Rahman');
  expect(dialogs).toBe(0);
  await page.reload();
  const saved: ResumeDraft = await page.evaluate(() => JSON.parse(localStorage.getItem('atsresume:draft:v1')!));
  expect(saved.resume).toEqual(resume);
  expect(saved.rawText).toBe(draft.rawText);
  expect(saved.jobDescription).toBe(draft.jobDescription);
  expect(saved.settings?.layout).toBe('graduate');
  await page.getByLabel('Resume section', { exact: true }).selectOption('design');
  await expect(page.getByLabel('Document layout', { exact: true })).toHaveValue('graduate');
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  const text = await page.locator('.resume-pages').innerText();
  expect(text.indexOf('Education')).toBeLessThan(text.indexOf('Work Experience'));
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await page.getByLabel('Resume section', { exact: true }).selectOption('export');
  const textDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download TXT', exact: true }).click();
  const downloadedText = await readFile((await (await textDownload).path())!, 'utf8');
  expect(downloadedText.indexOf('EDUCATION')).toBeLessThan(downloadedText.indexOf('WORK EXPERIENCE'));
  const docxDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Word (.docx)', exact: true }).click();
  const bytes = await readFile((await (await docxDownload).path())!);
  const raw = (await mammoth.extractRawText({ buffer: bytes })).value;
  expect(raw.indexOf('Education')).toBeLessThan(raw.indexOf('Work Experience'));
  expect(raw).toContain('Mina Rahman');
  expect(raw).not.toContain('Jordan Miller');
});

test('fictional example replacement is explicit and cancellation retains the career draft', async ({ page }) => {
  await seedDraft(page, draftForResume({ ...createEmptyResume(), fullName: 'Own Career' }, 'paste'));
  await page.goto('/resume-templates');
  const card = page.locator('#template-finance-ops');
  await card.locator('summary').click();
  page.once('dialog', async (dialog) => { expect(dialog.message()).toContain('fictional example'); await dialog.dismiss(); });
  await card.getByRole('button', { name: 'Edit this example', exact: true }).click();
  await expect(page).toHaveURL(/\/resume-templates$/);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('atsresume:draft:v1')!).resume.fullName)).toBe('Own Career');
  page.once('dialog', async (dialog) => dialog.accept());
  await card.getByRole('button', { name: 'Edit this example', exact: true }).click();
  await expect(page.locator('#resume-fullName')).toHaveValue('David K. Vance, CPA');
  await expect(page.locator('#main-content')).toContainText('This is a fictional example');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('atsresume:draft:v1')!).settings.layout)).toBe('classic');
});

test('country cards and layout references open the correct source-backed section in a new tab', async ({ page, context }) => {
  await page.goto('/');
  const cards = page.locator('#country-guide-cards > a');
  await expect(cards).toHaveCount(COUNTRY_GUIDES.length);
  for (const country of COUNTRY_GUIDES) {
    const link = page.locator(`#country-guide-cards a[href="/country-guides#${country.id}"]`);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(link.locator('img')).toHaveAttribute('src', /\/images\/templates\/.+\.png$/);
  }
  const newTab = context.waitForEvent('page');
  await page.locator('#country-guide-cards a[href="/country-guides#bangladesh"]').click();
  const guide = await newTab;
  await expect(guide.locator('#main-content h1')).toBeVisible();
  await expect(guide).toHaveURL(/\/country-guides#bangladesh$/);
  await expect(guide.locator('#bangladesh')).toContainText('Bdjobs');
  await expect.poll(() => guide.locator('#bangladesh').evaluate((element) => element.getBoundingClientRect().top)).toBeLessThan(140);
  expect(await guide.evaluate(() => window.opener === null)).toBe(true);
  await expect(guide.locator('#qatar')).toContainText('General guidance only');
  await expect(guide.locator('#germany')).toContainText('direct access was blocked');
  await expect(guide.locator('a[href*="careerservices.fas.harvard.edu"]').first()).toHaveAttribute('target', '_blank');
  await page.goto('/resume-templates');
  const anotherTab = context.waitForEvent('page');
  await page.locator('#template-tech-core').getByRole('link', { name: /Features & sources/ }).click();
  const layoutGuide = await anotherTab;
  await expect(layoutGuide.locator('#layout-modern')).toContainText('MIT CAPD');
  await expect.poll(() => layoutGuide.locator('#layout-modern').evaluate((element) => element.getBoundingClientRect().top)).toBeLessThan(140);
});

test('photo stays top-right with readable text and multi-page PDF/DOCX retain every contribution', async ({ page, context }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const resume = { ...createEmptyResume(), fullName: 'Mina Rahman', email: 'mina@example.com', phone: '+880 1700 000000', location: 'Dhaka, Bangladesh', summary: 'Synthetic document used to verify photo placement and multi-page export.',
    experience: Array.from({ length: 6 }, (_, index) => ({ id: `role-${index}`, role: `Verification role ${index + 1}`, company: 'Example Organisation', location: 'Dhaka', dates: `${2025 - index} – ${2026 - index}`, bullets: Array.from({ length: 5 }, (_, bullet) => `Contribution ${index + 1}.${bullet + 1}: prepared monthly reporting documents and reconciled supplier records, then shared the supporting details with the finance team.`) })),
    education: [{ id: 'education', degree: 'BBA', institution: 'Example University', dates: '2019', location: 'Dhaka' }],
  };
  await seedDraft(page, draftForResume(resume, 'paste', RESUME_LAYOUTS[0].settings));
  await page.getByRole('button', { name: /^Layout & region/ }).click();
  const photo = await page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = 320; canvas.height = 160;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#8e533c'; context.fillRect(0, 0, 320, 160);
    context.fillStyle = '#34614d'; context.fillRect(80, 0, 160, 160);
    return canvas.toDataURL('image/png').split(',')[1];
  });
  await page.getByLabel('Choose an optional resume photo', { exact: true }).setInputFiles({ name: 'synthetic-wide-photo.png', mimeType: 'image/png', buffer: Buffer.from(photo, 'base64') });
  await expect(page.getByText('Enabled in preview and document exports', { exact: true })).toBeVisible();
  const draft: ResumeDraft = await page.evaluate(() => JSON.parse(localStorage.getItem('atsresume:draft:v1')!));
  expect(draft.resume.photoUrl).toMatch(/^data:image\/jpeg;base64,/);
  const dimensions = await page.evaluate(async (src) => { const image = new Image(); image.src = src!; await image.decode(); return [image.naturalWidth, image.naturalHeight]; }, draft.resume.photoUrl);
  expect(dimensions).toEqual([512, 512]);
  const article = page.locator('.resume-pages article').first();
  const geometry = await article.evaluate((element) => {
    const photo = element.querySelector('.resume-identity-photo')!.getBoundingClientRect();
    const text = element.querySelector('.resume-identity-text')!.getBoundingClientRect();
    const next = element.querySelector('[data-block-id="summary-heading"]')!.getBoundingClientRect();
    return { photoTop: photo.top, textTop: text.top, photoLeft: photo.left, textRight: text.right, photoBottom: photo.bottom, nextTop: next.top };
  });
  expect(Math.abs(geometry.photoTop - geometry.textTop)).toBeLessThan(1);
  expect(geometry.textRight).toBeLessThan(geometry.photoLeft);
  expect(geometry.nextTop).toBeGreaterThanOrEqual(geometry.photoBottom);
  const pageIds = await page.locator('.resume-pages article').evaluateAll((articles) => articles.map((article) => Array.from(article.children).map((child) => child.getAttribute('data-block-id'))));
  expect(pageIds.length).toBeGreaterThanOrEqual(2);
  const blocks = getResumeDocumentBlocks(draft.resume, 'global', draft.settings!.layout);
  const measuredPages = pageIds.map((ids) => ids.map((id) => blocks.find((block) => block.id === id)!));
  expect(measuredPages.flat().length).toBe(blocks.length);
  const printPage = await context.newPage();
  await printPage.setContent(buildResumePrintHtml(draft.resume, draft.settings!, measuredPages));
  await printPage.evaluate(() => document.fonts.ready);
  const pdf = await printPage.pdf({ preferCSSPageSize: true, printBackground: true });
  const loadingTask = getDocument({ data: new Uint8Array(pdf) });
  const pdfDocument = await loadingTask.promise;
  expect(pdfDocument.numPages).toBe(pageIds.length);
  let pdfText = '';
  for (let index = 1; index <= pdfDocument.numPages; index++) {
    const pdfPage = await pdfDocument.getPage(index);
    const text = await pdfPage.getTextContent();
    pdfText += text.items.map((item) => 'str' in item ? item.str : '').join(' ');
  }
  await loadingTask.destroy();
  expect(pdfText).toContain('Mina Rahman');
  expect(pdfText).toContain('mina@example.com');
  for (let role = 1; role <= 6; role++) for (let bullet = 1; bullet <= 5; bullet++) expect(pdfText).toContain(`Contribution ${role}.${bullet}`);
  await page.getByRole('navigation', { name: 'Resume sections' }).getByRole('button', { name: 'Download', exact: true }).click();
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Word (.docx)', exact: true }).click();
  const bytes = await readFile((await (await downloading).path())!);
  const zip = await JSZip.loadAsync(bytes);
  expect(await zip.file('word/document.xml')!.async('string')).toContain('<wp:align>right</wp:align>');
  const docxText = (await mammoth.extractRawText({ buffer: bytes })).value;
  for (let role = 1; role <= 6; role++) for (let bullet = 1; bullet <= 5; bullet++) expect(docxText).toContain(`Contribution ${role}.${bullet}`);
  await page.getByRole('button', { name: /^Layout & region/ }).click();
  await page.getByLabel('Application region', { exact: true }).selectOption('us_uk');
  await expect(page.locator('.resume-pages .resume-identity-photo')).toHaveCount(0);
  await expect(page.getByText('Omitted in US / UK mode', { exact: true })).toBeVisible();
  await page.getByLabel('Application region', { exact: true }).selectOption('global');
  await page.getByRole('button', { name: 'Hide photo', exact: true }).click();
  await expect(page.locator('.resume-pages .resume-identity-photo')).toHaveCount(0);
  await mkdir('.qa/previews', { recursive: true });
  await printPage.setViewportSize({ width: 794, height: 1123 });
  await printPage.screenshot({ path: '.qa/previews/photo-print-first-page.png' });
});

test('all gallery images load and desktop/mobile cards show the actual document previews', async ({ page }) => {
  await mkdir('.qa/previews', { recursive: true });
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 375, height: 812 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/resume-templates');
    const images = page.locator('section[id^="template-"] figure img');
    await expect(images).toHaveCount(4);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth)).toBe(794);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `.qa/previews/templates-${viewport.width}.png`, fullPage: true });
  }
});
