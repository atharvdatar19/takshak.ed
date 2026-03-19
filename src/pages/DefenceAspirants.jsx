import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import {
    Shield, Star, CheckCircle2, ChevronDown, ChevronUp,
    Award, Users, Target, BookOpen, Swords, Clock,
    Phone, MessageSquare, FileText, Zap, Crown, Sparkles,
} from "lucide-react"

// ── Defence Exams Data ──
const DEFENCE_EXAMS = [
    {
        id: "nda",
        name: "NDA",
        fullName: "National Defence Academy",
        eligibility: "Class 12 pass (10+2), Age 16.5–19.5 years",
        conductedBy: "UPSC",
        frequency: "Twice a year (Apr & Sep)",
        papers: "Mathematics + GAT (General Ability Test)",
        selection: "Written Exam → SSB Interview → Medical",
        color: "from-emerald-500 to-teal-600",
    },
    {
        id: "cds",
        name: "CDS",
        fullName: "Combined Defence Services",
        eligibility: "Graduation (any stream)",
        conductedBy: "UPSC",
        frequency: "Twice a year",
        papers: "English + GK + Mathematics (IMA/INA/AFA)",
        selection: "Written Exam → SSB Interview → Medical",
        color: "from-blue-500 to-indigo-600",
    },
    {
        id: "afcat",
        name: "AFCAT",
        fullName: "Air Force Common Admission Test",
        eligibility: "Graduation with 60% (Engineering for technical)",
        conductedBy: "Indian Air Force",
        frequency: "Twice a year",
        papers: "GK, English, Numerical Ability, Reasoning",
        selection: "Written → AFSB Interview → Medical",
        color: "from-sky-500 to-blue-600",
    },
    {
        id: "ta",
        name: "TA",
        fullName: "Territorial Army",
        eligibility: "Employed/Self-employed, Age 18–42",
        conductedBy: "Indian Army",
        frequency: "Once a year",
        papers: "Reasoning + Elementary Mathematics + GK + English",
        selection: "Written → Interview → Medical",
        color: "from-amber-500 to-orange-600",
    },
]

// ── SSB 5-Day Process ──
const SSB_DAYS = [
    {
        day: "Day 1",
        title: "Screening Test",
        description: "OIR (Officer Intelligence Rating) test and PPDT (Picture Perception & Discussion Test). Candidates are screened in or screened out based on performance.",
        icon: Target,
    },
    {
        day: "Day 2",
        title: "Psychological Tests",
        description: "TAT (Thematic Apperception Test), WAT (Word Association Test), SRT (Situation Reaction Test), and Self-Description. Tests your subconscious personality.",
        icon: BookOpen,
    },
    {
        day: "Day 3-4",
        title: "GTO Tasks",
        description: "Group Discussion, GPE (Group Planning Exercise), PGT, HGT, Lecturette, Command Task, Snake Race, and Individual Obstacles. Tests leadership and teamwork.",
        icon: Users,
    },
    {
        day: "Day 4",
        title: "Personal Interview",
        description: "One-on-one interview with the IO (Interviewing Officer). Covers your life history, PIQ form details, current affairs, and situational questions.",
        icon: MessageSquare,
    },
    {
        day: "Day 5",
        title: "Conference",
        description: "Final round where all assessors meet the candidate together. The board makes the final recommendation decision. Results announced same day.",
        icon: Crown,
    },
]

// ── Pricing ──
const PRICING_PLANS = [
    {
        id: "free",
        name: "First Guidance",
        price: "FREE",
        priceNote: "No payment needed",
        highlight: false,
        color: "border-slate-200",
        gradient: "from-slate-50 to-white",
        badge: null,
        features: [
            "15-min introductory 1:1 call",
            "Defence career path assessment",
            "NDA vs CDS vs AFCAT guidance",
            "Eligibility check & exam timeline",
            "Personalized study roadmap",
            "Access to free resources on this page",
        ],
        cta: "Book Free Session",
    },
    {
        id: "session",
        name: "Written Exam Mentorship",
        price: "₹99",
        priceNote: "per session",
        highlight: false,
        color: "border-indigo-200",
        gradient: "from-indigo-50 to-white",
        badge: null,
        features: [
            "30-min 1:1 video session (Google Meet)",
            "Subject-wise strategy (Math, GK, English, Science)",
            "Previous year paper analysis & patterns",
            "Curated study material recommendations",
            "Mock test review & score improvement plan",
            "Doubt clearing on specific topics",
            "Post-session summary notes (WhatsApp/Email)",
            "Priority booking for next session",
        ],
        cta: "Book Session — ₹99",
        mentor: "Raghav Mishra",
    },
    {
        id: "ssb",
        name: "SSB Interview Prep",
        price: "₹699",
        priceNote: "complete plan",
        highlight: true,
        color: "border-amber-300",
        gradient: "from-amber-50 to-white",
        badge: "MOST POPULAR",
        features: [
            "3× live 1:1 sessions (45 min each)",
            "Mock SSB Simulation (OIR, PPDT, TAT, WAT, SRT)",
            "GTO Tasks Walkthrough — GD, GPE, Lecturette",
            "2× Mock Personal Interview with feedback",
            "Psychological Test Training & practice",
            "5-Day SSB Blueprint (day-by-day plan)",
            "OLQ Assessment & improvement areas",
            "Conference Round Prep strategy",
            "30-day WhatsApp group access for doubts",
            "Certificate of Completion by NetraX",
            "Bonus: SSB Resource Kit (PIQ guide, GK revision, current affairs)",
        ],
        cta: "Enroll — ₹699",
        mentor: "Hemant Singh Bhadoriya",
    },
]

