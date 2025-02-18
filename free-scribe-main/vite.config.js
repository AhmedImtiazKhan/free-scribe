import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@xenova/transformers'], // Explicitly optimize it only once
    exclude: [], // Prevent unnecessary re-optimization
  }
});
