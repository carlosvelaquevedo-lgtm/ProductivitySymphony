import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ProductivitySymphony/'   // ← MUST match your repo name exactly (case-sensitive!)
  // If your username/repo is different, change to '/your-repo-name/'
})
