import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow Vite to automatically find an available port
    // Setting port to 0 tells Vite to use the next available port
    port: 0,
    // Also enable host to allow access from other devices if needed
    host: true
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
