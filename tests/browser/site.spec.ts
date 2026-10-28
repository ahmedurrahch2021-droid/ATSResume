import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import JSZip from 'jszip';
import mammoth from 'mammoth';
import { readFile } from 'node:fs/promises';

const ROUTES = ['/', '/resume-checker', '/resume-templates', '/resume-examples', '/pricing', '/how-it-works', '/faq', '/about', '/contact', '/cover-letter', '/suite', '/order'];
const VIEWPORTS = [
  { width: 320, height: 568 }, { width: 375, height: 812 }, { width: 390, height: 844 },
  { width: 667, height: 375 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 1440, height: 900 },
];
const RESUME = `Mina Rahman
Accounts Officer
mina@example.com | +880 1712 345678 | Dhaka, Bangladesh
Experience
Accounts Officer at Example Distribution
Jan 2022 - Present
- Responsible for reconciling supplier invoices.
Education
Bachelor of Business Administration
Example University
2016 - 2020
Skills
Excel, financial reporting, QuickBooks`;

async function openPage(page: Page, route: string) {
  await page.goto(route);
  await expect(page.locator('#main-content h1')).toHaveCount(1);
  await expect(page.locator('#main-content h1')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

async function expectNoPageOverflow(page: Page) {
  const size = await page.evaluate(() => ({ width: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(size.content, 'Horizontal page scrolling is not allowed; document zoom stays inside its own viewport.').toBeLessThanOrEqual(size.width + 1);
}

for (const viewport of VIEWPORTS) {
  test(`all routes fit ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const route of ROUTES) {
      await openPage(page, route);
      await expectNoPageOverflow(page);
      const clipped = await page.locator('button:visible').evaluateAll((buttons) => buttons.filter((button) => button.scrollWidth > button.clientWidth + 2).map((button) => button.textContent?.trim()));
      expect(clipped, `${route} contains clipped button text`).toEqual([]);
      await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toBeVisible({ visible: viewport.width < 1024 });
    }
    expect(errors).toEqual([]);
  });
}

for (const viewport of VIEWPORTS.filter((size) => size.width < 1024)) {
  test(`menu geometry, focus and scrolling ${viewport.width}×${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openPage(page, '/');
    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollBefore = await page.evaluate(() => scrollY);
    const trigger = page.getByRole('button', { name: 'Open menu', exact: true });
    // Use a real pointer at the visible sticky-header control. Locator.click()
    // first scrolls the page itself when scroll-padding covers that control.
    const triggerBox = (await trigger.boundingBox())!;
    await page.mouse.click(triggerBox.x + triggerBox.width / 2, triggerBox.y + triggerBox.height / 2);
    const menu = page.locator('#mobile-navigation');
    await expect(menu).toBeVisible();
    const box = (await menu.boundingBox())!;
    expect(box.y).toBe(0);
    expect(box.height).toBeCloseTo(viewport.height, 0);
    expect(box.width).toBeLessThanOrEqual(viewport.width);
    await expect(menu.getByRole('button', { name: 'Close menu' })).toBeFocused();
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
    await menu.getByRole('button', { name: 'Local profile', exact: true }).focus();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('#mobile-navigation'))).toBe(true);
    await menu.getByRole('button', { name: 'Close menu' }).focus();
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('#mobile-navigation'))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(menu).not.toBeVisible();
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
    await trigger.click();
    await menu.getByRole('link', { name: 'Pricing', exact: true }).click();
    await expect(page).toHaveURL(/\/pricing$/);
    await expect(menu).not.toBeVisible();
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
    await expectNoPageOverflow(page);
    await trigger.click();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(menu).not.toBeVisible();
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  });
}

test('mobile menu closes on backdrop and every link navigates', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await openPage(page, '/');
  const trigger = page.getByRole('button', { name: 'Open menu', exact: true });
  const menu = page.locator('#mobile-navigation');
  await trigger.click();
  await page.mouse.click(10, 150);
  await expect(menu).not.toBeVisible();
  for (const href of ['/suite', '/resume-templates', '/cover-letter', '/resume-checker', '/how-it-works', '/resume-examples', '/faq', '/about', '/pricing']) {
    await trigger.click();
    await menu.locator(`nav a[href="${href}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(menu).not.toBeVisible();
    await expect(page.locator('#main-content h1')).toBeVisible();
  }
});

test('desktop disclosure menus are keyboard navigable and remain on screen', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await openPage(page, '/');
  for (const id of ['build', 'check', 'learn']) {
    const trigger = page.locator(`#nav-trigger-${id}`);
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    const panel = page.locator(`#nav-links-${id}`);
    await expect(panel).toBeVisible();
    await expect(panel.locator('a').first()).toBeFocused();
    const box = (await panel.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(1024);
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(panel).not.toBeVisible();
  }
});

test('contact prepares an email; it never reports a message as delivered', async ({ page }) => {
  await openPage(page, '/contact');
  await page.getByLabel('Your name', { exact: true }).fill('Mina Rahman');
  await page.getByLabel('Reply email', { exact: true }).fill('mina@example.com');
  await page.getByLabel('Message', { exact: true }).fill('Could you confirm review availability?');
  await page.getByRole('button', { name: 'Prepare email', exact: true }).click();
  await expect(page.getByRole('status').first()).toContainText('email draft is ready');
  await expect(page.getByRole('link', { name: 'Open email app', exact: true })).toHaveAttribute('href', /^mailto:ahmedur\.rahch2021@gmail\.com\?/);
  await expect(page.locator('#main-content')).not.toContainText('Message Received');
  await expectNoPageOverflow(page);
});

test('local profile needs no credentials and remains a local utility', async ({ page }) => {
  await openPage(page, '/');
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  await page.locator('#mobile-navigation').getByRole('button', { name: 'Local profile', exact: true }).click();
  const modal = page.getByRole('dialog', { name: 'Your local profile' });
  await expect(modal).toBeVisible();
  await expect(page.locator('dialog[open]')).toHaveCount(1);
  await expect(modal.locator('input[type="password"]')).toHaveCount(0);
  await modal.getByLabel('Name', { exact: true }).fill('Mina Rahman');
  await modal.getByRole('button', { name: 'Save local profile' }).click();
  await expect(modal.getByRole('status')).toContainText('saved in this browser');
  await page.keyboard.press('Escape');
  await expect(modal).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toBeFocused();
});

test('review inquiry supports three pages and never asks for card details', async ({ page }) => {
  await openPage(page, '/pricing');
  await page.getByLabel('Request 12-hour delivery (+$10)').check();
  await page.getByRole('button', { name: 'Inquire about Resume Starter' }).click();
  await expect(page).toHaveURL(/\/order$/);
  await page.getByLabel('Full name (required)', { exact: true }).fill('Mina Rahman');
  await page.getByLabel('Email (required)', { exact: true }).fill('mina@example.com');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByLabel('Request 12-hour delivery (+$10)')).toBeChecked();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('Experience, projects or training (required)', { exact: true }).fill('Reconciled supplier invoices for a local business.');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('Target role (required)', { exact: true }).fill('Accounts Officer');
  await page.getByLabel('Preferred length', { exact: true }).selectOption('3');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByLabel('Your inquiry brief')).toHaveValue(/Preferred length: 3 pages/);
  await expect(page.getByLabel('Your inquiry brief')).toHaveValue(/\$20 USD/);
  await expect(page.locator('input[autocomplete="cc-number"], input[autocomplete="cc-csc"], input[type="password"]')).toHaveCount(0);
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download brief', exact: true }).click();
  const downloaded = await downloading;
  const content = await readFile((await downloaded.path())!, 'utf8');
  expect(content).toContain('not an order or receipt');
  expect(content).not.toContain('Total Paid');
  await expectNoPageOverflow(page);
});

test('template preview fits a phone and finance handoff has no injected tech career data', async ({ page }) => {
  await openPage(page, '/resume-templates');
  await page.getByRole('button', { name: 'Finance & operations', exact: true }).click();
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Corporate Finance & Operations' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.resume-pages article').first()).toContainText('David K. Vance');
  await expect.poll(async () => dialog.locator('.resume-page-shell').first().evaluate((element) => element.getBoundingClientRect().width)).toBeLessThan(375);
  await dialog.getByRole('button', { name: 'Edit this example', exact: true }).click();
  await expect(page).toHaveURL(/\/suite$/);
  await expect(page.getByLabel('Full name', { exact: true })).toHaveValue('David K. Vance, CPA');
  const draft = await page.evaluate(() => JSON.parse(localStorage.getItem('atsresume:draft:v1')!).resume);
  expect(draft.email).toBe('david.vance@email.com');
  expect(draft.projects).toEqual([]);
  expect(draft.skills.methodologies).toBe('');
  expect(JSON.stringify(draft)).not.toContain('OpenSource Systems Core');
});

