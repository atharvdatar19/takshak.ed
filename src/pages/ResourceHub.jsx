import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { BookOpen, ExternalLink, ChevronDown, MapPin, CheckCircle, Star, ThumbsUp, FileText, Clock, Filter, Youtube, MessageCircle, Globe } from "lucide-react"
import { getEducators, getResources, upvoteResource } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../components/ui/Toast"
import LoadingSkeleton from "../components/ui/LoadingSkeleton"

const EXAM_OPTIONS = ["All", "JEE", "NEET", "CUET", "Class 12", "Class 10"]
const SUBJECT_OPTIONS = ["All", "Physics", "Chemistry", "Maths", "Science"]
const LANGUAGE_OPTIONS = ["All", "Hindi", "English", "Hinglish"]

const PLATFORM_ICONS = {
    youtube: Youtube,
    telegram: MessageCircle,
    website: Globe,
    pdf: FileText,
}

const TYPE_BADGES = {
    playlist: { label: "Playlist", color: "bg-red-100 text-red-700 border-red-200" },
    video: { label: "Video", color: "bg-pink-100 text-pink-700 border-pink-200" },
    pdf: { label: "PDF", color: "bg-amber-100 text-amber-700 border-amber-200" },
    notes: { label: "Notes", color: "bg-blue-100 text-blue-700 border-blue-200" },
    channel: { label: "Channel", color: "bg-purple-100 text-purple-700 border-purple-200" },
    telegram: { label: "Telegram", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
}

export default function ResourceHub() {
    const [searchParams, setSearchParams] = useSearchParams()
    const { user } = useAuth()
    const { addToast } = useToast()

    // Filters from URL
    const [examFilter, setExamFilter] = useState(searchParams.get("exam") || "All")
    const [subjectFilter, setSubjectFilter] = useState(searchParams.get("subject") || "All")
    const [languageFilter, setLanguageFilter] = useState(searchParams.get("language") || "All")

    // Data
    const [educators, setEducators] = useState([])
    const [resources, setResources] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedEducator, setSelectedEducator] = useState(null)

    // Persist filters in URL
    const updateFilters = useCallback((key, value) => {
        const params = new URLSearchParams(searchParams)
        if (value === "All") params.delete(key)
        else params.set(key, value)
        setSearchParams(params, { replace: true })
    }, [searchParams, setSearchParams])

    const setExam = (v) => { setExamFilter(v); updateFilters("exam", v); setSelectedEducator(null) }
    const setSubject = (v) => { setSubjectFilter(v); updateFilters("subject", v); setSelectedEducator(null) }
    const setLanguage = (v) => { setLanguageFilter(v); updateFilters("language", v); setSelectedEducator(null) }

    // Fetch educators
    useEffect(() => {
        let cancelled = false

        const fetchEducators = async () => {
            setLoading(true)
            const params = {}
            if (examFilter !== "All") params.exam = examFilter
            if (subjectFilter !== "All") params.subject = subjectFilter
            if (languageFilter !== "All") params.language = languageFilter

            const data = await getEducators(params)
            if (!cancelled) { setEducators(data); setLoading(false) }
        }

        fetchEducators()
        return () => { cancelled = true }
    }, [examFilter, subjectFilter, languageFilter])

    // Fetch resources when educator is selected or filters change
    useEffect(() => {
        const params = {}
        if (selectedEducator) params.educator_id = selectedEducator
        if (examFilter !== "All") params.exam = examFilter
        if (subjectFilter !== "All") params.subject = subjectFilter

        getResources(params).then(setResources)
    }, [selectedEducator, examFilter, subjectFilter])

    const handleUpvote = async (resourceId) => {
        if (!user) {
            addToast("info", "Please sign in to upvote resources.")
            return
        }
        try {
            await upvoteResource(resourceId, user.id)
            setResources(prev => prev.map(r => r.id === resourceId ? { ...r, upvotes: (r.upvotes || 0) + 1 } : r))
            addToast("success", "Upvoted!")
        } catch {
            addToast("error", "Could not upvote. You may have already upvoted this resource.")
        }
    }

    return (
        <div className="space-y-8 pb-12">
            <Helmet>
                <title>Resources — Best Free Study Material | TAKSHAK</title>
                <meta name="description" content="Curated list of the best free YouTube channels, playlists, PDFs and study resources for JEE, NEET, CUET and board exams." />
            </Helmet>

            {/* ── HERO ── */}
            <motion.section
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-[32px] bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 px-8 py-12 text-white relative overflow-hidden shadow-xl"
            >
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400 via-transparent to-transparent" />
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4 border border-white/20 backdrop-blur-md text-indigo-200">
                        📚 Curated & Vetted
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Resource Hub</h1>
                    <p className="text-indigo-100/90 text-lg leading-relaxed">
                        Stop wasting hours on YouTube. We&apos;ve curated the <strong>best free resources</strong> for every subject & exam — ranked by the community, vetted by toppers.
                    </p>
                </div>
            </motion.section>

            {/* ── FILTERS ── */}
            <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-20 z-10"
            >
                <div className="flex items-center gap-2 text-slate-500 font-semibold mr-1 shrink-0">
                    <Filter size={18} /> Filters:
                </div>

                <div className="flex flex-wrap gap-3 flex-1">
                    <FilterSelect label="Exam" value={examFilter} options={EXAM_OPTIONS} onChange={setExam} />
                    <FilterSelect label="Subject" value={subjectFilter} options={SUBJECT_OPTIONS} onChange={setSubject} />
                    <FilterSelect label="Language" value={languageFilter} options={LANGUAGE_OPTIONS} onChange={setLanguage} />
                </div>
            </motion.div>

            {loading ? <LoadingSkeleton rows={6} /> : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ── LEFT: EDUCATORS ── */}
                    <div className="lg:col-span-5 space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <BookOpen size={20} className="text-indigo-600" /> Educators
                            <span className="text-xs font-normal text-slate-400 ml-1">({educators.length})</span>
                        </h2>

                        <div className="space-y-3 max-h-[calc(100vh-260px)] overflow-y-auto pr-1 hide-scrollbar">
                            {educators.map(educator => (
                                <motion.button
                                    key={educator.id}
                                    type="button"
                                    onClick={() => setSelectedEducator(selectedEducator === educator.id ? null : educator.id)}
                                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                    className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 group ${selectedEducator === educator.id
                                        ? "bg-indigo-50 border-indigo-300 shadow-md ring-1 ring-indigo-300"
                                        : "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm"
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Platform icon */}
                                        <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-sm">
                                            {(() => { const PIcon = PLATFORM_ICONS[educator.platform] || Globe; return <PIcon size={22} /> })()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-indigo-700 transition">{educator.name}</h3>
                                                {educator.verified && (
                                                    <CheckCircle size={14} className="text-blue-500 shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500">{educator.handle} · {educator.subscriber_count} subscribers</p>

                                            <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">{educator.description}</p>

                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {educator.subjects?.map(s => (
                                                    <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-indigo-100">{s}</span>
                                                ))}
                                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-amber-100">{educator.language}</span>
                                            </div>

                                            {educator.city_origin && (
                                                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                                                    <MapPin size={10} /> From {educator.city_origin} 📍
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.button>
                            ))}

                            {educators.length === 0 && (
                                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                                    <p className="text-4xl mb-3">🔍</p>
                                    <p className="text-sm text-slate-500">No educators found for these filters. Try adjusting.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT: RESOURCES ── */}
                    <div className="lg:col-span-7 space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Star size={20} className="text-amber-500" /> Resources
                            <span className="text-xs font-normal text-slate-400 ml-1">({resources.length})</span>
                            {selectedEducator && (
                                <button onClick={() => setSelectedEducator(null)} className="ml-auto text-xs text-indigo-600 font-semibold hover:underline">
                                    Show All
                                </button>
                            )}
                        </h2>

                        <div className="space-y-3">
                            <AnimatePresence>
                                {resources.map((resource, idx) => {
                                    const typeBadge = TYPE_BADGES[resource.resource_type] || TYPE_BADGES.channel
                                    return (
                                        <motion.div
                                            key={resource.id}
                                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-shadow group"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                        {resource.is_pinned && (
                                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded-md border border-amber-200">⭐ Top Pick</span>
                                                        )}
                                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${typeBadge.color}`}>{typeBadge.label}</span>
                                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-200">{resource.exam}</span>
                                                    </div>

                                                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-700 transition">{resource.title}</h3>

                                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                                                        <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{resource.subject}</span>
                                                        {resource.topic && <span>· {resource.topic}</span>}
                                                        {resource.duration_hours && (
                                                            <span className="flex items-center gap-1"><Clock size={12} /> {resource.duration_hours}h</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col items-center gap-2 shrink-0">
                                                    <button
                                                        onClick={() => handleUpvote(resource.id)}
                                                        className="flex flex-col items-center gap-0.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition"
                                                    >
                                                        <ThumbsUp size={16} />
                                                        <span className="text-[10px] font-black">{resource.upvotes}</span>
                                                    </button>
                                                    <a
                                                        href={resource.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1.5 rounded-xl bg-slate-900 text-white px-3 py-2 text-xs font-bold shadow-sm hover:bg-indigo-600 transition hover:-translate-y-0.5"
                                                    >
                                                        Open <ExternalLink size={12} />
                                                    </a>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>

                            {resources.length === 0 && (
                                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                                    <p className="text-5xl mb-3">📖</p>
                                    <p className="text-sm text-slate-500">Select an educator or adjust filters to see curated resources.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function FilterSelect({ label, value, options, onChange }) {
    return (
        <div className="relative flex-1 min-w-[130px]">
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition"
            >
                {options.map(opt => <option key={opt} value={opt}>{opt === "All" ? `All ${label}s` : opt}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
        </div>
    )
}
