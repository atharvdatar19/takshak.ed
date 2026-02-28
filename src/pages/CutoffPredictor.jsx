import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, ChevronDown, ChevronRight, Filter, GraduationCap, Search, Target, TrendingUp } from "lucide-react"
import { useMemo, useState } from "react"
import AnimatedCounter from "../components/animations/AnimatedCounter"
import { StaggerContainer, StaggerItem, SlideIn } from "../components/animations/AnimationUtils"
import MagneticCard from "../components/animations/MagneticCard"
import ParticleField from "../components/animations/ParticleField"

/* ═══════════════════════════════════════════════════════
   EXAM DATA — demo cutoffs per exam
   ═══════════════════════════════════════════════════════ */

const EXAMS = [
    { key: "jee_main", label: "JEE Main", icon: "🎯", color: "from-blue-600 to-cyan-500" },
    { key: "jee_adv", label: "JEE Advanced", icon: "🏆", color: "from-purple-600 to-indigo-500" },
    { key: "neet", label: "NEET", icon: "🩺", color: "from-emerald-600 to-teal-500" },
    { key: "bitsat", label: "BITSAT", icon: "⚡", color: "from-amber-500 to-orange-500" },
    { key: "mht_cet", label: "MHT-CET", icon: "🏛️", color: "from-rose-500 to-pink-500" },
    { key: "cuet", label: "CUET", icon: "📚", color: "from-indigo-500 to-violet-500" },
]

const CATEGORIES = ["General", "OBC-NCL", "SC", "ST", "EWS", "PwD"]

// ── JEE Main Demo Data ──
const JEE_MAIN_DATA = [
    { college: "NIT Trichy", branch: "CSE", city: "Trichy", state: "TN", closing: { General: 4521, "OBC-NCL": 7890, SC: 18500, ST: 28000, EWS: 5200, PwD: 35000 }, type: "NIT", prev: [4200, 4380, 4521] },
    { college: "NIT Warangal", branch: "CSE", city: "Warangal", state: "Telangana", closing: { General: 5100, "OBC-NCL": 8600, SC: 21000, ST: 30000, EWS: 5800, PwD: 38000 }, type: "NIT", prev: [4800, 5000, 5100] },
    { college: "NIT Surathkal", branch: "CSE", city: "Surathkal", state: "Karnataka", closing: { General: 3800, "OBC-NCL": 6500, SC: 16000, ST: 24000, EWS: 4500, PwD: 32000 }, type: "NIT", prev: [3500, 3700, 3800] },
    { college: "NIT Calicut", branch: "ECE", city: "Calicut", state: "Kerala", closing: { General: 8900, "OBC-NCL": 14200, SC: 32000, ST: 45000, EWS: 10500, PwD: 50000 }, type: "NIT", prev: [8500, 8700, 8900] },
    { college: "IIIT Hyderabad", branch: "CSE", city: "Hyderabad", state: "Telangana", closing: { General: 2100, "OBC-NCL": 3800, SC: 10000, ST: 15000, EWS: 2600, PwD: 18000 }, type: "IIIT", prev: [1950, 2000, 2100] },
    { college: "IIIT Allahabad", branch: "IT", city: "Allahabad", state: "UP", closing: { General: 6700, "OBC-NCL": 11000, SC: 25000, ST: 38000, EWS: 7800, PwD: 42000 }, type: "IIIT", prev: [6200, 6500, 6700] },
    { college: "NIT Rourkela", branch: "CSE", city: "Rourkela", state: "Odisha", closing: { General: 7200, "OBC-NCL": 12000, SC: 28000, ST: 40000, EWS: 8500, PwD: 45000 }, type: "NIT", prev: [6800, 7000, 7200] },
    { college: "MNNIT Allahabad", branch: "CSE", city: "Allahabad", state: "UP", closing: { General: 8100, "OBC-NCL": 13500, SC: 30000, ST: 42000, EWS: 9500, PwD: 48000 }, type: "NIT", prev: [7600, 7900, 8100] },
    { college: "VNIT Nagpur", branch: "CSE", city: "Nagpur", state: "Maharashtra", closing: { General: 7500, "OBC-NCL": 12500, SC: 29000, ST: 41000, EWS: 8800, PwD: 46000 }, type: "NIT", prev: [7000, 7300, 7500] },
    { college: "NIT Durgapur", branch: "Mechanical", city: "Durgapur", state: "WB", closing: { General: 28000, "OBC-NCL": 38000, SC: 60000, ST: 75000, EWS: 32000, PwD: 80000 }, type: "NIT", prev: [26000, 27000, 28000] },
    { college: "IIIT Delhi", branch: "CSE", city: "Delhi", state: "Delhi", closing: { General: 3200, "OBC-NCL": 5500, SC: 13000, ST: 18000, EWS: 3800, PwD: 22000 }, type: "IIIT", prev: [2900, 3100, 3200] },
    { college: "NIT Jaipur", branch: "EE", city: "Jaipur", state: "Rajasthan", closing: { General: 12000, "OBC-NCL": 18000, SC: 38000, ST: 52000, EWS: 14000, PwD: 55000 }, type: "NIT", prev: [11000, 11500, 12000] },
]

