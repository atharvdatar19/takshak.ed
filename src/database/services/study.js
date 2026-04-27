import supabase from '@database/supabaseClient'

async function safeQuery(queryBuilder, fallback = []) {
  if (!queryBuilder) return fallback
  const { data, error } = await queryBuilder
  if (error) { console.error('[study]', error.message); return fallback }
  return data ?? fallback
}

// ── Study Sessions ────────────────────────────────────────────────────────────

export async function logStudySession({ userEmail, subject, durationMinutes, notes, mood }) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('study_sessions')
    .insert({ user_email: userEmail, subject, duration_minutes: durationMinutes, notes, mood })
    .select()
    .single()
  return { data, error: error?.message }
}

export async function getStudySessions(userEmail, limit = 30) {
  if (!supabase || !userEmail) return []
  return safeQuery(
    supabase
      .from('study_sessions')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_date', { ascending: false })
      .limit(limit)
  )
}

export async function getStudyStats(userEmail, days = 7) {
  if (!supabase || !userEmail) return { totalMinutes: 0, sessions: 0, subjects: {} }
  const since = new Date()
  since.setDate(since.getDate() - days)
  const sessions = await safeQuery(
    supabase
      .from('study_sessions')
      .select('subject, duration_minutes')
      .eq('user_email', userEmail)
      .gte('created_date', since.toISOString())
  )
  const totalMinutes = sessions.reduce((s, ss) => s + (ss.duration_minutes || 0), 0)
  const subjects = sessions.reduce((acc, ss) => {
    if (ss.subject) acc[ss.subject] = (acc[ss.subject] || 0) + (ss.duration_minutes || 0)
    return acc
  }, {})
  return { totalMinutes, sessions: sessions.length, subjects }
}

// ── Study Plans ───────────────────────────────────────────────────────────────

export async function getUserStudyPlans(userEmail) {
  if (!supabase || !userEmail) return []
  return safeQuery(
    supabase
      .from('study_plans')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false })
  )
}

export async function createStudyPlan({ userEmail, title, examTarget, targetDate, weeklyHours, subjects }) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('study_plans')
    .insert({ user_email: userEmail, title, exam_target: examTarget, target_date: targetDate, weekly_hours: weeklyHours, subjects })
    .select()
    .single()
  return { data, error: error?.message }
}

// ── Goals ─────────────────────────────────────────────────────────────────────

export async function getUserGoals(userEmail) {
  if (!supabase || !userEmail) return []
  return safeQuery(
    supabase
      .from('goals')
      .select('*')
      .eq('user_email', userEmail)
      .order('target_date', { ascending: true })
  )
}

export async function createGoal({ userEmail, title, description, targetDate, category }) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('goals')
    .insert({ user_email: userEmail, title, description, target_date: targetDate, category, status: 'active' })
    .select()
    .single()
  return { data, error: error?.message }
}

export async function updateGoalStatus(goalId, userEmail, status) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('goals')
    .update({ status })
    .eq('id', goalId)
    .eq('user_email', userEmail)
    .select()
    .single()
  return { data, error: error?.message }
}

// ── Quiz Attempts ─────────────────────────────────────────────────────────────

export async function logQuizAttempt({ userEmail, subject, topic, score, totalQuestions, timeTakenSeconds }) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_email: userEmail,
      subject,
      topic,
      score,
      total_questions: totalQuestions,
      time_taken_seconds: timeTakenSeconds,
    })
    .select()
    .single()
  return { data, error: error?.message }
}

export async function getQuizAttempts(userEmail, limit = 20) {
  if (!supabase || !userEmail) return []
  return safeQuery(
    supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_date', { ascending: false })
      .limit(limit)
  )
}

export async function getQuizPerformance(userEmail) {
  const attempts = await getQuizAttempts(userEmail, 50)
  if (!attempts.length) return {}
  return attempts.reduce((acc, a) => {
    if (!a.subject) return acc
    if (!acc[a.subject]) acc[a.subject] = { attempts: 0, totalScore: 0, totalQ: 0 }
    acc[a.subject].attempts++
    acc[a.subject].totalScore += a.score || 0
    acc[a.subject].totalQ += a.total_questions || 0
    return acc
  }, {})
}

// ── Documents ─────────────────────────────────────────────────────────────────

export async function getDocumentChecklist(userEmail) {
  if (!supabase || !userEmail) return []
  return safeQuery(
    supabase
      .from('user_doc_progress')
      .select('*')
      .eq('user_email', userEmail)
      .order('document_name')
  )
}

export async function updateDocumentStatus(userEmail, documentName, status) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('user_doc_progress')
    .upsert(
      { user_email: userEmail, document_name: documentName, status, updated_at: new Date().toISOString() },
      { onConflict: 'user_email,document_name' }
    )
    .select()
    .single()
  return { data, error: error?.message }
}
