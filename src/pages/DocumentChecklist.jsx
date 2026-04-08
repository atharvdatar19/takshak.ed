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
        <div className="relative z-10 pt-8 pb-24 px-2 md:px-6 max-w-5xl mx-auto space-y-8">
            {/* Page Header */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <p className="font-label text-[9px] uppercase tracking-[0.4em] text-on-surface-variant/60 mb-2">
                    ADMISSION TOOLKIT
                </p>
                <h1 className="section-title text-[clamp(36px,5vw,56px)]">
                    Document Checklist
                </h1>
                <p className="mt-3 text-on-surface-variant font-light text-base">
                    Never miss a document — track everything per college
                </p>
            </motion.section>

            {/* College Selector + Progress */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                className="glass rounded-lg p-6 md:p-8"
            >
                <div className="flex items-center gap-6">
                    <div className="flex-1">
                        <label className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant/60 mb-2 block">
                            Select College
                        </label>
                        <div className="relative">
                            <select
                                value={selectedCollege}
                                onChange={e => setSelectedCollege(e.target.value)}
                                className="w-full appearance-none border-0 border-b border-outline-variant/40 bg-transparent rounded-none px-0 py-3 text-sm font-light text-on-surface outline-none focus:border-primary transition-all duration-400"
                            >
                                {COLLEGES_LIST.map(c => <option key={c} value={c} className="bg-surface-container">{c}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-0 bottom-3 text-on-surface-variant/40 pointer-events-none" />
                        </div>
                    </div>

                    {/* Progress Ring */}
                    <div className="text-center">
                        <div className="relative mx-auto h-16 w-16">
                            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#41312c" strokeWidth="3" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={progress.percent === 100 ? "#dfc393" : "#ffb4a5"} strokeWidth="3" strokeDasharray={`${progress.percent}, 100`} strokeLinecap="round" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-headline font-bold text-on-surface">{progress.percent}%</span>
                        </div>
                        <p className="mt-1 text-[10px] font-label uppercase tracking-wider text-on-surface-variant/60">{progress.done}/{progress.total} required</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-6 h-[2px] rounded-full bg-surface-container-high overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(to right, #ffb4a5, #dfc393)" }}
                        animate={{ width: `${progress.percent}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </motion.section>

            {/* Document List */}
            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                className="glass rounded-lg p-2 md:p-4"
            >
                <div className="space-y-1">
                    {DEFAULT_DOCS.map((doc, i) => {
                        const isDone = checked[key(selectedCollege, doc.name)]
                        return (
                            <motion.div
                                key={doc.name}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.02, duration: 0.4, ease: "easeOut" }}
                                onClick={() => toggleDoc(doc.name)}
                                className={`flex cursor-pointer items-center gap-4 px-4 md:px-6 py-4 rounded-lg transition-all duration-400 ${isDone ? "bg-primary/5" : "hover:bg-surface-container-high/30"}`}
                            >
                                {/* Custom checkbox */}
                                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-400 ${
                                    isDone
                                        ? "bg-primary"
                                        : "border-2 border-outline-variant/40 hover:border-primary"
                                }`}>
                                    {isDone && <Check size={12} strokeWidth={3} className="text-on-primary" />}
                                </div>

                                <div className="flex-1">
                                    <p className={`text-sm font-medium transition-all duration-400 ${isDone ? "text-on-surface-variant/50 line-through decoration-primary/40" : "text-on-surface"}`}>
                                        {doc.name}
                                    </p>
                                </div>

                                {doc.required ? (
                                    <span className="bg-error/15 text-error rounded-full px-2 py-0.5 text-[9px] font-label uppercase tracking-widest font-bold">Required</span>
                                ) : (
                                    <span className="bg-outline-variant/20 text-on-surface-variant rounded-full px-2 py-0.5 text-[9px] font-label uppercase tracking-widest">Optional</span>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            </motion.section>

            {/* Completion banner */}
            {progress.percent === 100 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="glass rounded-lg p-8 text-center border-l-4 border-tertiary"
                >
                    <CheckCircle2 size={48} className="mx-auto text-tertiary" />
                    <p className="mt-3 font-headline font-bold text-lg text-on-surface italic">All documents ready! 🎉</p>
                    <p className="mt-1 text-sm text-on-surface-variant font-light">You're fully prepared for {selectedCollege}</p>
                </motion.div>
            )}
        </div>
    )
}
