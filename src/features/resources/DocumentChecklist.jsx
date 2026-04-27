import { motion } from "framer-motion"
import {
    Check,
    CheckCircle2,
    ChevronDown,
    Circle,
    ClipboardCheck,
    FileText,
    GraduationCap,
} from "lucide-react"
import { useMemo, useState } from "react"

const COLLEGES_LIST = [
    "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur",
    "NIT Trichy", "NIT Warangal", "NIT Surathkal", "BITS Pilani",
    "AIIMS Delhi", "JIPMER", "VIT Vellore", "SRM Chennai",
    "Amity University", "LPU", "Manipal University",
]

const DEFAULT_DOCS = [
    { name: "Aadhaar Card", required: true },
    { name: "10th Marksheet", required: true },
    { name: "10th Certificate", required: true },
    { name: "12th Marksheet", required: true },
    { name: "12th Certificate", required: true },
    { name: "Transfer Certificate", required: true },
    { name: "Migration Certificate", required: true },
    { name: "Character Certificate", required: true },
    { name: "Passport Size Photos (6)", required: true },
    { name: "Category Certificate", required: false },
    { name: "Income Certificate", required: false },
    { name: "Domicile Certificate", required: false },
    { name: "Medical Fitness Certificate", required: false },
    { name: "Entrance Exam Scorecard", required: true },
    { name: "Allotment Letter", required: true },
    { name: "Gap Certificate (if applicable)", required: false },
]

export default function DocumentChecklist() {
    const [selectedCollege, setSelectedCollege] = useState(COLLEGES_LIST[0])
    const [checked, setChecked] = useState({})

    const key = (college, doc) => `${college}::${doc}`

    function toggleDoc(doc) {
        const k = key(selectedCollege, doc)
        setChecked(prev => ({ ...prev, [k]: !prev[k] }))
    }

    const progress = useMemo(() => {
        const total = DEFAULT_DOCS.filter(d => d.required).length
        const done = DEFAULT_DOCS.filter(d => d.required && checked[key(selectedCollege, d.name)]).length
        return { total, done, percent: total > 0 ? Math.round((done / total) * 100) : 0 }
    }, [selectedCollege, checked])

    return (
        <div className="space-y-6">
            {/* Hero */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-gradient-purple rounded-3xl p-8 text-center text-white shadow-xl md:p-10"
            >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 shadow-lg">
                    <ClipboardCheck size={40} />
                </div>
                <h1 className="text-4xl font-extrabold md:text-5xl">Document Checklist</h1>
                <p className="mt-3 text-lg text-white/80">Never miss a document — track everything per college</p>
            </motion.section>

            {/* College Selector */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-card"
            >
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium text-slate-600">Select College</label>
                        <select
                            value={selectedCollege}
                            onChange={e => setSelectedCollege(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                        >
                            {COLLEGES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Progress */}
                    <div className="text-center">
                        <div className="relative mx-auto h-16 w-16">
                            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={progress.percent === 100 ? "#10b981" : "#6366f1"} strokeWidth="3" strokeDasharray={`${progress.percent}, 100`} strokeLinecap="round" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900">{progress.percent}%</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{progress.done}/{progress.total} required</p>
                    </div>
                </div>
            </motion.section>

            {/* Document List */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl border border-slate-200/60 bg-white shadow-card"
            >
                <div className="divide-y divide-slate-100">
                    {DEFAULT_DOCS.map((doc, i) => {
                        const isDone = checked[key(selectedCollege, doc.name)]
                        return (
                            <motion.div
                                key={doc.name}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.02 }}
                                onClick={() => toggleDoc(doc.name)}
                                className={`flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors ${isDone ? "bg-emerald-50/50" : "hover:bg-slate-50"}`}
                            >
                                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${isDone ? "bg-emerald-500 text-white" : "border-2 border-slate-300"}`}>
                                    {isDone && <Check size={14} strokeWidth={3} />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${isDone ? "text-emerald-700 line-through" : "text-slate-900"}`}>
                                        {doc.name}
                                    </p>
                                </div>
                                {doc.required ? (
                                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600">Required</span>
                                ) : (
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">Optional</span>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            </motion.section>

            {progress.percent === 100 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center"
                >
                    <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
                    <p className="mt-3 text-lg font-bold text-emerald-800">All documents ready! 🎉</p>
                    <p className="mt-1 text-sm text-emerald-600">You're fully prepared for {selectedCollege}</p>
                </motion.div>
            )}
        </div>
    )
}
