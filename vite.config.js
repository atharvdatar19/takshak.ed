import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-framer': ['framer-motion'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-supabase': ['@supabase/supabase-js'],
        }
      }
    },
    chunkSizeWarningLimit: 600,
  },
  resolve: {
    alias: { '@': '/src' }
  }
})
