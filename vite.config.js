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
          'vendor-supabase': ['@supabase/supabase-js'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: { '@': '/src' }
  }
})
```

**Step 6 — Go to your `public` folder, create a new file called `_redirects` (no extension) and paste this one line:**
```
/*    /index.html   200
```

**Step 7 — Commit and push to GitHub:**
```
git add .
git commit -m "fix: blank screen on Netlify"
git push
```

**Step 8 — Go to Netlify dashboard → your site → Site Settings → Environment Variables → Add these two:**
```
VITE_SUPABASE_URL = https://rhijpejgbfaohjemkacp.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_okSfLByC3Zp0M207qEXn4Q_ctCVciPD