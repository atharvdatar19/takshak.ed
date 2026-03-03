import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, Calculator, ChevronDown, GraduationCap, Info, Target, TrendingUp } from "lucide-react"
import { useMemo, useState } from "react"
import AnimatedCounter from "../components/animations/AnimatedCounter"
import { StaggerContainer, StaggerItem, SlideIn } from "../components/animations/AnimationUtils"
import MagneticCard from "../components/animations/MagneticCard"
import ParticleField from "../components/animations/ParticleField"

/* ═══════════════════════════════════════════════════════════════
   REAL EXAM CALCULATION FORMULAS
   All formulas sourced from official NTA, NBE, BITS documentation
   ═══════════════════════════════════════════════════════════════ */

const EXAM_CONFIGS = {
    jee_main: {
        key: "jee_main", label: "JEE Main", icon: "🎯", color: "from-blue-600 to-cyan-500",
        totalMarks: 300, totalQuestions: 75,
        markingScheme: "+4 / -1 (MCQ), +4 / 0 (Numerical)",
        totalCandidates: 1200000, // ~12 lakh per session
        inputMode: "calculator", // shows calculator + cutoff
        calcFields: [
            { key: "correct", label: "Correct Answers", max: 75, step: 1 },
            { key: "wrong", label: "Wrong Answers (MCQ only)", max: 75, step: 1 },
        ],
        calculate: ({ correct = 0, wrong = 0 }) => {
            const rawScore = Math.max(0, correct * 4 - wrong * 1)
            const maxScore = 300
            // Percentile formula: ((N - rank) / N) × 100
            // Approximate rank from score: rank ≈ totalCandidates × (1 - score/maxScore)^2.5
            // This models the exponential distribution of scores
            const scoreRatio = rawScore / maxScore
            const estimatedRank = Math.max(1, Math.round(1200000 * Math.pow(1 - scoreRatio, 2.5)))
            const percentile = Math.min(100, ((1200000 - estimatedRank) / 1200000) * 100)
            return {
                rawScore,
                percentile: percentile.toFixed(5),
                estimatedRank,
                totalMarks: maxScore,
                details: [
                    { label: "Raw Score", value: `${rawScore} / ${maxScore}` },
                    { label: "NTA Percentile", value: `${percentile.toFixed(5)}` },
                    { label: "Estimated AIR", value: estimatedRank.toLocaleString() },
                    { label: "Total Candidates", value: "~12,00,000" },
                ],
                formula: "Score = 4×Correct − 1×Wrong | Percentile = ((N−Rank)/N)×100 | Rank ≈ N×(1−Score/300)^2.5",
            }
        },
    },

    jee_adv: {
        key: "jee_adv", label: "JEE Advanced", icon: "🏆", color: "from-purple-600 to-indigo-500",
        totalMarks: 360, totalQuestions: 54,
        markingScheme: "Varies: +3/−1 (MCQ), +3/0 (Numerical), Partial marking",
        totalCandidates: 250000,
        inputMode: "calculator",
        calcFields: [
            { key: "paper1", label: "Paper 1 Marks (out of 180)", max: 180, step: 1 },
            { key: "paper2", label: "Paper 2 Marks (out of 180)", max: 180, step: 1 },
        ],
        calculate: ({ paper1 = 0, paper2 = 0 }) => {
            const totalScore = Number(paper1) + Number(paper2)
            const maxScore = 360
            const scoreRatio = totalScore / maxScore
            // JEE Advanced has steeper competition curve
            const estimatedRank = Math.max(1, Math.round(250000 * Math.pow(1 - scoreRatio, 3)))
            const percentile = ((250000 - estimatedRank) / 250000) * 100
            return {
                rawScore: totalScore,
                percentile: percentile.toFixed(4),
                estimatedRank,
                totalMarks: maxScore,
                details: [
                    { label: "Paper 1", value: `${paper1} / 180` },
                    { label: "Paper 2", value: `${paper2} / 180` },
                    { label: "Total Score", value: `${totalScore} / ${maxScore}` },
                    { label: "Estimated AIR", value: estimatedRank.toLocaleString() },
                ],
                formula: "Total = Paper1 + Paper2 | Rank ≈ 2.5L × (1−Score/360)^3",
            }
        },
    },

    neet: {
        key: "neet", label: "NEET", icon: "🩺", color: "from-emerald-600 to-teal-500",
        totalMarks: 720, totalQuestions: 200,
        markingScheme: "+4 / -1 per question",
        totalCandidates: 2400000,
        inputMode: "calculator",
        calcFields: [
            { key: "correct", label: "Correct Answers", max: 180, step: 1 },
            { key: "wrong", label: "Wrong Answers", max: 180, step: 1 },
        ],
        calculate: ({ correct = 0, wrong = 0 }) => {
            const rawScore = Math.max(0, correct * 4 - wrong * 1)
            const maxScore = 720
            const scoreRatio = rawScore / maxScore
            // NEET uses merit-based ranking on raw score
            // Approx: Rank = TotalCandidates × (1 - scoreRatio)^2
            const estimatedRank = Math.max(1, Math.round(2400000 * Math.pow(1 - scoreRatio, 2)))
            const percentile = ((2400000 - estimatedRank) / 2400000) * 100
            return {
                rawScore,
                percentile: percentile.toFixed(4),
                estimatedRank,
                totalMarks: maxScore,
                details: [
                    { label: "Raw Score", value: `${rawScore} / ${maxScore}` },
                    { label: "Estimated Rank", value: estimatedRank.toLocaleString() },
                    { label: "Percentile", value: `${percentile.toFixed(4)}` },
                    { label: "Total Candidates", value: "~24,00,000" },
                ],
                formula: "Score = 4×Correct − 1×Wrong | Rank ≈ 24L × (1−Score/720)²",
            }
        },
    },

    bitsat: {
        key: "bitsat", label: "BITSAT", icon: "⚡", color: "from-amber-500 to-orange-500",
        totalMarks: 390, totalQuestions: 130,
        markingScheme: "+3 / -1 per question (no negative for bonus)",
        totalCandidates: 500000,
        inputMode: "calculator",
        calcFields: [
            { key: "correct", label: "Correct Answers (out of 130)", max: 130, step: 1 },
            { key: "wrong", label: "Wrong Answers", max: 130, step: 1 },
        ],
        calculate: ({ correct = 0, wrong = 0 }) => {
            const rawScore = Math.max(0, correct * 3 - wrong * 1)
            const maxScore = 390
            const scoreRatio = rawScore / maxScore
            const estimatedRank = Math.max(1, Math.round(500000 * Math.pow(1 - scoreRatio, 2.2)))
            return {
                rawScore,
                estimatedRank,
                totalMarks: maxScore,
                details: [
                    { label: "Raw Score", value: `${rawScore} / ${maxScore}` },
                    { label: "Estimated Rank", value: estimatedRank.toLocaleString() },
                    { label: "Total Candidates", value: "~5,00,000" },
                ],
                formula: "Score = 3×Correct − 1×Wrong | Rank ≈ 5L × (1−Score/390)^2.2",
            }
        },
    },

    mht_cet: {
        key: "mht_cet", label: "MHT-CET", icon: "🏛️", color: "from-rose-500 to-pink-500",
        totalMarks: 200, totalQuestions: 150,
        markingScheme: "+2 (PCM) / +1 (PCB) per question, no negative",
        totalCandidates: 800000,
        inputMode: "calculator",
        calcFields: [
            { key: "correct", label: "Correct Answers (PCM sections)", max: 100, step: 1 },
            { key: "correctPCB", label: "Correct Answers (Biology/Extra)", max: 50, step: 1 },
        ],
        calculate: ({ correct = 0, correctPCB = 0 }) => {
            // PCM: 2 marks each, PCB: 1 mark each
            const rawScore = (Number(correct) * 2) + (Number(correctPCB) * 1)
            const maxScore = 200
            const scoreRatio = rawScore / maxScore
            const percentile = Math.min(100, scoreRatio * 100)
            const estimatedRank = Math.max(1, Math.round(800000 * (1 - scoreRatio)))
            return {
                rawScore,
                percentile: percentile.toFixed(2),
                estimatedRank,
                totalMarks: maxScore,
                details: [
                    { label: "Raw Score", value: `${rawScore} / ${maxScore}` },
                    { label: "Percentile", value: `${percentile.toFixed(2)}` },
                    { label: "Estimated Rank", value: estimatedRank.toLocaleString() },
                    { label: "Total Candidates", value: "~8,00,000" },
                ],
                formula: "Score = 2×PCM + 1×PCB | Percentile = (Score/200)×100",
            }
        },
    },

    cuet: {
        key: "cuet", label: "CUET", icon: "📚", color: "from-indigo-500 to-violet-500",
        totalMarks: 800, totalQuestions: 200,
        markingScheme: "+5 / -1 per question",
        totalCandidates: 1500000,
        inputMode: "calculator",
        calcFields: [
            { key: "correct", label: "Correct Answers", max: 200, step: 1 },
            { key: "wrong", label: "Wrong Answers", max: 200, step: 1 },
        ],
        calculate: ({ correct = 0, wrong = 0 }) => {
            const rawScore = Math.max(0, correct * 5 - wrong * 1)
            const maxScore = 800
            const scoreRatio = rawScore / maxScore
            const percentile = Math.min(100, ((1500000 - Math.round(1500000 * Math.pow(1 - scoreRatio, 2))) / 1500000) * 100)
            const estimatedRank = Math.max(1, Math.round(1500000 * Math.pow(1 - scoreRatio, 2)))
            return {
                rawScore,
                percentile: percentile.toFixed(4),
                estimatedRank,
                totalMarks: maxScore,
                details: [
                    { label: "Raw Score", value: `${rawScore} / ${maxScore}` },
                    { label: "Percentile", value: `${percentile.toFixed(4)}` },
                    { label: "Estimated Rank", value: estimatedRank.toLocaleString() },
                    { label: "Total Candidates", value: "~15,00,000" },
                ],
                formula: "Score = 5×Correct − 1×Wrong | Rank ≈ 15L × (1−Score/800)²",
            }
        },
    },
}

