import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import localUploadsPlugin from './vite.localUploads.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localUploadsPlugin()],
  server: {
    host: '127.0.0.1',
    strictPort: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'X-Permitted-Cross-Domain-Policies': 'none',
    },
    watch: {
      ignored: ['**/public/uploads/**'],
    },
  },
  preview: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'X-Permitted-Cross-Domain-Policies': 'none',
    },
  },
})
