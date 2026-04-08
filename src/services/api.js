import supabase, { isDemoMode } from "../supabaseClient"

/** Race a promise against a timeout — returns fallback on timeout */
function withTimeout(promise, ms = 8000, fallback = null) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => {
      console.warn(`[TAKSHAK API] Query timed out after ${ms}ms, using fallback`)
      resolve(fallback)
    }, ms)),
  ])
}

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
  {
    id: "6952a42984ee384882831a4e", full_name: "Paarth Ainchwar", photo_url: "https://base44.app/api/apps/68b276d48626205b99d1f6d7/files/public/68b276d48626205b99d1f6d7/6522ad2f1_52893.webp",
    headline: "Medico student", college: "Venkateshwara Institute of Medical Sciences, Delhi", bio: "Medico — 2nd year, studying at Venkateshwara Institute of Medical Sciences Delhi.",
    exam_focus: ["NEET"], subjects: ["Biology"], rating: 5, total_sessions: 0, experience_years: 4, languages: ["English", "Hindi"], is_verified: true
  },
  {
    id: "6949477ad49d0b8a0ed52a51", full_name: "Anshika Pathak", photo_url: "https://base44.app/api/apps/68b276d48626205b99d1f6d7/files/public/68b276d48626205b99d1f6d7/095b9f551_IMG-20251213-WA0013.jpg",
    headline: "CBSE 10th & 12th Board Exam Specialist | JEE Mentor", college: "VIT Bhopal, B.Tech CSE (AI&ML)", bio: "I'm Anshika Pathak, pursuing B.Tech in CS with specialization in AI & ML at VIT Bhopal. District Topper with 95.2% in class 12th CBSE Board. Passionate about mentoring JEE and NEET aspirants with academics, exam strategies, and personal guidance.",
    exam_focus: ["JEE", "CBSE Boards"], subjects: ["Physics", "Chemistry", "Mathematics", "English", "Python"], rating: 5, total_sessions: 0, experience_years: 1, languages: ["English", "Hindi"], is_verified: true,
    achievements: ["91.2% in Class 10th CBSE", "District Topper 95.2% in Class 12th CBSE", "MISHAN SHAKTI AWARD for excellence"]
  },
  {
    id: "69402a8915f9e59b7fd259b1", full_name: "Shagufta Behlim", photo_url: "https://via.placeholder.com/150",
    headline: "JEE Expert", college: "St. Thomas Sr. Sec. School", bio: "BTech student in CSE with AI specialization. District Topper in Science Stream (96.2% in Class 12th). Focuses on clear, structured concept-building in Physics and Chemistry with a supportive mentoring approach.",
    exam_focus: ["JEE"], subjects: ["Physics", "Chemistry"], rating: 5, total_sessions: 0, experience_years: 1, languages: ["English", "Hindi"], is_verified: true,
    achievements: ["District Topper Science Stream 96.2% in Class 12th"]
  },
  {
    id: "6906ea816383975166ea99a6", full_name: "Navdeep Singh", photo_url: "https://via.placeholder.com/150",
    headline: "JEE Expert", college: "NIT Jalandhar", bio: "Hi, I am Navdeep Singh from NIT Jalandhar and I am a Maths and Physics expert.",
    exam_focus: ["JEE"], subjects: ["Mathematics", "Physics"], rating: 5, total_sessions: 0, experience_years: 0, languages: ["English", "Hindi"], is_verified: true
  },
  {
    id: "69065527f82212ede602a539", full_name: "Abhinay Yadav", photo_url: "https://i.postimg.cc/7ZZFj8q1/abhinay.jpg",
    headline: "Defence Mentor", college: "Thapar University", bio: "Currently pursuing B-Tech from Thapar University. Cleared NDA written twice and attended 3 SSBs (including NDA, TES, NAVY TECH entries).",
    exam_focus: ["NDA", "Defence"], subjects: ["NDA Subjects"], rating: 5, total_sessions: 0, experience_years: 1, languages: ["English", "Hindi"], is_verified: true,
    achievements: ["NDA Written cleared 2 times", "Attended 3 SSBs"]
  },
  {
    id: "68e94d80a458b3378c74b08e", full_name: "Soham Kakkar", photo_url: "https://base44.app/api/apps/68b276d48626205b99d1f6d7/files/public/68b276d48626205b99d1f6d7/4332a6dff_1000045161.jpg",
    headline: "Developer | IIT Undergraduate", college: "IIT Jammu", bio: "Programmer and 2nd year undergraduate at IIT Jammu. Worked on professional web development projects, Coding Club Coordinator. AIR 8k in JEE Advanced. Got a frontend internship in first year.",
    exam_focus: ["JEE", "Programming"], subjects: ["Programming", "Web Development"], rating: 5, total_sessions: 0, experience_years: 2, languages: ["English", "Hindi"], is_verified: true,
    achievements: ["AIR 8k in JEE Advanced", "Coding Club Coordinator at IIT Jammu", "Frontend internship in first year"]
  },
  {
    id: "68de292208138b652d85034d", full_name: "Anvesha Joshi", photo_url: "https://i.postimg.cc/sX8bQn6s/IMG-20251003-120318-168.jpg",
    headline: "Humanities Expert for 12th CBSE Boards", college: "Banasthali Vidyapeeth", bio: "BBA student at Banasthali Vidyapeeth with 91% in Class 12 Humanities. Cleared CUET and attempted IPMAT. Mentor for English proficiency in board exams and competitive entrance tests. Passionate about counselling and personality development.",
    exam_focus: ["CUET", "CBSE Boards"], subjects: ["English", "History", "Economics"], rating: 5, total_sessions: 0, experience_years: 3, languages: ["English", "Hindi"], is_verified: true,
    achievements: ["12th Boards Topper", "Proficiency in Bharatnatyam", "Content Writer at Banasthali Vidyapeeth"]
  },
  {
    id: "68bfa6a94f766b498f945488", full_name: "Raghav Mishra", photo_url: "https://i.postimg.cc/8k7jnMdB/IMG-20250906-WA0146.jpg",
    headline: "NDA Written Exam & SSB Interview Coach", college: "Kendriya Vidyalaya", bio: "A seasoned mentor with firsthand experience clearing the NDA written exam and multiple SSB interviews. Specializes in breaking down complex mathematical concepts and preparing candidates for the psychological and GKT portions of the SSB.",
    exam_focus: ["NDA", "SSB Interview", "Defence"], subjects: ["Mathematics", "GAT"], rating: 5, total_sessions: 0, experience_years: 3, languages: ["English", "Hindi"], is_verified: true
  },
  {
    id: "68bfa388d0e04e2fbf156334", full_name: "Hemant Singh Bhadoriya", photo_url: "https://i.postimg.cc/B6qxmc37/IMG-20250921-WA0005.jpg",
    headline: "NDA Written + SSB Interview Guidance Expert", college: "Army Public School, Patiala", bio: "Cleared NDA written 5 times, SSB recommended (AIR 371). Mentored 50+ students for NDA written and taken 30+ SSB mock interviews. Helps candidates with SSB Interview and NDA written examination guidance.",
    exam_focus: ["NDA", "SSB Interview", "Defence"], subjects: ["NDA Written (Mathematics + GAT)", "SSB Interview Guidance"], rating: 5, total_sessions: 0, experience_years: 2, languages: ["English", "Hindi"], is_verified: true,
    achievements: ["RECOMMENDED FROM 19 SSB PRAYAGRAJ", "AIR 371"]
  },
  {
    id: "68bc5fd1d0f9370c13cedf89", full_name: "Priyanka Nihalani", photo_url: "https://i.postimg.cc/QtnXj7Kk/pri.jpg",
    headline: "Academic and Skill Development Mentor", college: "IET DAVV, Indore", bio: "B.Tech IT student at IET DAVV, Indore. CBSE District Topper (97.6% in Class 10) and 89.4% in Class 12. Mentor for Board exams (PCM, CS, English) and CUET preparation. Active in Google Developer Groups.",
    exam_focus: ["CUET", "CBSE Boards", "JEE"], subjects: ["Python", "Mathematics", "Web Development", "English", "PCM"], rating: 4.9, total_sessions: 0, experience_years: 1, languages: ["English", "Hindi"], is_verified: true,
    achievements: ["District Topper 97.6% Class 10th", "89.4% in Class 12th"]
  },
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

  try {
    const result = await withTimeout(
      query.order("is_featured", { ascending: false })
        .order("application_end", { ascending: true })
        .range(from, to),
      8000,
      null
    )

    if (!result || result.error) {
      console.warn("Supabase colleges error, returning demo data", result?.error)
      return EMPTY_RESULT
    }

    const { data, count } = result

    if (!data || data.length === 0) {
      return EMPTY_RESULT
    }

    return {
      records: data,
      total: count || data.length,
      page,
      pageSize,
    }
  } catch (err) {
    console.warn("Supabase colleges exception, returning demo data", err)
    return EMPTY_RESULT
  }
}

