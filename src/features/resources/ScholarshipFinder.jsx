import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence } from "framer-motion"
import {
    Award,
    Calendar,
    DollarSign,
    ExternalLink,
    Search,
} from "lucide-react"
import { useMemo, useState } from "react"

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const DEMO_SCHOLARSHIPS = [
    { id: 1, name: "National Merit Scholarship", amount: "₹50,000/year", deadline: "2026-05-15", streams: ["PCM", "PCB", "Commerce", "Arts"], categories: ["General", "OBC", "SC", "ST"], income_limit: 800000, state: "All India", eligibility: "12th pass with 80%+", apply_link: "https://scholarships.gov.in" },
    { id: 2, name: "Post Matric SC/ST Scholarship", amount: "Full tuition + ₹10K/mo", deadline: "2026-04-30", streams: ["PCM", "PCB", "Commerce", "Arts"], categories: ["SC", "ST"], income_limit: 250000, state: "All India", eligibility: "SC/ST category, income below 2.5L", apply_link: "https://scholarships.gov.in" },
    { id: 3, name: "INSPIRE Scholarship", amount: "₹80,000/year", deadline: "2026-06-30", streams: ["PCM", "PCB"], categories: ["General", "OBC", "SC", "ST", "EWS"], income_limit: null, state: "All India", eligibility: "Top 1% in 12th board OR JEE/NEET qualified", apply_link: "https://online-inspire.gov.in" },
    { id: 4, name: "Central Sector Scheme (CSSS)", amount: "₹12K-20K/year", deadline: "2026-05-31", streams: ["PCM", "PCB", "Commerce", "Arts"], categories: ["General", "OBC", "SC", "ST", "EWS"], income_limit: 600000, state: "All India", eligibility: "Top 20% in 12th board, family income < 6L", apply_link: "https://scholarships.gov.in" },
    { id: 5, name: "Pragati Scholarship (Girls)", amount: "₹50,000/year + tuition", deadline: "2026-04-15", streams: ["PCM"], categories: ["General", "OBC", "SC", "ST"], income_limit: 800000, state: "All India", eligibility: "Female students in AICTE approved institutions", apply_link: "https://www.aicte-india.org" },
    { id: 6, name: "Kishore Vaigyanik Protsahan Yojana", amount: "₹5K-7K/month", deadline: "2026-08-31", streams: ["PCM", "PCB"], categories: ["General", "OBC", "SC", "ST", "EWS"], income_limit: null, state: "All India", eligibility: "Science stream, must clear KVPY exam", apply_link: "https://kvpy.iisc.ac.in" },
    { id: 7, name: "Maulana Azad National Fellowship", amount: "₹31,000/month", deadline: "2026-07-15", streams: ["PCM", "PCB", "Commerce", "Arts"], categories: ["OBC"], income_limit: 600000, state: "All India", eligibility: "Minority community students", apply_link: "https://scholarships.gov.in" },
    { id: 8, name: "Vidyasiri Scholarship (Karnataka)", amount: "₹15K-25K/year", deadline: "2026-04-30", streams: ["PCM", "PCB", "Commerce", "Arts"], categories: ["General", "OBC", "SC", "ST"], income_limit: 250000, state: "Karnataka", eligibility: "Karnataka domicile, backward classes", apply_link: "https://sw.kar.nic.in" },
]

const STREAMS = ["PCM", "PCB", "Commerce", "Arts"]
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"]

export default function ScholarshipFinder() {
    const [search, setSearch] = useState("")
    const [stream, setStream] = useState("")
    const [category, setCategory] = useState("")

    const filtered = useMemo(() => {
        return DEMO_SCHOLARSHIPS.filter(s => {
            if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
            if (stream && !s.streams.includes(stream)) return false
            if (category && !s.categories.includes(category)) return false
            return true
        })
    }, [search, stream, category])

    return (
        <div className="space-y-8 md:space-y-12">
            {/* ── SEO Meta ── */}
            <Helmet>
                <title>Scholarship Finder 2024 | TAKक्षक</title>
                <meta name="description" content="Find the latest scholarships for Indian students across PCM, PCB, Commerce, and Arts. Filter by category, state, and income limit to discover money for your education." />
            </Helmet>

            {/* ═══ HERO ═══ */}
            <motion.section {...fadeUp(0)} className="relative overflow-hidden rounded-[32px] card-gradient-orange px-8 py-10 text-white md:px-12 md:py-16">
                <div className="orb orb-purple w-40 h-40 -top-10 right-10" />
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Award size={32} />
                    </div>
                    <h1 className="text-display text-3xl md:text-5xl">Scholarship Finder</h1>
                    <p className="mt-3 text-white/80 text-sm md:text-base">Discover scholarships you're eligible for — don't leave money on the table</p>
                </div>
            </motion.section>

            {/* ═══ FILTERS ═══ */}
            <motion.section {...fadeUp(0.1)} className="card-bb p-5 md:p-7">
                <div className="grid gap-3 md:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <Search size={16} className="text-slate-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search scholarships..." className="flex-1 bg-transparent text-sm outline-none" />
                    </div>
                    <select value={stream} onChange={e => setStream(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                        <option value="">All Streams</option>
                        {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                        <option value="">All Categories</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </motion.section>

            {/* ═══ RESULTS ═══ */}
            <section>
                <motion.p {...fadeUp(0.15)} className="mb-5 text-sm text-slate-500">Showing <strong className="text-slate-900">{filtered.length}</strong> scholarships</motion.p>
                <div className="grid gap-4 md:grid-cols-2">
                    {filtered.map((s, i) => {
                        const isExpired = new Date(s.deadline) < new Date()
                        return (
                            <motion.div key={s.id} {...fadeUp(0.2 + i * 0.05)} className="card-bb overflow-hidden">
                                <div className="p-5 md:p-7 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-card-title text-base text-slate-900">{s.name}</h3>
                                        <span className="shrink-0 pill pill-primary text-xs py-1">{s.amount}</span>
                                    </div>
                                    <p className="text-sm text-slate-600">{s.eligibility}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {s.streams.map(st => <span key={st} className="pill pill-outline text-[10px] py-0.5 px-2.5">{st}</span>)}
                                        {s.categories.filter(c => c !== "General").map(c => <span key={c} className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-700">{c}</span>)}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {s.deadline}</span>
                                        <span>{s.state}</span>
                                    </div>
                                    {s.income_limit && <p className="text-xs text-slate-500"><DollarSign size={11} className="inline mr-0.5" /> Income limit: ₹{s.income_limit.toLocaleString()}</p>}
                                    <a href={s.apply_link} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${isExpired ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"}`}>
                                        <ExternalLink size={14} /> {isExpired ? "Deadline Passed" : "Apply Now"}
                                    </a>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}
