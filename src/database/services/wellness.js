import supabase from '@database/supabaseClient'

async function safeQuery(queryBuilder, fallback = []) {
  if (!queryBuilder) return fallback
  const { data, error } = await queryBuilder
  if (error) { console.error('[wellness]', error.message); return fallback }
  return data ?? fallback
}

export async function logStress({ userEmail, stressLevel, mood, note, tags = [] }) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('stress_logs')
    .insert({ user_email: userEmail, stress_level: stressLevel, mood, note, tags })
    .select()
    .single()
  return { data, error: error?.message }
}

export async function getStressLogs(userEmail, days = 30) {
  if (!supabase || !userEmail) return []
  const since = new Date()
  since.setDate(since.getDate() - days)
  return safeQuery(
    supabase
      .from('stress_logs')
      .select('*')
      .eq('user_email', userEmail)
      .gte('logged_at', since.toISOString())
      .order('logged_at', { ascending: true })
  )
}

export async function getTodayStressLog(userEmail) {
  if (!supabase || !userEmail) return null
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('stress_logs')
    .select('*')
    .eq('user_email', userEmail)
    .gte('logged_at', `${today}T00:00:00.000Z`)
    .order('logged_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data
}

export async function getWellnessSummary(userEmail, days = 7) {
  const logs = await getStressLogs(userEmail, days)
  if (!logs.length) return { avgStress: 0, avgMood: 0, totalLogs: 0, trend: 'stable' }

  const avgStress = logs.reduce((s, l) => s + (l.stress_level || 0), 0) / logs.length
  const avgMood = logs.reduce((s, l) => s + (l.mood || 0), 0) / logs.length

  let trend = 'stable'
  if (logs.length >= 4) {
    const half = Math.floor(logs.length / 2)
    const firstHalfAvg = logs.slice(0, half).reduce((s, l) => s + l.stress_level, 0) / half
    const secondHalfAvg = logs.slice(half).reduce((s, l) => s + l.stress_level, 0) / (logs.length - half)
    if (secondHalfAvg > firstHalfAvg + 0.5) trend = 'increasing'
    else if (secondHalfAvg < firstHalfAvg - 0.5) trend = 'decreasing'
  }

  return { avgStress: Math.round(avgStress * 10) / 10, avgMood: Math.round(avgMood * 10) / 10, totalLogs: logs.length, trend }
}

export async function getMoodOptions() {
  return ['great', 'good', 'okay', 'stressed', 'anxious', 'exhausted']
}
