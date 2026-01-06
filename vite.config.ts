import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  define: {
    __APP_ENV__: process.env.VITE_APP_NAME,
  },
  plugins: [react(), tailwindcss(),],
    resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
