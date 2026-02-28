import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[MentorBhaiyaaa] Supabase env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not set. " +
    "Backend features will not work. Create a .env file with these variables."
  )
}

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  : null

export default supabase
