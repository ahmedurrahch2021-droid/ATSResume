import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';
import mammoth from 'mammoth';
import { createEmptyResume } from '../../src/utils/resumeDocument';
import { createEmptyCoverLetter } from '../../src/utils/coverLetterDocument';
import { draftForResume, type ResumeDraft } from '../../src/utils/resumeDraft';
import type { DiagnosticRequest, DiagnosticResponse } from '../../src/types/ai';

const ORIGINAL = 'Assisted with reconciling 20 supplier invoices.';
const SUGGESTED = 'Helped reconcile 20 supplier invoices.';
const usage = { remaining: 9, limit: 10, resetAt: '2026-10-30T00:00:00.000Z', scope: 'server-instance' };
const coach = (page: Page) => page.getByRole('dialog', { name: 'AI Writing Coach', exact: true });
const fixture = () => draftForResume({ ...createEmptyResume(), fullName: 'Mina Rahman', email: 'mina@example.com', targetTitle: 'Accounts Assistant', targetCountry: 'uk',
  summary: 'I support the accounts team with supplier records.',
  experience: [{ id: 'accounts:1', role: 'Accounts Assistant', company: 'Example Distribution', location: 'Dhaka', dates: '2022 – Present', bullets: [ORIGINAL, 'Prepared monthly reports in Excel.'] }],
  education: [{ id: 'bba', degree: 'BBA', institution: 'Example University', location: 'Dhaka', dates: '2020' }],
}, 'paste');
const responseFor = (input: DiagnosticRequest, suggestedText = SUGGESTED): DiagnosticResponse => ({
  originalText: input.currentText, suggestedText, rationale: 'Uses a shorter phrase while retaining the supporting role and supplied count.', clarifyingQuestion: null, isFallback: false, sourceIds: ['imperial-cv'],
});

async function seedResume(page: Page, draft = fixture()) {
  await page.goto('/suite');
  await expect(page.locator('#resume-fullName')).toBeVisible();
  await page.evaluate((value) => localStorage.setItem('atsresume:draft:v1', JSON.stringify(value)), draft);
  await page.reload();
  await expect(page.locator('#resume-fullName')).toHaveValue(draft.resume.fullName);
  return draft;
}
async function savedResume(page: Page): Promise<ResumeDraft> {
  return page.evaluate(() => JSON.parse(localStorage.getItem('atsresume:draft:v1')!));
}
async function openCoach(page: Page, configured = true) {
  await page.getByRole('button', { name: 'AI Writing Coach', exact: true }).click();
  await expect(coach(page)).toBeVisible();
  await expect(coach(page)).toContainText(configured ? 'Gemini is configured.' : 'Online AI is unavailable');
}
async function mockStatus(page: Page, configured = true) {
  await page.route('**/api/gemini/status', (route) => route.fulfill({ json: { configured, usage } }));
}

test('resume coaching is explicit, edits one field, supports undo/redo and reaches DOCX', async ({ page }) => {
  const requests: DiagnosticRequest[] = [];
  await mockStatus(page);
  await page.route('**/api/gemini/diagnose', async (route) => {
    const input = route.request().postDataJSON() as DiagnosticRequest;
    requests.push(input);
    await route.fulfill({ json: { ...responseFor(input), usage } });
  });
  const draft = fixture();
  draft.jobDescription = 'Accounts Assistant: reconcile supplier invoices and prepare reports in Excel.';
  await seedResume(page, draft);
  await page.getByLabel('Resume section', { exact: true }).selectOption('experience');
  expect(requests).toHaveLength(0);
  await openCoach(page);
  const panel = coach(page);
  await expect(panel.getByLabel('Text to improve', { exact: true })).toHaveValue('experience:accounts%3A1:0');
  await panel.getByRole('button', { name: 'Make this clearer', exact: true }).click();
  await expect(panel.getByLabel('Review and edit the wording')).toHaveValue(SUGGESTED);
  expect(requests).toHaveLength(1);
  expect(requests[0]).toMatchObject({ currentText: ORIGINAL, targetRole: 'Accounts Assistant', countryNorm: 'uk', jobDescription: draft.jobDescription, history: [] });
  expect(JSON.stringify(requests[0])).not.toContain('mina@example.com');
  await panel.getByRole('button', { name: 'Apply to selected field', exact: true }).click();
  const expected = structuredClone(draft.resume);
  expected.experience[0].bullets[0] = SUGGESTED;
  await expect.poll(async () => (await savedResume(page)).resume).toEqual(expected);
  await panel.getByRole('button', { name: 'Undo last coach edit', exact: true }).click();
  await expect.poll(async () => (await savedResume(page)).resume).toEqual(draft.resume);
  await panel.getByRole('button', { name: 'Redo last coach edit', exact: true }).click();
  await expect.poll(async () => (await savedResume(page)).resume).toEqual(expected);
  await panel.getByRole('button', { name: 'Close AI Writing Coach', exact: true }).click();
  await page.reload();
  expect((await savedResume(page)).resume).toEqual(expected);
  expect((await savedResume(page)).rawText).toBe(draft.rawText);
  expect((await savedResume(page)).jobDescription).toBe(draft.jobDescription);
  await openCoach(page);
  await expect(panel.locator('summary').filter({ hasText: 'Recent conversation' })).toContainText('2 messages');
  await panel.getByRole('button', { name: 'Close AI Writing Coach', exact: true }).click();
  await page.getByLabel('Resume section', { exact: true }).selectOption('export');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Word (.docx)', exact: true }).click();
  const text = (await mammoth.extractRawText({ buffer: await readFile((await (await download).path())!) })).value;
  for (const fact of [SUGGESTED, 'Mina Rahman', 'Example Distribution', 'Prepared monthly reports in Excel.', 'Example University']) expect(text).toContain(fact);
  expect(text).not.toContain(ORIGINAL);
});

