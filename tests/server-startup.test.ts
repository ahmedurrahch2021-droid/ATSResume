import assert from 'node:assert/strict';
import test from 'node:test';
import { spawn, type ChildProcess } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'node:net';

const root = process.cwd();
async function availablePort(): Promise<number> {
  const probe = createServer().listen(0, '0.0.0.0');
  await once(probe, 'listening');
  const address = probe.address();
  assert.ok(address && typeof address !== 'string');
  await new Promise<void>((accept, reject) => probe.close((error) => error ? reject(error) : accept()));
  return address.port;
}

async function start(port: number, apiKey = '') {
  const cwd = resolve('.qa/runtime-cwd');
  await mkdir(cwd, { recursive: true });
  const env: NodeJS.ProcessEnv = { ...process.env, PORT: String(port), NODE_ENV: '', GEMINI_API_KEY: apiKey, GOOGLE_GENAI_API_KEY: '', GOOGLE_API_KEY: '', DOTENV_CONFIG_PATH: resolve(cwd, 'no-env-file') };
  delete env.GEMINI_DATA_POLICY;
  const child = spawn(process.execPath, [resolve(root, 'dist-server/server.mjs')], { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  await new Promise<void>((accept, reject) => {
    const timeout = setTimeout(() => { child.kill(); reject(new Error(`Runtime did not become ready: ${output}`)); }, 20_000);
    child.stdout.on('data', (data) => { output += data.toString(); if (output.includes(`listening on 0.0.0.0:${port}`)) { clearTimeout(timeout); accept(); } });
    child.stderr.on('data', (data) => { output += data.toString(); });
    child.once('error', (error) => { clearTimeout(timeout); reject(error); });
    child.once('exit', (code) => { clearTimeout(timeout); reject(new Error(`Runtime exited (${code}): ${output}`)); });
  });
  return child;
}
async function stop(child: ChildProcess) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const exited = once(child, 'exit'); child.kill('SIGTERM'); await exited;
}

test('compiled production entrypoint starts on a clean port without Gemini or a TS runtime', async (t) => {
  const manifest = JSON.parse(await readFile('package.json', 'utf8'));
  assert.equal(manifest.scripts.start, 'node dist-server/server.mjs');
  const addressPort = await availablePort();
  const child = await start(addressPort);
  t.after(() => stop(child));
  const origin = `http://127.0.0.1:${addressPort}`;
  assert.deepEqual(await (await fetch(`${origin}/healthz`)).json(), { status: 'ok' });
  const home = await fetch(origin);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /See what our reader extracts/);
  const guides = await fetch(`${origin}/country-guides`, { redirect: 'manual' });
  assert.equal(guides.status, 200, 'Prerendered pages must not redirect to a trailing slash.');
  assert.equal(guides.headers.get('location'), null);
  assert.match(await guides.text(), /Choose a structure/);
  assert.equal((await fetch(`${origin}/images/templates/modern.png`)).status, 200);
  assert.equal((await fetch(`${origin}/assets/missing.js`)).status, 404);
  assert.equal((await (await fetch(`${origin}/api/gemini/status`)).json()).configured, false);
  const input = 'Assisted with supplier invoice reconciliation.';
  const response = await fetch(`${origin}/api/gemini/diagnose`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentText: input, sectionType: 'bullet' }) });
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.isFallback, true);
  assert.equal(data.suggestedText, input);
});

test('the production listener follows an alternate PORT instead of hard-coding 3000', async (t) => {
  const port = await availablePort();
  assert.notEqual(port, 3000);
  const child = await start(port);
  t.after(() => stop(child));
  assert.equal((await fetch(`http://127.0.0.1:${port}/healthz`)).status, 200);
});

test('a runtime Gemini key enables the coach without a paid-tier flag or a startup provider call', async (t) => {
  const port = await availablePort();
  // Synthetic key; status/startup must not contact Google or attempt to validate billing.
  const child = await start(port, 'qa-synthetic-key-not-a-real-credential');
  t.after(() => stop(child));
  const response = await fetch(`http://127.0.0.1:${port}/api/gemini/status`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).configured, true);
  assert.equal((await fetch(`http://127.0.0.1:${port}/healthz`)).status, 200);
});
