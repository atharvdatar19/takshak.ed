import supabase from "@database/supabaseClient"

// ── Cutoff Predictor ──

export async function getCutoffData({ stream, category }) {
    if (!supabase) return []
    let query = supabase.from("cutoff_data").select("*, colleges(name, city, state, type)")
    if (stream) query = query.eq("stream", stream)
    if (category) query = query.eq("category", category)
    query = query.order("closing_rank", { ascending: true })
    const { data, error } = await query
    if (error) throw error
    return data || []
}

export function predictChances(rank, cutoffs) {
    return cutoffs.map(c => {
        const ratio = rank / c.closing_rank
        let chance = "Low"
        let color = "rose"
        if (ratio <= 0.7) { chance = "High"; color = "emerald" }
        else if (ratio <= 1.0) { chance = "Medium"; color = "amber" }
        return { ...c, chance, color }
    })
}

// ── Application Tracker ──

export async function getUserApplications(userId) {
    if (!supabase || !userId) return []
    const { data, error } = await supabase
        .from("applications")
        .select("*, colleges(name, city, state, application_end)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
    if (error) throw error
    return data || []
}

export async function upsertApplication(app) {
    if (!supabase) return null
    const { data, error } = await supabase
        .from("applications")
        .upsert(app, { onConflict: "id" })
        .select()
        .single()
    if (error) throw error
    return data
}

export async function updateApplicationStatus(id, status) {
    if (!supabase) return null
    const { data, error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", id)
        .select()
        .single()
    if (error) throw error
    return data
}

export async function deleteApplication(id) {
    if (!supabase) return
    const { error } = await supabase.from("applications").delete().eq("id", id)
    if (error) throw error
}

// ── Scholarship Finder ──

export async function getScholarships(filters = {}) {
    if (!supabase) return []
    let query = supabase.from("scholarships").select("*")
    if (filters.stream) query = query.contains("streams", [filters.stream])
    if (filters.category) query = query.contains("categories", [filters.category])
    if (filters.state) query = query.eq("state", filters.state)
    if (filters.search) query = query.ilike("name", `%${filters.search}%`)
    query = query.order("deadline", { ascending: true })
    const { data, error } = await query
    if (error) throw error
    return data || []
}

// ── Document Checklist ──

const DEFAULT_DOCUMENTS = [
    "Aadhaar Card",
    "10th Marksheet",
    "12th Marksheet",
    "Transfer Certificate",
    "Migration Certificate",
    "Category Certificate (if applicable)",
    "Income Certificate",
    "Domicile Certificate",
    "Passport Size Photos (6)",
    "Character Certificate",
    "Medical Fitness Certificate",
    "Entrance Exam Scorecard",
]

export function getDefaultDocuments() {
    return DEFAULT_DOCUMENTS
}

export async function getUserDocProgress(userId) {
    if (!supabase || !userId) return []
    const { data, error } = await supabase
        .from("user_doc_progress")
        .select("*")
        .eq("user_id", userId)
    if (error) throw error
    return data || []
}

export async function toggleDocProgress(userId, collegeName, documentName, isCompleted) {
    if (!supabase) return null
    const { data, error } = await supabase
        .from("user_doc_progress")
        .upsert(
            { user_id: userId, college_name: collegeName, document_name: documentName, is_completed: isCompleted },
            { onConflict: "user_id,college_name,document_name" },
        )
        .select()
        .single()
    if (error) throw error
    return data
}

// ── Stress Check-in ──

export async function logStress(userId, mood, stressLevel, note) {
    if (!supabase || !userId) return null
    const { data, error } = await supabase
        .from("stress_logs")
        .insert({ user_id: userId, mood, stress_level: stressLevel, note })
        .select()
        .single()
    if (error) throw error
    return data
}

export async function getStressLogs(userId, days = 14) {
    if (!supabase || !userId) return []
    const since = new Date(Date.now() - days * 86400000).toISOString()
    const { data, error } = await supabase
        .from("stress_logs")
        .select("*")
        .eq("user_id", userId)
        .gte("logged_at", since)
        .order("logged_at", { ascending: true })
    if (error) throw error
    return data || []
}

// ── Forum ──

export async function getForumPosts(filters = {}) {
    if (!supabase) return []
    let query = supabase.from("forum_posts").select("*, forum_replies(count)")
    if (filters.stream) query = query.eq("stream", filters.stream)
    query = query.order("created_at", { ascending: false }).limit(50)
    const { data, error } = await query
    if (error) throw error
    return data || []
}

export async function createForumPost(post) {
    if (!supabase) return null
    const { data, error } = await supabase.from("forum_posts").insert(post).select().single()
    if (error) throw error
    return data
}

export async function getForumReplies(postId) {
    if (!supabase) return []
    const { data, error } = await supabase
        .from("forum_replies")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true })
    if (error) throw error
    return data || []
}

export async function createForumReply(reply) {
    if (!supabase) return null
    const { data, error } = await supabase.from("forum_replies").insert(reply).select().single()
    if (error) throw error
    return data
}

// ── Study Planner ──

export async function getUserStudyPlan(userId) {
    if (!supabase || !userId) return null
    const { data, error } = await supabase
        .from("study_plans")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
    if (error && error.code !== "PGRST116") throw error
    return data || null
}

export async function saveStudyPlan(plan) {
    if (!supabase) return null
    const { data, error } = await supabase.from("study_plans").upsert(plan, { onConflict: "id" }).select().single()
    if (error) throw error
    return data
}

// ── Mentor Booking ──

export async function createMeetingRequest(booking) {
    if (!supabase) return null
    const { data, error } = await supabase
        .from("bookings")
        .insert({ ...booking, status: "pending" })
        .select()
        .single()
    if (error) throw error
    return data
}

export async function getUserBookings(userId) {
    if (!supabase || !userId) return []
    const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("student_id", userId)
        .order("requested_datetime", { ascending: true })
    if (error) throw error
    return data || []
}
