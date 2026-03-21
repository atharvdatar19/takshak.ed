import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Star, MapPin, GraduationCap, CalendarDays, Globe, ChevronDown, Filter, Users, Search, Sparkles } from "lucide-react"
import { getMentors } from "../services/api"
import DataState from "../components/DataState"
import LoadingSkeleton from "../components/LoadingSkeleton"

const EXAM_OPTIONS = ["All", "JEE", "NEET", "CUET"]
const SUBJECT_OPTIONS = ["All", "Physics", "Chemistry", "Maths", "Biology"]
const COLLEGE_TYPE_OPTIONS = ["All", "IIT", "NIT", "IIIT", "AIIMS", "Other"]
const LANGUAGE_OPTIONS = ["All", "Hindi", "English", "Hinglish"]
const PRICE_RANGES = [
    { label: "All Prices", min: 0, max: Infinity },
    { label: "Under ₹200", min: 0, max: 200 },
    { label: "₹200 – ₹500", min: 200, max: 500 },
    { label: "₹500+", min: 500, max: Infinity },
]

export default function Mentors() {
    const navigate = useNavigate()
    const [mentors, setMentors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState("")
    const [examFilter, setExamFilter] = useState("All")
    const [subjectFilter, setSubjectFilter] = useState("All")
    const [collegeFilter, setCollegeFilter] = useState("All")
    const [languageFilter, setLanguageFilter] = useState("All")
    const [priceRange, setPriceRange] = useState(0)
    const [minRating, setMinRating] = useState(0)

    useEffect(() => {
        setLoading(true)
        getMentors({}).then(data => {
            setMentors(data)
            setLoading(false)
        }).catch(err => { setError(err.message); setLoading(false) })
    }, [])

    const filteredMentors = useMemo(() => {
        const pr = PRICE_RANGES[priceRange]
        return mentors.filter(m => {
            if (examFilter !== "All" && !m.exam_focus?.includes(examFilter) && m.stream !== examFilter) return false
            if (subjectFilter !== "All" && !m.subjects?.includes(subjectFilter) && m.specialization !== subjectFilter) return false
            if (collegeFilter !== "All" && m.college_type !== collegeFilter) return false
            if (languageFilter !== "All" && !m.languages?.includes(languageFilter) && m.language !== languageFilter) return false
            const rate = m.rate_30min_inr || m.session_price || 0
            if (rate < pr.min || rate > pr.max) return false
            if ((m.rating || 0) < minRating) return false
            if (search) {
                const q = search.toLowerCase()
                const nameMatch = (m.full_name || m.name || "").toLowerCase().includes(q)
                const collegeMatch = (m.college || "").toLowerCase().includes(q)
                const subMatch = (m.subjects || []).join(" ").toLowerCase().includes(q)
                if (!nameMatch && !collegeMatch && !subMatch) return false
            }
            return true
        })
    }, [mentors, examFilter, subjectFilter, collegeFilter, languageFilter, priceRange, minRating, search])

    return (
        <div className="space-y-8 pb-12">
            <Helmet>
                <title>Find a Mentor — 1:1 Sessions with IIT/NIT Seniors | TAKSHAK</title>
                <meta name="description" content="Book 1:1 mentoring sessions with verified IIT, NIT, AIIMS seniors. Get exam strategy, college advice, and mock analysis." />
            </Helmet>

            {/* Hero */}
            <motion.section
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-[32px] bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 px-8 py-12 text-white relative overflow-hidden shadow-xl"
            >
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400 via-transparent to-transparent" />
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4 border border-white/20 backdrop-blur-md text-indigo-200">
                        <Sparkles size={12} className="inline mr-1" /> Verified Seniors Only
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Find Your Mentor</h1>
                    <p className="text-indigo-100/90 text-lg leading-relaxed">
                        Book 1:1 sessions with <strong>verified seniors</strong> from IITs, NITs, and AIIMS. Get personalized strategies, mock analysis, and honest college advice.
                    </p>
                </div>
            </motion.section>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-20 z-10"
            >
                {/* Search */}
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, college, or subject..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white transition"
                    />
                </div>

                {/* Filter pills */}
                <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 text-slate-500 font-semibold text-xs shrink-0"><Filter size={14} /> Filters:</span>
                    <FilterSelect label="Exam" value={examFilter} options={EXAM_OPTIONS} onChange={setExamFilter} />
                    <FilterSelect label="Subject" value={subjectFilter} options={SUBJECT_OPTIONS} onChange={setSubjectFilter} />
                    <FilterSelect label="College" value={collegeFilter} options={COLLEGE_TYPE_OPTIONS} onChange={setCollegeFilter} />
                    <FilterSelect label="Language" value={languageFilter} options={LANGUAGE_OPTIONS} onChange={setLanguageFilter} />
                    <FilterSelect label="Price" value={priceRange} options={PRICE_RANGES.map(p => p.label)} onChange={v => setPriceRange(PRICE_RANGES.findIndex(p => p.label === v) || 0)} isIndex />

                    {/* Rating slider */}
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs text-slate-500 font-medium">Min ⭐</span>
                        <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={e => setMinRating(Number(e.target.value))}
                            className="w-20 h-1.5 accent-indigo-600" />
                        <span className="text-xs font-bold text-indigo-600 w-6">{minRating}</span>
                    </div>
                </div>
            </motion.div>

            {/* Results */}
            <DataState loading={loading} error={error} empty={!loading && filteredMentors.length === 0}
                emptyText="No mentors match your filters. Try adjusting."
            >
                {loading ? <LoadingSkeleton rows={6} /> : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredMentors.map((mentor, idx) => (
                            <MentorCard key={mentor.id} mentor={mentor} index={idx} onClick={() => navigate(`/mentors/${mentor.id}`)} />
                        ))}
                    </div>
                )}
            </DataState>
        </div>
    )
}

