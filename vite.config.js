import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import requireTransform from 'vite-plugin-require-transform';

export default defineConfig({
  plugins: [
    react(),
    requireTransform({
      fileRegex: /.jsx$|.js$/
    }),
  ],
  define: {
    global: 'window',
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
});