export async function getExamsTimeline(params = {}) {
  if (!supabase || isDemoMode) return DEMO_EXAMS

  const { stream = "", state = "", targetExam = "" } = params

  let query = supabase
    .from("exams_timeline")
    .select("*")
    .order("start_date", { ascending: true })

  if (stream) query = query.eq("stream", stream)
  if (targetExam) query = query.eq("exam_name", targetExam)

  if (state) {
    query = query.eq("state", state)
  }

  const { data, error } = await query

  if (error || !data || data.length === 0) {
    return DEMO_EXAMS
  }

  return data
}

export async function getMentors(params = {}) {
  const { search = "", stream = "All" } = params

  const applyFilters = (data) => {
    return data.filter(m => {
      const ms = search.toLowerCase()
      const matchesSearch = !search ||
        (m.full_name || "").toLowerCase().includes(ms) ||
        (m.college || "").toLowerCase().includes(ms) ||
        (m.exam_focus || []).some(e => typeof e === 'string' && e.toLowerCase().includes(ms))
      
      const matchesStream = stream === "All" || (m.subjects || []).includes(stream)
      
      return matchesSearch && matchesStream
    })
  }

  if (!supabase || isDemoMode) return applyFilters(DEMO_MENTORS)

  let query = supabase.from("mentors").select("*").order("rating", { ascending: false })
  
  if (search) {
      query = query.or(`full_name.ilike.%${search}%,college.ilike.%${search}%`)
  }

  const result = await withTimeout(query, 8000, null)

  if (!result || result.error || !result.data || result.data.length === 0) {
    if (result?.error) console.warn("Supabase getMentors error/timeout, using fallback", result.error)
    return applyFilters(DEMO_MENTORS)
  }
  
  return applyFilters(result.data)
}

