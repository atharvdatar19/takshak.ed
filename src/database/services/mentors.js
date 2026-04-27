import supabase from '@database/supabaseClient'

async function safeQuery(queryBuilder, fallback = []) {
  if (!queryBuilder) return fallback
  const { data, error } = await queryBuilder
  if (error) { console.error('[mentors]', error.message); return fallback }
  return data ?? fallback
}

export async function getMentors({ stream, maxFee, minRating, search, limit = 20, offset = 0 } = {}) {
  if (!supabase) return []
  let q = supabase
    .from('mentors')
    .select('*, mentor_availability(day_of_week, start_time, end_time, is_available)')
    .eq('is_verified', true)
    .order('rating', { ascending: false })
    .range(offset, offset + limit - 1)

  if (stream) q = q.eq('stream', stream)
  if (maxFee) q = q.lte('hourly_rate', maxFee)
  if (minRating) q = q.gte('rating', minRating)
  if (search) q = q.or(`name.ilike.%${search}%,bio.ilike.%${search}%`)

  return safeQuery(q)
}

export async function getMentorById(mentorId) {
  if (!supabase || !mentorId) return null
  const { data } = await supabase
    .from('mentors')
    .select('*, mentor_availability(*), reviews(*, users(name, avatar_url))')
    .eq('id', mentorId)
    .maybeSingle()
  return data
}

export async function getMentorAvailability(mentorId) {
  if (!supabase || !mentorId) return []
  return safeQuery(
    supabase
      .from('mentor_availability')
      .select('*')
      .eq('mentor_id', mentorId)
      .eq('is_available', true)
      .order('day_of_week')
  )
}

export async function getTopMentors(limit = 6) {
  if (!supabase) return []
  return safeQuery(
    supabase
      .from('mentors')
      .select('id, name, avatar_url, stream, hourly_rate, rating, review_count, tagline')
      .eq('is_verified', true)
      .order('rating', { ascending: false })
      .limit(limit)
  )
}

export async function getMentorReviews(mentorId, limit = 10) {
  if (!supabase || !mentorId) return []
  return safeQuery(
    supabase
      .from('reviews')
      .select('*, users(name, avatar_url)')
      .eq('mentor_id', mentorId)
      .order('created_at', { ascending: false })
      .limit(limit)
  )
}

export async function submitMentorReview({ mentorId, userEmail, rating, comment }) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('reviews')
    .insert({ mentor_id: mentorId, user_email: userEmail, rating, comment })
    .select()
    .single()
  return { data, error: error?.message }
}

export async function getMentorStreams() {
  if (!supabase) return ['JEE', 'NEET', 'UPSC', 'CAT', 'GATE', 'CUET', 'Defence']
  const { data } = await supabase
    .from('mentors')
    .select('stream')
    .eq('is_verified', true)
  const streams = [...new Set((data || []).map(m => m.stream).filter(Boolean))]
  return streams.length ? streams : ['JEE', 'NEET', 'UPSC', 'CAT', 'GATE', 'CUET', 'Defence']
}
