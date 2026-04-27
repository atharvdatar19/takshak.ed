import supabase from '@database/supabaseClient'

async function safeQuery(queryBuilder, fallback = []) {
  if (!queryBuilder) return fallback
  const { data, error } = await queryBuilder
  if (error) { console.error('[exams]', error.message); return fallback }
  return data ?? fallback
}

export async function getExamsTimeline({ category, search, limit = 30 } = {}) {
  if (!supabase) return []
  let q = supabase
    .from('exams_timeline')
    .select('*')
    .order('start_date', { ascending: true })
    .limit(limit)

  if (category) q = q.eq('category', category)
  if (search) q = q.ilike('name', `%${search}%`)

  return safeQuery(q)
}

export async function getUpcomingExams(limit = 5) {
  if (!supabase) return []
  const now = new Date().toISOString().split('T')[0]
  return safeQuery(
    supabase
      .from('exams_timeline')
      .select('id, name, category, start_date, end_date, registration_end, exam_date, slug')
      .gte('exam_date', now)
      .order('exam_date', { ascending: true })
      .limit(limit)
  )
}

export async function getExamById(id) {
  if (!supabase || !id) return null
  const { data } = await supabase
    .from('exams_timeline')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  return data
}

export async function getExamBySlug(slug) {
  if (!supabase || !slug) return null
  const { data } = await supabase
    .from('exams_timeline')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  return data
}

export async function getCutoffData({ examId, year, category, branch, college } = {}) {
  if (!supabase) return []
  let q = supabase
    .from('cutoff_data')
    .select('*, colleges(name, city)')
    .order('closing_rank', { ascending: true })

  if (examId) q = q.eq('exam_id', examId)
  if (year) q = q.eq('year', year)
  if (category) q = q.eq('category', category)
  if (branch) q = q.ilike('branch', `%${branch}%`)
  if (college) q = q.eq('college_id', college)

  return safeQuery(q)
}

export async function getExamCategories() {
  if (!supabase) return []
  const { data } = await supabase.from('exams_timeline').select('category')
  return [...new Set((data || []).map(e => e.category).filter(Boolean))].sort()
}

export async function getRegistrationDeadlines(limit = 5) {
  if (!supabase) return []
  const now = new Date().toISOString().split('T')[0]
  return safeQuery(
    supabase
      .from('exams_timeline')
      .select('id, name, category, registration_end, slug')
      .gte('registration_end', now)
      .order('registration_end', { ascending: true })
      .limit(limit)
  )
}
