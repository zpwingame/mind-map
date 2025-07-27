import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    exclude: ['@antv/x6']
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
})
