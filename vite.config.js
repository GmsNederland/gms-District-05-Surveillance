import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        login: resolve(__dirname, 'src/pages/login.html'),
        wachtwoordvergeten: resolve(__dirname, 'src/pages/wachtwoordvergeten.html'),
                index: resolve(__dirname, 'src/pages/index.html'),
        // error: resolve(__dirname, 'src/pages/error.html'),
        // voeg hier alle andere pagina's toe
      }
    }
  }
})