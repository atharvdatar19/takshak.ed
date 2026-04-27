import supabase from '@database/supabaseClient'

async function safeQuery(queryBuilder, fallback = []) {
  if (!queryBuilder) return fallback
  const { data, error } = await queryBuilder
  if (error) { console.error('[sessions]', error.message); return fallback }
  return data ?? fallback
}

export async function getUserBookings(userEmail) {
  if (!supabase || !userEmail) return []
  return safeQuery(
    supabase
      .from('bookings')
      .select('*, mentors(id, name, avatar_url, stream, tagline)')
      .eq('user_email', userEmail)
      .order('requested_datetime', { ascending: true })
  )
}

export async function getUpcomingBookings(userEmail) {
  if (!supabase || !userEmail) return []
  const now = new Date().toISOString()
  return safeQuery(
    supabase
      .from('bookings')
      .select('*, mentors(id, name, avatar_url, stream)')
      .eq('user_email', userEmail)
      .in('status', ['pending', 'confirmed'])
      .gte('requested_datetime', now)
      .order('requested_datetime', { ascending: true })
      .limit(5)
  )
}

export async function createBooking({ userEmail, mentorId, requestedDatetime, durationMinutes = 60, notes }) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_email: userEmail,
      mentor_id: mentorId,
      requested_datetime: requestedDatetime,
      duration_minutes: durationMinutes,
      notes,
      status: 'pending',
    })
    .select('*, mentors(name, stream)')
    .single()
  return { data, error: error?.message }
}

export async function cancelBooking(bookingId, userEmail) {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .eq('user_email', userEmail)
  return { error: error?.message }
}

export async function getUserTransactions(userEmail) {
  if (!supabase || !userEmail) return []
  return safeQuery(
    supabase
      .from('transactions')
      .select('*, mentors(name)')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false })
      .limit(20)
  )
}

export async function getBookingById(bookingId) {
  if (!supabase || !bookingId) return null
  const { data } = await supabase
    .from('bookings')
    .select('*, mentors(id, name, avatar_url, stream, hourly_rate)')
    .eq('id', bookingId)
    .maybeSingle()
  return data
}
