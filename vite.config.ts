import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Set base for GitHub Pages (replace if repo name changes)
  base: '/test-lib/',
  plugins: [react()],
})