export async function getStats() {
  if (!supabase || isDemoMode) return { colleges: 60, mentors: 120, users: 4500 }

  try {
    const [cResult, mResult, uResult] = await Promise.all([
      supabase.from("colleges").select('*', { count: 'exact', head: true }),
      supabase.from("mentors").select('*', { count: 'exact', head: true }),
      supabase.from("users").select('*', { count: 'exact', head: true })
    ])
    return {
      colleges: cResult.count || 60,
      mentors: mResult.count || 120,
      users: uResult.count || 4500
    }
  } catch (error) {
    return { colleges: 60, mentors: 120, users: 4500 }
  }
}

export async function getCourses() {
  if (!supabase || isDemoMode) return [
    { id: "c1", title: "Python Basics", category: "Coding", total_xp: 500, lesson_count: 10, description: "Learn Python from scratch." },
    { id: "c2", title: "College Survival Guide", category: "Soft Skills", total_xp: 300, lesson_count: 5, description: "Master your college life." },
    { id: "c3", title: "Excel for Engineering", category: "Data", total_xp: 400, lesson_count: 8, description: "Data analysis basics." }
  ]
  const { data, error } = await supabase.from("courses").select("*").limit(3)
  if (error || !data) return []
  return data
}

// ═══════════════════════════════════════════════
//  RESOURCE HUB — Educators & Resource Links
// ═══════════════════════════════════════════════

const DEMO_EDUCATORS = [
  { id: "e1", name: "Alakh Pandey (Physics Wallah)", handle: "@PhysicsWallah", platform: "youtube", profile_url: "https://youtube.com/@PhysicsWallahAlakhPandey", subjects: ["Physics", "Chemistry"], exams: ["JEE", "NEET"], language: "Hinglish", description: "Best for conceptual clarity. Started from Allahabad, built for Tier-2 students.", subscriber_count: "10.2M", city_origin: "Allahabad", verified: true, rating: 4.9 },
  { id: "e2", name: "Vedantu JEE", handle: "@VedantuJEEEnglish", platform: "youtube", profile_url: "https://youtube.com/@VedantuJEEEnglish", subjects: ["Physics", "Maths", "Chemistry"], exams: ["JEE"], language: "English", description: "Structured live + recorded sessions. Good for English-medium students.", subscriber_count: "2.1M", city_origin: "Bengaluru", verified: true, rating: 4.7 },
  { id: "e3", name: "Arvind Kalia", handle: "@ExamPundit", platform: "youtube", profile_url: "https://youtube.com/@ArvindKalia", subjects: ["Maths"], exams: ["JEE", "Class 12"], language: "Hindi", description: "Pure Hindi Maths — best for students who struggle with English explanations.", subscriber_count: "890K", city_origin: "Jaipur", verified: true, rating: 4.6 },
  { id: "e4", name: "Paaras Thakur", handle: "@PaarasThakur", platform: "youtube", profile_url: "https://youtube.com/@PaarasThakur", subjects: ["Chemistry"], exams: ["JEE", "NEET"], language: "Hinglish", description: "Organic Chemistry made simple. Legendary for named reactions.", subscriber_count: "3.4M", city_origin: "Kota", verified: true, rating: 4.8 },
  { id: "e5", name: "Khan Academy India", handle: "@KhanAcademyHindi", platform: "youtube", profile_url: "https://youtube.com/@khanacademyhindi", subjects: ["Maths", "Science"], exams: ["Class 10", "Class 12", "CUET"], language: "Hindi", description: "Foundational concepts in pure Hindi. Perfect for building basics from scratch.", subscriber_count: "1.2M", city_origin: null, verified: true, rating: 4.5 },
]

