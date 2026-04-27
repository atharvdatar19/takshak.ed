import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"
import {
    Lightbulb, ChevronRight, ChevronLeft, Sparkles, TrendingUp,
    DollarSign, Clock, BarChart3, Filter, ArrowUpDown, CheckCircle2,
    Rocket, Target, Save, ChevronDown, ChevronUp, Star, Zap, AlertCircle,
} from "lucide-react"
import { useAuth } from "@auth/AuthContext"
import { SKILL_CATEGORIES, INTEREST_AREAS } from "@/data/SkillMatcherData"
import { matchIncomePaths, saveSkillProfile } from "@database/services/skillMatcher"

const STEPS = [
    { label: "Skills", icon: Zap },
    { label: "Interests", icon: Target },
    { label: "Preferences", icon: Filter },
    { label: "Results", icon: Rocket },
]

const DIFFICULTY_OPTIONS = [
    { value: "all", label: "Any Level", desc: "Show all opportunities" },
    { value: "Beginner", label: "Beginner", desc: "Easy to start, lower barrier" },
    { value: "Intermediate", label: "Intermediate", desc: "Needs some experience" },
    { value: "Advanced", label: "Advanced", desc: "High skill, high reward" },
]

const BUDGET_OPTIONS = [
    { value: 0, label: "₹0 (Zero Investment)" },
    { value: 5000, label: "Under ₹5,000" },
    { value: 20000, label: "Under ₹20,000" },
    { value: 50000, label: "Under ₹50,000" },
    { value: 100000, label: "Under ₹1,00,000" },
    { value: Infinity, label: "No Budget Limit" },
]

const SORT_OPTIONS = [
    { value: "score", label: "Best Match" },
    { value: "income", label: "Highest Income" },
    { value: "easiest", label: "Easiest to Start" },
    { value: "cheapest", label: "Lowest Investment" },
    { value: "fastest", label: "Fastest to Earn" },
]

