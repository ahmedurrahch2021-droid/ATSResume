import { build } from 'vite';

// A separate Node bundle resolves TypeScript and local extensionless imports at build time.
await build({
  configFile: false, publicDir: false,
  build: { ssr: 'server.ts', outDir: 'dist-server', emptyOutDir: true, target: 'node22', minify: false,
    rolldownOptions: { output: { entryFileNames: 'server.mjs' } },
  },
});
