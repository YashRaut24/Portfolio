import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Explicitly disable sourcemaps for production security.
    // This ensures your uncompiled React source code is never exposed in the browser.
    sourcemap: false,

    // Target modern browsers to keep polyfill bloat to a minimum
    target: 'esnext',

    // Slightly increase the chunk warning limit to account for heavy animation libraries like Framer Motion
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split dependencies into dedicated chunks using a Vite 8 / Rolldown compatible function.
        // If you update your app code, the user doesn't have to re-download Framer Motion or React.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'motion-vendor';
            }
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'icons-vendor';
            }
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) {
              return 'react-vendor';
            }
            // All other node_modules will fall back to a generic vendor chunk automatically
          }
        }
      }
    }
  }
})