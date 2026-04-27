import supabase from '@database/supabaseClient'

async function safeQuery(queryBuilder, fallback = []) {
  if (!queryBuilder) return fallback
  const { data, error } = await queryBuilder
  if (error) { console.error('[notifications]', error.message); return fallback }
  return data ?? fallback
}

export async function getUserNotifications(userEmail, limit = 20) {
  if (!supabase || !userEmail) return []
  return safeQuery(
    supabase
      .from('notifications')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false })
      .limit(limit)
  )
}

export async function getUnreadCount(userEmail) {
  if (!supabase || !userEmail) return 0
  const { count } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_email', userEmail)
    .eq('is_read', false)
  return count || 0
}

export async function markAsRead(notificationId, userEmail) {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_email', userEmail)
  return { error: error?.message }
}

export async function markAllAsRead(userEmail) {
  if (!supabase || !userEmail) return { error: 'Not connected' }
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_email', userEmail)
    .eq('is_read', false)
  return { error: error?.message }
}

export async function deleteNotification(notificationId, userEmail) {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)
    .eq('user_email', userEmail)
  return { error: error?.message }
}

export async function createNotification({ userEmail, type, title, message, actionUrl }) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('notifications')
    .insert({ user_email: userEmail, type, title, message, action_url: actionUrl })
    .select()
    .single()
  return { data, error: error?.message }
}
