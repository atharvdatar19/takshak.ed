import supabase, { isDemoMode } from "../supabaseClient"

// --- DEMO DATA FALLBACKS ---
const LISTINGS = [
    {
        id: 1,
        title: "Allen JEE Main & Adv Complete Modules (2024)",
        seller: "Rohan K.",
        verified: true,
        exam: "JEE",
        type: "Modules",
        price: 3500,
        mrp: 12000,
        condition: "Good",
        location: "Kothrud, Pune",
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400&h=300",
        description: "Complete set of 11th & 12th PCM modules. Minor highlights in Physics vol 1, rest are completely clean. Need to sell urgently."
    },
    {
        id: 2,
        title: "Cengage Mathematics series (Full 5 Books)",
        seller: "Aditi S.",
        verified: true,
        exam: "JEE",
        type: "Books",
        price: 1800,
        mrp: 4500,
        condition: "Excellent",
        location: "Viman Nagar, Pune",
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400&h=300",
        description: "Like new. Only Algebra book has some pencil marks. Remaining 4 books are untouched."
    },
    {
        id: 3,
        title: "Resonance NEET Rank Booster Notes",
        seller: "Vikram R.",
        verified: false,
        exam: "NEET",
        type: "Notes",
        price: 800,
        mrp: 2000,
        condition: "Fair",
        location: "Aundh, Pune",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400&h=300",
        description: "Handwritten toppers notes bundled with resonance short notes. Binding is slightly loose but pages are fine."
    },
    {
        id: 4,
        title: "HC Verma Vol 1 & 2 - Latest Edition",
        seller: "Pooja M.",
        verified: true,
        exam: "JEE/NEET",
        type: "Books",
        price: 600,
        mrp: 950,
        condition: "Like New",
        location: "Baner, Pune",
        image: "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&q=80&w=400&h=300",
        description: "Just bought 3 months ago. Decided not to prepare for JEE."
    }
]

// --- SERVICES ---

export async function getMarketplaceListings() {
    if (isDemoMode) return LISTINGS

    const { data, error } = await supabase
        .from('marketplace_listings')
        .select(`*, users(full_name)`)
        .eq('status', 'available')
        .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) return LISTINGS

    return data.map(item => ({
        id: item.id,
        title: item.title,
        seller: item.users?.full_name || "Anonymous User",
        verified: false, // We can add verification logic later
        exam: item.exam,
        type: item.material_type,
        price: item.price,
        mrp: item.mrp || item.price * 2,
        condition: item.condition,
        location: `${item.city}, ${item.state || ""}`.replace(/,\s*$/, ""),
        image: item.photos && item.photos.length > 0 ? item.photos[0] : "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400&h=300",
        description: ""
    }))
}

export async function createMarketplaceListing(listing) {
    if (isDemoMode) return { success: true }

    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) throw new Error("Not logged in")

    const { error } = await supabase
        .from('marketplace_listings')
        .insert({
            seller_id: userData.user.id,
            ...listing
        })

    if (error) throw error
    return { success: true }
}
