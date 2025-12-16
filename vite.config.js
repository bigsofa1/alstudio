import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Removed vite-plugin-decap-cms; we serve /admin from public/admin directly

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
  ],
})
