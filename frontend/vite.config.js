import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/': {
        target: 'http://44.223.5.130:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
