import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['date-fns', '@tanstack/react-query', 'react', 'react-dom'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  build: {
    commonjsOptions: {
      include: [/date-fns/, /node_modules/],
      transformMixedEsModules: true,
    },
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@tanstack/react-query'],
        },
      },
    },
  },
}); 