function MentorCard({ mentor, index, onClick }) {
    const name = mentor.full_name || mentor.name || "Mentor"
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    const rate = mentor.rate_30min_inr || mentor.session_price || "Free"
    const subjects = mentor.subjects || (mentor.specialization ? [mentor.specialization] : [])
    const exams = mentor.exam_focus || (mentor.stream ? [mentor.stream] : [])

    return (
        <motion.article
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={onClick}
            className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
        >
            {/* Header gradient */}
            <div className="h-20 bg-gradient-to-r from-indigo-500 to-blue-500 relative">
                <div className="absolute -bottom-8 left-5">
                    {mentor.photo_url ? (
                        <img src={mentor.photo_url} alt={name} className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg object-cover" />
                    ) : (
                        <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg font-black">
                            {initials}
                        </div>
                    )}
                </div>
                {mentor.is_verified && (
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        ✓ Verified
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="px-5 pt-12 pb-5 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition">{name}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <GraduationCap size={11} /> {mentor.college || "Top College"} · {mentor.branch || ""} '{(mentor.grad_year || "").toString().slice(-2)}
                </p>
                {mentor.city_origin && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} /> {mentor.city_origin}
                    </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                    {exams.map(e => (
                        <span key={e} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-bold uppercase tracking-wider rounded-md border border-indigo-100">{e}</span>
                    ))}
                    {subjects.slice(0, 3).map(s => (
                        <span key={s} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[9px] font-bold uppercase tracking-wider rounded-md border border-purple-100">{s}</span>
                    ))}
                </div>

                {/* Languages */}
                {(mentor.languages || []).length > 0 && (
                    <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                        <Globe size={10} /> {mentor.languages.join(", ")}
                    </p>
                )}

                {/* Bottom stats */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star size={13} fill="currentColor" />
                        <span className="text-xs font-bold text-slate-700">{mentor.rating || "New"}</span>
                        <span className="text-[10px] text-slate-400">({mentor.total_sessions || 0} sessions)</span>
                    </div>
                    <span className="text-sm font-black text-emerald-600">₹{rate}<span className="text-[10px] text-slate-400 font-normal">/30min</span></span>
                </div>
            </div>

            {/* CTA */}
            <div className="px-5 pb-5">
                <button className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition flex items-center justify-center gap-2">
                    <CalendarDays size={15} /> Book Session
                </button>
            </div>
        </motion.article>
    )
}

function FilterSelect({ label, value, options, onChange, isIndex }) {
    return (
        <div className="relative min-w-[110px]">
            <select
                value={isIndex ? options[value] : value}
                onChange={e => onChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition"
            >
                {options.map(opt => <option key={opt} value={opt}>{opt === "All" ? `All ${label}s` : opt}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
        </div>
    )
}
