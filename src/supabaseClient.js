import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

// Detect if the key is a Vercel/placeholder key instead of a real Supabase JWT
const isInvalidKey = supabaseAnonKey.startsWith("sb_publishable_")
export const isDemoMode = isInvalidKey || !supabaseUrl || !supabaseAnonKey

if (isDemoMode) {
  console.warn(
    "[MentorBhaiyaaa] Invalid or missing Supabase credentials detected. " +
    "Falling back to DEMO MODE. Auth and backend will use local mocks."
  )
}

const supabase = !isDemoMode
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  })
  : null

export default supabase
