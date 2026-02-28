import { motion } from "framer-motion"
import {
    Award,
    Calendar,
    ChevronRight,
    DollarSign,
    ExternalLink,
    Search,
    Sparkles,
} from "lucide-react"
import { useMemo, useState } from "react"
import { useAutoReveal } from "../hooks/useScrollReveal"

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

const STREAMS = ["PCM", "PCB", "Commerce", "Arts"]
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"]

export default function ScholarshipFinder() {
    const [search, setSearch] = useState("")
    const [stream, setStream] = useState("")
    const [category, setCategory] = useState("")
    useAutoReveal()

    const filtered = useMemo(() => {
        return DEMO_SCHOLARSHIPS.filter(s => {
            if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
            if (stream && !s.streams.includes(stream)) return false
            if (category && !s.categories.includes(category)) return false
            return true
        })
    }, [search, stream, category])

    return (
        <div className="space-y-10 md:space-y-16">
            {/* ═══ HERO ═══ */}
            <section className="relative overflow-hidden rounded-[32px] card-gradient-orange px-8 py-12 text-white md:px-14 md:py-20">
                <div className="orb orb-purple w-40 h-40 -top-10 right-10" />
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm">
                        <Award size={40} />
                    </div>
                    <h1 className="text-display text-4xl md:text-6xl">Scholarship Finder</h1>
                    <p className="text-body-lg mt-4 text-white/80 text-base">
                        Discover scholarships you're eligible for — don't leave money on the table
                    </p>
                </div>
            </section>

            {/* ═══ FILTERS ═══ */}
            <section className="reveal card-bb p-6 md:p-8">
                <div className="grid gap-4 md:grid-cols-3">
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
            </section>

            {/* ═══ RESULTS ═══ */}
            <section>
                <p className="mb-6 text-sm text-slate-500 tracking-wide">Showing <strong>{filtered.length}</strong> scholarships</p>
                <div className="grid gap-5 md:grid-cols-2">
                    {filtered.map((s, i) => {
                        const isExpired = new Date(s.deadline) < new Date()
                        return (
                            <div key={s.id} className={`reveal reveal-delay-${(i % 4) + 1} card-bb overflow-hidden`}>
                                <div className="p-6 md:p-8 space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-card-title text-lg text-slate-900">{s.name}</h3>
                                        <span className="pill pill-primary text-xs py-1">{s.amount}</span>
                                    </div>

                                    <p className="text-sm text-slate-600 leading-relaxed">{s.eligibility}</p>

                                    <div className="flex flex-wrap gap-1.5">
                                        {s.streams.map(st => <span key={st} className="pill pill-outline text-[10px] py-0.5 px-2.5">{st}</span>)}
                                        {s.categories.filter(c => c !== "General").map(c => <span key={c} className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-700">{c}</span>)}
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {s.deadline}</span>
                                        <span>{s.state}</span>
                                    </div>

                                    {s.income_limit && <p className="text-xs text-slate-500"><DollarSign size={11} className="inline mr-0.5" /> Income limit: ₹{s.income_limit.toLocaleString()}</p>}

                                    <a href={s.apply_link} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${isExpired ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "pill-primary w-full"}`}>
                                        <ExternalLink size={14} /> {isExpired ? "Deadline Passed" : "Apply Now"}
                                    </a>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {filtered.length === 0 && (
                <div className="card-bb border-dashed p-12 text-center text-slate-500">
                    No scholarships match your filters. Try broadening your search.
                </div>
            )}
        </div>
    )
}