const DEMO_RESOURCES = [
  { id: "r1", educator_id: "e1", title: "Complete Electrostatics Series", url: "https://youtube.com/playlist?list=PLECFJzFIBbMXXUhDoO8iBVMBN0NzjFJhN", resource_type: "playlist", subject: "Physics", topic: "Electrostatics", exam: "JEE", duration_hours: 12, is_pinned: true, upvotes: 342 },
  { id: "r2", educator_id: "e1", title: "NEET Chemistry Complete Revision", url: "https://youtube.com/playlist?list=example", resource_type: "playlist", subject: "Chemistry", topic: null, exam: "NEET", duration_hours: 20, is_pinned: false, upvotes: 218 },
  { id: "r3", educator_id: "e2", title: "JEE Mains 2025 Full Crash Course", url: "https://youtube.com/playlist?list=example2", resource_type: "playlist", subject: "Maths", topic: null, exam: "JEE", duration_hours: 40, is_pinned: true, upvotes: 156 },
  { id: "r4", educator_id: "e3", title: "Class 12 Integration Made Easy", url: "https://youtube.com/playlist?list=example3", resource_type: "playlist", subject: "Maths", topic: "Integration", exam: "Class 12", duration_hours: 8, is_pinned: false, upvotes: 89 },
  { id: "r5", educator_id: "e4", title: "Organic Chemistry Named Reactions One-Shot", url: "https://youtube.com/watch?v=example4", resource_type: "video", subject: "Chemistry", topic: "Named Reactions", exam: "JEE", duration_hours: 3, is_pinned: true, upvotes: 430 },
  { id: "r6", educator_id: "e5", title: "CUET General Test — Full Course", url: "https://youtube.com/playlist?list=example5", resource_type: "playlist", subject: "Science", topic: null, exam: "CUET", duration_hours: 15, is_pinned: false, upvotes: 67 },
]

export async function getEducators(params = {}) {
  if (!supabase || isDemoMode) {
    let filtered = [...DEMO_EDUCATORS]
    if (params.exam) filtered = filtered.filter(e => e.exams.includes(params.exam))
    if (params.subject) filtered = filtered.filter(e => e.subjects.includes(params.subject))
    if (params.language) filtered = filtered.filter(e => e.language === params.language)
    return filtered
  }

  let query = supabase.from("educators").select("*")
  if (params.exam) query = query.contains("exams", [params.exam])
  if (params.subject) query = query.contains("subjects", [params.subject])
  if (params.language) query = query.eq("language", params.language)
  if (params.platform) query = query.eq("platform", params.platform)

  const { data, error } = await query.order("verified", { ascending: false }).order("rating", { ascending: false })
  if (error || !data || data.length === 0) return DEMO_EDUCATORS
  return data
}

export async function getResources(params = {}) {
  if (!supabase || isDemoMode) {
    let filtered = [...DEMO_RESOURCES]
    if (params.educator_id) filtered = filtered.filter(r => r.educator_id === params.educator_id)
    if (params.exam) filtered = filtered.filter(r => r.exam === params.exam)
    if (params.subject) filtered = filtered.filter(r => r.subject === params.subject)
    if (params.resource_type) filtered = filtered.filter(r => r.resource_type === params.resource_type)
    return filtered.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0) || b.upvotes - a.upvotes)
  }

  let query = supabase.from("resource_links").select("*")
  if (params.educator_id) query = query.eq("educator_id", params.educator_id)
  if (params.exam) query = query.eq("exam", params.exam)
  if (params.subject) query = query.eq("subject", params.subject)
  if (params.topic) query = query.eq("topic", params.topic)
  if (params.resource_type) query = query.eq("resource_type", params.resource_type)

  const { data, error } = await query.order("is_pinned", { ascending: false }).order("upvotes", { ascending: false })
  if (error || !data || data.length === 0) return DEMO_RESOURCES
  return data
}

