import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  outputDir: '.qa/browser-results',
  timeout: 60_000,
  expect: { timeout: 8_000 },
  workers: 2,
  fullyParallel: true,
  reporter: [['list'], ['json', { outputFile: '.qa/browser-report.json' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173',
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_CHANNEL ?? (process.platform === 'win32' ? 'msedge' : undefined),
    viewport: { width: 375, height: 812 },
    locale: 'en-GB',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: 'npm start',
    env: { PORT: '4173', NODE_ENV: 'production', GEMINI_API_KEY: '', GOOGLE_GENAI_API_KEY: '', GOOGLE_API_KEY: '' },
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
