import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The `assets/` folder at the project root is served as static files.
// A file at `assets/navio/demo.jpg` is available at the URL `/navio/demo.jpg`.
export default defineConfig({
  plugins: [react()],
  publicDir: 'assets',
})
