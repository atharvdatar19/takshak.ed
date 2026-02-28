import { motion } from "framer-motion"
import {
    BarChart3,
    ChevronDown,
    GraduationCap,
    Search,
    Sparkles,
    Target,
    TrendingUp,
} from "lucide-react"
import { useMemo, useState } from "react"
import { getCutoffData, predictChances } from "../services/student"

const STREAMS = ["PCM", "PCB", "Commerce", "Arts", "Defence"]
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"]

// Demo cutoff data for when Supabase tables don't exist yet
const DEMO_CUTOFFS = [
    { id: 1, colleges: { name: "IIT Bombay", city: "Mumbai", state: "Maharashtra", type: "government" }, stream: "PCM", category: "General", opening_rank: 1, closing_rank: 1200 },
    { id: 2, colleges: { name: "IIT Delhi", city: "New Delhi", state: "Delhi", type: "government" }, stream: "PCM", category: "General", opening_rank: 50, closing_rank: 1800 },
    { id: 3, colleges: { name: "IIT Madras", city: "Chennai", state: "Tamil Nadu", type: "government" }, stream: "PCM", category: "General", opening_rank: 100, closing_rank: 2200 },
    { id: 4, colleges: { name: "IIT Kanpur", city: "Kanpur", state: "Uttar Pradesh", type: "government" }, stream: "PCM", category: "General", opening_rank: 200, closing_rank: 3500 },
    { id: 5, colleges: { name: "IIT Kharagpur", city: "Kharagpur", state: "West Bengal", type: "government" }, stream: "PCM", category: "General", opening_rank: 300, closing_rank: 4500 },
    { id: 6, colleges: { name: "NIT Trichy", city: "Tiruchirappalli", state: "Tamil Nadu", type: "government" }, stream: "PCM", category: "General", opening_rank: 2000, closing_rank: 12000 },
    { id: 7, colleges: { name: "NIT Warangal", city: "Warangal", state: "Telangana", type: "government" }, stream: "PCM", category: "General", opening_rank: 3000, closing_rank: 15000 },
    { id: 8, colleges: { name: "BITS Pilani", city: "Pilani", state: "Rajasthan", type: "private" }, stream: "PCM", category: "General", opening_rank: 1000, closing_rank: 8000 },
    { id: 9, colleges: { name: "VIT Vellore", city: "Vellore", state: "Tamil Nadu", type: "private" }, stream: "PCM", category: "General", opening_rank: 5000, closing_rank: 50000 },
    { id: 10, colleges: { name: "AIIMS Delhi", city: "New Delhi", state: "Delhi", type: "government" }, stream: "PCB", category: "General", opening_rank: 1, closing_rank: 100 },
    { id: 11, colleges: { name: "JIPMER Puducherry", city: "Puducherry", state: "Puducherry", type: "government" }, stream: "PCB", category: "General", opening_rank: 50, closing_rank: 500 },
    { id: 12, colleges: { name: "Maulana Azad Medical", city: "New Delhi", state: "Delhi", type: "government" }, stream: "PCB", category: "General", opening_rank: 100, closing_rank: 3000 },
]

export default function CutoffPredictor() {
    const [rank, setRank] = useState("")
    const [stream, setStream] = useState("PCM")
    const [category, setCategory] = useState("General")
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)

    async function handlePredict() {
        if (!rank) return
        setLoading(true)
        try {
            let cutoffs = await getCutoffData({ stream, category })
            // Fallback to demo data if no Supabase data
            if (!cutoffs.length) {
                cutoffs = DEMO_CUTOFFS.filter(
                    c => c.stream === stream && c.category === category,
                )
            }
            const predictions = predictChances(Number(rank), cutoffs)
            setResults(predictions)
        } catch {
            // Use demo data on error
            const cutoffs = DEMO_CUTOFFS.filter(
                c => c.stream === stream && c.category === category,
            )
            setResults(predictChances(Number(rank), cutoffs))
        } finally {
            setLoading(false)
        }
    }

    const grouped = useMemo(() => {
        if (!results) return null
        return {
            high: results.filter(r => r.chance === "High"),
            medium: results.filter(r => r.chance === "Medium"),
            low: results.filter(r => r.chance === "Low"),
        }
    }, [results])

    return (
        <div className="space-y-6">
            {/* Hero */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="hero-gradient rounded-3xl p-8 text-center text-white shadow-xl md:p-12"
            >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 shadow-lg">
                    <Target size={40} />
                </div>
                <h1 className="text-4xl font-extrabold md:text-5xl">Cutoff Predictor</h1>
                <p className="mt-3 text-lg text-white/80">Check your chances at top colleges based on your rank</p>
            </motion.section>

            {/* Input Card */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="scroll-3d-card rounded-3xl border border-slate-200/60 bg-white p-6 shadow-card"
            >
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <BarChart3 size={20} className="text-indigo-600" /> Enter Your Details
                </h2>
                <div className="grid gap-4 md:grid-cols-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Your Rank</label>
                        <input
                            type="number"
                            value={rank}
                            onChange={e => setRank(e.target.value)}
                            placeholder="e.g. 5000"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Stream</label>
                        <select
                            value={stream}
                            onChange={e => setStream(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                        >
                            {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Category</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                        >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            type="button"
                            onClick={handlePredict}
                            disabled={!rank || loading}
                            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
                        >
                            {loading ? "Analyzing..." : "🎯 Predict Chances"}
                        </button>
                    </div>
                </div>
            </motion.section>

            {/* Results */}
            {grouped && (
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                >
                    {grouped.high.length > 0 && (
                        <ChanceGroup title="High Chance" emoji="🟢" color="emerald" items={grouped.high} />
                    )}
                    {grouped.medium.length > 0 && (
                        <ChanceGroup title="Medium Chance" emoji="🟡" color="amber" items={grouped.medium} />
                    )}
                    {grouped.low.length > 0 && (
                        <ChanceGroup title="Low Chance" emoji="🔴" color="rose" items={grouped.low} />
                    )}
                    {grouped.high.length === 0 && grouped.medium.length === 0 && grouped.low.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                            No cutoff data found for this combination. Try a different stream or category.
                        </div>
                    )}
                </motion.section>
            )}
        </div>
    )
}

function ChanceGroup({ title, emoji, color, items }) {
    const colorMap = {
        emerald: "border-emerald-200 bg-emerald-50",
        amber: "border-amber-200 bg-amber-50",
        rose: "border-rose-200 bg-rose-50",
    }
    const badgeMap = {
        emerald: "bg-emerald-100 text-emerald-700",
        amber: "bg-amber-100 text-amber-700",
        rose: "bg-rose-100 text-rose-700",
    }

    return (
        <div>
            <h3 className="mb-3 text-lg font-bold text-slate-900">{emoji} {title} — {items.length} colleges</h3>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {items.map(item => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`scroll-3d-card rounded-2xl border ${colorMap[color]} p-4 transition hover:-translate-y-1`}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="font-semibold text-slate-900">{item.colleges?.name || "Unknown"}</p>
                                <p className="text-xs text-slate-500">{item.colleges?.city}, {item.colleges?.state}</p>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${badgeMap[color]}`}>
                                {item.chance}
                            </span>
                        </div>
                        <div className="mt-3 flex gap-4 text-xs text-slate-600">
                            <span>Open: {item.opening_rank?.toLocaleString()}</span>
                            <span>Close: {item.closing_rank?.toLocaleString()}</span>
                            <span className="font-medium">{item.colleges?.type}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
