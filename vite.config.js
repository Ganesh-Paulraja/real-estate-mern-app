import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    proxy: {
      '/api': {
        // target: 'http://localhost:8000',
        target: 'https://real-estate-app-backend-1xu4.onrender.com',
        secure: true,
        changeOrigin: true,
      }
    }
  },
  plugins: [react()],
});