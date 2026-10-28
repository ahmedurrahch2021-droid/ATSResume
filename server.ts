import 'dotenv/config';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from './server/app';

async function startServer() {
  const compiled = import.meta.url.endsWith('/server.mjs');
  const production = compiled || process.env.NODE_ENV === 'production';
  const root = compiled ? resolve(dirname(fileURLToPath(import.meta.url)), '..') : process.cwd();
  const dist = resolve(root, 'dist');
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer from 1 to 65535.');
  if (production && !existsSync(resolve(dist, 'index.html'))) throw new Error('Built frontend is missing. Run npm run build before npm start.');
  const app = createApp({ distPath: production ? dist : undefined });
  let closeVite: (() => Promise<void>) | undefined;
  if (!production) {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares); closeVite = () => vite.close();
  }
  const server = app.listen(port, '0.0.0.0', () => console.log(`ATS Resume Lab listening on 0.0.0.0:${port} (${production ? 'production' : 'development'})`));
  server.on('error', (error) => { console.error('HTTP startup failed:', error.message); process.exitCode = 1; void closeVite?.(); });
  const shutdown = () => {
    server.close(() => { void closeVite?.().finally(() => process.exit(0)); if (!closeVite) process.exit(0); });
    setTimeout(() => process.exit(0), 8000).unref();
  };
  process.once('SIGTERM', shutdown); process.once('SIGINT', shutdown);
}
startServer().catch((error: Error) => { console.error('Server startup failed:', error.message); process.exitCode = 1; });
