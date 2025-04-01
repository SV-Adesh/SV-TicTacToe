import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Ensure proper asset handling
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate source maps for easier debugging
    sourcemap: true,
    // Rollup options
    rollupOptions: {
      output: {
        // Manually control chunk sizes
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'],
          socket: ['socket.io-client'],
        },
      },
    },
    // Force CSS to be extracted into a file for better caching
    cssCodeSplit: false,
  },
  // Ensure CSS processing is properly done
  css: {
    // Process @import statements
    preprocessorOptions: {
      css: { 
        charset: false 
      },
    },
    // Properly extract CSS to avoid FOUC
    postcss: true,
    devSourcemap: true,
  },
  // Configure for Vercel deployment
  server: {
    // Ensure CORS works correctly in dev mode
    cors: true,
    port: 5173
  }
})
