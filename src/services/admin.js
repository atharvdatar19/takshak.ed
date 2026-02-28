import supabase from "../supabaseClient"

// ── Colleges ──────────────────────────────────────────────────
export async function adminGetColleges() {
    const { data, error, count } = await supabase
        .from("colleges")
        .select("*", { count: "exact" })
        .order("application_end", { ascending: true })

    if (error) throw new Error(error.message)
    return { records: data || [], total: count || 0 }
}

export async function adminUpsertCollege(college) {
    const { data, error } = await supabase
        .from("colleges")
        .upsert(college, { onConflict: "id" })
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function adminDeleteCollege(id) {
    const { error } = await supabase.from("colleges").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

export async function adminToggleFeatured(id, value) {
    const { error } = await supabase
        .from("colleges")
        .update({ is_featured: value })
        .eq("id", id)

    if (error) throw new Error(error.message)
}

// ── Exams Timeline ────────────────────────────────────────────
export async function adminGetExams() {
    const { data, error, count } = await supabase
        .from("exams_timeline")
        .select("*", { count: "exact" })
        .order("start_date", { ascending: true })

    if (error) throw new Error(error.message)
    return { records: data || [], total: count || 0 }
}

export async function adminUpsertExam(exam) {
    const { data, error } = await supabase
        .from("exams_timeline")
        .upsert(exam, { onConflict: "id" })
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function adminDeleteExam(id) {
    const { error } = await supabase.from("exams_timeline").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ── Mentors ───────────────────────────────────────────────────
export async function adminGetMentors() {
    const { data, error, count } = await supabase
        .from("mentors")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return { records: data || [], total: count || 0 }
}

export async function adminToggleVerified(id, value) {
    const { error } = await supabase
        .from("mentors")
        .update({ is_verified: value })
        .eq("id", id)

    if (error) throw new Error(error.message)
}

export async function adminDeleteMentor(id) {
    const { error } = await supabase.from("mentors").delete().eq("id", id)
    if (error) throw new Error(error.message)
}

// ── Bookings ──────────────────────────────────────────────────
export async function adminGetBookings() {
    const { data, error, count } = await supabase
        .from("bookings")
        .select("*, mentors(name)", { count: "exact" })
        .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return { records: data || [], total: count || 0 }
}

export async function adminUpdateBookingStatus(id, status) {
    const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id)

    if (error) throw new Error(error.message)
}

// ── Users ─────────────────────────────────────────────────────
export async function adminGetUsers() {
    const { data, error, count } = await supabase
        .from("users")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return { records: data || [], total: count || 0 }
}

export async function adminTogglePremium(id, value) {
    const { error } = await supabase
        .from("users")
        .update({ is_premium: value })
        .eq("id", id)

    if (error) throw new Error(error.message)
}

// ── Notifications ─────────────────────────────────────────────
export async function adminBroadcastNotification(userIds, message, type = "info") {
    const rows = userIds.map(userId => ({
        user_id: userId,
        message,
        type,
        is_read: false,
    }))

    const { error } = await supabase.from("notifications").insert(rows)
    if (error) throw new Error(error.message)
}

// ── Data Health ───────────────────────────────────────────────
export async function adminGetDataHealth() {
    const [colleges, exams, mentors, users, bookings] = await Promise.all([
        supabase.from("colleges").select("id, name, official_link, state, streams_supported", { count: "exact" }),
        supabase.from("exams_timeline").select("id, start_date, stream", { count: "exact" }),
        supabase.from("mentors").select("id, rating, is_verified, stream", { count: "exact" }),
        supabase.from("users").select("id, stream, state, is_premium", { count: "exact" }),
        supabase.from("bookings").select("id, status", { count: "exact" }),
    ])

    const collegeRecords = colleges.data || []
    const examRecords = exams.data || []
    const mentorRecords = mentors.data || []
    const userRecords = users.data || []
    const bookingRecords = bookings.data || []

    const missingLinks = collegeRecords.filter(c => !c.official_link).length
    const lowRatingMentors = mentorRecords.filter(m => !m.rating || Number(m.rating) === 0).length
    const unverifiedMentors = mentorRecords.filter(m => !m.is_verified).length
    const missingDates = examRecords.filter(e => !e.start_date).length
    const pendingBookings = bookingRecords.filter(b => b.status === "Pending").length
    const premiumUsers = userRecords.filter(u => u.is_premium).length

    function countByField(records, field) {
        const map = {}
        for (const record of records) {
            const key = record[field] || "Unknown"
            map[key] = (map[key] || 0) + 1
        }
        return map
    }

    return {
        totals: {
            colleges: colleges.count || 0,
            exams: exams.count || 0,
            mentors: mentors.count || 0,
            users: users.count || 0,
            bookings: bookings.count || 0,
        },
        health: {
            missingLinks,
            lowRatingMentors,
            unverifiedMentors,
            missingDates,
            pendingBookings,
            premiumUsers,
        },
        distributions: {
            collegesByState: countByField(collegeRecords, "state"),
            mentorsByStream: countByField(mentorRecords, "stream"),
            usersByStream: countByField(userRecords, "stream"),
            bookingsByStatus: countByField(bookingRecords, "status"),
        },
    }
}
