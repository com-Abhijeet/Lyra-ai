import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        // Allow serving files from the project root and node_modules
        './',
        '/node_modules/bootstrap-icons/font/fonts'
      ]
    }
  }
});