// ── JEE Advanced Demo Data ──
const JEE_ADV_DATA = [
    { college: "IIT Bombay", branch: "CSE", city: "Mumbai", state: "Maharashtra", closing: { General: 66, "OBC-NCL": 120, SC: 350, ST: 500, EWS: 80, PwD: 600 }, type: "IIT", prev: [60, 63, 66] },
    { college: "IIT Delhi", branch: "CSE", city: "Delhi", state: "Delhi", closing: { General: 98, "OBC-NCL": 180, SC: 420, ST: 650, EWS: 110, PwD: 750 }, type: "IIT", prev: [90, 95, 98] },
    { college: "IIT Madras", branch: "CSE", city: "Chennai", state: "TN", closing: { General: 110, "OBC-NCL": 200, SC: 450, ST: 700, EWS: 130, PwD: 800 }, type: "IIT", prev: [100, 105, 110] },
    { college: "IIT Kanpur", branch: "CSE", city: "Kanpur", state: "UP", closing: { General: 170, "OBC-NCL": 280, SC: 600, ST: 900, EWS: 200, PwD: 1000 }, type: "IIT", prev: [155, 165, 170] },
    { college: "IIT Kharagpur", branch: "CSE", city: "Kharagpur", state: "WB", closing: { General: 200, "OBC-NCL": 330, SC: 700, ST: 1050, EWS: 240, PwD: 1200 }, type: "IIT", prev: [185, 190, 200] },
    { college: "IIT Roorkee", branch: "CSE", city: "Roorkee", state: "Uttarakhand", closing: { General: 350, "OBC-NCL": 550, SC: 1100, ST: 1600, EWS: 420, PwD: 1800 }, type: "IIT", prev: [320, 340, 350] },
    { college: "IIT Guwahati", branch: "CSE", city: "Guwahati", state: "Assam", closing: { General: 400, "OBC-NCL": 620, SC: 1300, ST: 1800, EWS: 480, PwD: 2000 }, type: "IIT", prev: [370, 385, 400] },
    { college: "IIT Hyderabad", branch: "CSE", city: "Hyderabad", state: "Telangana", closing: { General: 500, "OBC-NCL": 780, SC: 1500, ST: 2200, EWS: 600, PwD: 2500 }, type: "IIT", prev: [460, 480, 500] },
    { college: "IIT BHU", branch: "ECE", city: "Varanasi", state: "UP", closing: { General: 800, "OBC-NCL": 1200, SC: 2500, ST: 3500, EWS: 950, PwD: 4000 }, type: "IIT", prev: [740, 770, 800] },
]