export async function upvoteResource(resourceId, userId) {
  if (!supabase || isDemoMode) return { success: true }

  // Upsert into resource_upvotes
  const { error: upvoteErr } = await supabase
    .from("resource_upvotes")
    .upsert({ user_id: userId, resource_id: resourceId }, { onConflict: "user_id,resource_id" })

  if (upvoteErr) throw upvoteErr

  // Increment upvotes via RPC or manual update
  const { data: resource } = await supabase.from("resource_links").select("upvotes").eq("id", resourceId).single()
  if (resource) {
    await supabase.from("resource_links").update({ upvotes: (resource.upvotes || 0) + 1 }).eq("id", resourceId)
  }

  return { success: true }
}

// ═══════════════════════════════════════════════
//  MENTOR BOOKING WORKFLOW — New Functions
// ═══════════════════════════════════════════════

const DEMO_MENTOR_FULL = {
  id: "m1", user_id: "u1", full_name: "Arjun Mehta", photo_url: null,
  college: "IIT Bombay", college_type: "IIT", branch: "Computer Science", grad_year: 2024,
  city_origin: "Pune", languages: ["Hindi", "English"], exam_focus: ["JEE"],
  subjects: ["Physics", "Maths"], bio: "Secured AIR 342 in JEE Advanced. I help students build foolproof strategies and analyze mock tests meticulously.",
  rate_30min_inr: 299, rate_60min_inr: 499, total_sessions: 47, rating: 4.85,
  is_verified: true, is_active: true, linkedin_url: "https://linkedin.com/in/arjun", college_email: "arjun@iitb.ac.in",
}

const DEMO_AVAILABILITY = [
  { id: "a1", mentor_id: "m1", slot_start: new Date(Date.now() + 86400000).toISOString(), slot_end: new Date(Date.now() + 86400000 + 3600000).toISOString(), is_booked: false, is_locked: false },
  { id: "a2", mentor_id: "m1", slot_start: new Date(Date.now() + 86400000 * 2).toISOString(), slot_end: new Date(Date.now() + 86400000 * 2 + 1800000).toISOString(), is_booked: false, is_locked: false },
  { id: "a3", mentor_id: "m1", slot_start: new Date(Date.now() + 86400000 * 2 + 7200000).toISOString(), slot_end: new Date(Date.now() + 86400000 * 2 + 7200000 + 3600000).toISOString(), is_booked: true, is_locked: false },
  { id: "a4", mentor_id: "m1", slot_start: new Date(Date.now() + 86400000 * 3).toISOString(), slot_end: new Date(Date.now() + 86400000 * 3 + 1800000).toISOString(), is_booked: false, is_locked: false },
  { id: "a5", mentor_id: "m1", slot_start: new Date(Date.now() + 86400000 * 5).toISOString(), slot_end: new Date(Date.now() + 86400000 * 5 + 3600000).toISOString(), is_booked: false, is_locked: false },
]

const DEMO_REVIEWS = [
  { id: "rv1", session_id: "s1", reviewer_id: "u2", mentor_id: "m1", rating: 5, comment: "Arjun sir explained electrostatics so clearly. My mock scores jumped 30 marks after his session!", created_at: "2026-03-10T10:00:00Z", reviewer_name: "Neha D." },
  { id: "rv2", session_id: "s2", reviewer_id: "u3", mentor_id: "m1", rating: 4, comment: "Good session on time management for JEE. Would recommend.", created_at: "2026-03-05T14:00:00Z", reviewer_name: "Varun K." },
  { id: "rv3", session_id: "s3", reviewer_id: "u4", mentor_id: "m1", rating: 5, comment: "Best mentor on the platform. He actually cares about your progress.", created_at: "2026-02-28T08:00:00Z", reviewer_name: "Priya S." },
]

