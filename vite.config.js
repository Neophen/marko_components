// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: 'none',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ce_menu: resolve(__dirname, 'components/ce_menu.html'),
      },
    },
  },
})
