import { motion } from "framer-motion"
import { BarChart3, Target } from "lucide-react"
import { useMemo, useState } from "react"

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const DEMO_CUTOFFS = [
    { id: 1, college: "IIT Bombay", stream: "PCM", category: "General", closing_rank: 800, type: "government" },
    { id: 2, college: "IIT Delhi", stream: "PCM", category: "General", closing_rank: 1200, type: "government" },
    { id: 3, college: "IIT Madras", stream: "PCM", category: "General", closing_rank: 1500, type: "government" },
    { id: 4, college: "IIT Kanpur", stream: "PCM", category: "General", closing_rank: 2000, type: "government" },
    { id: 5, college: "AIIMS Delhi", stream: "PCB", category: "General", closing_rank: 50, type: "government" },
    { id: 6, college: "AIIMS Jodhpur", stream: "PCB", category: "General", closing_rank: 200, type: "government" },
    { id: 7, college: "NIT Trichy", stream: "PCM", category: "General", closing_rank: 5000, type: "government" },
    { id: 8, college: "NIT Warangal", stream: "PCM", category: "General", closing_rank: 6000, type: "government" },
    { id: 9, college: "NIT Surathkal", stream: "PCM", category: "General", closing_rank: 7000, type: "government" },
    { id: 10, college: "BITS Pilani", stream: "PCM", category: "General", closing_rank: 3500, type: "private" },
    { id: 11, college: "VIT Vellore", stream: "PCM", category: "General", closing_rank: 15000, type: "private" },
    { id: 12, college: "SRM Chennai", stream: "PCM", category: "General", closing_rank: 20000, type: "private" },
    { id: 13, college: "JIPMER", stream: "PCB", category: "General", closing_rank: 150, type: "government" },
    { id: 14, college: "IIT Bombay", stream: "PCM", category: "OBC", closing_rank: 2500, type: "government" },
    { id: 15, college: "IIT Delhi", stream: "PCM", category: "OBC", closing_rank: 3500, type: "government" },
    { id: 16, college: "NIT Trichy", stream: "PCM", category: "OBC", closing_rank: 12000, type: "government" },
]

function chanceLevel(rank, closing) {
    if (rank <= closing * 0.8) return "high"
    if (rank <= closing * 1.1) return "medium"
    return "low"
}

const CHANCE_CONFIG = {
    high: { label: "High Chance", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
    medium: { label: "Medium Chance", bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
    low: { label: "Low Chance", bg: "bg-rose-50 border-rose-200", text: "text-rose-600", dot: "bg-rose-500" },
}

export default function CutoffPredictor() {
    const [rank, setRank] = useState("")
    const [stream, setStream] = useState("PCM")
    const [category, setCategory] = useState("General")
    const [showResults, setShowResults] = useState(false)

    const results = useMemo(() => {
        if (!rank) return { high: [], medium: [], low: [] }
        const r = parseInt(rank, 10)
        if (isNaN(r)) return { high: [], medium: [], low: [] }
        const matched = DEMO_CUTOFFS.filter(c => c.stream === stream && c.category === category)
        const grouped = { high: [], medium: [], low: [] }
        matched.forEach(c => { grouped[chanceLevel(r, c.closing_rank)].push(c) })
        return grouped
    }, [rank, stream, category])

    const totalResults = results.high.length + results.medium.length + results.low.length

    return (
        <div className="space-y-8 md:space-y-12">
            {/* ═══ HERO ═══ */}
            <motion.section {...fadeUp(0)} className="relative overflow-hidden rounded-[32px] hero-gradient px-8 py-10 text-white md:px-12 md:py-16">
                <div className="orb orb-blue w-48 h-48 -top-16 -right-16" />
                <div className="orb orb-purple w-32 h-32 bottom-0 left-10" />
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Target size={32} />
                    </div>
                    <h1 className="text-display text-3xl md:text-5xl">Cutoff Predictor</h1>
                    <p className="mt-3 text-indigo-100/80 text-sm md:text-base">Check your chances at top colleges based on your rank</p>
                </div>
            </motion.section>

            {/* ═══ INPUT FORM ═══ */}
            <motion.section {...fadeUp(0.1)} className="card-bb p-6 md:p-8 max-w-2xl mx-auto">
                <h2 className="text-section text-lg md:text-xl text-slate-900 mb-5 flex items-center gap-2">
                    <BarChart3 size={20} className="text-indigo-600" /> Enter Your Details
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Your Rank</label>
                        <input type="number" value={rank} onChange={e => setRank(e.target.value)} placeholder="e.g. 5000" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Stream</label>
                            <select value={stream} onChange={e => setStream(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm">
                                <option value="PCM">PCM (Engineering)</option>
                                <option value="PCB">PCB (Medical)</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm">
                                <option value="General">General</option>
                                <option value="OBC">OBC</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                                <option value="EWS">EWS</option>
                            </select>
                        </div>
                    </div>
                    <button type="button" onClick={() => rank && setShowResults(true)} disabled={!rank} className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2">
                        <Target size={18} /> Predict Chances
                    </button>
                </div>
            </motion.section>

            {/* ═══ RESULTS ═══ */}
            {showResults && (
                <section className="space-y-6">
                    <motion.div {...fadeUp(0)} className="text-center">
                        <h2 className="text-section text-xl md:text-3xl text-slate-900">
                            Results for Rank <span className="text-indigo-600">#{rank}</span>
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">{totalResults} colleges found · {stream} · {category}</p>
                    </motion.div>

                    {["high", "medium", "low"].map(level => {
                        const items = results[level]
                        const config = CHANCE_CONFIG[level]
                        if (items.length === 0) return null
                        return (
                            <motion.div key={level} {...fadeUp(0.1)}>
                                <h3 className="text-card-title text-base text-slate-900 mb-3 flex items-center gap-2">
                                    <span className={`h-3 w-3 rounded-full ${config.dot}`} />
                                    {config.label} ({items.length})
                                </h3>
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {items.map((college, ci) => (
                                        <motion.div key={college.id} {...fadeUp(0.15 + ci * 0.05)} className={`card-bb ${config.bg} p-5`}>
                                            <h4 className="text-card-title text-sm text-slate-900">{college.college}</h4>
                                            <p className="mt-1 text-xs text-slate-500">Closing: <strong>#{college.closing_rank.toLocaleString()}</strong></p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="pill pill-outline text-[10px] py-0.5 px-2">{college.type}</span>
                                                <span className={`text-xs font-bold ${config.text}`}>{config.label}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )
                    })}
                </section>
            )}
        </div>
    )
}
