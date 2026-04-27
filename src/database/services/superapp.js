import supabase from "@database/supabaseClient"
import { auth, isFirebaseConfigured } from "@auth/firebase"

async function safeQuery(queryBuilder, fallback = []) {
  if (!queryBuilder) return fallback
  const { data, error } = await queryBuilder
  if (error) return fallback
  return data ?? fallback
}

function getFirebaseUser() {
  if (!isFirebaseConfigured || !auth) return null
  return auth.currentUser || null
}

export async function getCurrentUser() {
  return getFirebaseUser()
}

export async function getCurrentUserProfile() {
  const user = getFirebaseUser()
  if (!user || !supabase) return null
  const { data } = await supabase.from("users").select("*").eq("email", user.email).maybeSingle()
  return data
}

export async function getDashboardBundle() {
  const user = getFirebaseUser()
  if (!user || !supabase) {
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
    safeQuery(supabase.from("users").select("*").eq("email", user.email).maybeSingle(), null),
    safeQuery(
      supabase.from("study_sessions").select("*").eq("user_email", user.email).order("created_date", { ascending: false }).limit(30),
    ),
    safeQuery(
      supabase.from("quiz_attempts").select("*").eq("user_email", user.email).order("created_date", { ascending: false }).limit(30),
    ),
    safeQuery(
      supabase.from("bookings").select("*, mentors(name, stream)").eq("user_email", user.email).order("requested_datetime", { ascending: true }).limit(8),
    ),
    safeQuery(
      supabase.from("goals").select("*").eq("user_email", user.email).order("target_date", { ascending: true }).limit(8),
    ),
    safeQuery(
      supabase.from("notifications").select("*").eq("user_email", user.email).order("created_at", { ascending: false }).limit(20),
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
