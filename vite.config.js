import { defineConfig } from 'vite'
import { resolve } from 'path'
import { reverse } from 'lodash'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'), // ⭐ ROOT
        login: resolve(__dirname, 'src/pages/login.html'),
        rolenselect: resolve(__dirname, 'src/pages/rolenselect.html'),
        meldkamer: resolve(__dirname, 'src/pages/panels/meldkamer.html'),
        burger: resolve(__dirname, 'src/pages/panels/burger.html'),
        admin: resolve(__dirname, 'src/pages/panels/admin.html'),
        wachtwoordvergeten: resolve(__dirname, 'src/pages/wachtwoordvergeten.html'),
      }
    }
  }
})