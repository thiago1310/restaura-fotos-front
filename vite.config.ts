import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['fotos.seu.dev.br']
  },
  preview: {
    allowedHosts: ['fotos.seu.dev.br']
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
