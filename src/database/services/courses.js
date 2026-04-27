import supabase from '@database/supabaseClient'

async function safeQuery(queryBuilder, fallback = []) {
  if (!queryBuilder) return fallback
  const { data, error } = await queryBuilder
  if (error) { console.error('[courses]', error.message); return fallback }
  return data ?? fallback
}

export async function getCourses({ category, search, isFree, limit = 20, offset = 0 } = {}) {
  if (!supabase) return []
  let q = supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) q = q.eq('category', category)
  if (search) q = q.or(`title.ilike.%${search}%,provider.ilike.%${search}%,description.ilike.%${search}%`)
  if (isFree !== undefined) q = isFree ? q.eq('price', 0) : q.gt('price', 0)

  return safeQuery(q)
}

export async function getCourseById(id) {
  if (!supabase || !id) return null
  const { data } = await supabase
    .from('courses')
    .select('*, course_lessons(id, title, order_index, duration_seconds, is_free)')
    .eq('id', id)
    .maybeSingle()
  return data
}

export async function getCourseLessons(courseId) {
  if (!supabase || !courseId) return []
  return safeQuery(
    supabase
      .from('course_lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index')
  )
}

export async function getUserCourseProgress(userEmail, courseId) {
  if (!supabase || !userEmail) return []
  let q = supabase
    .from('user_course_progress')
    .select('*')
    .eq('user_email', userEmail)
  if (courseId) q = q.eq('course_id', courseId)
  return safeQuery(q)
}

export async function markLessonComplete(userEmail, courseId, lessonId) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('user_course_progress')
    .upsert(
      { user_email: userEmail, course_id: courseId, lesson_id: lessonId, completed: true, completed_at: new Date().toISOString() },
      { onConflict: 'user_email,course_id,lesson_id' }
    )
    .select()
    .single()
  return { data, error: error?.message }
}

export async function getCourseCompletionPercent(userEmail, courseId) {
  if (!supabase || !userEmail || !courseId) return 0
  const [lessonsRes, progressRes] = await Promise.all([
    supabase.from('course_lessons').select('id', { count: 'exact', head: true }).eq('course_id', courseId),
    supabase.from('user_course_progress').select('id', { count: 'exact', head: true }).eq('user_email', userEmail).eq('course_id', courseId).eq('completed', true),
  ])
  const total = lessonsRes.count || 0
  const done = progressRes.count || 0
  return total > 0 ? Math.round((done / total) * 100) : 0
}

export async function getFeaturedCourses(limit = 6) {
  if (!supabase) return []
  return safeQuery(
    supabase
      .from('courses')
      .select('id, title, provider, thumbnail_url, price, category, slug')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)
  )
}

export async function getCourseCategories() {
  if (!supabase) return []
  const { data } = await supabase.from('courses').select('category')
  return [...new Set((data || []).map(c => c.category).filter(Boolean))].sort()
}
