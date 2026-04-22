import { useState, useEffect, useMemo, useRef } from "react"
import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Search, Filter, Star, GraduationCap, MapPin, CheckCircle, Zap, Shield, Sparkles, ChevronRight, X } from "lucide-react"
import { getMentors } from "../services/api"
import { Link, useNavigate } from "react-router-dom"
import LoadingSkeleton from "../components/ui/LoadingSkeleton"

const STREAMS = ["All", "Engineering", "Medical", "Design", "Commerce", "Arts"]

export default function Mentors() {
    const navigate = useNavigate()
    const [mentors, setMentors] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeStream, setActiveStream] = useState("All")
    const [hoveredCard, setHoveredCard] = useState(null)
    const containerRef = useRef(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })
    const yParallax = useTransform(scrollYProgress, [0, 1], [0, 150])
    // Bug fix: useTransform must be called at top level, NOT inline in JSX
    const yParallax2 = useTransform(scrollYProgress, [0, 1], [0, -200])

    useEffect(() => {
        setLoading(true)
        getMentors()
            .then((data) => { setMentors(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const filteredMentors = useMemo(() => {
        return mentors.filter(m => {
            const matchesSearch =
                m.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.college?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.exam_focus?.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
            const matchesStream = activeStream === "All" || (m.subjects || []).includes(activeStream)
            return matchesSearch && matchesStream
        })
    }, [mentors, searchQuery, activeStream])

    // Container Animation
    const staggerAnim = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }
    const cardAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
    }

    return (
        <div className="relative min-h-screen pb-24 overflow-hidden" ref={containerRef}>
            <Helmet>
                <title>Find a Mentor — Elite 1:1 Guidance | TAKSHAK</title>
                <meta name="description" content="Connect with verified students from IITs, NITs, and top colleges for 1:1 mentorship and exam strategy." />
            </Helmet>

            {/* ── Breathtaking Ambient Backgrounds ── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    style={{ y: yParallax, background: "radial-gradient(circle, #4edea3 0%, transparent 70%)" }}
                    className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full mix-blend-screen opacity-20"
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    style={{ y: yParallax2, background: "radial-gradient(circle, #3131c0 0%, transparent 70%)" }}
                    className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full mix-blend-screen opacity-15"
                    animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] mix-blend-screen bg-rose-500" />
            </div>

            {/* ── Hero Section ── */}
            <div className="relative z-10 mx-auto max-w-7xl px-5 pt-12 pb-8">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-center relative">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(78,222,163,0.2)]">
                        <Sparkles size={12} /> The Top 1% of Minds
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-indigo-400 drop-shadow-xl">
                        Find Your <br className="md:hidden" /> True North
                    </h1>
                    <p className="text-base md:text-lg text-[#a3aac4] font-medium max-w-2xl mx-auto leading-relaxed">
                        Learn directly from those who conquered the hardest exams. First session is absolutely <span className="text-emerald-400 font-bold border-b border-emerald-400/30">FREE <Zap size={14} className="inline mb-1" /></span>
                    </p>
                </motion.div>
            </div>

            {/* ── Floating Control Bar (Glassmorphism) ── */}
            <div className="sticky top-20 z-40 mx-auto max-w-7xl px-5 mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row gap-4 items-center p-3 rounded-2xl md:rounded-full border border-white/10 bg-[#0f1930]/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">

                    {/* Search Input */}
                    <div className="relative w-full md:max-w-xs group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#a3aac4] group-focus-within:text-indigo-400 transition-colors">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, college, exam..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-transparent focus:border-indigo-500/40 focus:bg-white/10 text-white placeholder:text-[#6d758c] text-sm rounded-full w-full py-3.5 pl-11 pr-4 outline-none transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#6d758c] hover:text-white transition-colors">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Stream Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 hide-scrollbar px-1">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-[#a3aac4]">
                            <Filter size={14} />
                        </div>
                        {STREAMS.map((s) => (
                            <button
                                key={s}
                                onClick={() => setActiveStream(s)}
                                className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 relative overflow-hidden ${activeStream === s ? "text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "text-[#a3aac4] hover:text-white hover:bg-white/5"}`}
                            >
                                {activeStream === s && (
                                    <motion.div layoutId="activeStreamBackground" className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 -z-10"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />
                                )}
                                <span className="relative z-10">{s}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ── Breathtaking Mentors Grid ── */}
            <div className="relative z-10 mx-auto max-w-7xl px-5">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-[2rem] h-[450px] bg-white/5 animate-pulse border border-white/10" />
                        ))}
                    </div>
                ) : filteredMentors.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl" />
                            <Search size={48} className="text-[#6d758c] relative z-10 m-auto mt-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Mentors Found</h3>
                        <p className="text-[#a3aac4] text-sm max-w-sm mx-auto">Try adjusting your search criteria or explore other streams. The perfect mentor is waiting!</p>
                        <button onClick={() => { setSearchQuery(""); setActiveStream("All") }} className="mt-6 px-6 py-2 rounded-full border border-indigo-500/30 text-indigo-400 text-sm font-bold hover:bg-indigo-500/10 transition-colors">
                            Clear Filters
                        </button>
                    </motion.div>
                ) : (
                    <motion.div variants={staggerAnim} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredMentors.map((mentor) => {
                            const initials = (mentor.full_name || mentor.name || "M").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
                            const isHovered = hoveredCard === mentor.id

                            return (
                                <motion.div
                                    key={mentor.id}
                                    variants={cardAnim}
                                    className="group relative flex flex-col h-[480px] rounded-[2rem] overflow-hidden"
                                    onHoverStart={() => setHoveredCard(mentor.id)}
                                    onHoverEnd={() => setHoveredCard(null)}
                                >
                                    {/* Sub-Card Glow Drop Shadow */}
                                    <div className={`absolute inset-0 rounded-[2rem] bg-indigo-500/20 blur-2xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                                    {/* Card Container */}
                                    <div className="relative h-full flex flex-col bg-[#0f1930] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-indigo-500/50">

                                        {/* ── Top Half: Prominent Dynamic Image ── */}
                                        <div className="relative h-[55%] w-full bg-[#16213e] overflow-hidden shrink-0 group-hover:h-[45%] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                                            {/* Free Session Flag */}
                                            <div className="absolute top-4 left-4 z-20">
                                                <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-[#002919] px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase shadow-[0_4px_15px_rgba(78,222,163,0.4)]">
                                                    <Zap size={12} className="fill-[#002919]" /> First 10m Free
                                                </div>
                                            </div>

                                            {/* Top Right Icons */}
                                            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                                                {mentor.is_verified && (
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#4edea3] tooltip-trigger">
                                                        <Shield size={14} className="drop-shadow-[0_0_8px_rgba(78,222,163,0.8)]" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* The Picture */}
                                            {mentor.photo_url ? (
                                                <motion.img
                                                    src={mentor.photo_url}
                                                    alt={mentor.full_name}
                                                    className="w-full h-full object-cover object-top transition-transform duration-700"
                                                    animate={{ scale: isHovered ? 1.05 : 1 }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 to-[#0f1930] transition-transform duration-700"
                                                    style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}>
                                                    <span className="text-6xl font-black text-white/10 drop-shadow-md">{initials}</span>
                                                </div>
                                            )}

                                            {/* Bottom Gradient Fade to pure structural dark */}
                                            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f1930] via-[#0f1930]/80 to-transparent z-10" />

                                            {/* Rating Badge - Floats on the gradient line */}
                                            <div className="absolute bottom-4 right-4 z-20">
                                                <div className="flex items-center gap-1 bg-[#1a264a]/80 backdrop-blur-xl border border-white/10 px-2.5 py-1 rounded-xl shadow-lg">
                                                    <Star size={12} className="text-amber-400 fill-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]" />
                                                    <span className="text-xs font-black text-white">{mentor.rating || "5.0"}</span>
                                                    <span className="text-[9px] text-[#6d758c] font-medium ml-0.5">({mentor.total_sessions || 0})</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Bottom Half: Dark Glass Details ── */}
                                        <div className="relative flex flex-col flex-1 px-6 pt-2 pb-6 z-20">
                                            {/* Info block */}
                                            <div className="flex-1 space-y-3">
                                                <div>
                                                    <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight group-hover:text-indigo-300 transition-colors">
                                                        {(mentor.full_name || mentor.name || "Mentor Name")}
                                                    </h3>
                                                    <p className="text-xs text-[#a3aac4] flex items-center gap-1.5 mt-1">
                                                        <GraduationCap size={14} className="text-indigo-400" />
                                                        <span className="truncate">{mentor.college}</span>
                                                    </p>
                                                    {mentor.city_origin && (
                                                        <p className="text-[10px] text-[#6d758c] flex items-center gap-1 font-medium mt-1">
                                                            <MapPin size={10} /> {mentor.city_origin}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Tags Grid */}
                                                <div className="flex flex-wrap gap-1.5">
                                                    {(mentor.exam_focus || []).slice(0, 3).map((e) => (
                                                        <span key={e} className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                                                            {e}
                                                        </span>
                                                    ))}
                                                    {(mentor.subjects || []).slice(0, 2).map((s) => (
                                                        <span key={s} className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                                                            {s}
                                                        </span>
                                                    ))}
                                                    {((mentor.exam_focus?.length || 0) + (mentor.subjects?.length || 0) > 5) && (
                                                        <span className="px-2 py-0.5 rounded text-[9px] font-black border border-white/10 bg-white/5 text-[#a3aac4]">
                                                            +More
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Bio snippet */}
                                                <p className="text-[11px] leading-relaxed text-[#6d758c] line-clamp-2 mt-4 transition-all duration-300 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto overflow-hidden">
                                                    {mentor.bio || "An expert mentor ready to guide you to success with a personalized roadmap."}
                                                </p>
                                            </div>

                                            {/* Pricing & CTA Line */}
                                            <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/10 relative z-30">
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-[#6d758c] font-black mb-0.5">10 Min Session</p>
                                                    <p className="text-lg font-black text-white">₹80</p>
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/mentors/${mentor.id}`)}
                                                    className="flex items-center justify-center h-10 w-10 md:w-auto md:px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-95 group/btn"
                                                >
                                                    <span className="hidden md:block text-xs font-bold mr-2">Book Slot</span>
                                                    <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
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