test('mobile checker, focused fix, editor persistence and cover letter DOCX share the correct contact', async ({ page }) => {
  await openPage(page, '/resume-checker');
  await page.getByRole('button', { name: 'Paste Text Directly', exact: true }).click();
  await page.locator('#checker-resume-text').fill(RESUME.replace('mina@example.com | ', ''));
  await page.locator('#checker-job-description').fill('Accounts Officer requiring Excel and financial reporting with supplier invoice reconciliation.');
  await page.getByRole('button', { name: 'Check my resume', exact: true }).first().click();
  const results = page.locator('#scan-results');
  await expect(results).toBeVisible();
  const auditAccessibility = await new AxeBuilder({ page }).include('#scan-results').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(auditAccessibility.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')).map((item) => item.id)).toEqual([]);
  await results.locator('li').filter({ hasText: 'FMT-08' }).getByRole('button', { name: 'Fix in editor', exact: true }).click();
  await expect(page.locator('#resume-email')).toBeFocused();
  await page.locator('#resume-email').fill('mina@example.com');
  await expect(page.locator('#main-content')).toContainText('No longer flagged in the current draft');
  await page.reload();
  await expect(page.locator('#resume-email')).toHaveValue('mina@example.com');
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await expect.poll(async () => page.locator('.resume-page-shell').first().evaluate((element) => element.getBoundingClientRect().width)).toBeLessThan(375);
  await expectNoPageOverflow(page);
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await page.getByRole('button', { name: 'Cover letter builder', exact: true }).click();
  await page.getByRole('button', { name: 'Import resume contact details', exact: true }).click();
  await expect(page.locator('#letter-sender-fullName')).toHaveValue('Mina Rahman');
  await expect(page.locator('#letter-sender-email')).toHaveValue('mina@example.com');
  await page.locator('#letter-opening').fill('I would like to apply for the Accounts Officer role. I reconcile supplier invoices and prepare supporting reports.');
  await page.getByRole('button', { name: 'Preview letter', exact: true }).click();
  await expect.poll(async () => page.locator('.document-page-shell').evaluate((element) => element.getBoundingClientRect().width)).toBeLessThan(375);
  await page.locator('#letter-zoom').selectOption('1');
  await expectNoPageOverflow(page);
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Word (.docx)', exact: true }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toMatch(/\.docx$/);
  const bytes = await readFile((await download.path())!);
  const zip = await JSZip.loadAsync(bytes);
  expect(zip.file('word/document.xml')).not.toBeNull();
  const text = await mammoth.extractRawText({ buffer: bytes });
  expect(text.value).toContain('Mina Rahman');
  expect(text.value).toContain('mina@example.com');
  expect(text.value).not.toContain('Alex Vance');
});

for (const route of ROUTES) {
  test(`automated accessibility baseline: ${route}`, async ({ page }) => {
    await openPage(page, route);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const findings = result.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')).map((item) => ({ id: item.id, elements: item.nodes.map((node) => node.target) }));
    expect(findings, `${route} failed the automated accessibility baseline`).toEqual([]);
  });
}

test('an unreadable replacement clears old checker results instead of showing a stale report', async ({ page }) => {
  await openPage(page, '/resume-checker');
  const input = page.locator('input[type="file"]').first();
  await input.setInputFiles({ name: 'Resume.txt', mimeType: 'text/plain', buffer: Buffer.from(RESUME) });
  await expect(page.locator('#main-content')).toContainText('Loaded: Resume.txt');
  await page.getByRole('button', { name: 'Check my resume', exact: true }).first().click();
  await expect(page.locator('#scan-results')).toBeVisible();
  await input.setInputFiles({ name: 'Legacy.doc', mimeType: 'application/msword', buffer: Buffer.from('not a modern Word package') });
  await expect(page.getByRole('alert')).toContainText('Legacy .doc');
  await expect(page.locator('#scan-results')).toHaveCount(0);
});

test('blocked browser storage still supports checker-to-editor handoff in the same tab', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new Error('QA: browser storage is blocked'); };
  });
  await openPage(page, '/resume-checker');
  await page.getByRole('button', { name: 'Paste Text Directly', exact: true }).click();
  await page.locator('#checker-resume-text').fill(RESUME);
  await page.getByRole('button', { name: 'Check my resume', exact: true }).first().click();
  await expect(page.locator('#scan-results')).toContainText('Browser storage is blocked');
  await page.locator('#scan-results').getByRole('button', { name: 'Open in the editor', exact: true }).first().click();
  await expect(page.locator('#resume-fullName')).toHaveValue('Mina Rahman');
  await expect(page.locator('#resume-email')).toHaveValue('mina@example.com');
  await expect(page.locator('#main-content')).toContainText('Session only');
});
