import { motion, AnimatePresence } from "framer-motion"
import {
    BookOpen,
    Calendar,
    Check,
    ChevronRight,
    Clock,
    GraduationCap,
    Plus,
    Sparkles,
    Trash2,
} from "lucide-react"
import { useMemo, useState } from "react"

const EXAMS = ["JEE Main", "JEE Advanced", "NEET", "CUET", "NDA", "CAT", "CLAT", "BITSAT"]
const SUBJECTS_MAP = {
    "JEE Main": ["Physics", "Chemistry", "Mathematics"],
    "JEE Advanced": ["Physics", "Chemistry", "Mathematics"],
    "NEET": ["Physics", "Chemistry", "Biology"],
    "CUET": ["English", "Domain Subjects", "General Test"],
    "NDA": ["Mathematics", "General Ability"],
    "CAT": ["Verbal Ability", "Data Interpretation", "Logical Reasoning", "Quantitative Aptitude"],
    "CLAT": ["English", "General Knowledge", "Legal Reasoning", "Logical Reasoning", "Quantitative Techniques"],
    "BITSAT": ["Physics", "Chemistry", "Mathematics", "English & Verbal Reasoning"],
}

const LS_KEY = "mentorbhaiyaa_study_plan"
function loadPlan() { try { return JSON.parse(localStorage.getItem(LS_KEY)) } catch { return null } }
function savePlan(p) { try { localStorage.setItem(LS_KEY, JSON.stringify(p)) } catch { } }

function generateSchedule(exam, examDate, hoursPerDay) {
    const subjects = SUBJECTS_MAP[exam] || []
    const today = new Date()
    const target = new Date(examDate)
    const totalDays = Math.max(1, Math.floor((target - today) / 86400000))
    const weeksLeft = Math.ceil(totalDays / 7)

    const phases = []
    const phaseSize = Math.max(1, Math.floor(weeksLeft / 3))

    // Phase 1: Concept Building
    phases.push({
        phase: "Phase 1: Concept Building",
        weeks: phaseSize,
        color: "indigo",
        tasks: subjects.map(s => ({ subject: s, task: `Cover all ${s} basics and NCERT/textbook`, hours: Math.round((phaseSize * 7 * hoursPerDay) / subjects.length) }))
    })

    // Phase 2: Practice
    phases.push({
        phase: "Phase 2: Practice & Problem Solving",
        weeks: phaseSize,
        color: "amber",
        tasks: subjects.map(s => ({ subject: s, task: `DPPs, previous year questions for ${s}`, hours: Math.round((phaseSize * 7 * hoursPerDay) / subjects.length) }))
    })

    // Phase 3: Revision
    phases.push({
        phase: "Phase 3: Revision & Mock Tests",
        weeks: weeksLeft - 2 * phaseSize,
        color: "emerald",
        tasks: [
            { subject: "All", task: "Full-length mock tests (3 per week)", hours: totalDays * hoursPerDay * 0.4 },
            { subject: "All", task: "Weak topic revision", hours: totalDays * hoursPerDay * 0.3 },
            { subject: "All", task: "Quick formula revision + shortcuts", hours: totalDays * hoursPerDay * 0.3 },
        ]
    })

    return { exam, examDate, hoursPerDay, totalDays, weeksLeft, phases, checkedTasks: {} }
}

export default function StudyPlanner() {
    const [step, setStep] = useState("form")
    const [exam, setExam] = useState("JEE Main")
    const [examDate, setExamDate] = useState("")
    const [hoursPerDay, setHoursPerDay] = useState(6)
    const [plan, setPlan] = useState(() => loadPlan())
    const [checked, setChecked] = useState(plan?.checkedTasks || {})

    function generatePlan() {
        if (!examDate) return
        const newPlan = generateSchedule(exam, examDate, hoursPerDay)
        setPlan(newPlan)
        setChecked({})
        savePlan(newPlan)
        setStep("plan")
    }

    function toggleTask(key) {
        const updated = { ...checked, [key]: !checked[key] }
        setChecked(updated)
        if (plan) savePlan({ ...plan, checkedTasks: updated })
    }

    const colorMap = { indigo: "border-indigo-200 bg-indigo-50", amber: "border-amber-200 bg-amber-50", emerald: "border-emerald-200 bg-emerald-50" }
    const badgeMap = { indigo: "bg-indigo-100 text-indigo-700", amber: "bg-amber-100 text-amber-700", emerald: "bg-emerald-100 text-emerald-700" }

    return (
        <div className="space-y-6">
            {/* Hero */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="hero-gradient rounded-3xl p-8 text-center text-white shadow-xl md:p-10"
            >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 shadow-lg">
                    <BookOpen size={40} />
                </div>
                <h1 className="text-4xl font-extrabold md:text-5xl">Smart Study Planner</h1>
                <p className="mt-3 text-lg text-white/80">AI-powered revision timetable tailored to your exam date</p>
            </motion.section>

            {/* Form / Plan */}
            {!plan || step === "form" ? (
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-card space-y-5"
                >
                    <h2 className="text-lg font-bold text-slate-900">⚙️ Configure Your Study Plan</h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">Target Exam</label>
                            <select value={exam} onChange={e => setExam(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                                {EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">Exam Date</label>
                            <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
                        </div>
                        <div>
                            <label className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
                                <span>Hours/Day</span><span className="font-bold text-indigo-600">{hoursPerDay}h</span>
                            </label>
                            <input type="range" min={2} max={12} value={hoursPerDay} onChange={e => setHoursPerDay(Number(e.target.value))} className="mt-2 w-full accent-indigo-500" />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={generatePlan}
                        disabled={!examDate}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50"
                    >
                        <Sparkles size={16} /> Generate My Study Plan
                    </button>
                </motion.section>
            ) : (
                <div className="space-y-5">
                    {/* Plan Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{plan.exam} — {plan.weeksLeft} weeks left</h2>
                            <p className="text-sm text-slate-500">Exam date: {new Date(plan.examDate).toLocaleDateString("en-IN")} · {plan.hoursPerDay}h/day</p>
                        </div>
                        <button type="button" onClick={() => { setPlan(null); savePlan(null); setStep("form") }} className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                            <Sparkles size={14} /> Regenerate
                        </button>
                    </div>

                    {/* Phases */}
                    {plan.phases.map((phase, pi) => (
                        <div key={pi} className={`rounded-3xl border p-5 ${colorMap[phase.color]}`}>
                            <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-900">
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badgeMap[phase.color]}`}>{phase.weeks > 0 ? `${phase.weeks} weeks` : "Final sprint"}</span>
                                {phase.phase}
                            </h3>
                            <div className="space-y-2">
                                {phase.tasks.map((task, ti) => {
                                    const key = `${pi}_${ti}`
                                    return (
                                        <div key={ti} onClick={() => toggleTask(key)} className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-white bg-white p-3.5 shadow-sm transition hover:shadow-md ${checked[key] ? "opacity-60" : ""}`}>
                                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${checked[key] ? "bg-emerald-500 text-white" : "border-2 border-slate-300"}`}>
                                                {checked[key] && <Check size={12} strokeWidth={3} />}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm font-medium ${checked[key] ? "line-through text-slate-400" : "text-slate-900"}`}>{task.task}</p>
                                                <p className="text-xs text-slate-500">{task.subject} · ~{Math.round(task.hours)}h total</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
