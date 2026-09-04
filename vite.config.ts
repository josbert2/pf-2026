import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// Fallback for local builds outside Docker — keeps %VITE_SITE_URL% in
// index.html and import.meta.env.VITE_SITE_URL always defined.
process.env.VITE_SITE_URL ||= 'https://josbert.dev'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Same-origin `/api` in dev — points at the local API (compose or `bun run` in ./server).
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET ?? 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  // vite-react-ssg renders in Node; motion needs to be bundled for SSR.
  ssr: {
    noExternal: ['motion', 'framer-motion'],
  },
})
