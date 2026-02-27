import supabase from "../supabaseClient"

async function fetchTable(tableName, orderBy) {
  let query = supabase.from(tableName).select("*")

  if (orderBy) {
    query = query.order(orderBy, { ascending: true })
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}

export function getColleges() {
  return fetchTable("colleges", "application_end")
}

export function getExamsTimeline() {
  return fetchTable("exams_timeline", "registration_end")
}