test('cover-letter coaching preserves an empty opening and every unselected field', async ({ page }) => {
  await mockStatus(page);
  await page.route('**/api/gemini/diagnose', async (route) => route.fulfill({ json: responseFor(route.request().postDataJSON()) }));
  const letter = { ...createEmptyCoverLetter(), id: 'qa-letter', targetCountry: 'bd' as const, opening: '', bodyParagraphs: [ORIGINAL, 'I prepare reports in Excel.'], keyHighlights: ['Completed invoice checks.'], closing: 'Thank you for reviewing my application.' };
  await page.goto('/cover-letter');
  await expect(page.locator('#letter-opening')).toBeVisible();
  await page.evaluate((value) => localStorage.setItem('atsresume_cover_letter_data', JSON.stringify(value)), letter);
  await page.reload();
  await openCoach(page);
  const panel = coach(page);
  await panel.getByLabel('Text to improve', { exact: true }).selectOption('body:0');
  await panel.getByRole('button', { name: 'Request writing help', exact: true }).click();
  await expect(panel.getByLabel('Review and edit the wording')).toHaveValue(SUGGESTED);
  await panel.getByRole('button', { name: 'Apply to selected field', exact: true }).click();
  const readLetter = () => page.evaluate(() => JSON.parse(localStorage.getItem('atsresume_cover_letter_data')!));
  const expected = { ...letter, bodyParagraphs: [SUGGESTED, letter.bodyParagraphs[1]] };
  await expect.poll(readLetter).toEqual(expected);
  await panel.getByRole('button', { name: 'Undo last coach edit', exact: true }).click();
  await expect.poll(readLetter).toEqual(letter);
  await panel.getByRole('button', { name: 'Redo last coach edit', exact: true }).click();
  await expect.poll(readLetter).toEqual(expected);
  await panel.getByRole('button', { name: 'Close AI Writing Coach', exact: true }).click();
  await page.reload();
  await expect(page.locator('#letter-opening')).toHaveValue('');
  await expect(page.locator('#letter-body-0')).toHaveValue(SUGGESTED);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Word (.docx)', exact: true }).click();
  const text = (await mammoth.extractRawText({ buffer: await readFile((await (await download).path())!) })).value;
  for (const fact of [SUGGESTED, letter.bodyParagraphs[1], letter.keyHighlights[0], letter.closing, letter.signOff]) expect(text).toContain(fact);
});

