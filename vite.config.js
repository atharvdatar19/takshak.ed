import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-framer': ['framer-motion'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@auth': path.resolve(__dirname, 'src/auth'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@database': path.resolve(__dirname, 'src/database'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@lib': path.resolve(__dirname, 'src/lib'),
    }
  }
})
