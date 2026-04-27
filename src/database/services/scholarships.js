import supabase from '@database/supabaseClient'

async function safeQuery(queryBuilder, fallback = []) {
  if (!queryBuilder) return fallback
  const { data, error } = await queryBuilder
  if (error) { console.error('[scholarships]', error.message); return fallback }
  return data ?? fallback
}

export async function getScholarships({ category, state, minAmount, search, limit = 20, offset = 0 } = {}) {
  if (!supabase) return []
  let q = supabase
    .from('scholarships')
    .select('*')
    .eq('is_active', true)
    .order('deadline', { ascending: true })
    .range(offset, offset + limit - 1)

  if (category) q = q.eq('category', category)
  if (state) q = q.or(`state.eq.${state},state.is.null`)
  if (minAmount) q = q.gte('amount', minAmount)
  if (search) q = q.or(`name.ilike.%${search}%,provider.ilike.%${search}%`)

  return safeQuery(q)
}

export async function getScholarshipById(id) {
  if (!supabase || !id) return null
  const { data } = await supabase
    .from('scholarships')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  return data
}

export async function getUpcomingDeadlines(limit = 5) {
  if (!supabase) return []
  const now = new Date().toISOString().split('T')[0]
  return safeQuery(
    supabase
      .from('scholarships')
      .select('id, name, provider, amount, deadline')
      .eq('is_active', true)
      .gte('deadline', now)
      .order('deadline', { ascending: true })
      .limit(limit)
  )
}

export async function getUserSavedScholarships(userEmail) {
  if (!supabase || !userEmail) return []
  return safeQuery(
    supabase
      .from('user_scholarships')
      .select('*, scholarships(*)')
      .eq('user_email', userEmail)
      .order('saved_at', { ascending: false })
  )
}

export async function saveScholarship(userEmail, scholarshipId) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('user_scholarships')
    .upsert({ user_email: userEmail, scholarship_id: scholarshipId }, { onConflict: 'user_email,scholarship_id' })
    .select()
    .single()
  return { data, error: error?.message }
}

export async function unsaveScholarship(userEmail, scholarshipId) {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase
    .from('user_scholarships')
    .delete()
    .eq('user_email', userEmail)
    .eq('scholarship_id', scholarshipId)
  return { error: error?.message }
}

export async function updateApplicationStatus(userEmail, scholarshipId, status) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('user_scholarships')
    .update({ application_status: status })
    .eq('user_email', userEmail)
    .eq('scholarship_id', scholarshipId)
    .select()
    .single()
  return { data, error: error?.message }
}

export async function getScholarshipCategories() {
  if (!supabase) return []
  const { data } = await supabase.from('scholarships').select('category').eq('is_active', true)
  return [...new Set((data || []).map(s => s.category).filter(Boolean))].sort()
}
