import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

export const isDemoMode = !supabaseUrl || !supabaseAnonKey

if (isDemoMode) {
  console.warn("[TAKSHAK] Supabase credentials not found. Running in DEMO MODE.")
}

const supabase = !isDemoMode
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  })
  : null

export default supabase
