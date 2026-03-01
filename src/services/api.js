import supabase, { isDemoMode } from "../supabaseClient"

// --- DEMO FALLBACK DATA ---
const DEMO_COLLEGES = [
  {
    id: "1",
    name: "Indian Institute of Technology Bombay",
    city: "Mumbai",
    state: "Maharashtra",
    type: "government",
    established_year: 1958,
    website: "https://www.iitb.ac.in",
    application_end: "2026-05-30",
    streams_supported: ["PCM"],
    is_featured: true
  },
  {
    id: "2",
    name: "National Institute of Technology Trichy",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    type: "government",
    established_year: 1964,
    website: "https://www.nitt.edu",
    application_end: "2026-06-15",
    streams_supported: ["PCM"],
    is_featured: true
  },
  {
    id: "3",
    name: "BITS Pilani",
    city: "Pilani",
    state: "Rajasthan",
    type: "private",
    established_year: 1964,
    website: "https://www.bits-pilani.ac.in",
    application_end: "2026-04-10",
    streams_supported: ["PCM", "PCB"],
    is_featured: true
  },
  {
    id: "4",
    name: "Vellore Institute of Technology",
    city: "Vellore",
    state: "Tamil Nadu",
    type: "private",
    established_year: 1984,
    website: "https://vit.ac.in",
    application_end: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10), // Closing in 3 days
    streams_supported: ["PCM", "PCB"],
    is_featured: false
  },
  {
    id: "5",
    name: "All India Institute of Medical Sciences",
    city: "New Delhi",
    state: "Delhi",
    type: "government",
    established_year: 1956,
    website: "https://www.aiims.edu",
    application_end: "2026-03-30",
    streams_supported: ["PCB"],
    is_featured: true
  },
  {
    id: "6",
    name: "SRM Institute of Science and Technology",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "private",
    established_year: 1985,
    website: "https://www.srmist.edu.in",
    application_end: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    streams_supported: ["PCM"],
    is_featured: false
  }
]

const DEMO_EXAMS = [
  { id: "e1", name: "JEE Main Session 1", start_date: "2026-01-24", end_date: "2026-02-01", is_national: true, stream: "PCM" },
  { id: "e2", name: "NEET UG", start_date: "2026-05-05", end_date: "2026-05-05", is_national: true, stream: "PCB" },
  { id: "e3", name: "BITSAT Session 1", start_date: "2026-05-20", end_date: "2026-05-24", is_national: true, stream: "PCM" },
  { id: "e4", name: "MHT-CET (PCM)", start_date: "2026-04-16", end_date: "2026-04-30", is_national: false, state: "Maharashtra", stream: "PCM" }
]

const DEMO_MENTORS = [
  { id: "m1", name: "Arjun K.", college: "IIT Delhi", company: "Google", role: "Software Engineer", rating: 4.9, sessions: 120, price: 500, stream: "PCM", image: "https://i.pravatar.cc/150?u=a" },
  { id: "m2", name: "Priya S.", college: "AIIMS Delhi", company: "Safdarjung Hospital", role: "Junior Resident", rating: 4.8, sessions: 85, price: 450, stream: "PCB", image: "https://i.pravatar.cc/150?u=b" },
  { id: "m3", name: "Rahul M.", college: "BITS Pilani", company: "Microsoft", role: "Product Manager", rating: 4.7, sessions: 60, price: 400, stream: "PCM", image: "https://i.pravatar.cc/150?u=c" }
]

const EMPTY_RESULT = { records: DEMO_COLLEGES, total: DEMO_COLLEGES.length, page: 1, pageSize: 8 }

function applyEquals(query, key, value) {
  return value ? query.eq(key, value) : query
}

export async function getColleges(params = {}) {
  if (!supabase || isDemoMode) return EMPTY_RESULT

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

  if (error) {
    console.warn("Supabase colleges error, returning mock schema", error)
    return EMPTY_RESULT
  }

  if (!data || data.length === 0) {
    return EMPTY_RESULT // Fallback if table is just clean-installed and empty
  }

  return {
    records: data,
    total: count || data.length,
    page,
    pageSize,
  }
}

export async function getExamsTimeline(params = {}) {
  if (!supabase || isDemoMode) return DEMO_EXAMS

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

  if (error || !data || data.length === 0) {
    return DEMO_EXAMS
  }

  return data
}

export async function getMentors(params = {}) {
  if (!supabase || isDemoMode) return DEMO_MENTORS

  let query = supabase.from("mentors").select("*").order("rating", { ascending: false })
  if (params.stream) query = query.eq("stream", params.stream)

  const { data, error } = await query

  if (error || !data || data.length === 0) {
    return DEMO_MENTORS
  }
  return data
}
