import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.tsx'],
    globals: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/e2e/**',
      '**/*.e2e.spec.{js,ts}',
      '**/*.e2e.test.{js,ts}',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});