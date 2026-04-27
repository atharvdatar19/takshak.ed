import supabase from '@database/supabaseClient'

async function safeQuery(queryBuilder, fallback = []) {
  if (!queryBuilder) return fallback
  const { data, error } = await queryBuilder
  if (error) { console.error('[forum]', error.message); return fallback }
  return data ?? fallback
}

export async function getForumPosts({ category, search, sortBy = 'latest', limit = 20, offset = 0 } = {}) {
  if (!supabase) return []
  let q = supabase
    .from('forum_posts')
    .select('*, users(name, avatar_url)')
    .eq('is_deleted', false)
    .range(offset, offset + limit - 1)

  if (category) q = q.eq('category', category)
  if (search) q = q.or(`title.ilike.%${search}%,body.ilike.%${search}%`)

  if (sortBy === 'popular') q = q.order('upvote_count', { ascending: false })
  else if (sortBy === 'unanswered') q = q.eq('reply_count', 0).order('created_at', { ascending: false })
  else q = q.order('created_at', { ascending: false })

  return safeQuery(q)
}

export async function getPostById(postId) {
  if (!supabase || !postId) return null
  const { data } = await supabase
    .from('forum_posts')
    .select('*, users(name, avatar_url)')
    .eq('id', postId)
    .eq('is_deleted', false)
    .maybeSingle()
  return data
}

export async function getPostReplies(postId) {
  if (!supabase || !postId) return []
  return safeQuery(
    supabase
      .from('forum_replies')
      .select('*, users(name, avatar_url)')
      .eq('post_id', postId)
      .eq('is_deleted', false)
      .order('is_accepted', { ascending: false })
      .order('upvote_count', { ascending: false })
      .order('created_at', { ascending: true })
  )
}

export async function createPost({ userEmail, title, body, category, tags = [] }) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('forum_posts')
    .insert({ user_email: userEmail, title, body, category, tags })
    .select('*, users(name, avatar_url)')
    .single()
  return { data, error: error?.message }
}

export async function createReply({ userEmail, postId, body, parentReplyId = null }) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('forum_replies')
    .insert({ user_email: userEmail, post_id: postId, body, parent_reply_id: parentReplyId })
    .select('*, users(name, avatar_url)')
    .single()
  return { data, error: error?.message }
}

export async function votePost(userEmail, postId, voteType) {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase
    .from('forum_votes')
    .upsert(
      { user_email: userEmail, post_id: postId, vote_type: voteType },
      { onConflict: 'user_email,post_id,reply_id' }
    )
  return { error: error?.message }
}

export async function voteReply(userEmail, replyId, voteType) {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase
    .from('forum_votes')
    .upsert(
      { user_email: userEmail, reply_id: replyId, vote_type: voteType },
      { onConflict: 'user_email,post_id,reply_id' }
    )
  return { error: error?.message }
}

export async function markReplyAccepted(replyId, postId, userEmail) {
  if (!supabase) return { error: 'Not connected' }
  await supabase.from('forum_replies').update({ is_accepted: false }).eq('post_id', postId)
  const { error } = await supabase
    .from('forum_replies')
    .update({ is_accepted: true })
    .eq('id', replyId)
  return { error: error?.message }
}

export async function deletePost(postId, userEmail) {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase
    .from('forum_posts')
    .update({ is_deleted: true })
    .eq('id', postId)
    .eq('user_email', userEmail)
  return { error: error?.message }
}

export async function getUserPosts(userEmail, limit = 20) {
  if (!supabase || !userEmail) return []
  return safeQuery(
    supabase
      .from('forum_posts')
      .select('*')
      .eq('user_email', userEmail)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(limit)
  )
}

export async function getForumCategories() {
  return ['General', 'JEE', 'NEET', 'UPSC', 'CAT', 'GATE', 'CUET', 'Defence', 'College Life', 'Career']
}
