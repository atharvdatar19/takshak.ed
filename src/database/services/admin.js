import supabase, { isDemoMode } from "@database/supabaseClient"

// ── Demo fallback helper ──────────────────────────────────────
function demoFallback(records = [], total = 0) {
    return { records, total }
}

async function safeQuery(builder) {
    if (!supabase) return { data: null, error: { message: "Demo mode" }, count: 0 }
    return builder
}

// ── Colleges ──────────────────────────────────────────────────
export async function adminGetColleges() {
    if (!supabase) return demoFallback()
    const { data, error, count } = await supabase
        .from("colleges")
        .select("*", { count: "exact" })
        .order("application_end", { ascending: true })

    if (error) throw new Error(error.message)
    return { records: data || [], total: count || 0 }
}

export async function adminUpsertCollege(college) {
    if (!supabase) return college
    const { data, error } = await supabase
        .from("colleges")
        .upsert(college, { onConflict: "id" })
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function adminDeleteCollege(id) {
    if (!supabase) return
    const { error } = await supabase.from("colleges").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

export async function adminToggleFeatured(id, value) {
    if (!supabase) return
    const { error } = await supabase
        .from("colleges")
        .update({ is_featured: value })
        .eq("id", id)

    if (error) throw new Error(error.message)
}

// ── Exams Timeline ────────────────────────────────────────────
export async function adminGetExams() {
    if (!supabase) return demoFallback()
    const { data, error, count } = await supabase
        .from("exams_timeline")
        .select("*", { count: "exact" })
        .order("start_date", { ascending: true })

    if (error) throw new Error(error.message)
    return { records: data || [], total: count || 0 }
}

export async function adminUpsertExam(exam) {
    if (!supabase) return exam
    const { data, error } = await supabase
        .from("exams_timeline")
        .upsert(exam, { onConflict: "id" })
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function adminDeleteExam(id) {
    if (!supabase) return
    const { error } = await supabase.from("exams_timeline").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ── Mentors ───────────────────────────────────────────────────
export async function adminGetMentors(verifiedOnly = null) {
    if (!supabase) return demoFallback()
    let query = supabase
        .from("mentors")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })

    if (verifiedOnly === true) query = query.eq("is_verified", true)
    if (verifiedOnly === false) query = query.eq("is_verified", false)

    const { data, error, count } = await query
    if (error) throw new Error(error.message)
    return { records: data || [], total: count || 0 }
}

export async function adminToggleVerified(id, value) {
    if (!supabase) return
    const { error } = await supabase
        .from("mentors")
        .update({ is_verified: value })
        .eq("id", id)

    if (error) throw new Error(error.message)
}

export async function adminDeleteMentor(id) {
    if (!supabase) return
    const { error } = await supabase.from("mentors").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ── Sessions ──────────────────────────────────────────────────
export async function adminGetSessions() {
    if (!supabase) return demoFallback()
    const { data, error, count } = await supabase
        .from("sessions")
        .select("*, mentors(full_name, college)", { count: "exact" })
        .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return { records: data || [], total: count || 0 }
}

// ── Transactions / Payouts ────────────────────────────────────
export async function adminGetTransactions() {
    if (!supabase) return demoFallback()
    const { data, error, count } = await supabase
        .from("transactions")
        .select("*, sessions(topic, mentor_id, mentors(full_name))", { count: "exact" })
        .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return { records: data || [], total: count || 0 }
}

export async function adminUpdateTransactionStatus(id, status) {
    if (!supabase) return
    const { error } = await supabase
        .from("transactions")
        .update({ status })
        .eq("id", id)

    if (error) throw new Error(error.message)
}

// ── Reports ───────────────────────────────────────────────────
export async function adminGetReports() {
    if (!supabase) return demoFallback()
    const { data, error, count } = await supabase
        .from("reports")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return { records: data || [], total: count || 0 }
}

export async function adminUpdateReport(id, status) {
    if (!supabase) return
    const { error } = await supabase
        .from("reports")
        .update({ status })
        .eq("id", id)

    if (error) throw new Error(error.message)
}

// ── Educators ─────────────────────────────────────────────────
export async function adminGetEducators() {
    if (!supabase) return demoFallback()
    const { data, error, count } = await supabase
        .from("educators")
        .select("*", { count: "exact" })
        .order("upvotes", { ascending: false })

    if (error) throw new Error(error.message)
    return { records: data || [], total: count || 0 }
}

export async function adminUpsertEducator(educator) {
    if (!supabase) return educator
    const { data, error } = await supabase
        .from("educators")
        .upsert(educator, { onConflict: "id" })
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function adminDeleteEducator(id) {
    if (!supabase) return
    const { error } = await supabase.from("educators").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ── Users ─────────────────────────────────────────────────────
export async function adminGetUsers() {
    if (!supabase) return demoFallback()
    const { data, error, count } = await supabase
        .from("users")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return { records: data || [], total: count || 0 }
}

export async function adminUpdateUserRole(id, role) {
    if (!supabase) return
    const { error } = await supabase
        .from("users")
        .update({ role })
        .eq("id", id)

    if (error) throw new Error(error.message)
}

export async function adminTogglePremium(id, value) {
    if (!supabase) return
    const { error } = await supabase
        .from("users")
        .update({ is_premium: value })
        .eq("id", id)

    if (error) throw new Error(error.message)
}

// ── Team Access (admin-role users) ────────────────────────────
export async function adminGetTeamMembers() {
    if (!supabase) return demoFallback()
    const { data, error, count } = await supabase
        .from("users")
        .select("*", { count: "exact" })
        .in("role", ["admin", "moderator", "content_editor", "finance_viewer"])
        .order("created_at", { ascending: true })

    if (error) throw new Error(error.message)
    return { records: data || [], total: count || 0 }
}

// ── Notifications ─────────────────────────────────────────────
export async function adminBroadcastNotification(userIds, message, type = "info") {
    if (!supabase) return
    const rows = userIds.map(userId => ({
        user_id: userId,
        message,
        type,
        is_read: false,
    }))

    const { error } = await supabase.from("notifications").insert(rows)
    if (error) throw new Error(error.message)
}

// ── Data Health (Dashboard Stats) ─────────────────────────────
export async function adminGetDataHealth() {
    if (!supabase) {
        return {
            totals: { colleges: 0, exams: 0, mentors: 0, users: 0, sessions: 0, transactions: 0, reports: 0 },
            health: { unverifiedMentors: 0, openReports: 0, pendingSessions: 0 },
        }
    }

    const [colleges, exams, mentors, users, sessions, transactions, reports] = await Promise.all([
        supabase.from("colleges").select("id", { count: "exact", head: true }),
        supabase.from("exams_timeline").select("id", { count: "exact", head: true }),
        supabase.from("mentors").select("id, is_verified", { count: "exact" }),
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("sessions").select("id, status", { count: "exact" }),
        supabase.from("transactions").select("id, amount_inr, platform_fee_inr, status", { count: "exact" }),
        supabase.from("reports").select("id, status", { count: "exact" }),
    ])

    const mentorRecords = mentors.data || []
    const sessionRecords = sessions.data || []
    const reportRecords = reports.data || []
    const txRecords = transactions.data || []

    const totalRevenue = txRecords.filter(t => t.status === "captured").reduce((s, t) => s + Number(t.amount_inr || 0), 0)
    const platformFees = txRecords.filter(t => t.status === "captured").reduce((s, t) => s + Number(t.platform_fee_inr || 0), 0)

    return {
        totals: {
            colleges: colleges.count || 0,
            exams: exams.count || 0,
            mentors: mentors.count || 0,
            users: users.count || 0,
            sessions: sessions.count || 0,
            transactions: transactions.count || 0,
            reports: reports.count || 0,
        },
        health: {
            unverifiedMentors: mentorRecords.filter(m => !m.is_verified).length,
            openReports: reportRecords.filter(r => r.status === "open").length,
            pendingSessions: sessionRecords.filter(s => s.status === "pending_payment" || s.status === "confirmed").length,
            completedSessions: sessionRecords.filter(s => s.status === "completed").length,
            totalRevenue,
            platformFees,
        },
    }
}

// ── Legacy Aliases ────────────────────────────────────────────
// These wrapper functions exist to prevent build errors in legacy admin panel components
export async function adminGetBookings() {
    return adminGetSessions()
}

export async function adminUpdateBookingStatus(id, status) {
    if (!supabase) return
    const { error } = await supabase
        .from("sessions")
        .update({ status })
        .eq("id", id)

    if (error) throw new Error(error.message)
}