// ── NEET Demo Data ──
const NEET_DATA = [
    { college: "AIIMS Delhi", branch: "MBBS", city: "Delhi", state: "Delhi", closing: { General: 720, "OBC-NCL": 710, SC: 680, ST: 650, EWS: 715, PwD: 620 }, type: "AIIMS", prev: [715, 718, 720], isScore: true },
    { college: "JIPMER Puducherry", branch: "MBBS", city: "Puducherry", state: "Puducherry", closing: { General: 700, "OBC-NCL": 690, SC: 660, ST: 630, EWS: 695, PwD: 600 }, type: "JIPMER", prev: [695, 698, 700], isScore: true },
    { college: "Maulana Azad MC", branch: "MBBS", city: "Delhi", state: "Delhi", closing: { General: 690, "OBC-NCL": 680, SC: 650, ST: 620, EWS: 685, PwD: 590 }, type: "GMC", prev: [685, 688, 690], isScore: true },
    { college: "KMC Manipal", branch: "MBBS", city: "Manipal", state: "Karnataka", closing: { General: 630, "OBC-NCL": 620, SC: 580, ST: 550, EWS: 625, PwD: 520 }, type: "Private", prev: [625, 628, 630], isScore: true },
    { college: "Grant MC Mumbai", branch: "MBBS", city: "Mumbai", state: "Maharashtra", closing: { General: 680, "OBC-NCL": 670, SC: 640, ST: 610, EWS: 675, PwD: 580 }, type: "GMC", prev: [675, 678, 680], isScore: true },
    { college: "BJ MC Ahmedabad", branch: "BDS", city: "Ahmedabad", state: "Gujarat", closing: { General: 580, "OBC-NCL": 560, SC: 520, ST: 490, EWS: 575, PwD: 460 }, type: "GMC", prev: [575, 578, 580], isScore: true },
    { college: "CMC Vellore", branch: "MBBS", city: "Vellore", state: "TN", closing: { General: 660, "OBC-NCL": 650, SC: 620, ST: 590, EWS: 655, PwD: 560 }, type: "Private", prev: [655, 658, 660], isScore: true },
    { college: "Osmania MC", branch: "MBBS", city: "Hyderabad", state: "Telangana", closing: { General: 650, "OBC-NCL": 640, SC: 600, ST: 570, EWS: 645, PwD: 540 }, type: "GMC", prev: [645, 648, 650], isScore: true },
]

// ── BITSAT Demo Data ──
const BITSAT_DATA = [
    { college: "BITS Pilani", branch: "CSE", city: "Pilani", state: "Rajasthan", closing: { General: 360, "OBC-NCL": 360, SC: 360, ST: 360, EWS: 360, PwD: 340 }, type: "BITS", prev: [350, 355, 360], isScore: true },
    { college: "BITS Pilani", branch: "ECE", city: "Pilani", state: "Rajasthan", closing: { General: 340, "OBC-NCL": 340, SC: 340, ST: 340, EWS: 340, PwD: 320 }, type: "BITS", prev: [330, 335, 340], isScore: true },
    { college: "BITS Goa", branch: "CSE", city: "Goa", state: "Goa", closing: { General: 330, "OBC-NCL": 330, SC: 330, ST: 330, EWS: 330, PwD: 310 }, type: "BITS", prev: [320, 325, 330], isScore: true },
    { college: "BITS Hyderabad", branch: "CSE", city: "Hyderabad", state: "Telangana", closing: { General: 310, "OBC-NCL": 310, SC: 310, ST: 310, EWS: 310, PwD: 290 }, type: "BITS", prev: [300, 305, 310], isScore: true },
    { college: "BITS Hyderabad", branch: "Mechanical", city: "Hyderabad", state: "Telangana", closing: { General: 260, "OBC-NCL": 260, SC: 260, ST: 260, EWS: 260, PwD: 240 }, type: "BITS", prev: [250, 255, 260], isScore: true },
]

// ── MHT-CET Demo Data ──
const MHT_CET_DATA = [
    { college: "COEP Pune", branch: "CSE", city: "Pune", state: "Maharashtra", closing: { General: 99.2, "OBC-NCL": 97.5, SC: 90.0, ST: 85.0, EWS: 98.5, PwD: 80.0 }, type: "Govt", prev: [98.8, 99.0, 99.2], isPercentile: true },
    { college: "VJTI Mumbai", branch: "CSE", city: "Mumbai", state: "Maharashtra", closing: { General: 99.0, "OBC-NCL": 97.0, SC: 88.0, ST: 83.0, EWS: 98.0, PwD: 78.0 }, type: "Govt", prev: [98.5, 98.8, 99.0], isPercentile: true },
    { college: "PICT Pune", branch: "CSE", city: "Pune", state: "Maharashtra", closing: { General: 96.5, "OBC-NCL": 93.0, SC: 82.0, ST: 76.0, EWS: 95.5, PwD: 70.0 }, type: "Private", prev: [95.8, 96.2, 96.5], isPercentile: true },
    { college: "WCE Sangli", branch: "CSE", city: "Sangli", state: "Maharashtra", closing: { General: 94.0, "OBC-NCL": 90.0, SC: 78.0, ST: 72.0, EWS: 93.0, PwD: 66.0 }, type: "Govt", prev: [93.0, 93.5, 94.0], isPercentile: true },
    { college: "DJ Sanghvi Mumbai", branch: "IT", city: "Mumbai", state: "Maharashtra", closing: { General: 95.5, "OBC-NCL": 92.0, SC: 80.0, ST: 74.0, EWS: 94.5, PwD: 68.0 }, type: "Private", prev: [94.5, 95.0, 95.5], isPercentile: true },
]

