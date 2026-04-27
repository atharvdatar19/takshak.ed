import supabase from '@database/supabaseClient'

async function safeQuery(queryBuilder, fallback = []) {
  if (!queryBuilder) return fallback
  const { data, error } = await queryBuilder
  if (error) { console.error('[applications]', error.message); return fallback }
  return data ?? fallback
}

export async function getUserApplications(userEmail) {
  if (!supabase || !userEmail) return []
  return safeQuery(
    supabase
      .from('applications')
      .select('*, colleges(id, name, city, state, logo_url, slug)')
      .eq('user_email', userEmail)
      .order('updated_at', { ascending: false })
  )
}

export async function createApplication({ userEmail, collegeId, programName, applicationDeadline, notes }) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('applications')
    .insert({
      user_email: userEmail,
      college_id: collegeId,
      program_name: programName,
      application_deadline: applicationDeadline,
      notes,
      status: 'planning',
    })
    .select('*, colleges(name, city, logo_url)')
    .single()
  return { data, error: error?.message }
}

export async function updateApplicationStatus(applicationId, userEmail, status) {
  if (!supabase) return { error: 'Not connected' }
  const validStatuses = ['planning', 'applied', 'documents_pending', 'under_review', 'accepted', 'rejected', 'waitlisted', 'withdrawn']
  if (!validStatuses.includes(status)) return { error: 'Invalid status' }
  const { data, error } = await supabase
    .from('applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', applicationId)
    .eq('user_email', userEmail)
    .select()
    .single()
  return { data, error: error?.message }
}

export async function updateApplication(applicationId, userEmail, updates) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('applications')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', applicationId)
    .eq('user_email', userEmail)
    .select()
    .single()
  return { data, error: error?.message }
}

export async function deleteApplication(applicationId, userEmail) {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', applicationId)
    .eq('user_email', userEmail)
  return { error: error?.message }
}

export async function getApplicationStats(userEmail) {
  if (!supabase || !userEmail) return {}
  const apps = await getUserApplications(userEmail)
  return apps.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1
    return acc
  }, {})
}
