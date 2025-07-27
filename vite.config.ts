import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@antv/x6']
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})
