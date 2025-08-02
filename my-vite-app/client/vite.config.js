import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['e9d89261c3c5.ngrok-free.app'] // ✅ This allows external domains like ngrok
  }
});
