import supabase from '@database/supabaseClient'

async function safeQuery(queryBuilder, fallback = []) {
  if (!queryBuilder) return fallback
  const { data, error } = await queryBuilder
  if (error) { console.error('[colleges]', error.message); return fallback }
  return data ?? fallback
}

export async function getColleges({ search, state, type, nirf_min, nirf_max, limit = 24, offset = 0 } = {}) {
  if (!supabase) return []
  let q = supabase
    .from('colleges')
    .select('*')
    .order('nirf_rank', { ascending: true, nullsFirst: false })
    .range(offset, offset + limit - 1)

  if (search) q = q.textSearch('fts', search, { type: 'websearch' })
  if (state) q = q.eq('state', state)
  if (type) q = q.eq('type', type)
  if (nirf_min) q = q.gte('nirf_rank', nirf_min)
  if (nirf_max) q = q.lte('nirf_rank', nirf_max)

  return safeQuery(q)
}

export async function getCollegeById(id) {
  if (!supabase || !id) return null
  const { data } = await supabase
    .from('colleges')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  return data
}

export async function getCollegeBySlug(slug) {
  if (!supabase || !slug) return null
  const { data } = await supabase
    .from('colleges')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  return data
}

export async function getTopColleges(limit = 10) {
  if (!supabase) return []
  return safeQuery(
    supabase
      .from('colleges')
      .select('id, name, city, state, type, nirf_rank, logo_url, slug')
      .not('nirf_rank', 'is', null)
      .order('nirf_rank', { ascending: true })
      .limit(limit)
  )
}

export async function getDeadlineColleges(limit = 6) {
  if (!supabase) return []
  const now = new Date().toISOString().split('T')[0]
  return safeQuery(
    supabase
      .from('colleges')
      .select('id, name, city, state, application_end, logo_url, slug')
      .gte('application_end', now)
      .order('application_end', { ascending: true })
      .limit(limit)
  )
}

export async function compareColleges(ids = []) {
  if (!supabase || !ids.length) return []
  return safeQuery(
    supabase
      .from('colleges')
      .select('*')
      .in('id', ids)
  )
}

export async function getCollegeStates() {
  if (!supabase) return []
  const { data } = await supabase.from('colleges').select('state')
  return [...new Set((data || []).map(c => c.state).filter(Boolean))].sort()
}

export async function getCollegeTypes() {
  if (!supabase) return []
  const { data } = await supabase.from('colleges').select('type')
  return [...new Set((data || []).map(c => c.type).filter(Boolean))].sort()
}
