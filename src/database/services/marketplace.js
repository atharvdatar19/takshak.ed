import supabase from '@database/supabaseClient'

async function safeQuery(queryBuilder, fallback = []) {
  if (!queryBuilder) return fallback
  const { data, error } = await queryBuilder
  if (error) { console.error('[marketplace]', error.message); return fallback }
  return data ?? fallback
}

export async function getListings({ exam, type, condition, maxPrice, search, limit = 20, offset = 0 } = {}) {
  if (!supabase) return []
  let q = supabase
    .from('marketplace_listings')
    .select('*, users(name, avatar_url)')
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (exam) q = q.eq('exam', exam)
  if (type) q = q.eq('material_type', type)
  if (condition) q = q.eq('condition', condition)
  if (maxPrice) q = q.lte('price', maxPrice)
  if (search) q = q.or(`title.ilike.%${search}%,description.ilike.%${search}%`)

  return safeQuery(q)
}

export async function getListingById(id) {
  if (!supabase || !id) return null
  const { data } = await supabase
    .from('marketplace_listings')
    .select('*, users(name, avatar_url)')
    .eq('id', id)
    .maybeSingle()
  return data
}

export async function getUserListings(userEmail) {
  if (!supabase || !userEmail) return []
  return safeQuery(
    supabase
      .from('marketplace_listings')
      .select('*')
      .eq('seller_email', userEmail)
      .order('created_at', { ascending: false })
  )
}

export async function createListing({ sellerEmail, title, description, exam, materialType, condition, price, mrp, photos = [], city, state }) {
  if (!supabase) return { error: 'Not connected' }
  const { data, error } = await supabase
    .from('marketplace_listings')
    .insert({
      seller_email: sellerEmail,
      title,
      description,
      exam,
      material_type: materialType,
      condition,
      price,
      mrp,
      photos,
      city,
      state,
      status: 'available',
    })
    .select()
    .single()
  return { data, error: error?.message }
}

export async function updateListingStatus(listingId, sellerEmail, status) {
  if (!supabase) return { error: 'Not connected' }
  const validStatuses = ['available', 'sold', 'reserved', 'removed']
  if (!validStatuses.includes(status)) return { error: 'Invalid status' }
  const { error } = await supabase
    .from('marketplace_listings')
    .update({ status })
    .eq('id', listingId)
    .eq('seller_email', sellerEmail)
  return { error: error?.message }
}

export async function deleteListing(listingId, sellerEmail) {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase
    .from('marketplace_listings')
    .delete()
    .eq('id', listingId)
    .eq('seller_email', sellerEmail)
  return { error: error?.message }
}

export async function getExamOptions() {
  return ['JEE', 'NEET', 'UPSC', 'CAT', 'GATE', 'CUET', 'Defence', 'Board', 'Other']
}

export async function getMaterialTypes() {
  return ['Books', 'Modules', 'Notes', 'Test Papers', 'Study Material', 'Other']
}

export async function getConditionOptions() {
  return ['Like New', 'Good', 'Fair', 'Acceptable']
}

// Backwards-compatible alias
export const getMarketplaceListings = () => getListings()