// ── CUET Demo Data ──
const CUET_DATA = [
    { college: "Delhi University", branch: "B.Com (Hons)", city: "Delhi", state: "Delhi", closing: { General: 750, "OBC-NCL": 720, SC: 650, ST: 600, EWS: 740, PwD: 550 }, type: "Central", prev: [740, 745, 750], isScore: true },
    { college: "JNU", branch: "BA (Hons) Economics", city: "Delhi", state: "Delhi", closing: { General: 700, "OBC-NCL": 670, SC: 600, ST: 550, EWS: 690, PwD: 500 }, type: "Central", prev: [690, 695, 700], isScore: true },
    { college: "BHU", branch: "B.Sc", city: "Varanasi", state: "UP", closing: { General: 650, "OBC-NCL": 620, SC: 550, ST: 500, EWS: 640, PwD: 450 }, type: "Central", prev: [640, 645, 650], isScore: true },
    { college: "Jamia Millia Islamia", branch: "BA (Hons) English", city: "Delhi", state: "Delhi", closing: { General: 620, "OBC-NCL": 590, SC: 520, ST: 470, EWS: 610, PwD: 420 }, type: "Central", prev: [610, 615, 620], isScore: true },
]

const EXAM_DATA_MAP = {
    jee_main: JEE_MAIN_DATA,
    jee_adv: JEE_ADV_DATA,
    neet: NEET_DATA,
    bitsat: BITSAT_DATA,
    mht_cet: MHT_CET_DATA,
    cuet: CUET_DATA,
}

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

/* ═══════════════════════════════════════════════════════
   CutoffPredictor Component
   ═══════════════════════════════════════════════════════ */

