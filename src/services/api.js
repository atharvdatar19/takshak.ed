import supabase from "../supabaseClient"

const EMPTY_RESULT = { records: [], total: 0, page: 1, pageSize: 8 }

function applyEquals(query, key, value) {
  return value ? query.eq(key, value) : query
}

export async function getColleges(params = {}) {
  if (!supabase) return EMPTY_RESULT

  const {
    search = "",
    state = "",
    stream = "",
    admissionMode = "",
    status = "",
    page = 1,
    pageSize = 8,
  } = params

  let query = supabase
    .from("colleges")
    .select("*", { count: "exact" })

  query = applyEquals(query, "state", state)
  query = applyEquals(query, "admission_mode", admissionMode)

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  if (stream) {
    query = query.contains("streams_supported", [stream])
  }

  const nowIso = new Date().toISOString().slice(0, 10)

  if (status === "open") {
    query = query.gte("application_end", nowIso)
  }

  if (status === "closed") {
    query = query.lt("application_end", nowIso)
  }

  if (status === "closingSoon") {
    const soon = new Date()
    soon.setDate(soon.getDate() + 5)
    query = query
      .gte("application_end", nowIso)
      .lte("application_end", soon.toISOString().slice(0, 10))
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order("is_featured", { ascending: false })
    .order("application_end", { ascending: true })
    .range(from, to)

  if (error) throw new Error(error.message)

  return {
    records: data || [],
    total: count || 0,
    page,
    pageSize,
  }
}

export async function getExamsTimeline(params = {}) {
  if (!supabase) return []

  const { stream = "", state = "", targetExam = "" } = params

  let query = supabase
    .from("exams_timeline")
    .select("*")
    .order("priority", { ascending: false })
    .order("start_date", { ascending: true })

  if (stream) query = query.eq("stream", stream)
  if (targetExam) query = query.eq("target_exam", targetExam)

  if (state) {
    query = query.or(`is_national.eq.true,state.eq.${state}`)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)

  return data || []
}

export async function getMentors(params = {}) {
  if (!supabase) return []

  let query = supabase.from("mentors").select("*").order("rating", { ascending: false })
  if (params.stream) query = query.eq("stream", params.stream)

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return data || []
}
