import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {execFileSync} from 'node:child_process';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

/**
 * Prerender the public routes after the bundle is written.
 *
 * This runs from inside `vite build`, not from a separate npm script, so the
 * site cannot ship as a JavaScript-only shell just because a host (AI Studio,
 * a CI runner, a deploy preset) calls `vite build` directly. The output is the
 * same either way.
 *
 * `vite build --mode spa` skips this step, for the rare case where a plain
 * single-page bundle is wanted.
 */
function prerenderPlugin(): Plugin {
  let root = process.cwd();
  let skip = false;

  return {
    name: 'ats-prerender',
    apply: 'build',
    configResolved(config) {
      root = config.root;
      skip = config.mode === 'spa' || process.env.SKIP_PRERENDER === '1';
    },
    closeBundle() {
      if (skip) {
        console.warn('\n[prerender] skipped — this build is a single-page shell, not deployable as-is.\n');
        return;
      }

      const cli = path.join(root, 'node_modules', 'tsx', 'dist', 'cli.mjs');

      // Fails the build loudly rather than deploying a shell with no per-route HTML.
      execFileSync(process.execPath, [cli, 'scripts/prerender.tsx'], {
        cwd: root,
        stdio: 'inherit',
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), prerenderPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
