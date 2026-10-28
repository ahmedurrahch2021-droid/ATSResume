import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const sources = [
  ['MIT CAPD', 'https://capd.mit.edu/resources/make-your-resume-ats-friendly/'],
  ['Harvard Mignone Center', 'https://careerservices.fas.harvard.edu/resources/bullet-point-resume-template/'],
  ['Greenhouse', 'https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse'],
  ['NBER', 'https://www.nber.org/papers/w30886'],
  ['Bdjobs', 'https://mybdjobs.bdjobs.com/mybdjobs/faq.asp'],
  ['Imperial College London', 'https://www.imperial.ac.uk/careers/applications-and-interviews/cv/'],
  ['NYU Abu Dhabi', 'https://nyuad.nyu.edu/content/dam/nyuad/academics/undergraduate/career-development/documents/cdc-building-cv.pdf'],
  ['IIT Madras', 'https://internship.iitm.ac.in/downloads/Internship_Resume_Guidelines_2025-26.pdf'],
];

test('below-hero logos open the supporting documents and the full source library is reachable', async ({ page, context }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const section = page.locator('#research');
  expect(await section.evaluate((element) => Boolean(element.previousElementSibling?.querySelector('h1')))).toBe(true);
  await expect(section).toContainText('References, not endorsements.');
  await expect(section.locator('.research-card')).toHaveCount(8);
  for (const [name, url] of sources) {
    const link = section.getByRole('link', { name: new RegExp(name) });
    await expect(link).toHaveAttribute('href', url);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await context.route(sources[0][1], (route) => route.fulfill({ contentType: 'text/html', body: '<h1>Source destination fixture</h1>' }));
  const opened = page.waitForEvent('popup');
  await section.getByRole('img', { name: 'MIT', exact: true }).click();
  const sourcePage = await opened;
  await expect(sourcePage).toHaveURL(sources[0][1]);
  await sourcePage.close();
  await section.getByRole('button', { name: 'Next research sources', exact: true }).click();
  await expect(section).toContainText('5–8 of 8 sources');
  await expect.poll(() => section.locator('img').evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await section.getByRole('link', { name: 'Browse the source library', exact: true }).click();
  await expect(page).toHaveURL(/\/country-guides#source-library$/);
  await expect(page.locator('#source-library-title')).toBeInViewport();
  for (const [, url] of sources) await expect(page.locator('#source-library').locator(`a[href="${url}"]`)).toHaveCount(1);
  await expect(page.locator('#source-library')).toContainText('further reading; direct access not verified');
});

test('research carousel supports keyboard controls, link focus and responsive resizing', async ({ page }) => {
  await page.goto('/#research');
  const section = page.locator('#research');
  for (const [viewport, firstPage, nextPage] of [
    [{ width: 320, height: 568 }, '1 of 8 sources', '2 of 8 sources'],
    [{ width: 667, height: 375 }, '1–2 of 8 sources', '3–4 of 8 sources'],
    [{ width: 1440, height: 1000 }, '1–4 of 8 sources', '5–8 of 8 sources'],
  ] as const) {
    await page.setViewportSize(viewport);
    await section.locator('ul').evaluate((element) => { element.scrollLeft = 0; });
    await expect(section).toContainText(firstPage);
    const next = section.getByRole('button', { name: 'Next research sources', exact: true });
    const previous = section.getByRole('button', { name: 'Previous research sources', exact: true });
    await expect(previous).toBeDisabled();
    await next.focus();
    await page.keyboard.press('Enter');
    await expect(section).toContainText(nextPage);
    await previous.focus();
    await page.keyboard.press('Space');
    await expect(section).toContainText(firstPage);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  }
  const links = section.locator('.research-card');
  await links.first().focus();
  for (let index = 0; index < sources.length; index++) {
    await expect(links.nth(index)).toBeFocused();
    await expect(links.nth(index)).toBeInViewport({ ratio: 0.5 });
    if (index < sources.length - 1) await page.keyboard.press('Tab');
  }
});

test('private feedback validates, prepares editable Unicode drafts and never submits a comment', async ({ page, context }) => {
  const posts: string[] = [];
  context.on('request', (request) => { if (request.method() === 'POST') posts.push(request.url()); });
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (value: string) => { (window as unknown as { copiedFeedback: string }).copiedFeedback = value; } } }));
  await page.goto('/pricing');
  await page.locator('footer').getByRole('link', { name: 'Leave private feedback', exact: true }).click();
  await expect(page).toHaveURL(/\/#feedback$/);
  const section = page.locator('#feedback');
  await expect(page.locator('#feedback-title')).toBeInViewport();
  await section.getByRole('button', { name: 'Prepare my feedback', exact: true }).click();
  await expect(section.getByRole('alert')).toContainText('Write a comment');
  await expect(section.getByLabel('Your comment', { exact: true })).toBeFocused();
  await section.getByLabel('Your name (optional)', { exact: true }).fill('মিনা & Example');
  await section.getByLabel('Feedback about', { exact: true }).selectOption('Report a problem');
  const comment = 'বাংলায় মতামত: PDF ডাউনলোড ভালো।\nThe mobile #preview & Word layout could be clearer.';
  await section.getByLabel('Your comment', { exact: true }).fill(comment);
  await section.getByRole('button', { name: 'Prepare my feedback', exact: true }).click();
  await expect(section.getByRole('heading', { name: 'Your draft is ready—not sent yet.', exact: true })).toBeFocused();
  const messageField = section.getByLabel('Review and edit your message', { exact: true });
  await expect(messageField).toHaveValue(new RegExp(comment.split('\n')[0]));
  const edited = `${await messageField.inputValue()}\nExtra note after reviewing the draft.`;
  await messageField.fill(edited);
  const email = section.getByRole('link', { name: 'Open email draft', exact: true });
  const whatsapp = section.getByRole('link', { name: 'Open WhatsApp draft' });
  const emailUrl = new URL((await email.getAttribute('href'))!);
  const whatsappUrl = new URL((await whatsapp.getAttribute('href'))!);
  expect(emailUrl.pathname).toBe('ahmedur.rahch2021@gmail.com');
  expect(emailUrl.searchParams.get('body')).toBe(edited);
  expect(whatsappUrl.origin + whatsappUrl.pathname).toBe('https://wa.me/8801748755209');
  expect(whatsappUrl.searchParams.get('text')).toBe(edited);
  expect(posts).toEqual([]);
  expect(await page.evaluate((value) => [localStorage, sessionStorage].some((storage) => Object.keys(storage).some((key) => storage.getItem(key)?.includes(value))), comment)).toBe(false);
  await section.getByRole('button', { name: 'Copy message', exact: true }).click();
  await expect(section.getByRole('status')).toContainText('Nothing has been sent by this site.');
  expect(await page.evaluate(() => (window as unknown as { copiedFeedback: string }).copiedFeedback)).toBe(edited);
  // Prevent an OS mail-client launch; still exercise the site's truthful handoff state.
  await email.evaluate((element) => element.addEventListener('click', (event) => event.preventDefault()));
  await email.click();
  await expect(section.getByRole('status')).toContainText('This site cannot confirm delivery.');
  await context.route('https://wa.me/**', (route) => route.fulfill({ contentType: 'text/html', body: '<h1>Messaging draft fixture</h1>' }));
  const opened = page.waitForEvent('popup');
  await whatsapp.click();
  const messagingPage = await opened;
  await expect(messagingPage).toHaveURL(whatsappUrl.href);
  await messagingPage.close();
  await expect(section.getByRole('status')).toContainText('press Send there');
  expect(posts).toEqual([]);
  await section.getByLabel('Your comment', { exact: true }).fill('A corrected comment.');
  await expect(messageField).toHaveCount(0);
  await expect(email).toHaveCount(0);
  await section.getByRole('button', { name: 'Prepare my feedback', exact: true }).click();
  await expect(messageField).toHaveValue(/A corrected comment/);
  expect(await messageField.inputValue()).not.toContain(comment);
});

test('feedback works without a name and copying failure offers manual selection; new sections pass accessibility checks', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Clipboard unavailable'); } } }));
  await page.goto('/#feedback');
  const section = page.locator('#feedback');
  await section.getByLabel('Your comment', { exact: true }).fill('I would like clearer download instructions.');
  await section.getByRole('button', { name: 'Prepare my feedback', exact: true }).click();
  const message = section.getByLabel('Review and edit your message', { exact: true });
  expect(await message.inputValue()).not.toContain('Name:');
  await section.getByRole('button', { name: 'Copy message', exact: true }).click();
  await expect(section.getByRole('status')).toContainText('Automatic copying is unavailable');
  await expect(message).toBeFocused();
  expect(await message.evaluate((element: HTMLTextAreaElement) => element.selectionEnd - element.selectionStart)).toBe((await message.inputValue()).length);
  const result = await new AxeBuilder({ page }).include('#research').include('#feedback').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(result.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')).map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) }))).toEqual([]);
});
