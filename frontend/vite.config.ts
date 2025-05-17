import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/app/' : '/', // 🌐 Magic: auto switch
    publicDir: 'public', // ✅ includes _redirects, etc.
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
