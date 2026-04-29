import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import {
    Shield, Star, CheckCircle2, ChevronDown, ChevronUp,
    Award, Users, Target, BookOpen, Clock,
    Phone, MessageSquare, FileText, Zap, Crown, Sparkles,
} from "lucide-react"

// ── Defence Exams Data ──
const DEFENCE_EXAMS = [
    {
        id: "nda", name: "NDA", fullName: "National Defence Academy",
        eligibility: "Class 12 pass (10+2), Age 16.5–19.5 years", conductedBy: "UPSC", frequency: "Twice a year (Apr & Sep)",
        papers: "Mathematics + GAT", selection: "Written Exam → SSB Interview → Medical",
        color: "from-emerald-500/20 to-teal-600/10 border-emerald-500/30 text-emerald-400",
    },
    {
        id: "cds", name: "CDS", fullName: "Combined Defence Services",
        eligibility: "Graduation (any stream)", conductedBy: "UPSC", frequency: "Twice a year",
        papers: "English + GK + Math", selection: "Written Exam → SSB Interview → Medical",
        color: "from-blue-500/20 to-indigo-600/10 border-blue-500/30 text-blue-400",
    },
    {
        id: "afcat", name: "AFCAT", fullName: "Air Force Common Admission Test",
        eligibility: "Graduation with 60% (Engg for tech)", conductedBy: "Indian Air Force", frequency: "Twice a year",
        papers: "GK, English, Numerical, Reasoning", selection: "Written → AFSB Interview → Medical",
        color: "from-sky-500/20 to-blue-600/10 border-sky-500/30 text-sky-400",
    },
    {
        id: "ta", name: "TA", fullName: "Territorial Army",
        eligibility: "Employed/Self-employed, Age 18–42", conductedBy: "Indian Army", frequency: "Once a year",
        papers: "Reasoning + Math + GK + English", selection: "Written → Interview → Medical",
        color: "from-amber-500/20 to-orange-600/10 border-amber-500/30 text-amber-400",
    },
]

// ── SSB 5-Day Process ──
const SSB_DAYS = [
    { day: "Day 1", title: "Screening Test", description: "OIR (Officer Intelligence Rating) test and PPDT (Picture Perception & Discussion Test). Candidates are screened in or screened out based on performance.", icon: Target },
    { day: "Day 2", title: "Psychological Tests", description: "TAT (Thematic Apperception Test), WAT (Word Association Test), SRT (Situation Reaction Test), and Self-Description. Tests your subconscious personality.", icon: BookOpen },
    { day: "Day 3-4", title: "GTO Tasks", description: "Group Discussion, GPE (Group Planning Exercise), PGT, HGT, Lecturette, Command Task, Snake Race, and Individual Obstacles. Tests leadership and teamwork.", icon: Users },
    { day: "Day 4", title: "Personal Interview", description: "One-on-one interview with the IO (Interviewing Officer). Covers your life history, PIQ form details, current affairs, and situational questions.", icon: MessageSquare },
    { day: "Day 5", title: "Conference", description: "Final round where all assessors meet the candidate together. The board makes the final recommendation decision. Results announced same day.", icon: Crown },
]

// ── Pricing ──
const PRICING_PLANS = [
    {
        id: "free", name: "First Guidance", price: "FREE", priceNote: "No payment needed", highlight: false,
        color: "border-white/10", gradient: "from-white/5 to-transparent", badge: null,
        features: ["15-min introductory 1:1 call", "Defence career path assessment", "NDA vs CDS vs AFCAT guidance", "Eligibility check & exam timeline"],
        cta: "Book Free Session", btnStyle: "bg-white/10 text-white hover:bg-white/20"
    },
    {
        id: "session", name: "Written Exam Mentorship", price: "₹99", priceNote: "per session", highlight: false,
        color: "border-indigo-500/30", gradient: "from-indigo-500/10 to-transparent", badge: null,
        features: ["30-min 1:1 video session", "Subject-wise strategy", "Previous year paper analysis", "Curated study material", "Mock test review"],
        cta: "Book Session — ₹99", mentor: "Raghav Mishra", btnStyle: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
    },
    {
        id: "ssb", name: "SSB Interview Prep", price: "₹699", priceNote: "complete plan", highlight: true,
        color: "border-amber-500/50", gradient: "from-amber-500/20 to-[#0f1930]", badge: "MOST POPULAR",
        features: ["3× live 1:1 sessions (45 min each)", "Mock SSB Simulation (OIR, PPDT, TAT)", "GTO Tasks Walkthrough", "2× Mock Personal Interview", "5-Day SSB Blueprint"],
        cta: "Enroll — ₹699", mentor: "Hemant Singh Bhadoriya", btnStyle: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_25px_rgba(245,158,11,0.5)] border-none"
    },
]

