/**
 * siteContent.js — Admin-managed site content service
 * Allows admin to update website content without touching code.
 * Falls back to hardcoded defaults when no admin overrides exist.
 */
import supabase, { isDemoMode } from "../supabaseClient"

const LS_PREFIX = "netrax_content_"

// ── Default Values (mirrors current hardcoded content) ──
const DEFAULTS = {
    announcements: [],
    quickActions: [
        { title: "Find a Mentor", description: "Get 1:1 expert guidance from top rankers", icon: "Users", gradient: "card-gradient-blue", tag: "RECOMMENDED", link: "/sessions" },
        { title: "Defence Prep", description: "NDA, CDS, SSB prep — first session FREE", icon: "Shield", gradient: "card-gradient-teal", tag: "NEW", link: "/defence" },
        { title: "Ask Doubts", description: "Ask anonymously, learn together", icon: "MessageSquare", gradient: "card-gradient-purple", link: "/forum" },
        { title: "Predict Cutoff", description: "Check your chances at top colleges", icon: "Target", gradient: "card-gradient-orange", link: "/cutoff" },
    ],
    defenceMentors: [
        {
            id: "raghav",
            name: "Raghav Mishra",
            title: "NDA Written Exam & SSB Interview Coach",
            bio: "NDA Written Exam & SSB Interview Coach with 3 years of mentoring experience. Specializes in breaking down complex mathematical concepts and preparing candidates for psychological and GKT portions of SSB. Kendriya Vidyalaya alumni.",
            email: "raghavmishracr700@gmail.com",
            rating: 5.0,
            tags: ["NDA Written", "SSB Interview", "Mathematics", "GAT & GKT"],
            slots: ["10:00 AM", "2:00 PM", "6:00 PM"],
        },
        {
            id: "hemant",
            name: "Hemant Singh Bhadoriya",
            title: "NDA Written + SSB Interview Expert",
            bio: "AIR 371 NDA. Cleared NDA written exam 5 times. Mentored 50+ students for NDA written, conducted 30+ SSB mock interviews. Army Public School, Patiala.",
            email: "hemantbhadoriya040@gmail.com",
            rating: 5.0,
            tags: ["NDA Written + SSB", "Psychological Tests", "GTO Tasks", "30+ SSB Mocks"],
            slots: ["9:00 AM", "11:00 AM", "4:00 PM"],
        },
    ],
    defencePricing: [
        { id: "free", name: "First Guidance", price: "FREE", priceNote: "No payment needed" },
        { id: "session", name: "Written Exam Mentorship", price: "₹99", priceNote: "per session" },
        { id: "ssb", name: "SSB Interview Prep", price: "₹699", priceNote: "complete plan" },
    ],
    motivationalQuotes: [
        "Your future is shaped by the actions you take today.",
        "Small daily consistency compounds into rank-changing outcomes.",
        "Build discipline now, and opportunities will follow.",
        "Every practice test is a step closer to your dream college.",
        "Nations are built by minds that never stopped learning.",
    ],
    siteSettings: {
        brandName: "NetraX",
        tagline: "Where real experience meets real ambition",
        supportEmail: "atharvd10166@gmail.com",
        whatsappNumber: "",
        featureToggles: {
            chatbot: true,
            wellness: true,
            skillMatcher: true,
            defenceAspirants: true,
        },
        seo: {
            defaultTitle: "NetraX — College Admissions & Mentoring Platform",
            defaultDescription: "Track college admissions, access 1:1 mentoring, and prepare for competitive exams with NetraX.",
            ogImageUrl: "",
        },
    },
}

/**
 * Get content by key, with fallback to defaults
 */
export async function getSiteContent(key) {
    // Try localStorage first (works in demo and as cache)
    try {
        const stored = localStorage.getItem(`${LS_PREFIX}${key}`)
        if (stored) return JSON.parse(stored)
    } catch { /* silent */ }

    // Try Supabase if available
    if (!isDemoMode && supabase) {
        try {
            const { data, error } = await supabase
                .from("site_content")
                .select("value")
                .eq("key", key)
                .single()

            if (!error && data?.value) {
                // Cache to localStorage
                try { localStorage.setItem(`${LS_PREFIX}${key}`, JSON.stringify(data.value)) } catch { /* silent */ }
                return data.value
            }
        } catch (err) {
            console.warn("Site content fetch error:", err.message)
        }
    }

    return DEFAULTS[key] || null
}

/**
 * Update content (admin only)
 */
export async function updateSiteContent(key, value) {
    // Always save to localStorage
    try {
        localStorage.setItem(`${LS_PREFIX}${key}`, JSON.stringify(value))
    } catch { /* silent */ }

    // Try Supabase upsert
    if (!isDemoMode && supabase) {
        try {
            await supabase
                .from("site_content")
                .upsert({
                    key,
                    value,
                    updated_at: new Date().toISOString(),
                }, { onConflict: "key" })
        } catch (err) {
            console.warn("Site content save error:", err.message)
        }
    }

    return value
}

/**
 * Get all content keys and their values (for admin panel)
 */
export async function getAllSiteContent() {
    const result = {}
    for (const key of Object.keys(DEFAULTS)) {
        result[key] = await getSiteContent(key)
    }
    return result
}

/**
 * Reset a key to its default
 */
export function resetToDefault(key) {
    try { localStorage.removeItem(`${LS_PREFIX}${key}`) } catch { /* silent */ }
    return DEFAULTS[key]
}

export { DEFAULTS }
