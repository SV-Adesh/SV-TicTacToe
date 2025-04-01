import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Generate source maps for better debugging
    sourcemap: true,
    // Ensure assets are properly referenced
    assetsDir: 'assets',
    // Optimize chunks
    chunkSizeWarningLimit: 1000,
  },
  // Fix CSS processing
  css: {
    // Ensure postcss processes all CSS files
    postcss: true,
    // Extract all CSS into separate files to avoid FOUC (Flash of Unstyled Content)
    extract: true,
  },
  // Configure for Vercel deployment
  server: {
    // Ensure CORS works correctly in dev mode
    cors: true,
    port: 5173
  }
})
