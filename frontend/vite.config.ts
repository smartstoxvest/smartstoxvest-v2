import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/', // 🚀 Makes sure routing works correctly on GitHub/Netlify
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // ✅ 10 MB cache
      },
      manifest: {
        name: 'SmartStoxVest',
        short_name: 'SmartStox',
        start_url: '/app/', // 🏁 Ensures app loads from /app on PWA install
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2563eb',
        icons: [
          {
            src: 'pwa-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✨ Cleaner imports using '@'
    },
  },
 // server: {
   // fs: {
     // strict: true,
     // allow: ['src'], // 🔒 Prevents access to unintended file paths
   // },
 // },
});