test('a delayed response is discarded after changing fields and a manual edit blocks stale apply', async ({ page }) => {
  await mockStatus(page);
  let requests = 0;
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/api/gemini/diagnose', async (route) => {
    const input = route.request().postDataJSON() as DiagnosticRequest;
    if (++requests === 1) await pending;
    await route.fulfill({ json: responseFor(input, requests === 1 ? SUGGESTED : 'I help the accounts team maintain supplier records.') }).catch(() => {});
  });
  const draft = await seedResume(page);
  await openCoach(page);
  const panel = coach(page);
  await panel.getByLabel('Text to improve', { exact: true }).selectOption('experience:accounts%3A1:0');
  await panel.getByRole('button', { name: 'Make this clearer', exact: true }).click();
  await expect.poll(() => requests).toBe(1);
  await panel.getByLabel('Text to improve', { exact: true }).selectOption('summary');
  release();
  await expect(panel.getByRole('region', { name: 'Coach result' })).toHaveCount(0);
  await panel.getByRole('button', { name: 'Make this clearer', exact: true }).click();
  await expect(panel.getByLabel('Review and edit the wording')).toHaveValue('I help the accounts team maintain supplier records.');
  await panel.getByRole('button', { name: 'Close AI Writing Coach', exact: true }).click();
  await page.getByLabel('Resume section', { exact: true }).selectOption('summary');
  await page.locator('#resume-summary').fill('Manually revised summary.');
  await openCoach(page);
  await expect(panel.getByRole('button', { name: 'Apply to selected field', exact: true })).toBeDisabled();
  await expect(panel).toContainText('The document field has changed.');
  expect((await savedResume(page)).resume.experience).toEqual(draft.resume.experience);
  expect((await savedResume(page)).resume.summary).toBe('Manually revised summary.');
});

test('offline guidance stays local and remains usable when browser storage is blocked', async ({ page }) => {
  await mockStatus(page, false);
  let posts = 0;
  page.on('request', (request) => { if (request.method() === 'POST') posts++; });
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error('QA storage blocked'); }; });
  await page.goto('/suite?section=summary');
  await page.locator('#resume-summary').fill(ORIGINAL);
  await openCoach(page, false);
  const panel = coach(page);
  await panel.getByRole('button', { name: 'Request writing help', exact: true }).click();
  await expect(panel.getByRole('heading', { name: 'Local writing guidance', exact: true })).toBeVisible();
  await expect(panel.getByLabel('Review and edit the wording')).toHaveValue(ORIGINAL);
  await expect(panel.getByRole('button', { name: 'Apply to selected field', exact: true })).toBeDisabled();
  await panel.locator('summary').filter({ hasText: 'Recent conversation' }).click();
  await expect(panel).toContainText('this conversation is session-only');
  expect(posts).toBe(0);
});

test('quota exhaustion and malformed responses retain the selected text', async ({ page }) => {
  await mockStatus(page);
  let calls = 0;
  await page.route('**/api/gemini/diagnose', async (route) => {
    const input = route.request().postDataJSON() as DiagnosticRequest;
    if (++calls === 1) await route.fulfill({ status: 429, headers: { 'Retry-After': '60' }, json: { ...responseFor(input, input.currentText), isFallback: true, message: 'This server’s coach allowance is temporarily unavailable.', usage: { ...usage, remaining: 0 } } });
    else await route.fulfill({ contentType: 'text/html', body: '<html>upstream error</html>' });
  });
  const draft = await seedResume(page);
  await openCoach(page);
  const panel = coach(page);
  for (const message of ['coach allowance is temporarily unavailable', 'online coach could not be reached']) {
    await panel.getByRole('button', { name: 'Make this clearer', exact: true }).click();
    await expect(panel).toContainText(message);
    await expect(panel.getByLabel('Review and edit the wording')).toHaveValue(draft.resume.summary);
    await expect(panel.getByRole('button', { name: 'Apply to selected field', exact: true })).toBeDisabled();
  }
  expect((await savedResume(page)).resume).toEqual(draft.resume);
});

test('coach dialog fits phone, landscape and desktop, contains focus and passes the accessibility baseline', async ({ page }) => {
  await mockStatus(page, false);
  await seedResume(page);
  const trigger = page.getByRole('button', { name: 'AI Writing Coach', exact: true });
  for (const viewport of [{ width: 320, height: 568 }, { width: 667, height: 375 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await openCoach(page, false);
    const panel = coach(page);
    const box = (await panel.boundingBox())!;
    expect(box.width).toBeLessThanOrEqual(viewport.width);
    expect(box.height).toBeLessThanOrEqual(viewport.height);
    expect(await panel.evaluate((element) => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
    await panel.getByRole('button', { name: 'Close AI Writing Coach', exact: true }).focus();
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('dialog[open]'))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(panel).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await openCoach(page, false);
  const result = await new AxeBuilder({ page }).include('dialog[open]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(result.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')).map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) }))).toEqual([]);
});
