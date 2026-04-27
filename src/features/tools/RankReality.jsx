import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Map, Target, Filter, ChevronRight, CheckCircle2,
    AlertCircle, GraduationCap, MapPin, Search, ArrowRight,
    TrendingUp, Banknote, HelpCircle
} from "lucide-react"

import { cutoffDataset, getRankOptions } from "@/data/josaa_cutoffs"

export default function RankReality() {
    const [rank, setRank] = useState("")
    const [examType, setExamType] = useState("JEE Main")
    const [category, setCategory] = useState("OPEN")
    const [hasCalculated, setHasCalculated] = useState(false)
    const [results, setResults] = useState([])

    // Filters
    const [selectedTier, setSelectedTier] = useState("All")

    const handleCalculate = (e) => {
        e.preventDefault()
        if (!rank) return
        const rInput = parseInt(rank)
        const opts = getRankOptions(rInput, examType)
        setResults(opts)
        setHasCalculated(true)
    }

    const filteredResults = useMemo(() => {
        if (selectedTier === "All") return results
        return results.filter(r => r.tier === selectedTier)
    }, [results, selectedTier])

    // Compute metrics for header
    const stats = useMemo(() => {
        const safe = results.filter(c => c.matchedBranches.some(b => b.probability >= 90)).length
        const realistic = results.filter(c => c.matchedBranches.some(b => b.probability >= 70 && b.probability < 90)).length
        const reach = results.filter(c => c.matchedBranches.some(b => b.probability >= 30 && b.probability < 70)).length
        return { safe, realistic, reach, total: results.length }
    }, [results])

    return (
        <div className="mx-auto max-w-7xl animate-fade-in space-y-6">
            {/* ── HEADER ── */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 p-8 text-white shadow-xl lg:p-12">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>

                <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-indigo-100 backdrop-blur-md">
                            <Map size={16} /> Rank vs Reality Engine
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-yellow-200">True Worth</span>
                        </h1>
                        <p className="text-lg text-indigo-100/80 max-w-xl">
                            Stop guessing. Enter your exact rank to see a data-backed spectrum of colleges you can genuinely get into, based on historical JoSAA & CSAB opening/closing trends.
                        </p>
                    </div>

                    {/* Input Form */}
                    <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-xl border border-white/20 shadow-2xl">
                        <form onSubmit={handleCalculate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Exam</label>
                                    <select
                                        value={examType}
                                        onChange={e => setExamType(e.target.value)}
                                        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 [&>option]:text-slate-900"
                                    >
                                        <option value="JEE Main">JEE Main</option>
                                        <option value="JEE Advanced">JEE Advanced</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Category</label>
                                    <select
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 [&>option]:text-slate-900"
                                    >
                                        <option value="OPEN">OPEN</option>
                                        <option value="OBC-NCL">OBC-NCL</option>
                                        <option value="EWS">EWS</option>
                                        <option value="SC">SC</option>
                                        <option value="ST">ST</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Your Rank (CRL or Category)</label>
                                <div className="relative">
                                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                                    <input
                                        type="number"
                                        placeholder="e.g. 14500"
                                        value={rank}
                                        onChange={e => setRank(e.target.value)}
                                        className="w-full rounded-xl border border-white/20 bg-white/5 pl-12 pr-4 py-3 text-lg font-bold text-white placeholder:text-white/30 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400"
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-3.5 font-bold text-slate-900 shadow-xl transition hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center gap-2"
                            >
                                <Search size={18} /> Reveal My Reality
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* ── RESULTS ── */}
            <AnimatePresence mode="wait">
                {hasCalculated && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Summary Badges */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
                                <p className="text-sm font-medium text-slate-500">Total Matches</p>
                                <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.total}</p>
                            </div>
                            <div className="rounded-2xl bg-emerald-50 p-5 border border-emerald-100 shadow-sm relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 text-emerald-500/10"><CheckCircle2 size={100} /></div>
                                <p className="text-sm font-medium text-emerald-700 relative z-10">Safe Options</p>
                                <p className="text-3xl font-extrabold text-emerald-800 mt-1 relative z-10">{stats.safe}</p>
                            </div>
                            <div className="rounded-2xl bg-blue-50 p-5 border border-blue-100 shadow-sm relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 text-blue-500/10"><CheckCircle2 size={100} /></div>
                                <p className="text-sm font-medium text-blue-700 relative z-10">Realistic</p>
                                <p className="text-3xl font-extrabold text-blue-800 mt-1 relative z-10">{stats.realistic}</p>
                            </div>
                            <div className="rounded-2xl bg-orange-50 p-5 border border-orange-100 shadow-sm relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 text-orange-500/10"><AlertCircle size={100} /></div>
                                <p className="text-sm font-medium text-orange-700 relative z-10">Reach / Dream</p>
                                <p className="text-3xl font-extrabold text-orange-800 mt-1 relative z-10">{stats.reach}</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium pr-2 border-r border-slate-200 shrink-0">
                                <Filter size={16} /> Filters
                            </div>
                            {["All", "IIT", "NIT", "IIIT", "GFTI", "Private"].map(tier => (
                                <button
                                    key={tier}
                                    onClick={() => setSelectedTier(tier)}
                                    className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${selectedTier === tier
                                        ? "bg-slate-900 text-white"
                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    {tier}
                                </button>
                            ))}
                        </div>

                        {/* Cards List */}
                        <div className="grid gap-5">
                            {filteredResults.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                                    <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No colleges found in this tier</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto">Try selecting a different tier or verify if your rank qualifies for these institutions.</p>
                                </div>
                            ) : (
                                filteredResults.map((college, idx) => (
                                    <CollegeRowCard key={idx} college={college} userRank={parseInt(rank)} />
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function CollegeRowCard({ college, userRank }) {
    // Show top 2 matched branches
    const displayBranches = college.matchedBranches.slice(0, 2);
    const hasMore = college.matchedBranches.length > 2;
    const maxProb = Math.max(...college.matchedBranches.map(b => b.probability));

    const getStatusColor = (prob) => {
        if (prob >= 90) return "text-emerald-700 bg-emerald-50 border-emerald-200"
        if (prob >= 70) return "text-blue-700 bg-blue-50 border-blue-200"
        if (prob >= 30) return "text-orange-700 bg-orange-50 border-orange-200"
        return "text-red-700 bg-red-50 border-red-200"
    }

    const mainStatus = getStatusColor(maxProb)

    return (
        <div className="group rounded-2xl bg-white p-1 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className={`p-4 md:p-6 rounded-xl relative`}>
                <div className="flex flex-col md:flex-row md:items-start gap-6">

                    {/* Left: Identity */}
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                                {college.tier}
                            </span>
                            <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
                                <MapPin size={14} /> {college.location.city}, {college.location.state}
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {college.target}
                        </h2>
                        <div className="flex gap-4 text-sm font-medium text-slate-700 mt-2">
                            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <TrendingUp size={16} className="text-emerald-500" />
                                <span>Median: {college.placement.median} LPA</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 hidden sm:flex">
                                <Banknote size={16} className="text-blue-500" />
                                <span>Fees: ₹{(college.fees / 100000).toFixed(1)}L total</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Branches */}
                    <div className="w-full md:w-[450px] shrink-0 space-y-2.5">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Predicted Branches</h4>
                        <div className="space-y-2 relative">
                            {/* Connector line */}
                            <div className="absolute left-[9px] top-3 bottom-3 w-px bg-slate-200" />

                            {displayBranches.map((branch, i) => (
                                <div key={i} className="relative flex items-center justify-between pl-6 py-1 group/branch">
                                    <div className="absolute left-[5px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full bg-slate-200 border-2 border-white group-hover/branch:bg-indigo-400 transition-colors" />

                                    <div className="flex-1 min-w-0 pr-4">
                                        <p className="text-sm font-semibold text-slate-900 truncate" title={branch.name}>
                                            {branch.name}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                                            <span>Opening: <strong className="text-slate-700">{branch.or}</strong></span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span>Closing: <strong className="text-slate-700">{branch.cr}</strong></span>
                                        </p>
                                    </div>
                                    <div className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${getStatusColor(branch.probability)}`}>
                                        {branch.probability}% {branch.label}
                                    </div>
                                </div>
                            ))}
                            {hasMore && (
                                <div className="pl-6 pt-1">
                                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded cursor-pointer hover:bg-indigo-100 transition">
                                        + {college.matchedBranches.length - 2} more branches
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Arrow */}
                    <div className="hidden lg:flex items-center justify-center shrink-0 w-12 h-12 rounded-full border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all text-slate-400 self-center">
                        <ChevronRight size={20} />
                    </div>

                </div>
            </div>
        </div>
    )
}
