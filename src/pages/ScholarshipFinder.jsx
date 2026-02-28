import { motion } from "framer-motion"
import {
    Award,
    Calendar,
    DollarSign,
    ExternalLink,
    Filter,
    GraduationCap,
    Search,
    Sparkles,
} from "lucide-react"
import { useMemo, useState } from "react"

const DEMO_SCHOLARSHIPS = [
    { id: 1, name: "National Merit Scholarship", amount: "₹50,000/year", deadline: "2026-05-15", streams: ["PCM", "PCB", "Commerce", "Arts"], categories: ["General", "OBC", "SC", "ST"], income_limit: 800000, state: "All India", eligibility: "12th pass with 80%+", apply_link: "https://scholarships.gov.in" },
    { id: 2, name: "Post Matric SC/ST Scholarship", amount: "Full tuition + ₹10,000/month", deadline: "2026-04-30", streams: ["PCM", "PCB", "Commerce", "Arts"], categories: ["SC", "ST"], income_limit: 250000, state: "All India", eligibility: "SC/ST category, income below 2.5L", apply_link: "https://scholarships.gov.in" },
    { id: 3, name: "INSPIRE Scholarship", amount: "₹80,000/year", deadline: "2026-06-30", streams: ["PCM", "PCB"], categories: ["General", "OBC", "SC", "ST", "EWS"], income_limit: null, state: "All India", eligibility: "Top 1% in 12th board OR JEE/NEET qualified", apply_link: "https://online-inspire.gov.in" },
    { id: 4, name: "Central Sector Scheme (CSSS)", amount: "₹12,000/year (UG) to ₹20,000/year", deadline: "2026-05-31", streams: ["PCM", "PCB", "Commerce", "Arts"], categories: ["General", "OBC", "SC", "ST", "EWS"], income_limit: 600000, state: "All India", eligibility: "Top 20% in 12th board, family income < 6L", apply_link: "https://scholarships.gov.in" },
    { id: 5, name: "Pragati Scholarship (Girls)", amount: "₹50,000/year + tuition", deadline: "2026-04-15", streams: ["PCM"], categories: ["General", "OBC", "SC", "ST"], income_limit: 800000, state: "All India", eligibility: "Female students in AICTE approved institutions", apply_link: "https://www.aicte-india.org" },
    { id: 6, name: "Kishore Vaigyanik Protsahan Yojana", amount: "₹5,000-7,000/month", deadline: "2026-08-31", streams: ["PCM", "PCB"], categories: ["General", "OBC", "SC", "ST", "EWS"], income_limit: null, state: "All India", eligibility: "Stream: Science, must clear KVPY exam", apply_link: "https://kvpy.iisc.ac.in" },
    { id: 7, name: "Maulana Azad National Fellowship", amount: "₹31,000/month", deadline: "2026-07-15", streams: ["PCM", "PCB", "Commerce", "Arts"], categories: ["OBC"], income_limit: 600000, state: "All India", eligibility: "Minority community students for higher studies", apply_link: "https://scholarships.gov.in" },
    { id: 8, name: "Vidyasiri Scholarship (Karnataka)", amount: "₹15,000-25,000/year", deadline: "2026-04-30", streams: ["PCM", "PCB", "Commerce", "Arts"], categories: ["General", "OBC", "SC", "ST"], income_limit: 250000, state: "Karnataka", eligibility: "Karnataka domicile, backward classes", apply_link: "https://sw.kar.nic.in" },
]

const STREAMS = ["", "PCM", "PCB", "Commerce", "Arts"]
const CATEGORIES = ["", "General", "OBC", "SC", "ST", "EWS"]

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
        <div className="space-y-6">
            {/* Hero */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-gradient-orange rounded-3xl p-8 text-center text-white shadow-xl md:p-12"
            >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 shadow-lg">
                    <Award size={40} />
                </div>
                <h1 className="text-4xl font-extrabold md:text-5xl">Scholarship Finder</h1>
                <p className="mt-3 text-lg text-white/80">Discover scholarships you're eligible for — don't leave money on the table</p>
            </motion.section>

            {/* Filters */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-card"
            >
                <div className="grid gap-3 md:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                        <Search size={16} className="text-slate-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search scholarships..."
                            className="flex-1 bg-transparent text-sm outline-none"
                        />
                    </div>
                    <select value={stream} onChange={e => setStream(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
                        <option value="">All Streams</option>
                        {STREAMS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
                        <option value="">All Categories</option>
                        {CATEGORIES.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </motion.section>

            {/* Results */}
            <p className="text-sm text-slate-500">Showing {filtered.length} scholarships</p>

            <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((s, i) => {
                    const isExpired = new Date(s.deadline) < new Date()
                    return (
                        <motion.article
                            key={s.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="scroll-3d-card overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
                        >
                            <div className="p-5 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
                                    <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                                        {s.amount}
                                    </span>
                                </div>

                                <p className="text-sm text-slate-600">{s.eligibility}</p>

                                <div className="flex flex-wrap gap-1.5">
                                    {s.streams.map(st => (
                                        <span key={st} className="rounded-full border border-indigo-200 px-2 py-0.5 text-[10px] font-medium text-indigo-600">{st}</span>
                                    ))}
                                    {s.categories.filter(c => c !== "General").map(c => (
                                        <span key={c} className="rounded-full border border-amber-200 px-2 py-0.5 text-[10px] font-medium text-amber-600">{c}</span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> Deadline: {s.deadline}</span>
                                    <span>{s.state}</span>
                                </div>

                                {s.income_limit && (
                                    <p className="text-xs text-slate-500">
                                        <DollarSign size={11} className="mr-0.5 inline" /> Income limit: ₹{s.income_limit.toLocaleString()}
                                    </p>
                                )}

                                <a
                                    href={s.apply_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-md transition ${isExpired
                                            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                            : "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:-translate-y-0.5"
                                        }`}
                                >
                                    <ExternalLink size={12} /> {isExpired ? "Deadline Passed" : "Apply Now"}
                                </a>
                            </div>
                        </motion.article>
                    )
                })}
            </div>

            {filtered.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                    No scholarships match your filters. Try broadening your search.
                </div>
            )}
        </div>
    )
}
