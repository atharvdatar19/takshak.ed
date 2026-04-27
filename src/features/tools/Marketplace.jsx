import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { ShoppingBag, Search, Filter, MessageSquare, MapPin, Tag, Star, ChevronDown, CheckCircle2, PlayCircle, BookOpen } from "lucide-react"
import { getMarketplaceListings } from "@database/services/marketplace"
import { takshakCourses } from "@/data/takshakData"
import { useToast } from "@components/Toast"

export default function Marketplace() {
    const [activeTab, setActiveTab] = useState("buy") // "buy" | "sell"
    const [selectedExam, setSelectedExam] = useState("All Exams")
    const [selectedCategory, setSelectedCategory] = useState("All Materials")
    const [selectedMode, setSelectedMode] = useState("All Modes")
    const [searchQuery, setSearchQuery] = useState("")
    const [listings, setListings] = useState([])

    // Sell Form State
    const [sellForm, setSellForm] = useState({ title: "", category: "Books", exam: "JEE", price: "", condition: "Good" })
    const { addToast } = useToast()

    const handleSellSubmit = (e) => {
        e.preventDefault()
        const newItem = {
            id: Date.now().toString(),
            title: sellForm.title,
            exam: sellForm.exam,
            type: sellForm.category,
            price: Number(sellForm.price),
            condition: sellForm.condition,
            location: "Local",
            image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
            provider: "You (Seller)"
        }
        setListings([newItem, ...listings])
        addToast("success", "Item listed successfully for sale!")
        setSellForm({ title: "", category: "Books", exam: "JEE", price: "", condition: "Good" })
        setActiveTab("buy")
    }

    useEffect(() => {
        async function loadData() {
            let data = []
            try {
                data = await getMarketplaceListings()
            } catch (err) {
                console.error("Supabase API error for marketplace:", err)
            }

            const courseListings = takshakCourses.map(c => ({
                id: c.id,
                title: c.title,
                exam: c.exam,
                type: "Course",
                provider: c.provider,
                mode: c.mode,
                price: c.price,
                mrp: c.price + 2000,
                condition: "New",
                location: "Online",
                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
                tags: c.tags,
                rating: c.rating
            }))

            setListings([...(data || []), ...courseListings])
        }
        loadData()
    }, [])

    const filteredListings = listings.filter(item => {
        if (selectedCategory !== "All Materials" && item.type !== selectedCategory) return false
        if (selectedExam !== "All Exams" && !(item.exam && item.exam.includes(selectedExam))) return false
        if (selectedMode !== "All Modes" && item.mode !== selectedMode) return false
        if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.provider?.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    })

    return (
        <div className="mx-auto max-w-7xl animate-fade-in space-y-8">
            <Helmet>
                <title>Marketplace | TAKSHAK</title>
                <meta name="description" content="Buy and sell second-hand study materials, P2P notes, and discover official Live/Recorded courses." />
                <meta property="og:title" content="Marketplace | TAKSHAK Courses & Materials" />
                <meta property="og:description" content="Buy and sell second-hand study materials, P2P notes, and discover official Live/Recorded courses." />
            </Helmet>

            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-600 mb-3 border border-rose-200">
                        <ShoppingBag size={14} /> P2P Materials & Official Courses
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                        Unified Marketplace
                    </h1>
                    <p className="mt-2 text-lg text-slate-500 max-w-3xl">
                        Buy expensive coaching modules from verified seniors or purchase official Live/Recorded courses from top providers like PhysicsWallah and Unacademy.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setActiveTab("buy")} className={`px-5 py-2.5 rounded-xl font-bold border transition ${activeTab === "buy" ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>
                        Buy Materials
                    </button>
                    <button onClick={() => setActiveTab("sell")} className={`px-5 py-2.5 rounded-xl font-bold border transition flex items-center gap-2 ${activeTab === "sell" ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}>
                        <Tag size={18} /> Sell Item
                    </button>
                </div>
            </div>

            {activeTab === "buy" ? (
                <>
                    {/* ── SEARCH & FILTERS ── */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-10 transition-all">
                        <div className="relative w-full md:w-96 shrink-0">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search 'PhysicsWallah', 'Allen Modules'..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 font-medium text-slate-700"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                            {["All Exams", "JEE", "GATE", "UPSC", "CAT"].map(filter => (
                                <button
                                    key={'exam-' + filter}
                                    onClick={() => setSelectedExam(filter)}
                                    className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${selectedExam === filter
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                            <div className="h-8 w-px bg-slate-200 mx-2 shrink-0"></div>
                            {["All Materials", "Course", "Books", "Modules"].map(filter => (
                                <button
                                    key={'cat-' + filter}
                                    onClick={() => setSelectedCategory(filter)}
                                    className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition ${selectedCategory === filter
                                        ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}

                            <div className="h-8 w-px bg-slate-200 mx-2 shrink-0"></div>

                            {["All Modes", "Live", "Recorded", "Hybrid"].map(filter => (
                                <button
                                    key={'mode-' + filter}
                                    onClick={() => setSelectedMode(filter)}
                                    className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${selectedMode === filter
                                        ? "bg-teal-600 text-white shadow-md shadow-teal-200"
                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    {filter === "Live" && <PlayCircle size={14} />}
                                    {filter === "All Modes" && <Filter size={14} />}
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── GRID ── */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {filteredListings.map(item => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col relative"
                                >
                                    {/* Image Container */}
                                    <div className="relative h-48 overflow-hidden bg-slate-100">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                                        <div className="absolute top-3 left-3 flex gap-2">
                                            <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm border border-white/50">
                                                {item.exam}
                                            </div>
                                            {item.type === "Course" && (
                                                <div className="bg-indigo-600/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-sm flex items-center gap-1 border border-indigo-400/50">
                                                    <PlayCircle size={12} /> Course
                                                </div>
                                            )}
                                        </div>

                                        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm ${item.condition === 'Excellent' || item.condition === 'Like New' || item.condition === 'New' ? 'bg-emerald-500 text-white' :
                                            item.condition === 'Good' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'
                                            }`}>
                                            {item.condition}
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        {item.provider && (
                                            <p className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 mb-1">
                                                Partner: {item.provider}
                                            </p>
                                        )}

                                        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 line-clamp-2" title={item.title}>
                                            {item.title}
                                        </h3>

                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-slate-500 text-xs flex items-center gap-1.5 line-clamp-1">
                                                <MapPin size={14} className="shrink-0" /> {item.location}
                                            </p>

                                            {item.mode && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                                                    {item.mode}
                                                </span>
                                            )}
                                        </div>

                                        {item.rating && (
                                            <div className="flex items-center gap-1 mb-3 text-xs font-bold text-amber-500">
                                                <Star size={12} fill="currentColor" /> {item.rating} Rating
                                            </div>
                                        )}

                                        <div className="mt-auto pt-4 border-t border-slate-100">
                                            <div className="flex justify-between items-end mb-4">
                                                <div>
                                                    {item.mrp && <p className="text-xs text-slate-400 line-through">MRP ₹{item.mrp}</p>}
                                                    <p className="font-black text-2xl text-slate-900">₹{item.price}</p>
                                                </div>
                                                {item.mrp && item.price && (
                                                    <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                                        {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition shadow-sm text-sm active:scale-95">
                                                    {item.type === "Course" ? "Enroll Now" : "Buy Now"}
                                                </button>
                                                <button className="flex items-center justify-center p-2.5 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-600 rounded-xl transition active:scale-95" title="Contact Seller/Provider">
                                                    <MessageSquare size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    {filteredListings.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                            <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No matching materials found</h3>
                            <p className="text-slate-500 text-sm">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </>
            ) : (
                /* ── SELL FORM ── */
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">List an Item for Sale</h2>
                    <form onSubmit={handleSellSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                            <input required type="text" placeholder="e.g. HC Verma Concepts of Physics Vol 1" value={sellForm.title} onChange={e => setSellForm({ ...sellForm, title: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-rose-400 focus:bg-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                                <select value={sellForm.category} onChange={e => setSellForm({ ...sellForm, category: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-rose-400 focus:bg-white">
                                    <option value="Books">Books</option>
                                    <option value="Notes">Notes / Modules</option>
                                    <option value="Devices">Devices / Calculators</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Exam</label>
                                <select value={sellForm.exam} onChange={e => setSellForm({ ...sellForm, exam: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-rose-400 focus:bg-white">
                                    <option value="JEE">JEE</option>
                                    <option value="NEET">NEET</option>
                                    <option value="UPSC">UPSC</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Condition</label>
                                <select value={sellForm.condition} onChange={e => setSellForm({ ...sellForm, condition: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-rose-400 focus:bg-white">
                                    <option value="Like New">Like New</option>
                                    <option value="Good">Good</option>
                                    <option value="Acceptable">Acceptable</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Price (₹)</label>
                                <input required type="number" min="0" placeholder="e.g. 500" value={sellForm.price} onChange={e => setSellForm({ ...sellForm, price: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-rose-400 focus:bg-white" />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-3.5 mt-4 rounded-xl bg-rose-500 text-white font-bold shadow-md shadow-rose-200 hover:bg-rose-600 hover:shadow-lg transition">
                            Post Listing
                        </button>
                    </form>
                </motion.div>
            )}
        </div>
    )
}
