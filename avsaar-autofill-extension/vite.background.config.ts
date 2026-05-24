import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false, // Don't clear dist because popup/content are already there
    lib: {
      entry: resolve(__dirname, 'src/background/background.ts'),
      name: 'AvsaarBackground',
      formats: ['iife'],
      fileName: () => 'background.js',
    },
    rollupOptions: {
      output: {
        extend: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
