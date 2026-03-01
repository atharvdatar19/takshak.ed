import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, Search, Filter, MessageSquare, MapPin, Tag, Star, ChevronDown, CheckCircle2 } from "lucide-react"
import { getMarketplaceListings } from "../services/marketplace"

export default function Marketplace() {
    const [selectedExam, setSelectedExam] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")
    const [listings, setListings] = useState([])

    useEffect(() => {
        getMarketplaceListings().then(setListings)
    }, [])

    const filteredListings = listings.filter(item => {
        if (selectedExam !== "All" && !item.exam.includes(selectedExam)) return false
        if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    })

    return (
        <div className="mx-auto max-w-7xl animate-fade-in space-y-8">
            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-600 mb-3 border border-rose-200">
                        <ShoppingBag size={14} /> P2P Material Exchange
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                        Senior Marketplace
                    </h1>
                    <p className="mt-2 text-lg text-slate-500 max-w-2xl">
                        Buy expensive coaching modules and books from verified seniors in your city at 60-80% off. No scrap dealers, pure student-to-student value.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white text-slate-700 px-5 py-2.5 rounded-xl font-bold border border-slate-200 shadow-sm transition hover:bg-slate-50">
                        My Listings
                    </button>
                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-slate-200 transition hover:bg-slate-800 flex items-center gap-2">
                        <Tag size={18} /> Sell Material
                    </button>
                </div>
            </div>

            {/* ── SEARCH & FILTERS ── */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-10">
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search 'Allen Modules' or 'HC Verma'..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                    {["All", "JEE", "NEET", "Books", "Modules", "Notes"].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setSelectedExam(filter)}
                            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition ${selectedExam === filter
                                ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-sm font-bold ml-auto md:ml-2 hover:bg-slate-200 transition shrink-0">
                        <Filter size={16} /> Filters
                    </button>
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
                            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm border border-white/50">
                                    {item.exam}
                                </div>
                                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm ${item.condition === 'Excellent' || item.condition === 'Like New' ? 'bg-emerald-500 text-white' :
                                    item.condition === 'Good' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'
                                    }`}>
                                    {item.condition}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 line-clamp-2" title={item.title}>
                                    {item.title}
                                </h3>

                                <p className="text-slate-500 text-xs mb-4 flex items-center gap-1.5 line-clamp-2">
                                    <MapPin size={14} className="shrink-0" /> {item.location}
                                </p>

                                <div className="mt-auto pt-4 border-t border-slate-100">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <p className="text-xs text-slate-400 line-through">MRP ₹{item.mrp}</p>
                                            <p className="font-black text-2xl text-slate-900">₹{item.price}</p>
                                        </div>
                                        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                            {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition shadow-sm text-sm">
                                            Buy Now
                                        </button>
                                        <button className="flex items-center justify-center p-2.5 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-600 rounded-xl transition">
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
        </div>
    )
}
