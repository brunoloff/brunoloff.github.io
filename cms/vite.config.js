import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const outDir = fileURLToPath(new URL('../assets/vendor/sveltia', import.meta.url));

export default defineConfig({
  // URLs of chunks and assets are resolved from where GitHub Pages serves them.
  base: '/assets/vendor/sveltia/',
  publicDir: false,
  build: {
    outDir,
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 4096,
    rollupOptions: {
      input: fileURLToPath(new URL('./entry.js', import.meta.url)),
      preserveEntrySignatures: 'exports-only',
      output: {
        format: 'es',
        entryFileNames: 'sveltia-cms.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