// ── Accordion Item ──
function AccordionItem({ item, isOpen, onClick }) {
    const Icon = item.icon
    return (
        <div className="rounded-[20px] border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden transition-all hover:bg-white/10">
            <button onClick={onClick} className="flex items-center gap-4 w-full p-5 md:p-6 text-left focus:outline-none">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
                    <Icon size={20} />
                </div>
                <div className="flex-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#6d758c] mb-1 block">{item.day}</span>
                    <h4 className="text-base font-bold text-white tracking-tight">{item.title}</h4>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[#a3aac4]">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <p className="px-6 pb-6 text-sm text-[#a3aac4] leading-relaxed ml-16">
                            {item.description}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ── Main Page ──
export default function DefenceAspirants() {
    const navigate = useNavigate()
    const [openSSB, setOpenSSB] = useState(0)

    return (
        <div className="min-h-screen bg-[#0b1326] pb-24 relative overflow-hidden">
            <Helmet>
                <title>Defence Exam Aspirants — NDA, CDS, AFCAT & SSB Prep | TAKक्षक</title>
                <meta name="description" content="Prepare for NDA, CDS, AFCAT & SSB interviews with expert mentors. First guidance session free." />
            </Helmet>

            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="space-y-16 md:space-y-24 max-w-6xl mx-auto px-4 md:px-8 relative z-10 pt-8">

                {/* ═══ HERO ═══ */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                    className="relative overflow-hidden rounded-[2.5rem] bg-[#0f1930]/80 backdrop-blur-3xl border border-white/10 px-8 py-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                    <div className="absolute inset-0">
                        <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/20 blur-[100px]" />
                        <div className="absolute bottom-[-50%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/20 blur-[100px]" />
                    </div>
                    
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 backdrop-blur-md shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                            <Shield size={48} />
                        </motion.div>
                        
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
                            Defence Exam <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Command Center</span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#a3aac4] font-medium max-w-2xl mx-auto leading-relaxed">
                            Your complete preparation hub for NDA, CDS, AFCAT & SSB Interviews — guided by mentors who've been through it.
                        </p>
                        
                        <div className="mt-10 flex flex-wrap justify-center gap-3">
                            {[{ icon: Zap, label: "First Session FREE" }, { icon: Shield, label: "Expert Defence Mentors" }, { icon: Award, label: "AIR 371 NDA Mentor" }].map((badge, i) => (
                                <span key={i} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-5 py-2.5 text-[14px] font-black uppercase tracking-widest text-white shadow-sm">
                                    <badge.icon size={14} className="text-emerald-400" /> {badge.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* ═══ HEAD MENTORS ═══ */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">🎖️ Your Head Mentors</h2>
                        <p className="text-[#a3aac4] text-sm uppercase tracking-widest font-bold">The finest student mentors — they've walked the path</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Raghav Mishra */}
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="group rounded-[2rem] bg-[#0f1930] border border-white/10 overflow-hidden hover:border-indigo-500/50 transition-all shadow-xl">
                            <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-b border-white/5 p-6 md:p-8">
                                <div className="flex items-center gap-5">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-indigo-500/20 border border-indigo-500/30 text-3xl font-black text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                        RM
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white tracking-tight">Raghav Mishra</h3>
                                        <p className="text-[#a3aac4] font-medium mt-1">Written Exam Specialist</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 md:p-8 space-y-6 bg-gradient-to-b from-white/5 to-transparent">
                                <p className="text-sm text-[#a3aac4] leading-relaxed">
                                    NDA Written Exam & SSB Interview Coach with <strong className="text-white">3 years of mentoring experience</strong>. Specializes in breaking down complex mathematical concepts and preparing candidates for the psychological and GKT portions of SSB.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {["NDA Written", "SSB Interview", "Mathematics", "GAT & GKT"].map(tag => (
                                        <span key={tag} className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-[10px] font-black text-indigo-300 uppercase tracking-widest">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-6 text-[14px] font-black uppercase tracking-widest text-[#6d758c]">
                                    <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-400 fill-amber-400" /> 5.0</span>
                                    <span className="flex items-center gap-1.5"><Users size={14} /> 3 yr exp</span>
                                </div>
                                <button onClick={() => navigate("/sessions")} className="w-full rounded-xl bg-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition-colors uppercase tracking-wider">
                                    Book 1:1 Session — ₹99
                                </button>
                            </div>
                        </motion.div>

                        {/* Hemant Singh Bhadoriya */}
                        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="group rounded-[2rem] bg-[#0f1930] border border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all shadow-xl">
                            <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border-b border-white/5 p-6 md:p-8">
                                <div className="flex items-center gap-5">
                                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-emerald-500/20 border border-emerald-500/30 text-3xl font-black text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                                        HS
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white tracking-tight">Hemant Bhadoriya</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-[#a3aac4] font-medium">SSB Specialist</p>
                                            <span className="rounded bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[9px] font-black text-amber-400 uppercase tracking-widest shadow-[0_0_10px_rgba(245,158,11,0.2)]">AIR 371 NDA</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 md:p-8 space-y-6 bg-gradient-to-b from-white/5 to-transparent">
                                <p className="text-sm text-[#a3aac4] leading-relaxed">
                                    <strong className="text-amber-400">AIR 371 in NDA</strong> — cleared NDA written exam <strong className="text-white">5 times</strong>. Mentored <strong className="text-white">50+ students</strong> for NDA written and conducted <strong className="text-white">30+ SSB mock interviews</strong> for NDA and direct entries.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {["NDA Written + SSB", "Psychological Tests", "GTO Tasks", "30+ SSB Mocks"].map(tag => (
                                        <span key={tag} className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black text-emerald-300 uppercase tracking-widest">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-6 text-[14px] font-black uppercase tracking-widest text-[#6d758c]">
                                    <span className="flex items-center gap-1.5"><Star size={14} className="text-amber-400 fill-amber-400" /> 5.0</span>
                                    <span className="flex items-center gap-1.5"><Users size={14} /> 50+ students</span>
                                    <span className="flex items-center gap-1.5"><Award size={14} className="text-emerald-400" /> 5× Written</span>
                                </div>
                                <button onClick={() => navigate("/sessions")} className="w-full rounded-xl bg-emerald-600 px-4 py-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(5,150,105,0.3)] hover:bg-emerald-500 transition-colors uppercase tracking-wider">
                                    Enroll SSB Prep — ₹699
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ═══ PRICING PLANS ═══ */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">💰 Choose Your Plan</h2>
                        <p className="text-[#a3aac4] text-sm uppercase tracking-widest font-bold">Start free, upgrade when ready</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {PRICING_PLANS.map((plan, idx) => (
                            <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={`relative rounded-[2rem] border bg-gradient-to-b ${plan.gradient} ${plan.color} overflow-hidden shadow-2xl transition-all ${plan.highlight ? "ring-2 ring-amber-500/50 lg:-translate-y-4" : ""} bg-[#0f1930]`}>
                                {plan.badge && (
                                    <div className="absolute top-0 inset-x-0 mx-auto w-max rounded-b-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-1.5 text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                                        {plan.badge}
                                    </div>
                                )}
                                <div className={`p-8 md:p-10 space-y-8 ${plan.badge ? "pt-12" : ""}`}>
                                    <div className="text-center border-b border-white/10 pb-8">
                                        <h3 className="text-xl font-bold text-[#a3aac4] tracking-tight">{plan.name}</h3>
                                        <div className="flex items-center justify-center gap-2 mt-4">
                                            <span className="text-5xl font-black text-white tracking-tight">{plan.price}</span>
                                        </div>
                                        <span className="text-[14px] font-black uppercase tracking-widest text-[#6d758c] mt-2 block">{plan.priceNote}</span>
                                        {plan.mentor && <p className="text-xs text-indigo-400 font-bold mt-3">with {plan.mentor}</p>}
                                    </div>

                                    <ul className="space-y-4">
                                        {plan.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-[#a3aac4]">
                                                <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${plan.highlight ? "text-amber-400" : "text-emerald-400"}`} />
                                                <span className="leading-snug">{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="pt-4">
                                        <button onClick={() => navigate("/sessions")} className={`w-full rounded-xl px-4 py-4 text-sm font-bold uppercase tracking-wider transition-all ${plan.btnStyle}`}>
                                            {plan.cta}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ═══ DEFENCE EXAMS OVERVIEW ═══ */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">🛡️ Exams at a Glance</h2>
                        <p className="text-[#a3aac4] text-sm uppercase tracking-widest font-bold">Every path to serving the nation</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {DEFENCE_EXAMS.map((exam, idx) => (
                            <motion.div key={exam.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.08 }} className="rounded-[2rem] border bg-[#0f1930] hover:bg-[#16213e] overflow-hidden transition-all shadow-xl group border-white/10">
                                <div className={`bg-gradient-to-r ${exam.color.split(" ").slice(0, 2).join(" ")} border-b border-white/5 p-6`}>
                                    <h3 className="text-2xl font-black text-white tracking-tight">{exam.name}</h3>
                                    <p className="text-xs text-white/70 font-bold uppercase tracking-widest mt-1">{exam.fullName}</p>
                                </div>
                                <div className="p-6 space-y-4 bg-gradient-to-b from-white/5 to-transparent">
                                    {[
                                        ["Eligibility", exam.eligibility], ["Conducted By", exam.conductedBy],
                                        ["Frequency", exam.frequency], ["Papers", exam.papers], ["Selection", exam.selection],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-sm">
                                            <span className="font-black uppercase tracking-widest text-[#6d758c] text-[10px] w-28 shrink-0 mt-1">{label}</span>
                                            <span className="text-[#a3aac4] font-medium leading-snug">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ═══ SSB INTERVIEW GUIDE ═══ */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">🎯 SSB 5-Day Process</h2>
                        <p className="text-[#a3aac4] text-sm uppercase tracking-widest font-bold">Understand every stage of the SSB</p>
                    </div>

                    <div className="space-y-4 max-w-4xl mx-auto">
                        {SSB_DAYS.map((item, idx) => (
                            <AccordionItem key={idx} item={item} isOpen={openSSB === idx} onClick={() => setOpenSSB(openSSB === idx ? -1 : idx)} />
                        ))}
                    </div>
                </section>

                {/* ═══ WHY CHOOSE US ═══ */}
                <section className="relative overflow-hidden rounded-[2.5rem] bg-[#0f1930]/80 border border-white/10 p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                    
                    <h2 className="text-3xl font-black text-white mb-12 text-center relative z-10">Why Aspirants Choose TAKक्षक</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {[
                            { icon: Shield, label: "Mentors Who've Done It", desc: "Learn from AIR 371 NDA holder and specialists", border: "border-emerald-500/30", color: "text-emerald-400 bg-emerald-500/10" },
                            { icon: Phone, label: "1:1 Personal Attention", desc: "No batch system — direct video calls with your mentor", border: "border-indigo-500/30", color: "text-indigo-400 bg-indigo-500/10" },
                            { icon: Zap, label: "First Session Free", desc: "Try before you commit — zero risk, zero payment", border: "border-amber-500/30", color: "text-amber-400 bg-amber-500/10" },
                            { icon: FileText, label: "Complete SSB Blueprint", desc: "5-day plan, mock SSB, psychological test training", border: "border-rose-500/30", color: "text-rose-400 bg-rose-500/10" },
                        ].map((item, i) => (
                            <div key={i} className="text-center space-y-4">
                                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border ${item.border} ${item.color} shadow-lg`}>
                                    <item.icon size={26} />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-white tracking-tight mb-2">{item.label}</h4>
                                    <p className="text-xs text-[#a3aac4] leading-relaxed max-w-[200px] mx-auto">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══ CTA ═══ */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-500/30 p-10 md:p-16 text-center text-white"
                >
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                    <Sparkles size={40} className="mx-auto mb-6 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-white to-emerald-200">Ready to Start Your Journey?</h2>
                    <p className="text-[#a3aac4] text-base md:text-lg max-w-2xl mx-auto relative z-10 leading-relaxed">
                        Your first guidance session is completely free. Talk to our mentors, get a roadmap, and decide your path — no strings attached.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-5 relative z-10">
                        <button onClick={() => navigate("/sessions")} className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#002919] shadow-[0_0_25px_rgba(52,211,153,0.4)] hover:-translate-y-1 transition-all">
                            🎖️ Book Free Session
                        </button>
                    </div>
                </motion.section>
            </div>
        </div>
    )
}
