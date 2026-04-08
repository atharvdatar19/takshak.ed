import supabase from "../supabaseClient"

/** Race a promise against a timeout — returns fallback on timeout */
function withTimeout(promise, ms = 8000, fallback = null) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => {
      console.warn(`[TAKSHAK] Query timed out after ${ms}ms, using fallback`)
      resolve(fallback)
    }, ms)),
  ])
}

async function safeQuery(queryBuilder, fallback = []) {
  if (!queryBuilder) return fallback
  try {
    const { data, error } = await withTimeout(queryBuilder, 8000, { data: null, error: 'timeout' })
    if (error) return fallback
    return data ?? fallback
  } catch {
    return fallback
  }
}

export async function getCurrentUser() {
  if (!supabase) return null
  try {
    const result = await withTimeout(supabase.auth.getUser(), 6000, { data: null })
    return result?.data?.user || null
  } catch {
    console.warn('[TAKSHAK] getCurrentUser failed, returning null')
    return null
  }
}

export async function getCurrentUserProfile() {
  if (!supabase) return null
  const user = await getCurrentUser()
  if (!user) return null

  const { data } = await supabase.from("users").select("*").eq("id", user.id).single()
  return data
}

export async function getDashboardBundle() {
  const user = await getCurrentUser()
  if (!user) {
    return {
      user: null,
      profile: null,
      studySessions: [],
      quizAttempts: [],
      bookings: [],
      goals: [],
      notifications: [],
      colleges: [],
      exams: [],
      mentors: [],
    }
  }

  const [
    profile,
    studySessions,
    quizAttempts,
    bookings,
    goals,
    notifications,
    colleges,
    exams,
    mentors,
  ] = await Promise.all([
    safeQuery(supabase.from("users").select("*").eq("id", user.id).single(), null),
    safeQuery(
      supabase.from("study_sessions").select("*").eq("user_id", user.id).order("created_date", { ascending: false }).limit(30),
    ),
    safeQuery(
      supabase.from("quiz_attempts").select("*").eq("user_id", user.id).order("created_date", { ascending: false }).limit(30),
    ),
    safeQuery(
      supabase.from("bookings").select("*, mentors(name, stream)").eq("user_email", user.email).order("requested_datetime", { ascending: true }).limit(8),
    ),
    safeQuery(
      supabase.from("goals").select("*").eq("user_id", user.id).order("target_date", { ascending: true }).limit(8),
    ),
    safeQuery(
      supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
    ),
    safeQuery(supabase.from("colleges").select("*").order("application_end", { ascending: true }).limit(30)),
    safeQuery(supabase.from("exams_timeline").select("*").order("start_date", { ascending: true }).limit(30)),
    safeQuery(supabase.from("mentors").select("*").order("rating", { ascending: false }).limit(10)),
  ])

  return {
    user,
    profile,
    studySessions,
    quizAttempts,
    bookings,
    goals,
    notifications,
    colleges,
    exams,
    mentors,
  }
}
