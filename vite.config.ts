import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // el service worker se actualiza solo
      manifest: {
        "theme_color": "#21395e",
        "background_color": "#ffffff",
        "icons": [
          {
            "purpose": "maskable",
            "sizes": "512x512",
            "src": "icon512_maskable.png",
            "type": "image/png"
          },
          {
            "purpose": "any",
            "sizes": "512x512",
            "src": "icon512_rounded.png",
            "type": "image/png"
          }
        ],
        "orientation": "any",
        "display": "standalone",
        "lang": "es-ES",
        "name": "System Workshop",
        "short_name": "SystemWorkshop",
        "start_url": "/",
        "description": "Sistema de gestion de talleres de motos",
         "id": "/"
      }
    })
  ],
  base: "/", // o "/tu-subcarpeta/" si tu app no está en root
  optimizeDeps: {
    include: ["quill", "react-quilljs"]
  },
  build: {
    outDir: "dist", // carpeta de salida
    commonjsOptions: {
      include: [/quill/, /react-quilljs/, /node_modules/], // transformar CommonJS a ESM
    },
  }
})
