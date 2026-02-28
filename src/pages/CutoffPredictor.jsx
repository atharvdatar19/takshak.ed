import { motion } from "framer-motion"
import {
    BarChart3,
    ChevronRight,
    Sparkles,
    Target,
    TrendingUp,
} from "lucide-react"
import { useMemo, useState } from "react"
import { useAutoReveal } from "../hooks/useScrollReveal"

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
    high: { label: "High Chance", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
    medium: { label: "Medium Chance", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
    low: { label: "Low Chance", bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-600", dot: "bg-rose-500" },
}

export default function CutoffPredictor() {
    const [rank, setRank] = useState("")
    const [stream, setStream] = useState("PCM")
    const [category, setCategory] = useState("General")
    const [showResults, setShowResults] = useState(false)
    useAutoReveal()

    const results = useMemo(() => {
        if (!rank) return { high: [], medium: [], low: [] }
        const r = parseInt(rank, 10)
        if (isNaN(r)) return { high: [], medium: [], low: [] }

        const matched = DEMO_CUTOFFS.filter(c => c.stream === stream && c.category === category)
        const grouped = { high: [], medium: [], low: [] }
        matched.forEach(c => { grouped[chanceLevel(r, c.closing_rank)].push(c) })
        return grouped
    }, [rank, stream, category])

    function handlePredict() {
        if (!rank) return
        setShowResults(true)
    }

    const totalResults = results.high.length + results.medium.length + results.low.length

    return (
        <div className="space-y-10 md:space-y-16">
            {/* ═══ HERO ═══ */}
            <section className="relative overflow-hidden rounded-[32px] hero-gradient px-8 py-12 text-white md:px-14 md:py-20">
                <div className="orb orb-blue w-48 h-48 -top-16 -right-16" />
                <div className="orb orb-purple w-32 h-32 bottom-0 left-10" />
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm">
                        <Target size={40} />
                    </div>
                    <h1 className="text-display text-4xl md:text-6xl">Cutoff Predictor</h1>
                    <p className="text-body-lg mt-4 text-indigo-100/80 text-base">
                        Check your chances at top colleges based on your rank
                    </p>
                </div>
            </section>

            {/* ═══ INPUT FORM ═══ */}
            <section className="reveal card-bb p-6 md:p-10 max-w-2xl mx-auto">
                <h2 className="text-section text-xl md:text-2xl text-slate-900 mb-6 flex items-center gap-2">
                    <BarChart3 size={22} className="text-indigo-600" /> Enter Your Details
                </h2>
                <div className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Your Rank</label>
                        <input type="number" value={rank} onChange={e => setRank(e.target.value)} placeholder="e.g. 5000" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Stream</label>
                            <select value={stream} onChange={e => setStream(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm">
                                <option value="PCM">PCM (Engineering)</option>
                                <option value="PCB">PCB (Medical)</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm">
                                <option value="General">General</option>
                                <option value="OBC">OBC</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                                <option value="EWS">EWS</option>
                            </select>
                        </div>
                    </div>
                    <button type="button" onClick={handlePredict} disabled={!rank} className="pill pill-primary w-full justify-center py-4 text-base disabled:opacity-50">
                        <Target size={18} /> Predict Chances
                    </button>
                </div>
            </section>

            {/* ═══ RESULTS ═══ */}
            {showResults && (
                <section className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-section text-2xl md:text-4xl text-slate-900">
                            Results for Rank <span className="text-indigo-600">#{rank}</span>
                        </h2>
                        <p className="text-body-lg mt-2">{totalResults} colleges found · {stream} · {category}</p>
                    </div>

                    {["high", "medium", "low"].map(level => {
                        const items = results[level]
                        const config = CHANCE_CONFIG[level]
                        if (items.length === 0) return null
                        return (
                            <div key={level} className="reveal">
                                <h3 className="text-card-title text-lg text-slate-900 mb-4 flex items-center gap-2">
                                    <span className={`h-3 w-3 rounded-full ${config.dot}`} />
                                    {config.label} ({items.length})
                                </h3>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {items.map(college => (
                                        <div key={college.id} className={`card-bb ${config.border} ${config.bg} p-5 md:p-6`}>
                                            <h4 className="text-card-title text-base text-slate-900">{college.college}</h4>
                                            <p className="mt-1 text-sm text-slate-500">Closing rank: <strong>#{college.closing_rank.toLocaleString()}</strong></p>
                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="pill pill-outline text-[10px] py-0.5 px-2">{college.type}</span>
                                                <span className={`text-xs font-bold ${config.text}`}>{config.label}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </section>
            )}
        </div>
    )
}