function formatCurrency(val) {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`
    return `₹${val}`
}

// ── Progress Stepper ──
function ProgressStepper({ currentStep }) {
    return (
        <div className="flex items-center justify-center gap-1 sm:gap-3 mb-8">
            {STEPS.map((step, idx) => {
                const Icon = step.icon
                const isActive = idx === currentStep
                const isDone = idx < currentStep
                return (
                    <div key={step.label} className="flex items-center gap-1 sm:gap-3">
                        <motion.div
                            animate={{
                                scale: isActive ? 1.1 : 1,
                                backgroundColor: isDone ? "#6366f1" : isActive ? "#4f46e5" : "#f1f5f9",
                            }}
                            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${isDone || isActive ? "text-white shadow-lg shadow-indigo-200" : "text-slate-400"
                                }`}
                        >
                            {isDone ? <CheckCircle2 size={14} /> : <Icon size={14} />}
                            <span className="hidden sm:inline">{step.label}</span>
                        </motion.div>
                        {idx < STEPS.length - 1 && (
                            <div className={`h-0.5 w-4 sm:w-8 rounded-full transition-colors ${idx < currentStep ? "bg-indigo-500" : "bg-slate-200"
                                }`} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

// ── Skill Selection Chips ──
function SkillSelector({ selected, onToggle }) {
    return (
        <div className="space-y-6">
            {SKILL_CATEGORIES.map(cat => (
                <div key={cat.id}>
                    <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <span className={`inline-block h-2 w-2 rounded-full bg-gradient-to-r ${cat.color}`} />
                        {cat.label}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {cat.skills.map(skill => {
                            const isSelected = selected.includes(skill.id)
                            return (
                                <motion.button
                                    key={skill.id}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => onToggle(skill.id)}
                                    className={`rounded-xl px-3 py-1.5 text-xs font-medium border transition-all duration-200 ${isSelected
                                            ? `bg-gradient-to-r ${cat.color} text-white border-transparent shadow-md`
                                            : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                                        }`}
                                >
                                    {isSelected && <span className="mr-1">✓</span>}
                                    {skill.label}
                                </motion.button>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}

// ── Interest Area Grid ──
function InterestSelector({ selected, onToggle }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {INTEREST_AREAS.map(area => {
                const isSelected = selected.includes(area.id)
                return (
                    <motion.button
                        key={area.id}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onToggle(area.id)}
                        className={`relative rounded-2xl p-4 text-left border transition-all duration-200 ${isSelected
                                ? "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300 shadow-md shadow-indigo-100"
                                : "bg-white/80 border-slate-200 hover:border-indigo-200 hover:shadow-sm"
                            }`}
                    >
                        {isSelected && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2"
                            >
                                <CheckCircle2 size={16} className="text-indigo-600" />
                            </motion.div>
                        )}
                        <span className="text-2xl block mb-1">{area.icon}</span>
                        <span className={`text-xs font-semibold ${isSelected ? "text-indigo-700" : "text-slate-600"}`}>
                            {area.label}
                        </span>
                    </motion.button>
                )
            })}
        </div>
    )
}

// ── Difficulty badge ──
function DifficultyBadge({ level }) {
    const colors = {
        Beginner: "bg-emerald-100 text-emerald-700",
        Intermediate: "bg-amber-100 text-amber-700",
        Advanced: "bg-rose-100 text-rose-700",
    }
    return (
        <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colors[level] || "bg-slate-100 text-slate-600"}`}>
            {level}
        </span>
    )
}

// ── Result Card ──
function ResultCard({ path, rank }) {
    const [expanded, setExpanded] = useState(false)

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.06 }}
            className="group relative rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
            {/* Match Score Ribbon */}
            <div className={`absolute top-0 right-0 w-20 h-20 overflow-hidden ${path.matchScore >= 70 ? "" : "opacity-80"}`}>
                <div className={`absolute top-3 -right-5 w-28 text-center text-[10px] font-bold text-white py-1 rotate-45 shadow ${path.matchScore >= 80 ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
                        path.matchScore >= 60 ? "bg-gradient-to-r from-indigo-500 to-purple-500" :
                            path.matchScore >= 40 ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                                "bg-gradient-to-r from-slate-400 to-slate-500"
                    }`}>
                    {path.matchScore}% Match
                </div>
            </div>

            <div className="p-5">
                {/* Header */}
                <div className="pr-16">
                    <div className="flex items-center gap-2 mb-1">
                        {rank < 3 && <Star size={14} className="text-amber-500 fill-amber-500" />}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{path.category}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{path.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">{path.description}</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="rounded-xl bg-emerald-50 p-2.5 text-center">
                        <DollarSign size={14} className="mx-auto text-emerald-600 mb-1" />
                        <p className="text-[10px] text-slate-500">Monthly Income</p>
                        <p className="text-xs font-bold text-emerald-700">
                            {formatCurrency(path.incomeRange.min)} - {formatCurrency(path.incomeRange.max)}
                        </p>
                    </div>
                    <div className="rounded-xl bg-blue-50 p-2.5 text-center">
                        <BarChart3 size={14} className="mx-auto text-blue-600 mb-1" />
                        <p className="text-[10px] text-slate-500">Startup Cost</p>
                        <p className="text-xs font-bold text-blue-700">
                            {path.startupCost.max === 0 ? "Free" : `${formatCurrency(path.startupCost.min)} - ${formatCurrency(path.startupCost.max)}`}
                        </p>
                    </div>
                    <div className="rounded-xl bg-purple-50 p-2.5 text-center">
                        <Clock size={14} className="mx-auto text-purple-600 mb-1" />
                        <p className="text-[10px] text-slate-500">Time to Income</p>
                        <p className="text-xs font-bold text-purple-700">{path.timeToIncome}</p>
                    </div>
                    <div className="rounded-xl bg-amber-50 p-2.5 text-center">
                        <TrendingUp size={14} className="mx-auto text-amber-600 mb-1" />
                        <p className="text-[10px] text-slate-500">Difficulty</p>
                        <DifficultyBadge level={path.difficulty} />
                    </div>
                </div>

                {/* Why it matched */}
                {path.reasons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {path.reasons.map((r, i) => (
                            <span key={i} className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-medium text-indigo-700">
                                <Sparkles size={10} /> {r}
                            </span>
                        ))}
                    </div>
                )}

                {/* Expand / Collapse */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                >
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expanded ? "Show Less" : "View Growth Path & Steps"}
                </button>

                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                                {/* Growth Trajectory */}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                        <TrendingUp size={12} /> Growth Trajectory
                                    </h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">{path.growthTrajectory}</p>
                                </div>

                                {/* Action Steps */}
                                <div>
                                    <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                                        <Rocket size={12} /> How to Get Started
                                    </h4>
                                    <ol className="space-y-2">
                                        {path.steps.map((step, i) => (
                                            <li key={i} className="flex gap-2.5 items-start text-xs text-slate-600">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white mt-0.5">
                                                    {i + 1}
                                                </span>
                                                <span className="leading-relaxed">{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

// ── Main Page ──
export default function SkillMatcher() {
    const { user } = useAuth()
    const [step, setStep] = useState(0)
    const [selectedSkills, setSelectedSkills] = useState([])
    const [selectedInterests, setSelectedInterests] = useState([])
    const [difficulty, setDifficulty] = useState("all")
    const [budget, setBudget] = useState(Infinity)
    const [sortBy, setSortBy] = useState("score")
    const [results, setResults] = useState([])
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const toggleSkill = useCallback((id) => {
        setSelectedSkills(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        )
    }, [])

    const toggleInterest = useCallback((id) => {
        setSelectedInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }, [])

    const handleFindPaths = useCallback(() => {
        const matched = matchIncomePaths(selectedSkills, selectedInterests, {
            maxInvestment: budget,
            difficulty,
        })
        setResults(matched)
        setStep(3)
    }, [selectedSkills, selectedInterests, budget, difficulty])

    const sortedResults = useMemo(() => {
        const copy = [...results]
        switch (sortBy) {
            case "income": return copy.sort((a, b) => b.incomeRange.max - a.incomeRange.max)
            case "easiest": {
                const order = { Beginner: 0, Intermediate: 1, Advanced: 2 }
                return copy.sort((a, b) => order[a.difficulty] - order[b.difficulty])
            }
            case "cheapest": return copy.sort((a, b) => a.startupCost.max - b.startupCost.max)
            case "fastest": return copy.sort((a, b) => a.timeToIncome.localeCompare(b.timeToIncome))
            default: return copy // already sorted by score
        }
    }, [results, sortBy])

    const handleSave = useCallback(async () => {
        setSaving(true)
        try {
            await saveSkillProfile(user?.id, {
                skills: selectedSkills,
                interests: selectedInterests,
                preferences: { difficulty, maxInvestment: budget },
            })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (e) {
            console.warn("Save failed:", e)
        }
        setSaving(false)
    }, [user, selectedSkills, selectedInterests, difficulty, budget])

    const canProceedStep0 = selectedSkills.length >= 1
    const canProceedStep1 = selectedInterests.length >= 1

    return (
        <>
            <Helmet>
                <title>AI Skill Matcher — Find Your Income Path | TAKSHAK</title>
                <meta name="description" content="Discover realistic income paths and business ideas based on your skills and interests. AI-powered matching engine for Indian students and freshers." />
            </Helmet>

            <div className="max-w-5xl mx-auto">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200">
                            <Lightbulb size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">AI Skill Matcher</h1>
                            <p className="text-sm text-slate-500">Discover income paths that match your unique skills & interests</p>
                        </div>
                    </div>
                </motion.div>

                {/* Progress Stepper */}
                <ProgressStepper currentStep={step} />

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    {/* ── STEP 0: SKILLS ── */}
                    {step === 0 && (
                        <motion.div
                            key="step-skills"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-800 mb-1">Select Your Skills</h2>
                                <p className="text-sm text-slate-500 mb-5">
                                    Pick the skills you currently have — even basic knowledge counts! <span className="text-indigo-600 font-medium">({selectedSkills.length} selected)</span>
                                </p>
                                <SkillSelector selected={selectedSkills} onToggle={toggleSkill} />

                                <div className="mt-6 flex justify-end">
                                    <button
                                        disabled={!canProceedStep0}
                                        onClick={() => setStep(1)}
                                        className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${canProceedStep0
                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl"
                                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            }`}
                                    >
                                        Next: Pick Interests <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 1: INTERESTS ── */}
                    {step === 1 && (
                        <motion.div
                            key="step-interests"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-800 mb-1">What Excites You?</h2>
                                <p className="text-sm text-slate-500 mb-5">
                                    Pick areas that genuinely interest you — passion drives success! <span className="text-indigo-600 font-medium">({selectedInterests.length} selected)</span>
                                </p>
                                <InterestSelector selected={selectedInterests} onToggle={toggleInterest} />

                                <div className="mt-6 flex justify-between">
                                    <button
                                        onClick={() => setStep(0)}
                                        className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                                    >
                                        <ChevronLeft size={16} /> Back
                                    </button>
                                    <button
                                        disabled={!canProceedStep1}
                                        onClick={() => setStep(2)}
                                        className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${canProceedStep1
                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl"
                                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            }`}
                                    >
                                        Next: Set Preferences <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 2: PREFERENCES ── */}
                    {step === 2 && (
                        <motion.div
                            key="step-preferences"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-800 mb-1">Fine-tune Your Search</h2>
                                <p className="text-sm text-slate-500 mb-6">Set your preferences to get the most relevant results.</p>

                                {/* Difficulty Level */}
                                <div className="mb-6">
                                    <label className="text-sm font-bold text-slate-700 mb-3 block">
                                        Preferred Difficulty Level
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {DIFFICULTY_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setDifficulty(opt.value)}
                                                className={`rounded-xl p-3 text-left border transition-all ${difficulty === opt.value
                                                        ? "bg-indigo-50 border-indigo-300 shadow-sm"
                                                        : "bg-white border-slate-200 hover:border-indigo-200"
                                                    }`}
                                            >
                                                <p className={`text-xs font-bold ${difficulty === opt.value ? "text-indigo-700" : "text-slate-700"}`}>
                                                    {opt.label}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Budget */}
                                <div className="mb-6">
                                    <label className="text-sm font-bold text-slate-700 mb-3 block">
                                        Maximum Initial Investment
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {BUDGET_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => setBudget(opt.value)}
                                                className={`rounded-xl p-3 text-left border transition-all ${budget === opt.value
                                                        ? "bg-emerald-50 border-emerald-300 shadow-sm"
                                                        : "bg-white border-slate-200 hover:border-emerald-200"
                                                    }`}
                                            >
                                                <p className={`text-xs font-bold ${budget === opt.value ? "text-emerald-700" : "text-slate-700"}`}>
                                                    {opt.label}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                                    >
                                        <ChevronLeft size={16} /> Back
                                    </button>
                                    <button
                                        onClick={handleFindPaths}
                                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-200 hover:shadow-xl transition-all"
                                    >
                                        <Sparkles size={16} /> Find My Income Paths
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 3: RESULTS ── */}
                    {step === 3 && (
                        <motion.div
                            key="step-results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Results Header */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">
                                        🎯 {sortedResults.length} Income Path{sortedResults.length !== 1 ? "s" : ""} Found
                                    </h2>
                                    <p className="text-sm text-slate-500">Ranked by how well they match your profile</p>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    {/* Sort Selector */}
                                    <div className="flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-1.5">
                                        <ArrowUpDown size={13} className="text-slate-400" />
                                        <select
                                            value={sortBy}
                                            onChange={e => setSortBy(e.target.value)}
                                            className="bg-transparent text-xs font-medium text-slate-700 outline-none cursor-pointer"
                                        >
                                            {SORT_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Save Button */}
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || saved}
                                        className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${saved
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                                            }`}
                                    >
                                        {saved ? <CheckCircle2 size={13} /> : <Save size={13} />}
                                        {saved ? "Saved!" : saving ? "Saving..." : "Save Profile"}
                                    </button>

                                    {/* Start Over */}
                                    <button
                                        onClick={() => { setStep(0); setResults([]) }}
                                        className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition"
                                    >
                                        Start Over
                                    </button>
                                </div>
                            </div>

                            {/* No Results */}
                            {sortedResults.length === 0 && (
                                <div className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm p-12 text-center space-y-3">
                                    <AlertCircle size={40} className="mx-auto text-amber-500" />
                                    <h3 className="text-lg font-bold text-slate-700">No matches found</h3>
                                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                                        Try selecting more skills or broader preferences. The more you select, the better our matching works.
                                    </p>
                                    <button
                                        onClick={() => setStep(0)}
                                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
                                    >
                                        <ChevronLeft size={16} /> Adjust Skills
                                    </button>
                                </div>
                            )}

                            {/* Result Cards */}
                            <div className="space-y-4">
                                {sortedResults.map((path, idx) => (
                                    <ResultCard key={path.id} path={path} rank={idx} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}
