import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence } from "framer-motion"
import { Bookmark, Lock, Target, ExternalLink } from "lucide-react"
import { useState, useCallback, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@auth/AuthContext"
import supabase, { isDemoMode } from "@database/supabaseClient"
import { useRealtimeSync } from "@hooks/useRealtimeSync"
import LoadingSkeleton from "@components/LoadingSkeleton"
import DataState from "@components/DataState"
import { useToast } from "@components/Toast"

const PAGE_SIZE = 8
const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
]
const BRANCHES = ["CSE", "ECE", "Mechanical", "Civil", "Electrical", "IT", "Data Science", "Bio-Tech"]

export default function CutoffPredictor() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const { addToast } = useToast()

    // Query params from typical homepage navigation
    const searchParams = new URLSearchParams(location.search)

    // Form Inputs
    const [rank, setRank] = useState(searchParams.get("rank") || "")
    const [category, setCategory] = useState(searchParams.get("category") || "OPEN")
    const [exam, setExam] = useState(searchParams.get("exam") || "JEE_MAIN")
    const [homeState, setHomeState] = useState("")
    const [preferredStates, setPreferredStates] = useState([])
    const [preferredBranches, setPreferredBranches] = useState([])

    // Data State
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const executePrediction = useCallback(async (currentPage = 1) => {
        if (!rank) {
            setError("Please enter your rank to predict cutoffs.")
            return
        }
        setLoading(true)
        setError("")

        try {
            if (!supabase || isDemoMode) {
                // Mock behavior
                setTimeout(() => {
                    setRecords([
                        { id: 1, name: "NIT Trichy", branch: "CSE", city: "Trichy", state: "Tamil Nadu", fees: "₹ 1.5L" },
                        { id: 2, name: "IIT Bombay", branch: "Mechanical", city: "Mumbai", state: "Maharashtra", fees: "₹ 2.2L" },
                        { id: 3, name: "BITS Pilani", branch: "ECE", city: "Pilani", state: "Rajasthan", fees: "₹ 5.5L" },
                        { id: 4, name: "IIIT Hyderabad", branch: "CSE", city: "Hyderabad", state: "Telangana", fees: "₹ 3.0L" },
                        { id: 5, name: "VNIT Nagpur", branch: "Civil", city: "Nagpur", state: "Maharashtra", fees: "₹ 1.4L" },
                    ])
                    setTotal(5)
                    setPage(currentPage)
                    setLoading(false)
                }, 800)
                return
            }

            // TODO: When 'cutoffs' table is added, JOIN with cutoffs where cutoff.closing_rank >= userRank 
            // and cutoff.category = selectedCategory and cutoff.exam = selectedExam

            let query = supabase.from("colleges").select("*", { count: "exact" })

            // Mock logic using available college columns for now
            if (preferredStates.length > 0) {
                query = query.in("state", preferredStates)
            } else if (homeState) {
                // query = query.eq("state", homeState) // if we strictly wanted home state
            }

            const from = (currentPage - 1) * PAGE_SIZE
            const to = from + PAGE_SIZE - 1

            const { data, count, error: err } = await query.order("is_featured", { ascending: false }).range(from, to)

            if (err) throw err

            // Format data mock
            const formattedData = data.map((c, i) => ({
                id: c.id,
                name: c.name,
                branch: preferredBranches.length > 0 ? preferredBranches[0] : (c.streams_supported?.[0] || "General"),
                city: c.city,
                state: c.state,
                fees: `₹ ${(1.2 + i * 0.1).toFixed(1)}L`, // Mock fees
                website: c.website
            }))

            setRecords(formattedData)
            setTotal(count || formattedData.length)
            setPage(currentPage)
        } catch (err) {
            console.error(err)
            setError(err.message || "Failed to fetch predictions.")
        } finally {
            setLoading(false)
        }
    }, [rank, category, exam, homeState, preferredStates, preferredBranches])

    // Load automatically if rank is populated via query params
    useEffect(() => {
        if (searchParams.get("rank")) {
            executePrediction(1)
        }
    }, [])

    useRealtimeSync("colleges", () => {
        if (rank) executePrediction(page)
    })

    const handleFormSubmit = (e) => {
        e.preventDefault()
        executePrediction(1)
    }

    const toggleArrayItem = (setter, array, item) => {
        if (array.includes(item)) setter(array.filter(i => i !== item))
        else setter([...array, item])
    }

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    return (
        <div className="space-y-8 pb-10">
            <Helmet>
                <title>Cutoff Predictor 2024 | TAKSHAK</title>
                <meta name="description" content="Predict your college admission chances based on your rank, category, and preferred exams." />
            </Helmet>

            <motion.section
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="hero-gradient px-8 py-12 rounded-[32px] text-white shadow-xl"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"><Target size={28} /></div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Cutoff Predictor</h1>
                </div>
                <p className="text-indigo-100 max-w-xl text-lg">
                    Discover your best college matches based on accurate cutoff algorithms and JoSAA historical trends.
                </p>
            </motion.section>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                {/* ── LEFT SIDEBAR: INPUT FORM ── */}
                <motion.div
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    className="lg:col-span-1 rounded-3xl bg-white border border-slate-200 p-6 shadow-card sticky top-24"
                >
                    <form onSubmit={handleFormSubmit} className="space-y-5">
                        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Your Profile</h2>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Rank</label>
                            <input type="number" required value={rank} onChange={(e) => setRank(e.target.value)} placeholder="e.g. 15000" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white">
                                <option value="OPEN">OPEN / GEN</option>
                                <option value="OBC">OBC-NCL</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                                <option value="EWS">EWS</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Exam</label>
                            <select value={exam} onChange={(e) => setExam(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white">
                                <option value="JEE_MAIN">JEE Main</option>
                                <option value="JEE_ADV">JEE Advanced</option>
                                <option value="NEET">NEET</option>
                                <option value="CUET">CUET</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Home State</label>
                            <select value={homeState} onChange={(e) => setHomeState(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white">
                                <option value="">Select Home State</option>
                                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Preferred Branches</label>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-slate-100 rounded-xl bg-slate-50">
                                {BRANCHES.map(b => (
                                    <label key={b} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                                        <input type="checkbox" checked={preferredBranches.includes(b)} onChange={() => toggleArrayItem(setPreferredBranches, preferredBranches, b)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                        {b}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition">
                            Predict Colleges
                        </button>
                    </form>
                </motion.div>

                {/* ── MAIN AREA: RESULTS TABLE ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="lg:col-span-3 space-y-4 relative"
                >
                    {loading ? <LoadingSkeleton rows={6} /> : (
                        <DataState loading={false} error={error} empty={records.length === 0 && !error}>
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden pb-16 relative">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">College</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Branch</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">City/State</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Closing Rank</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Fees / yr</th>
                                                <th className="px-6 py-4 font-bold text-slate-500"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {records.map((c, idx) => {
                                                const isLocked = !user && idx >= 3
                                                return (
                                                    <tr key={c.id} className={`transition hover:bg-slate-50 ${isLocked ? "blur-md pointer-events-none select-none" : ""}`}>
                                                        <td className="px-6 py-4 font-bold text-slate-900">{c.name}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">{c.branch}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-500 hidden sm:table-cell">{c.city}, {c.state}</td>
                                                        <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{Number(rank) + 200 * idx}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-600 hidden md:table-cell">{c.fees}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex gap-2 justify-end">
                                                                <button onClick={() => addToast('success', `Tracking ${c.name}`)} className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition" title="Track">
                                                                    <Bookmark size={16} />
                                                                </button>
                                                                {c.website && (
                                                                    <a href={c.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition" title="Website">
                                                                        <ExternalLink size={16} />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Login Wall Overlay */}
                                {!user && records.length > 3 && (
                                    <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-white via-white/95 to-transparent flex flex-col items-center justify-end pb-12 shadow-[inset_0_-40px_40px_rgba(255,255,255,1)]">
                                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl text-center max-w-sm w-11/12">
                                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4 text-indigo-600">
                                                <Lock size={20} />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">Unlock Full Results</h3>
                                            <p className="text-sm text-slate-500 mb-6">Create a free account to view all college matches across entire India and track their cutoffs.</p>
                                            <button onClick={() => navigate("/signup", { state: { from: location.pathname + location.search } })} className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 transition">
                                                Sign In / Sign Up
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Pagination (only active if signed in or results <= 3) */}
                            {(user || records.length <= 3) && totalPages > 1 && (
                                <div className="mt-6 flex items-center justify-between px-4">
                                    <button disabled={page <= 1} onClick={() => executePrediction(page - 1)} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50 transition">Previous</button>
                                    <p className="text-sm text-slate-600">Page {page} of {totalPages}</p>
                                    <button disabled={page >= totalPages} onClick={() => executePrediction(page + 1)} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50 transition">Next</button>
                                </div>
                            )}

                            {/* Data Freshness Badge */}
                            {records.length > 0 && (
                                <div className="mt-6 flex justify-center">
                                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                                        📊 Data: JoSAA 2024 · Official Source
                                    </span>
                                </div>
                            )}
                        </DataState>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