// ── Accordion Item ──
function AccordionItem({ item, isOpen, onClick }) {
    const Icon = item.icon
    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm overflow-hidden transition-shadow hover:shadow-md">
            <button
                onClick={onClick}
                className="flex items-center gap-4 w-full p-5 text-left"
            >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                    <Icon size={18} />
                </div>
                <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">{item.day}</span>
                    <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed ml-14">
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
        <>
            <Helmet>
                <title>Defence Exam Aspirants — NDA, CDS, AFCAT & SSB Prep | NetraX</title>
                <meta name="description" content="Prepare for NDA, CDS, AFCAT exams and SSB interviews with expert mentors. First guidance session free. Written exam mentorship ₹99/session. Complete SSB Prep ₹699." />
            </Helmet>

            <div className="space-y-10 md:space-y-16 max-w-6xl mx-auto">

                {/* ═══ HERO ═══ */}
                <motion.section
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 px-8 py-12 text-white md:px-14 md:py-20"
                >
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/20 blur-3xl -translate-y-1/2 translate-x-1/3" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-yellow-300/20 blur-3xl translate-y-1/2 -translate-x-1/3" />
                    </div>
                    <div className="relative z-10 text-center max-w-3xl mx-auto">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm">
                            <Shield size={40} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Defence Exam Command Center</h1>
                        <p className="mt-4 text-emerald-100/90 text-base md:text-lg max-w-xl mx-auto">
                            Your complete preparation hub for NDA, CDS, AFCAT & SSB Interviews — guided by mentors who've been through it.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-sm font-medium">
                                <Zap size={14} /> First Session FREE
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-sm font-medium">
                                <Shield size={14} /> Expert Defence Mentors
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-sm font-medium">
                                <Award size={14} /> AIR 371 NDA Mentor
                            </span>
                        </div>
                    </div>
                </motion.section>

                {/* ═══ HEAD MENTORS ═══ */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 text-center">🎖️ Your Head Mentors</h2>
                    <p className="text-sm text-slate-500 text-center mb-8">The finest student mentors — they've walked the path you're about to take</p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Raghav Mishra */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-2xl font-black">
                                        RM
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Raghav Mishra</h3>
                                        <p className="text-indigo-100 text-sm font-medium">Written Exam Specialist</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    NDA Written Exam & SSB Interview Coach with <strong>3 years of mentoring experience</strong>. Specializes in breaking down complex mathematical concepts and preparing candidates for the psychological and GKT (General Knowledge Test) portions of SSB. Kendriya Vidyalaya alumni.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">NDA Written</span>
                                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">SSB Interview</span>
                                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Mathematics</span>
                                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">GAT & GKT</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /> 5.0</span>
                                    <span className="flex items-center gap-1"><Users size={14} /> 3 yr experience</span>
                                </div>
                                <button
                                    onClick={() => navigate("/sessions")}
                                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:shadow-xl transition-all active:scale-[0.98]"
                                >
                                    Book 1:1 Session — ₹99
                                </button>
                            </div>
                        </motion.div>

                        {/* Hemant Singh Bhadoriya */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-2xl border border-amber-200/80 bg-white/90 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-2xl font-black">
                                        HS
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Hemant Singh Bhadoriya</h3>
                                        <div className="flex items-center gap-2">
                                            <p className="text-emerald-100 text-sm font-medium">SSB Interview Specialist</p>
                                            <span className="rounded bg-amber-400 px-1.5 py-0.5 text-[9px] font-black text-amber-900 uppercase">AIR 371 NDA</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    <strong>AIR 371 in NDA</strong> — cleared NDA written exam <strong>5 times</strong>. Mentored <strong>50+ students</strong> for NDA written and conducted <strong>30+ SSB mock interviews</strong> for NDA and direct entries. Army Public School, Patiala. Provides roadmap for an easy and smooth approach towards achieving goals.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">NDA Written + SSB</span>
                                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Psychological Tests</span>
                                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">GTO Tasks</span>
                                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">30+ SSB Mocks</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /> 5.0</span>
                                    <span className="flex items-center gap-1"><Users size={14} /> 50+ students</span>
                                    <span className="flex items-center gap-1"><Award size={14} className="text-amber-500" /> 5× NDA Written</span>
                                </div>
                                <button
                                    onClick={() => navigate("/sessions")}
                                    className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:shadow-xl transition-all active:scale-[0.98]"
                                >
                                    Enroll SSB Prep — ₹699
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ═══ PRICING PLANS ═══ */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 text-center">💰 Choose Your Plan</h2>
                    <p className="text-sm text-slate-500 text-center mb-8">Start free, upgrade when ready — no pressure, no commitment</p>

                    <div className="grid md:grid-cols-3 gap-5">
                        {PRICING_PLANS.map((plan, idx) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative rounded-2xl border-2 bg-gradient-to-b ${plan.gradient} ${plan.color} overflow-hidden shadow-sm hover:shadow-lg transition-all ${plan.highlight ? "ring-2 ring-amber-400 ring-offset-2" : ""}`}
                            >
                                {plan.badge && (
                                    <div className="absolute top-0 right-0 rounded-bl-xl bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-[9px] font-black text-white uppercase tracking-wider">
                                        {plan.badge}
                                    </div>
                                )}
                                <div className="p-6 space-y-5">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
                                        <div className="flex items-baseline gap-1 mt-1">
                                            <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                                            <span className="text-xs text-slate-500 font-medium">{plan.priceNote}</span>
                                        </div>
                                        {plan.mentor && (
                                            <p className="text-xs text-indigo-600 font-medium mt-1">with {plan.mentor}</p>
                                        )}
                                    </div>

                                    <ul className="space-y-2.5">
                                        {plan.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                                                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => navigate("/sessions")}
                                        className={`w-full rounded-xl px-4 py-3 text-sm font-bold transition-all active:scale-[0.98] ${plan.highlight
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200 hover:shadow-xl"
                                            : plan.id === "free"
                                                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md"
                                                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl"
                                            }`}
                                    >
                                        {plan.cta}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ═══ DEFENCE EXAMS OVERVIEW ═══ */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 text-center">🛡️ Defence Exams at a Glance</h2>
                    <p className="text-sm text-slate-500 text-center mb-8">Know your options — every exam, every path to serving the nation</p>

                    <div className="grid sm:grid-cols-2 gap-5">
                        {DEFENCE_EXAMS.map((exam, idx) => (
                            <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.08 }}
                                className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-md transition-all"
                            >
                                <div className={`bg-gradient-to-r ${exam.color} p-4 text-white`}>
                                    <h3 className="text-lg font-bold">{exam.name}</h3>
                                    <p className="text-xs text-white/80">{exam.fullName}</p>
                                </div>
                                <div className="p-4 space-y-2">
                                    {[
                                        ["Eligibility", exam.eligibility],
                                        ["Conducted By", exam.conductedBy],
                                        ["Frequency", exam.frequency],
                                        ["Papers", exam.papers],
                                        ["Selection", exam.selection],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex gap-2 text-xs">
                                            <span className="font-bold text-slate-500 w-20 shrink-0">{label}</span>
                                            <span className="text-slate-700">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ═══ SSB INTERVIEW GUIDE ═══ */}
                <section>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 text-center">🎯 SSB Interview — 5-Day Process</h2>
                    <p className="text-sm text-slate-500 text-center mb-8">Understand every stage of the Services Selection Board with Hemant's guidance</p>

                    <div className="space-y-3 max-w-3xl mx-auto">
                        {SSB_DAYS.map((item, idx) => (
                            <AccordionItem
                                key={idx}
                                item={item}
                                isOpen={openSSB === idx}
                                onClick={() => setOpenSSB(openSSB === idx ? -1 : idx)}
                            />
                        ))}
                    </div>
                </section>

                {/* ═══ WHY CHOOSE US ═══ */}
                <section className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-8 md:p-12 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Why Aspirants Choose NetraX</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { icon: Shield, label: "Mentors Who've Done It", desc: "Learn from AIR 371 NDA holder and defence exam specialists", color: "text-emerald-600 bg-emerald-50" },
                            { icon: Phone, label: "1:1 Personal Attention", desc: "No batch system — direct video calls with your mentor", color: "text-indigo-600 bg-indigo-50" },
                            { icon: Zap, label: "First Session Free", desc: "Try before you commit — zero risk, zero payment", color: "text-amber-600 bg-amber-50" },
                            { icon: FileText, label: "Complete SSB Blueprint", desc: "5-day plan, mock SSB, psychological test training", color: "text-rose-600 bg-rose-50" },
                        ].map((item, i) => (
                            <div key={i} className="text-center space-y-2">
                                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}>
                                    <item.icon size={22} />
                                </div>
                                <h4 className="text-sm font-bold text-slate-800">{item.label}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ═══ CTA ═══ */}
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[32px] bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-14 text-center text-white"
                >
                    <Sparkles size={32} className="mx-auto mb-4 text-amber-400" />
                    <h2 className="text-2xl md:text-3xl font-black">Ready to Start Your Defence Journey?</h2>
                    <p className="mt-3 text-slate-300 text-sm max-w-lg mx-auto">
                        Your first guidance session is completely free. Talk to our mentors, get a roadmap, and decide your path — no strings attached.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => navigate("/sessions")}
                            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 hover:shadow-xl transition-all active:scale-[0.98]"
                        >
                            🎖️ Book Free Session Now
                        </button>
                        <button
                            onClick={() => navigate("/sessions")}
                            className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-all active:scale-[0.98]"
                        >
                            View All Mentors
                        </button>
                    </div>
                </motion.section>
            </div>
        </>
    )
}
