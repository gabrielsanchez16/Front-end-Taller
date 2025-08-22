import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/", // o "/tu-subcarpeta/" si tu app no está en root
  optimizeDeps: {
    include: ["quill", "react-quilljs"]
  },
  build: {
    commonjsOptions: {
      include: [/quill/, /react-quilljs/, /node_modules/]
    }
  }
})
