import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),VitePWA({
    strategies: 'injectManifest',
    injectManifest: {
      globPatterns: [
        '**/*.{js,css,html,ico,png,svg,woff,woff2}'
      ],
      swSrc: 'public/sw.js',
      swDest: 'dist/sw.js',
      manifestTransforms: [
        (manifestEntries) => {
          return {
            manifest: manifestEntries,
            warnings: []
          }
        }
      ]
    },
    manifest:{
      name:"Metallic Fox - Counter App",
      short_name:"Metallic Fox",
      description:"The best counting PWA - Metallic Fox Counter Application",
      theme_color:"#df0505ff",
      background_color:"#3d0a0a",
      display:"standalone",
      scope:"/",
      start_url:"/",
      orientation:"portrait-primary",
      icons:[
         {
      "src": "icons/fox_icon-48x48.png",
      "sizes": "48x48",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/fox_icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/fox_icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/fox_icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/fox_icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/fox_icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/fox_icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/fox_icon-256x256.png",
      "sizes": "256x256",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/fox_icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/fox_icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
      ],
    },
    workbox:{
      runtimeCaching:[
        {
          urlPattern:/^https:\/\//,
          handler:"CacheFirst",
          options:{
            cacheName:"external-cache",
            expiration:{
              maxEntries:50,
              maxAgeSeconds:86400
            }
          }
        }
      ]
    },
    devOptions:{
      enabled:true,
      suppressWarnings:true,
      navigateFallback:"/"
    },
    registerType:"autoUpdate"
  })],
})


