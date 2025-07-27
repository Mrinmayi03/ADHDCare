import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://jubilant-computing-machine-5jj9p7wv64qfx99-8000.app.github.dev',
      '/static': 'https://jubilant-computing-machine-5jj9p7wv64qfx99-8000.app.github.dev',
    },
  },
  build: {
    sourcemap : true
  }

})
