import supabase from '@database/supabaseClient'

async function safeQuery(queryBuilder, fallback = []) {
  if (!queryBuilder) return fallback
  const { data, error } = await queryBuilder
  if (error) { console.error('[community]', error.message); return fallback }
  return data ?? fallback
}

// ── Fresher Profiles ──────────────────────────────────────────────────────────

export async function getFresherProfiles({ college, branch, search, limit = 20, offset = 0 } = {}) {
  if (!supabase) return []
  let q = supabase
    .from('fresher_profiles')
    .select('*, users(name, avatar_url)')
    .range(offset, offset + limit - 1)

  if (college) q = q.eq('college_id', college)
  if (branch) q = q.eq('branch', branch)
  if (search) q = q.or(`hometown.ilike.%${search}%,hobbies.ilike.%${search}%`)

  return safeQuery(q)
}

export async function upsertFresherProfile({ userEmail, collegeId, branch, year, hometown, hobbies, lookingForRoommate, preferredRoommateGender, bio }) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('fresher_profiles')
    .upsert(
      { user_email: userEmail, college_id: collegeId, branch, year, hometown, hobbies, looking_for_roommate: lookingForRoommate, preferred_roommate_gender: preferredRoommateGender, bio },
      { onConflict: 'user_email' }
    )
    .select()
    .single()
  return { data, error: error?.message }
}

export async function getRoommateMatches(userEmail, limit = 10) {
  if (!supabase || !userEmail) return []
  const { data: myProfile } = await supabase
    .from('fresher_profiles')
    .select('*')
    .eq('user_email', userEmail)
    .maybeSingle()

  if (!myProfile) return []

  let q = supabase
    .from('fresher_profiles')
    .select('*, users(name, avatar_url)')
    .eq('looking_for_roommate', true)
    .eq('college_id', myProfile.college_id)
    .neq('user_email', userEmail)
    .limit(limit)

  if (myProfile.preferred_roommate_gender) {
    q = q.or(`preferred_roommate_gender.eq.${myProfile.preferred_roommate_gender},preferred_roommate_gender.is.null`)
  }

  return safeQuery(q)
}

// ── Senior Connect ────────────────────────────────────────────────────────────

export async function getSeniorConnect(collegeId, limit = 10) {
  if (!supabase) return []
  return safeQuery(
    supabase
      .from('users')
      .select('id, name, avatar_url, year, stream')
      .eq('college_id', collegeId)
      .eq('role', 'mentor')
      .order('created_at', { ascending: false })
      .limit(limit)
  )
}

// ── Campus Posts ──────────────────────────────────────────────────────────────

export async function getCampusPosts({ collegeId, category, limit = 20, offset = 0 } = {}) {
  if (!supabase) return []
  let q = supabase
    .from('campus_posts')
    .select('*, users(name, avatar_url)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (collegeId) q = q.eq('college_id', collegeId)
  if (category) q = q.eq('category', category)

  return safeQuery(q)
}

export async function createCampusPost({ userEmail, collegeId, title, body, category, imageUrl }) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('campus_posts')
    .insert({ user_email: userEmail, college_id: collegeId, title, body, category, image_url: imageUrl })
    .select('*, users(name, avatar_url)')
    .single()
  return { data, error: error?.message }
}

export async function getCampusPostCategories() {
  return ['Events', 'Clubs', 'Academics', 'Sports', 'Placement', 'General', 'Lost & Found', 'Housing']
}

// Backwards-compatible aliases
export const getRoommateCandidates = (college) => getFresherProfiles({ college })
