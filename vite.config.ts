import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Keep HMR for source edits, but ignore runtime-generated files so indexing,
      // model caching, and server logs cannot reload the browser.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true'
        ? null
        : {
          ignored: [
            '**/.cache/**',
            '**/.vector_store.json',
            '**/logs/**',
            '**/dist/**',
          ],
        },
    },
  };
});
