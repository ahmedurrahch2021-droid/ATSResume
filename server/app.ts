import express, { type ErrorRequestHandler } from 'express';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { createHmac, randomBytes } from 'node:crypto';
import { createDiagnosticService, validateDiagnosticRequest } from './geminiDiagnostic';
import { CoachLimits } from './coachLimits';
import { coachFallback } from '../src/utils/aiGuidance';
import { PRERENDER_ROUTES, ROUTE_PATHS } from '../src/routes';

export function createApp(options: { distPath?: string; service?: ReturnType<typeof createDiagnosticService>; limits?: CoachLimits } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  // The Google project determines its free/paid tier. A runtime key enables the optional coach.
  const service = options.service ?? createDiagnosticService({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY, model: process.env.GEMINI_MODEL });
  const positive = (value: string | undefined, fallback: number) => /^\d+$/.test(value ?? '') && Number(value) > 0 ? Math.min(10000, Number(value)) : fallback;
  const limits = options.limits ?? new CoachLimits(positive(process.env.AI_CLIENT_DAILY_LIMIT, 10), positive(process.env.AI_INSTANCE_DAILY_LIMIT, 100));
  const salt = randomBytes(32);
  const clientId = (ip: string | undefined) => createHmac('sha256', salt).update(ip ?? 'unknown').digest('hex');

  app.get('/healthz', (_req, res) => res.status(200).json({ status: 'ok' }));
  app.use('/api', (_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
  app.get('/api/gemini/status', (req, res) => res.json({ configured: service.configured, usage: limits.usage(clientId(req.ip)) }));
  app.use('/api', express.json({ limit: '96kb' }));
  app.post('/api/gemini/diagnose', async (req, res) => {
    const origin = req.get('origin');
    if (origin) {
      try { if (new URL(origin).host !== req.get('host')) { res.status(403).json({ error: 'Use the coach from this site.' }); return; } }
      catch { res.status(400).json({ error: 'Invalid request origin.' }); return; }
    }
    const request = validateDiagnosticRequest(req.body);
    if (!request) { res.status(400).json({ error: 'Choose a section of up to 6,000 characters and valid, bounded context.' }); return; }
    if (!service.configured) { res.json(await service.run(request)); return; }
    const permit = limits.acquire(clientId(req.ip));
    if (!permit.allowed) {
      res.setHeader('Retry-After', String(permit.retryAfter));
      res.status(429).json({ ...coachFallback(request, permit.reason ?? 'server-busy'), retryAfterSeconds: permit.retryAfter, usage: permit.usage }); return;
    }
    const controller = new AbortController();
    res.on('close', () => { if (!res.writableEnded) controller.abort(); });
    try { res.json({ ...await service.run(request, controller.signal), usage: permit.usage }); }
    catch { if (!res.headersSent && !res.destroyed) res.status(503).json({ ...coachFallback(request, 'provider-unavailable'), usage: permit.usage }); }
    finally { permit.release(); }
  });
  app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found.' }));
  const errors: ErrorRequestHandler = (error, _req, res, _next) => {
    res.status(error?.type === 'entity.too.large' ? 413 : error instanceof SyntaxError ? 400 : 500).json({ error: error?.type === 'entity.too.large' ? 'Request is too large.' : 'The request could not be processed.' });
  };
  app.use('/api', errors);
  if (options.distPath) {
    const dist = resolve(options.distPath);
    // Serve real prerendered route HTML before the existing SPA fallback.
    // Explicit routes avoid express.static's directory redirect (and preserve URL fragments).
    for (const route of PRERENDER_ROUTES) {
      const html = resolve(dist, `.${ROUTE_PATHS[route]}`, 'index.html');
      if (existsSync(html)) app.get(ROUTE_PATHS[route], (_req, res) => res.sendFile(html));
    }
    app.use(express.static(dist, { redirect: false }));
    app.use('/assets', (_req, res) => res.sendStatus(404));
    app.use('/images', (_req, res) => res.sendStatus(404));
    app.get('*', (_req, res) => res.sendFile(resolve(dist, 'index.html')));
  }
  return app;
}
