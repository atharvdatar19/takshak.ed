import supabase, { isDemoMode } from "../supabaseClient"

// --- DEMO DATA FALLBACKS ---
const ROOMMATE_CANDIDATES = [
    { id: 1, name: "Rahul Sharma", state: "Delhi", match: 92, habits: { sleep: "Early Bird 🌅", study: "Silent 🤫", clean: "Neat Freak ✨", social: "Introvert 📖" }, bio: "Looking for a quiet room to focus on coding. I don't smoke/drink." },
    { id: 2, name: "Vikram Reddy", state: "Telangana", match: 85, habits: { sleep: "Night Owl 🦉", study: "Music 🎵", clean: "Neat ✨", social: "Ambivert 🤝" }, bio: "Usually up late studying or gaming. Easy going, looking to explore campus life." },
    { id: 3, name: "Aarav Patel", state: "Gujarat", match: 65, habits: { sleep: "Night Owl 🦉", study: "Group 🗣️", clean: "Relaxed 😎", social: "Extrovert 🎉" }, bio: "Love organizing weekend trips. Open door policy!" },
]

const SENIOR_CONNECT = [
    { id: 1, name: "Priya S.", year: "4th Year ECE", rating: 4.9, tags: ["Hostel Tips", "Placements", "Robotics Club"], avatar: "bg-blue-500" },
    { id: 2, name: "Aditya V.", year: "3rd Year CSE", rating: 4.8, tags: ["Coding Culture", "Hackathons", "Mess Food"], avatar: "bg-emerald-500" },
    { id: 3, name: "Karan T.", year: "2nd Year Mech", rating: 4.7, tags: ["Sports", "First Year survival", "Local Transport"], avatar: "bg-purple-500" },
]

const CAMPUS_POSTS = [
    { id: 1, type: "announcement", author: "Admin", time: "2h ago", content: "Hostel allotment list will be published on 15th August. Keep your documents ready.", pinned: true },
    { id: 2, type: "intro", author: "Neha Das (CSE)", time: "5h ago", content: "Hey everyone! Coming from Kolkata. Anyone on the Coromandel Express on the 18th? Let's travel together!", likes: 12, comments: 4 },
    { id: 3, type: "question", author: "Varun K.", time: "1d ago", content: "Is it necessary to buy laptops before joining, or should we wait for college discounts?", likes: 5, comments: 8 },
]

// --- SERVICES ---

export async function getRoommateCandidates(college) {
    if (isDemoMode) return ROOMMATE_CANDIDATES

    // Real Supabase call
    const { data, error } = await supabase
        .from('fresher_profiles')
        .select(`*, users!inner(full_name, email)`)
        .eq('college', college)

    if (error || !data) return ROOMMATE_CANDIDATES

    // Map DB data to frontend shape
    return data.map(profile => ({
        id: profile.user_id,
        name: profile.users?.full_name || "Unknown",
        state: profile.city_from || "Unknown",
        match: Math.floor(Math.random() * 30 + 60), // Mocking match % for now
        habits: profile.habits || { sleep: "Regular", study: "Mix", clean: "Neat", social: "Ambivert" },
        bio: profile.bio || "No bio provided"
    }))
}

export async function getSeniorConnect(college) {
    // Senior functionality hasn't been mapped to DB yet, returning mock
    return SENIOR_CONNECT
}

export async function getCampusPosts(college) {
    if (isDemoMode) return CAMPUS_POSTS

    const { data, error } = await supabase
        .from('campus_posts')
        .select(`*, users(full_name)`)
        .eq('college', college)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) return CAMPUS_POSTS

    return data.map(post => ({
        id: post.id,
        type: post.post_type,
        author: post.users?.full_name || "Anonymous",
        time: new Date(post.created_at).toLocaleDateString(),
        content: post.content,
        pinned: post.is_pinned,
        likes: Math.floor(Math.random() * 10), // Mock interactions
        comments: Math.floor(Math.random() * 5)
    }))
}

export async function createCampusPost(college, content) {
    if (isDemoMode) return { success: true }

    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) throw new Error("Not logged in")

    const { error } = await supabase
        .from('campus_posts')
        .insert({
            author_id: userData.user.id,
            college,
            content,
            post_type: 'intro'
        })

    if (error) throw error
    return { success: true }
}