const DEMO_SESSIONS = [
  { id: "s1", student_id: "u2", mentor_id: "m1", duration_minutes: 60, agreed_rate_inr: 499, meet_link: "https://meet.jit.si/takshak-s1", topic: "JEE Maths Strategy", status: "completed", created_at: "2026-03-10T09:00:00Z", completed_at: "2026-03-10T10:00:00Z", student_name: "Neha D.", mentor_name: "Arjun Mehta" },
  { id: "s2", student_id: "u3", mentor_id: "m1", duration_minutes: 30, agreed_rate_inr: 299, meet_link: "https://meet.jit.si/takshak-s2", topic: "Mock Test Analysis", status: "confirmed", created_at: new Date(Date.now() + 86400000).toISOString(), student_name: "Varun K.", mentor_name: "Arjun Mehta" },
]

const DEMO_TRANSACTIONS = [
  { id: "t1", type: "session_payment", payer_id: "u2", payee_id: "u1", session_id: "s1", amount_inr: 499, platform_fee_inr: 99.80, status: "captured", created_at: "2026-03-10T09:00:00Z" },
  { id: "t2", type: "payout", payer_id: null, payee_id: "u1", session_id: "s1", amount_inr: 399.20, platform_fee_inr: 0, status: "captured", created_at: "2026-03-11T09:00:00Z" },
]

export async function getMentorById(id) {
  if (!supabase || isDemoMode) return DEMO_MENTOR_FULL

  const { data, error } = await supabase
    .from("mentors")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return DEMO_MENTOR_FULL
  return data
}

export async function getMentorAvailability(mentorId) {
  if (!supabase || isDemoMode) return DEMO_AVAILABILITY

  const { data, error } = await supabase
    .from("mentor_availability")
    .select("*")
    .eq("mentor_id", mentorId)
    .gte("slot_start", new Date().toISOString())
    .order("slot_start", { ascending: true })

  if (error || !data) return DEMO_AVAILABILITY
  return data
}

export async function getMentorReviews(mentorId) {
  if (!supabase || isDemoMode) return DEMO_REVIEWS

  const { data, error } = await supabase
    .from("reviews")
    .select("*, users:reviewer_id(full_name)")
    .eq("mentor_id", mentorId)
    .order("created_at", { ascending: false })

  if (error || !data) return DEMO_REVIEWS
  return data.map(r => ({ ...r, reviewer_name: r.users?.full_name || "Student" }))
}

export async function getMyBookings(userId) {
  if (!supabase || isDemoMode) return DEMO_SESSIONS

  const { data, error } = await supabase
    .from("sessions")
    .select("*, mentors(full_name)")
    .eq("student_id", userId)
    .order("created_at", { ascending: false })

  if (error || !data) return DEMO_SESSIONS
  return data.map(s => ({ ...s, mentor_name: s.mentors?.full_name || "Mentor" }))
}

export async function getMentorSessions(mentorId) {
  if (!supabase || isDemoMode) return DEMO_SESSIONS

  const { data, error } = await supabase
    .from("sessions")
    .select("*, users:student_id(full_name)")
    .eq("mentor_id", mentorId)
    .order("created_at", { ascending: false })

  if (error || !data) return DEMO_SESSIONS
  return data.map(s => ({ ...s, student_name: s.users?.full_name || "Student" }))
}

export async function markSessionComplete(sessionId) {
  if (!supabase || isDemoMode) return { success: true }

  const { error } = await supabase
    .from("sessions")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", sessionId)

  if (error) throw error
  return { success: true }
}

export async function getMyTransactions(userId) {
  if (!supabase || isDemoMode) return DEMO_TRANSACTIONS

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .or(`payer_id.eq.${userId},payee_id.eq.${userId}`)
    .order("created_at", { ascending: false })

  if (error || !data) return DEMO_TRANSACTIONS
  return data
}

export async function toggleEducatorUpvote(educatorId, userId, hasUpvoted) {
  if (!supabase || isDemoMode) return { success: true }

  if (hasUpvoted) {
    await supabase.from("educator_upvotes").delete().eq("user_id", userId).eq("educator_id", educatorId)
    const { data: edu } = await supabase.from("educators").select("upvotes").eq("id", educatorId).single()
    if (edu) await supabase.from("educators").update({ upvotes: Math.max(0, (edu.upvotes || 0) - 1) }).eq("id", educatorId)
  } else {
    await supabase.from("educator_upvotes").upsert({ user_id: userId, educator_id: educatorId })
    const { data: edu } = await supabase.from("educators").select("upvotes").eq("id", educatorId).single()
    if (edu) await supabase.from("educators").update({ upvotes: (edu.upvotes || 0) + 1 }).eq("id", educatorId)
  }
  return { success: true }
}
