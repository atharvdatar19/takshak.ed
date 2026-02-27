import supabase from "../supabaseClient"

async function safeQuery(queryBuilder, fallback = []) {
  const { data, error } = await queryBuilder
  if (error) return fallback
  return data ?? fallback
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data?.user || null
}

export async function getCurrentUserProfile() {
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
