import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/pages/login.html'),
        forgot: resolve(__dirname, 'src/pages/wachtwoordvergeten.html'),
      }
    },
    outDir: 'dist'
  }
});