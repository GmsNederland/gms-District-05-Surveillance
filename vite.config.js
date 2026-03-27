import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, '/index.html'),
        login: resolve(__dirname, 'src/pages/login.html'),
        wachtwoordvergeten: resolve(__dirname, 'src/pages/wachtwoordvergeten.html'),
        // error: resolve(__dirname, 'src/pages/error.html'),
        // voeg hier alle andere pagina's toe

      }
    }
  }
})