export default function CutoffPredictor() {
    const [selectedExam, setSelectedExam] = useState("jee_main")
    const [rank, setRank] = useState("")
    const [category, setCategory] = useState("General")
    const [branchFilter, setBranchFilter] = useState("")
    const [showResults, setShowResults] = useState(false)

    const exam = EXAMS.find(e => e.key === selectedExam)
    const data = EXAM_DATA_MAP[selectedExam] || []
    const isScoreBased = data[0]?.isScore || false
    const isPercentile = data[0]?.isPercentile || false

    const inputLabel = isPercentile ? "Your Percentile" : isScoreBased ? "Your Score" : "Your Rank"
    const inputPlaceholder = isPercentile ? "e.g. 97.5" : isScoreBased ? "e.g. 650" : "e.g. 5000"

    // Get unique branches for filter
    const branches = useMemo(() => [...new Set(data.map(d => d.branch))], [data])

    // Predict chances
    const results = useMemo(() => {
        if (!rank) return []
        const userVal = parseFloat(rank)
        if (isNaN(userVal)) return []

        return data
            .filter(d => !branchFilter || d.branch === branchFilter)
            .map(d => {
                const cutoff = d.closing[category] || d.closing.General
                let chance, chanceColor, chancePercent

                if (isScoreBased || isPercentile) {
                    // Higher score = better
                    const ratio = userVal / cutoff
                    if (ratio >= 1.0) { chance = "Safe"; chanceColor = "emerald"; chancePercent = Math.min(95, 60 + ratio * 30) }
                    else if (ratio >= 0.92) { chance = "Moderate"; chanceColor = "amber"; chancePercent = 35 + ratio * 25 }
                    else { chance = "Reach"; chanceColor = "rose"; chancePercent = Math.max(5, ratio * 30) }
                } else {
                    // Lower rank = better
                    const ratio = userVal / cutoff
                    if (ratio <= 0.7) { chance = "Safe"; chanceColor = "emerald"; chancePercent = Math.min(95, 90 - ratio * 40) }
                    else if (ratio <= 1.0) { chance = "Moderate"; chanceColor = "amber"; chancePercent = 60 - ratio * 20 }
                    else { chance = "Reach"; chanceColor = "rose"; chancePercent = Math.max(5, 30 - (ratio - 1) * 20) }
                }

                return { ...d, cutoff, chance, chanceColor, chancePercent: Math.round(chancePercent) }
            })
            .sort((a, b) => {
                const order = { Safe: 0, Moderate: 1, Reach: 2 }
                return order[a.chance] - order[b.chance]
            })
    }, [rank, category, data, branchFilter, isScoreBased, isPercentile])

    const safeCount = results.filter(r => r.chance === "Safe").length
    const modCount = results.filter(r => r.chance === "Moderate").length
    const reachCount = results.filter(r => r.chance === "Reach").length

    return (
        <div className="space-y-8 md:space-y-12">
            {/* ═══ HERO ═══ */}
            <motion.section {...fadeUp(0)} className="relative overflow-hidden rounded-[32px] hero-gradient px-8 py-10 text-white md:px-12 md:py-16">
                <ParticleField count={30} color="rgba(255,255,255,0.5)" lineColor="rgba(255,255,255,0.1)" maxDist={90} />
                <div className="orb orb-purple w-40 h-40 -top-10 -right-10" />
                <div className="orb orb-blue w-32 h-32 bottom-0 left-10" />
                <div className="relative z-10">
                    <SlideIn direction="down" delay={0.1}>
                        <span className="pill pill-glass text-xs mb-3">🎯 Exam-Specific Predictions</span>
                    </SlideIn>
                    <h1 className="text-display text-3xl md:text-5xl mt-3">Cutoff Predictor</h1>
                    <p className="mt-3 text-indigo-100/80 max-w-lg text-sm md:text-base">
                        Check your admission chances across India's top institutions.
                        Select your exam, enter your rank or score, and see your chances instantly.
                    </p>
                </div>
            </motion.section>

            {/* ═══ EXAM TABS ═══ */}
            <motion.section {...fadeUp(0.1)}>
                <h2 className="text-section text-lg md:text-xl text-slate-900 mb-4 flex items-center gap-2">
                    <GraduationCap size={20} className="text-indigo-600" /> Select Your Exam
                </h2>
                <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                    {EXAMS.map((e, i) => (
                        <motion.button
                            key={e.key}
                            type="button"
                            onClick={() => { setSelectedExam(e.key); setShowResults(false); setRank(""); setBranchFilter("") }}
                            className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-4 text-sm font-semibold transition-all duration-300 ${selectedExam === e.key
                                    ? "border-indigo-400 bg-indigo-50 text-indigo-700 shadow-lg shadow-indigo-100 scale-[1.03]"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/50"
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <span className="text-2xl">{e.icon}</span>
                            <span className="text-xs md:text-sm">{e.label}</span>
                            {selectedExam === e.key && (
                                <motion.div
                                    layoutId="exam-indicator"
                                    className="absolute -bottom-0.5 left-1/4 right-1/4 h-1 rounded-full bg-indigo-500"
                                />
                            )}
                        </motion.button>
                    ))}
                </div>
            </motion.section>

            {/* ═══ INPUT FORM ═══ */}
            <motion.section {...fadeUp(0.15)} className="card-bb p-6 md:p-8 max-w-2xl mx-auto gradient-border">
                <div className="bg-white rounded-[22px] p-6 md:p-8 relative z-10">
                    <h3 className="text-card-title text-lg mb-5 flex items-center gap-2">
                        <span className="text-2xl">{exam?.icon}</span> {exam?.label} — Enter Details
                    </h3>

                    <div className="space-y-4">
                        {/* Rank / Score input */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
                                {inputLabel}
                            </label>
                            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                                <Target size={16} className="text-slate-400" />
                                <input
                                    type="number"
                                    step={isPercentile ? "0.1" : "1"}
                                    placeholder={inputPlaceholder}
                                    value={rank}
                                    onChange={e => setRank(e.target.value)}
                                    className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Category + Branch filters */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Category</label>
                                <div className="relative">
                                    <select
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Branch</label>
                                <div className="relative">
                                    <select
                                        value={branchFilter}
                                        onChange={e => setBranchFilter(e.target.value)}
                                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                    >
                                        <option value="">All Branches</option>
                                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="button"
                            onClick={() => rank && setShowResults(true)}
                            disabled={!rank}
                            className={`btn-ripple w-full rounded-full bg-gradient-to-r ${exam?.color || "from-indigo-600 to-purple-600"} px-6 py-3.5 text-base font-semibold text-white shadow-lg transition hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2`}
                        >
                            <BarChart3 size={18} />
                            Predict My Chances
                        </button>
                    </div>
                </div>
            </motion.section>

            {/* ═══ RESULTS ═══ */}
            <AnimatePresence>
                {showResults && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Summary badges */}
                        <div className="flex flex-wrap gap-3 justify-center">
                            <ChanceBadge label="Safe" count={safeCount} color="emerald" emoji="✅" />
                            <ChanceBadge label="Moderate" count={modCount} color="amber" emoji="⚠️" />
                            <ChanceBadge label="Reach" count={reachCount} color="rose" emoji="🎯" />
                        </div>

                        {/* Result cards */}
                        <StaggerContainer stagger={0.06} className="grid gap-4 md:grid-cols-2">
                            {results.map((r, i) => (
                                <StaggerItem key={`${r.college}-${r.branch}-${i}`}>
                                    <MagneticCard intensity={0.03} className="h-full">
                                        <div className="card-bb p-5 h-full shimmer-hover">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-card-title text-sm truncate">{r.college}</h4>
                                                    <p className="text-xs text-slate-500 mt-0.5">{r.branch} · {r.city}, {r.state}</p>
                                                </div>
                                                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide bg-${r.chanceColor}-100 text-${r.chanceColor}-700 border border-${r.chanceColor}-200`}>
                                                    {r.chance}
                                                </span>
                                            </div>

                                            {/* Chance meter */}
                                            <div className="mb-3">
                                                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                                    <span>Admission probability</span>
                                                    <span className={`font-bold text-${r.chanceColor}-600`}>{r.chancePercent}%</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${r.chancePercent}%` }}
                                                        transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                                                        className={`h-full rounded-full bg-gradient-to-r ${r.chanceColor === "emerald" ? "from-emerald-400 to-emerald-600"
                                                                : r.chanceColor === "amber" ? "from-amber-400 to-amber-600"
                                                                    : "from-rose-400 to-rose-600"
                                                            }`}
                                                    />
                                                </div>
                                            </div>

                                            {/* Cutoff + trend */}
                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div className="rounded-xl bg-slate-50 px-3 py-2">
                                                    <p className="text-slate-400">{isPercentile ? "Cutoff %ile" : isScoreBased ? "Cutoff Score" : "Closing Rank"}</p>
                                                    <p className="font-bold text-slate-800 text-sm mt-0.5">
                                                        {isPercentile ? r.cutoff.toFixed(1) : r.cutoff.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl bg-slate-50 px-3 py-2">
                                                    <p className="text-slate-400 flex items-center gap-1">
                                                        <TrendingUp size={10} /> 3yr trend
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        {r.prev?.map((v, j) => (
                                                            <span key={j} className="text-[10px] text-slate-500">
                                                                {isPercentile ? v.toFixed(1) : v.toLocaleString()}
                                                                {j < r.prev.length - 1 && <span className="text-slate-300 mx-0.5">→</span>}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-2 pt-2 border-t border-slate-100">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${r.type === "IIT" || r.type === "AIIMS" ? "bg-purple-100 text-purple-700" :
                                                        r.type === "NIT" || r.type === "GMC" ? "bg-blue-100 text-blue-700" :
                                                            r.type === "IIIT" || r.type === "BITS" ? "bg-teal-100 text-teal-700" :
                                                                "bg-slate-100 text-slate-600"
                                                    }`}>
                                                    {r.type}
                                                </span>
                                            </div>
                                        </div>
                                    </MagneticCard>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </motion.div>
                )}
            </AnimatePresence>

            {showResults && results.length === 0 && (
                <motion.p {...fadeUp(0)} className="text-center text-slate-500 py-8">
                    No matching colleges found for this criteria. Try adjusting your filters.
                </motion.p>
            )}
        </div>
    )
}

function ChanceBadge({ label, count, color, emoji }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 bg-${color}-50 border-${color}-200`}
        >
            <span className="text-lg">{emoji}</span>
            <div>
                <p className={`text-lg font-bold text-${color}-700`}>
                    <AnimatedCounter value={count} duration={0.8} />
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
            </div>
        </motion.div>
    )
}
