import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/': {
        target: 'http://52.205.89.4:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
