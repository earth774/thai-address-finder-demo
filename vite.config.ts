import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  // Set base for GitHub Pages (replace if repo name changes)
  base: '/thai-address-finder-demo/',
  resolve: {
    alias: {
      fs: path.resolve(__dirname, 'src/shims/fs.ts'),
      path: path.resolve(__dirname, 'src/shims/path.ts'),
      url: path.resolve(__dirname, 'src/shims/url.ts'),
    },
  },
  plugins: [react()],
})
