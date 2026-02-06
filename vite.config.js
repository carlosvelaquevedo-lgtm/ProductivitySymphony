import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base path for GitHub Pages deployment
  // For Vercel, this is ignored
  // For GitHub Pages, set to your repo name: base: '/your-repo-name/'
  base: process.env.GITHUB_PAGES ? '/ProductivitySymphony/' : '/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['recharts']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts', 'lucide-react']
  }
})