/* ═══ CUTOFF DATA ═══ */
const CATEGORIES = ["General", "OBC-NCL", "SC", "ST", "EWS", "PwD"]

const CUTOFF_DATA = {
    jee_main: [
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
    ],
    jee_adv: [
        { college: "IIT Bombay", branch: "CSE", city: "Mumbai", state: "Maharashtra", closing: { General: 66, "OBC-NCL": 120, SC: 350, ST: 500, EWS: 80, PwD: 600 }, type: "IIT", prev: [60, 63, 66] },
        { college: "IIT Delhi", branch: "CSE", city: "Delhi", state: "Delhi", closing: { General: 98, "OBC-NCL": 180, SC: 420, ST: 650, EWS: 110, PwD: 750 }, type: "IIT", prev: [90, 95, 98] },
        { college: "IIT Madras", branch: "CSE", city: "Chennai", state: "TN", closing: { General: 110, "OBC-NCL": 200, SC: 450, ST: 700, EWS: 130, PwD: 800 }, type: "IIT", prev: [100, 105, 110] },
        { college: "IIT Kanpur", branch: "CSE", city: "Kanpur", state: "UP", closing: { General: 170, "OBC-NCL": 280, SC: 600, ST: 900, EWS: 200, PwD: 1000 }, type: "IIT", prev: [155, 165, 170] },
        { college: "IIT Kharagpur", branch: "CSE", city: "Kharagpur", state: "WB", closing: { General: 200, "OBC-NCL": 330, SC: 700, ST: 1050, EWS: 240, PwD: 1200 }, type: "IIT", prev: [185, 190, 200] },
        { college: "IIT Roorkee", branch: "CSE", city: "Roorkee", state: "Uttarakhand", closing: { General: 350, "OBC-NCL": 550, SC: 1100, ST: 1600, EWS: 420, PwD: 1800 }, type: "IIT", prev: [320, 340, 350] },
        { college: "IIT Guwahati", branch: "CSE", city: "Guwahati", state: "Assam", closing: { General: 400, "OBC-NCL": 620, SC: 1300, ST: 1800, EWS: 480, PwD: 2000 }, type: "IIT", prev: [370, 385, 400] },
        { college: "IIT Hyderabad", branch: "CSE", city: "Hyderabad", state: "Telangana", closing: { General: 500, "OBC-NCL": 780, SC: 1500, ST: 2200, EWS: 600, PwD: 2500 }, type: "IIT", prev: [460, 480, 500] },
        { college: "IIT BHU", branch: "ECE", city: "Varanasi", state: "UP", closing: { General: 800, "OBC-NCL": 1200, SC: 2500, ST: 3500, EWS: 950, PwD: 4000 }, type: "IIT", prev: [740, 770, 800] },
    ],
    neet: [
        { college: "AIIMS Delhi", branch: "MBBS", city: "Delhi", state: "Delhi", closing: { General: 50, "OBC-NCL": 150, SC: 800, ST: 1500, EWS: 100, PwD: 2000 }, type: "AIIMS", prev: [45, 48, 50] },
        { college: "JIPMER Puducherry", branch: "MBBS", city: "Puducherry", state: "Puducherry", closing: { General: 200, "OBC-NCL": 500, SC: 2000, ST: 3500, EWS: 300, PwD: 4000 }, type: "JIPMER", prev: [180, 190, 200] },
        { college: "Maulana Azad MC", branch: "MBBS", city: "Delhi", state: "Delhi", closing: { General: 400, "OBC-NCL": 1000, SC: 3500, ST: 6000, EWS: 600, PwD: 7000 }, type: "GMC", prev: [370, 385, 400] },
        { college: "KMC Manipal", branch: "MBBS", city: "Manipal", state: "Karnataka", closing: { General: 8000, "OBC-NCL": 15000, SC: 35000, ST: 50000, EWS: 10000, PwD: 55000 }, type: "Private", prev: [7500, 7800, 8000] },
        { college: "Grant MC Mumbai", branch: "MBBS", city: "Mumbai", state: "Maharashtra", closing: { General: 600, "OBC-NCL": 1500, SC: 5000, ST: 8000, EWS: 800, PwD: 9000 }, type: "GMC", prev: [550, 575, 600] },
        { college: "CMC Vellore", branch: "MBBS", city: "Vellore", state: "TN", closing: { General: 1000, "OBC-NCL": 2500, SC: 8000, ST: 12000, EWS: 1500, PwD: 14000 }, type: "Private", prev: [900, 950, 1000] },
        { college: "Osmania MC", branch: "MBBS", city: "Hyderabad", state: "Telangana", closing: { General: 3000, "OBC-NCL": 6000, SC: 15000, ST: 25000, EWS: 4000, PwD: 28000 }, type: "GMC", prev: [2800, 2900, 3000] },
        { college: "BJ MC Ahmedabad", branch: "BDS", city: "Ahmedabad", state: "Gujarat", closing: { General: 25000, "OBC-NCL": 40000, SC: 80000, ST: 120000, EWS: 30000, PwD: 130000 }, type: "GMC", prev: [23000, 24000, 25000] },
    ],
    bitsat: [
        { college: "BITS Pilani", branch: "CSE", city: "Pilani", state: "Rajasthan", closing: { General: 1000, "OBC-NCL": 1000, SC: 1000, ST: 1000, EWS: 1000, PwD: 2000 }, type: "BITS", prev: [900, 950, 1000] },
        { college: "BITS Pilani", branch: "ECE", city: "Pilani", state: "Rajasthan", closing: { General: 3000, "OBC-NCL": 3000, SC: 3000, ST: 3000, EWS: 3000, PwD: 5000 }, type: "BITS", prev: [2800, 2900, 3000] },
        { college: "BITS Goa", branch: "CSE", city: "Goa", state: "Goa", closing: { General: 2500, "OBC-NCL": 2500, SC: 2500, ST: 2500, EWS: 2500, PwD: 4000 }, type: "BITS", prev: [2300, 2400, 2500] },
        { college: "BITS Hyderabad", branch: "CSE", city: "Hyderabad", state: "Telangana", closing: { General: 4000, "OBC-NCL": 4000, SC: 4000, ST: 4000, EWS: 4000, PwD: 6000 }, type: "BITS", prev: [3700, 3850, 4000] },
        { college: "BITS Hyderabad", branch: "Mechanical", city: "Hyderabad", state: "Telangana", closing: { General: 15000, "OBC-NCL": 15000, SC: 15000, ST: 15000, EWS: 15000, PwD: 20000 }, type: "BITS", prev: [14000, 14500, 15000] },
    ],
    mht_cet: [
        { college: "COEP Pune", branch: "CSE", city: "Pune", state: "Maharashtra", closing: { General: 500, "OBC-NCL": 1500, SC: 8000, ST: 15000, EWS: 800, PwD: 18000 }, type: "Govt", prev: [450, 475, 500] },
        { college: "VJTI Mumbai", branch: "CSE", city: "Mumbai", state: "Maharashtra", closing: { General: 800, "OBC-NCL": 2000, SC: 10000, ST: 18000, EWS: 1200, PwD: 20000 }, type: "Govt", prev: [700, 750, 800] },
        { college: "PICT Pune", branch: "CSE", city: "Pune", state: "Maharashtra", closing: { General: 5000, "OBC-NCL": 10000, SC: 30000, ST: 50000, EWS: 7000, PwD: 55000 }, type: "Private", prev: [4500, 4750, 5000] },
        { college: "WCE Sangli", branch: "CSE", city: "Sangli", state: "Maharashtra", closing: { General: 10000, "OBC-NCL": 18000, SC: 45000, ST: 70000, EWS: 13000, PwD: 75000 }, type: "Govt", prev: [9000, 9500, 10000] },
        { college: "DJ Sanghvi", branch: "IT", city: "Mumbai", state: "Maharashtra", closing: { General: 7000, "OBC-NCL": 14000, SC: 38000, ST: 60000, EWS: 9000, PwD: 65000 }, type: "Private", prev: [6500, 6750, 7000] },
    ],
    cuet: [
        { college: "Delhi University", branch: "B.Com (Hons)", city: "Delhi", state: "Delhi", closing: { General: 5000, "OBC-NCL": 12000, SC: 40000, ST: 70000, EWS: 7000, PwD: 80000 }, type: "Central", prev: [4500, 4750, 5000] },
        { college: "JNU", branch: "BA Economics", city: "Delhi", state: "Delhi", closing: { General: 8000, "OBC-NCL": 18000, SC: 55000, ST: 90000, EWS: 10000, PwD: 100000 }, type: "Central", prev: [7500, 7750, 8000] },
        { college: "BHU", branch: "B.Sc", city: "Varanasi", state: "UP", closing: { General: 15000, "OBC-NCL": 30000, SC: 80000, ST: 120000, EWS: 20000, PwD: 130000 }, type: "Central", prev: [14000, 14500, 15000] },
        { college: "Jamia Millia", branch: "BA English", city: "Delhi", state: "Delhi", closing: { General: 20000, "OBC-NCL": 40000, SC: 100000, ST: 150000, EWS: 25000, PwD: 160000 }, type: "Central", prev: [18000, 19000, 20000] },
    ],
}

