/**
 * Single source of truth for admin emails.
 * Update here only — AuthContext and AdminGuard both import from this file.
 * Keep this list in sync with the Supabase SQL trigger in supabase/migrations/.
 */
export const ADMIN_EMAILS = [
  "takshak.notifications@gmail.com",
  "atharvd10166@gmail.com",
  "punyatirthasahoo@gmail.com",
]
