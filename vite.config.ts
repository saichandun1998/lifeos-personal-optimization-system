// @ts-check
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Vite configuration for LifeOS.
 */
export default defineConfig({
  base: '/lifeos-personal-optimization-system/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