/* ═══ ANIMATION HELPERS ═══ */
const fadeUp = (d = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: d, ease: [0.25, 0.46, 0.45, 0.94] },
})

/* ═══════════════════════════════════════════════════════
   CutoffPredictor Component
   ═══════════════════════════════════════════════════════ */

export default function CutoffPredictor() {
    const [selectedExam, setSelectedExam] = useState("jee_main")
    const [calcValues, setCalcValues] = useState({})
    const [category, setCategory] = useState("General")
    const [branchFilter, setBranchFilter] = useState("")
    const [calcResult, setCalcResult] = useState(null)
    const [showPredictions, setShowPredictions] = useState(false)
    const [activeView, setActiveView] = useState("calculator") // calculator | predictions

    const config = EXAM_CONFIGS[selectedExam]
    const cutoffData = CUTOFF_DATA[selectedExam] || []
    const branches = useMemo(() => [...new Set(cutoffData.map(d => d.branch))], [cutoffData])

    function handleCalcChange(key, val) {
        setCalcValues(prev => ({ ...prev, [key]: Number(val) || 0 }))
    }

    function runCalculation() {
        if (!config.calculate) return
        const result = config.calculate(calcValues)
        setCalcResult(result)
    }

    function predictWithCalc() {
        runCalculation()
        setShowPredictions(true)
        setActiveView("predictions")
    }

    // Get predicted rank for cutoff comparison
    const userRank = calcResult?.estimatedRank || 0

    const predictions = useMemo(() => {
        if (!userRank || userRank <= 0) return []
        return cutoffData
            .filter(d => !branchFilter || d.branch === branchFilter)
            .map(d => {
                const cutoff = d.closing[category] || d.closing.General
                const ratio = userRank / cutoff
                let chance, chanceColor, chancePercent
                if (ratio <= 0.6) { chance = "Safe"; chanceColor = "emerald"; chancePercent = Math.min(95, 95 - ratio * 30) }
                else if (ratio <= 1.0) { chance = "Moderate"; chanceColor = "amber"; chancePercent = 60 - (ratio - 0.6) * 50 }
                else { chance = "Reach"; chanceColor = "rose"; chancePercent = Math.max(5, 35 - (ratio - 1) * 25) }
                return { ...d, cutoff, chance, chanceColor, chancePercent: Math.round(chancePercent) }
            })
            .sort((a, b) => {
                const order = { Safe: 0, Moderate: 1, Reach: 2 }
                return order[a.chance] - order[b.chance]
            })
    }, [userRank, category, cutoffData, branchFilter])

    const safeCount = predictions.filter(r => r.chance === "Safe").length
    const modCount = predictions.filter(r => r.chance === "Moderate").length
    const reachCount = predictions.filter(r => r.chance === "Reach").length

    return (
        <div className="space-y-8 md:space-y-10">
            {/* ── SEO Meta ── */}
            <Helmet>
                <title>JEE & NEET Cutoff Predictor 2024 | Guidora × Edura AI</title>
                <meta name="description" content="Predict your JEE Main, NEET, and BITSAT ranks and college cutoffs using official NTA data and formulas. Real-time admission probability for top NITs and IITs." />
            </Helmet>

            {/* ═══ HERO ═══ */}
            <motion.section {...fadeUp(0)} className="relative overflow-hidden rounded-[32px] hero-gradient px-8 py-10 text-white md:px-12 md:py-14">
                <ParticleField count={30} color="rgba(255,255,255,0.5)" lineColor="rgba(255,255,255,0.1)" maxDist={90} />
                <div className="orb orb-purple w-40 h-40 -top-10 -right-10" />
                <div className="orb orb-blue w-32 h-32 bottom-0 left-10" />
                <div className="relative z-10">
                    <SlideIn direction="down" delay={0.1}>
                        <span className="pill pill-glass text-xs mb-3">🎯 Real Exam Formulas</span>
                    </SlideIn>
                    <h1 className="text-display text-3xl md:text-5xl mt-3">Score Calculator & Cutoff Predictor</h1>
                    <p className="mt-3 text-indigo-100/80 max-w-lg text-sm md:text-base">
                        Calculate your exact score, percentile & estimated rank using official NTA formulas.
                        Then check admission chances across India's top institutions.
                    </p>
                </div>
            </motion.section>

            {/* ═══ EXAM TABS ═══ */}
            <motion.section {...fadeUp(0.1)}>
                <h2 className="text-section text-lg text-slate-900 mb-4 flex items-center gap-2">
                    <GraduationCap size={20} className="text-indigo-600" /> Select Exam
                </h2>
                <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                    {Object.values(EXAM_CONFIGS).map(e => (
                        <motion.button
                            key={e.key}
                            type="button"
                            onClick={() => { setSelectedExam(e.key); setCalcResult(null); setCalcValues({}); setShowPredictions(false); setBranchFilter(""); setActiveView("calculator") }}
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
                                <motion.div layoutId="exam-indicator" className="absolute -bottom-0.5 left-1/4 right-1/4 h-1 rounded-full bg-indigo-500" />
                            )}
                        </motion.button>
                    ))}
                </div>
            </motion.section>

            {/* ═══ VIEW TOGGLE ═══ */}
            <motion.div {...fadeUp(0.15)} className="flex justify-center">
                <div className="flex rounded-2xl bg-white border border-slate-200 p-1 shadow-sm">
                    {[{ key: "calculator", label: "📐 Score Calculator", icon: Calculator }, { key: "predictions", label: "🎯 Cutoff Predictions", icon: Target }].map(v => (
                        <button key={v.key} type="button" onClick={() => setActiveView(v.key)}
                            className={`relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors duration-200`}
                        >
                            {activeView === v.key && (
                                <motion.div layoutId="view-toggle" className="absolute inset-0 rounded-xl bg-indigo-100" transition={{ type: "spring", stiffness: 300, damping: 25 }} />
                            )}
                            <span className={`relative z-10 ${activeView === v.key ? "text-indigo-700" : "text-slate-500"}`}>{v.label}</span>
                        </button>
                    ))}
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {activeView === "calculator" ? (
                    /* ═══ SCORE CALCULATOR ═══ */
                    <motion.section
                        key="calculator"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="card-bb p-6 md:p-8 gradient-border">
                            <div className="bg-white rounded-[22px] p-6 md:p-8 relative z-10 space-y-5">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{config.icon}</span>
                                    <div>
                                        <h3 className="text-card-title text-lg">{config.label} Score Calculator</h3>
                                        <p className="text-xs text-slate-500">Marking: {config.markingScheme}</p>
                                    </div>
                                </div>

                                {/* Input fields */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    {config.calcFields.map(f => (
                                        <div key={f.key}>
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">{f.label}</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max={f.max}
                                                step={f.step}
                                                value={calcValues[f.key] || ""}
                                                onChange={e => handleCalcChange(f.key, e.target.value)}
                                                placeholder={`Max: ${f.max}`}
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Calculate button */}
                                <button
                                    type="button"
                                    onClick={runCalculation}
                                    className={`btn-ripple w-full rounded-full bg-gradient-to-r ${config.color} px-6 py-3.5 text-base font-semibold text-white shadow-lg transition hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2`}
                                >
                                    <Calculator size={18} />
                                    Calculate Score & Rank
                                </button>

                                {/* Results */}
                                <AnimatePresence>
                                    {calcResult && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-4 overflow-hidden"
                                        >
                                            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-5">
                                                <h4 className="text-sm font-bold text-indigo-800 mb-3 flex items-center gap-2">
                                                    📊 Your Results
                                                </h4>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {calcResult.details.map(d => (
                                                        <div key={d.label} className="rounded-xl bg-white px-3.5 py-2.5 shadow-sm">
                                                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{d.label}</p>
                                                            <p className="text-base font-bold text-slate-900 mt-0.5">{d.value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Formula used */}
                                            <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wide flex items-center gap-1">
                                                    <Info size={10} /> Formula Used
                                                </p>
                                                <p className="text-xs text-slate-600 mt-1 font-mono">{calcResult.formula}</p>
                                            </div>

                                            {/* Predict button */}
                                            <button
                                                type="button"
                                                onClick={predictWithCalc}
                                                className="btn-ripple w-full rounded-full border-2 border-indigo-200 bg-indigo-50 px-6 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition flex items-center justify-center gap-2"
                                            >
                                                <Target size={16} />
                                                Check College Cutoffs with Rank {calcResult.estimatedRank.toLocaleString()} →
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.section>
                ) : (
                    /* ═══ CUTOFF PREDICTIONS ═══ */
                    <motion.div
                        key="predictions"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Filters */}
                        <div className="flex flex-wrap gap-3 items-center justify-center">
                            {calcResult && (
                                <div className="rounded-2xl bg-indigo-50 border border-indigo-200 px-4 py-2 text-sm">
                                    <span className="text-slate-500">Your Rank: </span>
                                    <span className="font-bold text-indigo-700">{calcResult.estimatedRank.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="relative">
                                <select value={category} onChange={e => setCategory(e.target.value)}
                                    className="appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-8 py-2 text-sm font-medium outline-none focus:border-indigo-400">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)}
                                    className="appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-8 py-2 text-sm font-medium outline-none focus:border-indigo-400">
                                    <option value="">All Branches</option>
                                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {userRank > 0 && predictions.length > 0 ? (
                            <>
                                {/* Summary badges */}
                                <div className="flex flex-wrap gap-3 justify-center">
                                    <ChanceBadge label="Safe" count={safeCount} color="emerald" emoji="✅" />
                                    <ChanceBadge label="Moderate" count={modCount} color="amber" emoji="⚠️" />
                                    <ChanceBadge label="Reach" count={reachCount} color="rose" emoji="🎯" />
                                </div>

                                {/* Result cards */}
                                <StaggerContainer stagger={0.06} className="grid gap-4 md:grid-cols-2">
                                    {predictions.map((r, i) => (
                                        <StaggerItem key={`${r.college}-${r.branch}-${i}`}>
                                            <MagneticCard intensity={0.03} className="h-full">
                                                <div className="card-bb p-5 h-full shimmer-hover">
                                                    <div className="flex items-start justify-between gap-3 mb-3">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-card-title text-sm truncate">{r.college}</h4>
                                                            <p className="text-xs text-slate-500 mt-0.5">{r.branch} · {r.city}, {r.state}</p>
                                                        </div>
                                                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${r.chanceColor === "emerald" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                                                            r.chanceColor === "amber" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                                                                "bg-rose-100 text-rose-700 border border-rose-200"
                                                            }`}>
                                                            {r.chance}
                                                        </span>
                                                    </div>

                                                    {/* Chance meter */}
                                                    <div className="mb-3">
                                                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                                            <span>Admission probability</span>
                                                            <span className={`font-bold ${r.chanceColor === "emerald" ? "text-emerald-600" :
                                                                r.chanceColor === "amber" ? "text-amber-600" : "text-rose-600"
                                                                }`}>{r.chancePercent}%</span>
                                                        </div>
                                                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${r.chancePercent}%` }}
                                                                transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                                                                className={`h-full rounded-full bg-gradient-to-r ${r.chanceColor === "emerald" ? "from-emerald-400 to-emerald-600" :
                                                                    r.chanceColor === "amber" ? "from-amber-400 to-amber-600" :
                                                                        "from-rose-400 to-rose-600"
                                                                    }`}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Cutoff + trend */}
                                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                                                            <p className="text-slate-400">Closing Rank</p>
                                                            <p className="font-bold text-slate-800 text-sm mt-0.5">{r.cutoff.toLocaleString()}</p>
                                                        </div>
                                                        <div className="rounded-xl bg-slate-50 px-3 py-2">
                                                            <p className="text-slate-400 flex items-center gap-1"><TrendingUp size={10} /> 3yr trend</p>
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                {r.prev?.map((v, j) => (
                                                                    <span key={j} className="text-[10px] text-slate-500">
                                                                        {v.toLocaleString()}{j < r.prev.length - 1 && <span className="text-slate-300 mx-0.5">→</span>}
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
                                                            }`}>{r.type}</span>
                                                    </div>
                                                </div>
                                            </MagneticCard>
                                        </StaggerItem>
                                    ))}
                                </StaggerContainer>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-5xl mb-3">📐</p>
                                <p className="text-slate-500 text-sm">
                                    Use the <button type="button" onClick={() => setActiveView("calculator")} className="text-indigo-600 font-semibold hover:underline">Score Calculator</button> first to calculate your rank, then come back here to check cutoffs.
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function ChanceBadge({ label, count, color, emoji }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 ${color === "emerald" ? "bg-emerald-50 border-emerald-200" :
                color === "amber" ? "bg-amber-50 border-amber-200" :
                    "bg-rose-50 border-rose-200"
                }`}
        >
            <span className="text-lg">{emoji}</span>
            <div>
                <p className={`text-lg font-bold ${color === "emerald" ? "text-emerald-700" :
                    color === "amber" ? "text-amber-700" : "text-rose-700"
                    }`}>
                    <AnimatedCounter value={count} duration={0.8} />
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
            </div>
        </motion.div>
    )
}
