import { useState, useEffect, useMemo, useRef } from "react"
import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Search, Filter, Star, GraduationCap, MapPin, CheckCircle, Zap, Shield, Sparkles, ChevronRight, X } from "lucide-react"
import { getMentors } from "../services/api"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import LoadingSkeleton from "../components/LoadingSkeleton"

const STREAMS = ["All", "JEE", "NEET", "Defence", "CUET", "CBSE Boards", "Programming"]

export default function Mentors() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    
    const initialSearch = searchParams.get("search") || ""
    const initialStream = searchParams.get("stream") || "All"

    const [mentors, setMentors] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState(initialSearch)
    const [activeStream, setActiveStream] = useState(initialStream)
    const [hoveredCard, setHoveredCard] = useState(null)
    const containerRef = useRef(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })
    const yParallax = useTransform(scrollYProgress, [0, 1], [0, 150])
    const yParallax2 = useTransform(scrollYProgress, [0, 1], [0, -200])

    useEffect(() => {
        const handler = setTimeout(() => {
            setLoading(true)
            getMentors({ search: searchQuery, stream: activeStream })
                .then((data) => { setMentors(data); setLoading(false) })
                .catch(() => setLoading(false))
        }, 300)
        return () => clearTimeout(handler)
    }, [searchQuery, activeStream])

    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        if (searchQuery) params.set("search", searchQuery)
        else params.delete("search")

        if (activeStream !== "All") params.set("stream", activeStream)
        else params.delete("stream")

        setSearchParams(params, { replace: true })
    }, [searchQuery, activeStream, setSearchParams])

    // Animation variants
    const staggerAnim = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } }
    }
    const cardAnim = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    }

    return (
        <div className="relative min-h-screen pb-24 overflow-hidden" ref={containerRef}>
            <Helmet>
                <title>Find a Mentor — Elite 1:1 Guidance | TAKSHAK</title>
                <meta name="description" content="Connect with verified students from IITs, NITs, and top colleges for 1:1 mentorship and exam strategy." />
            </Helmet>

            {/* Atmospheric glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    style={{ y: yParallax }}
                    className="atmo-glow-primary absolute top-[-10%] right-[-5%]"
                />
                <motion.div
                    style={{ y: yParallax2 }}
                    className="atmo-glow-secondary absolute bottom-[-10%] left-[-10%]"
                />
            </div>

            {/* ── Hero Section ── */}
            <div className="relative z-10 mx-auto max-w-7xl px-5 pt-12 pb-8">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-tertiary/20 bg-tertiary/10 text-tertiary text-[9px] font-label font-black uppercase tracking-widest mb-6">
                        <Sparkles size={12} /> The Top 1% of Minds
                    </span>
                    <h1 className="font-headline font-black text-[clamp(40px,6vw,72px)] italic text-on-surface leading-tight tracking-tighter mb-6">
                        Find Your <br className="md:hidden" /> True North
                    </h1>
                    <p className="text-base md:text-lg text-on-surface-variant font-light max-w-2xl mx-auto leading-relaxed">
                        Learn directly from those who conquered the hardest exams. First session is absolutely <span className="text-tertiary font-bold border-b border-tertiary/30">FREE <Zap size={14} className="inline mb-1" /></span>
                    </p>
                </motion.div>
            </div>

            {/* ── Glass Control Bar ── */}
            <div className="sticky top-20 z-40 mx-auto max-w-7xl px-5 mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col md:flex-row gap-4 items-center p-3 rounded-lg md:rounded-full glass">

                    {/* Search Input */}
                    <div className="relative w-full md:max-w-xs group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/60 group-focus-within:text-primary transition-colors duration-400">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, college, exam..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-0 border-b border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/40 text-sm rounded-none w-full py-3 pl-11 pr-4 outline-none focus:border-primary transition-all duration-400"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant/40 hover:text-on-surface transition-colors duration-400">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Stream Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 px-1">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container text-on-surface-variant/60">
                            <Filter size={14} />
                        </div>
                        {STREAMS.map((s) => (
                            <button
                                key={s}
                                onClick={() => setActiveStream(s)}
                                className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-label font-bold uppercase tracking-wider transition-all duration-400 relative overflow-hidden ${activeStream === s ? "text-on-primary" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/30"}`}
                            >
                                {activeStream === s && (
                                    <motion.div layoutId="activeStreamBackground" className="absolute inset-0 bg-primary rounded-full -z-10"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />
                                )}
                                <span className="relative z-10">{s}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ── Mentors Grid ── */}
            <div className="relative z-10 mx-auto max-w-7xl px-5">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-lg h-[420px] shimmer" />
                        ))}
                    </div>
                ) : mentors.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                            <Search size={48} className="text-on-surface-variant/40 relative z-10 m-auto mt-6" />
                        </div>
                        <h3 className="text-2xl font-headline font-bold text-on-surface italic mb-2">No Mentors Found</h3>
                        <p className="text-on-surface-variant font-light text-sm max-w-sm mx-auto">Try adjusting your search criteria or explore other streams. The perfect mentor is waiting!</p>
                        <button onClick={() => { setSearchQuery(""); setActiveStream("All") }} className="btn-ghost mt-6">
                            Clear Filters
                        </button>
                    </motion.div>
                ) : (
                    <motion.div variants={staggerAnim} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {mentors.map((mentor) => {
                            const initials = (mentor.full_name || mentor.name || "M").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
                            const isHovered = hoveredCard === mentor.id

                            return (
                                <motion.div
                                    key={mentor.id}
                                    variants={cardAnim}
                                    className="group relative flex flex-col h-[440px] rounded-lg overflow-hidden"
                                    onHoverStart={() => setHoveredCard(mentor.id)}
                                    onHoverEnd={() => setHoveredCard(null)}
                                >
                                    {/* Hover glow */}
                                    <div className={`absolute inset-0 rounded-lg bg-primary/15 blur-2xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                                    {/* Card Container */}
                                    <div className="relative h-full flex flex-col glass rounded-lg border border-outline-variant/10 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-primary/30">

                                        {/* Top Half: Image */}
                                        <div className="relative h-[55%] w-full bg-surface-container overflow-hidden shrink-0 group-hover:h-[45%] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                                            {/* Free Session Flag */}
                                            <div className="absolute top-4 left-4 z-20">
                                                <div className="flex items-center gap-1.5 bg-tertiary text-on-tertiary px-3 py-1.5 rounded-full text-[9px] font-label font-black tracking-wider uppercase">
                                                    <Zap size={12} /> First 10m Free
                                                </div>
                                            </div>

                                            {/* Verified Badge */}
                                            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                                                {mentor.is_verified && (
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full glass text-tertiary">
                                                        <Shield size={14} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Photo */}
                                            {mentor.photo_url ? (
                                                <motion.img
                                                    src={mentor.photo_url}
                                                    alt={mentor.full_name}
                                                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700"
                                                    animate={{ scale: isHovered ? 1.05 : 1 }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-surface-container-high transition-transform duration-700"
                                                    style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}>
                                                    <span className="text-6xl font-headline font-black text-on-surface-variant/10">{initials}</span>
                                                </div>
                                            )}

                                            {/* Gradient fade */}
                                            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-container via-surface-container/80 to-transparent z-10" />

                                            {/* Rating Badge */}
                                            <div className="absolute bottom-4 right-4 z-20">
                                                <div className="flex items-center gap-1 glass px-2.5 py-1 rounded-full">
                                                    <Star size={12} className="text-tertiary fill-tertiary" />
                                                    <span className="text-xs font-headline font-bold text-on-surface">{mentor.rating || "5.0"}</span>
                                                    <span className="text-[9px] text-on-surface-variant/60 font-label ml-0.5">({mentor.total_sessions || 0})</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Half: Details */}
                                        <div className="relative flex flex-col flex-1 px-6 pt-2 pb-6 z-20">
                                            <div className="flex-1 space-y-3">
                                                <div>
                                                    <h3 className="text-lg font-headline font-bold text-on-surface italic tracking-tight leading-tight group-hover:text-primary transition-colors duration-400">
                                                        {(mentor.full_name || mentor.name || "Mentor Name")}
                                                    </h3>
                                                    {mentor.headline && (
                                                        <p className="text-sm font-semibold text-secondary mt-1.5 line-clamp-1">
                                                            {mentor.headline}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1.5 font-light">
                                                        <GraduationCap size={14} className="text-primary/70 shrink-0" />
                                                        <span className="truncate">{mentor.college}</span>
                                                    </p>
                                                    {mentor.city_origin && (
                                                        <p className="text-[10px] text-on-surface-variant/60 flex items-center gap-1 font-label mt-1">
                                                            <MapPin size={10} /> {mentor.city_origin}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-1.5">
                                                    {(mentor.exam_focus || []).slice(0, 3).map((e) => (
                                                        <span key={e} className="px-2 py-0.5 rounded-full text-[8px] font-label font-black uppercase tracking-wider border border-tertiary/20 bg-tertiary/10 text-tertiary">
                                                            {e}
                                                        </span>
                                                    ))}
                                                    {(mentor.subjects || []).slice(0, 2).map((s) => (
                                                        <span key={s} className="px-2 py-0.5 rounded-full text-[8px] font-label font-black uppercase tracking-wider border border-primary/20 bg-primary/10 text-primary/80">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Bio on hover */}
                                                <p className="text-[11px] leading-relaxed text-on-surface-variant/60 font-light line-clamp-2 mt-4 transition-all duration-500 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto overflow-hidden">
                                                    {mentor.bio || "An expert mentor ready to guide you to success with a personalized roadmap."}
                                                </p>
                                            </div>

                                            {/* Pricing & CTA */}
                                            <div className="flex items-center justify-between pt-4 mt-auto border-t border-outline-variant/10 relative z-30">
                                                <div>
                                                    <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/60 font-bold mb-0.5">10 Min Session</p>
                                                    <p className="text-lg font-headline font-black text-on-surface">₹80</p>
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/mentors/${mentor.id}`)}
                                                    className="btn-primary py-2.5 px-4 text-[10px] group/btn"
                                                >
                                                    <span className="hidden md:block mr-1">Book Slot</span>
                                                    <ChevronRight size={14} className="transition-transform duration-400 group-hover/btn:translate-x-1" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    )
}
