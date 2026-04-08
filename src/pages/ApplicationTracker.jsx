import { motion, AnimatePresence } from "framer-motion"
import {
    ChevronRight,
    GraduationCap,
    Kanban,
    Plus,
    Trash2,
    X,
    Briefcase,
    CodeXml,
    Award
} from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { formatDate, getDaysLeft } from "../lib/date"

const COLUMNS = [
    { id: "wishlist", label: "📋 Wishlist", color: "border-outline-variant/20 bg-surface-container-low" },
    { id: "applied", label: "📝 Applied", color: "border-blue-300 bg-primary/10" },
    { id: "docs_sent", label: "📄 In Progress", color: "border-amber-300 bg-tertiary/10" },
    { id: "admitted", label: "🎉 Accepted/Won", color: "border-emerald-300 bg-tertiary/10" },
]

// Demo data for when there's no auth
const DEMO_APPS = [
    { id: "d1", title: "IIT Bombay", type: "College", city: "Mumbai", state: "Maharashtra", status: "wishlist", deadline: "2026-04-15", notes: "" },
    { id: "d2", title: "Google STEP Internship", type: "Internship", city: "Remote", state: "", status: "applied", deadline: "2026-03-20", notes: "Application submitted" },
    { id: "d3", title: "Flipkart GRiD", type: "Hackathon", city: "Online", state: "", status: "docs_sent", deadline: "2026-03-25", notes: "Round 1 cleared" },
]

const TYPE_CONFIG = {
    College: { icon: GraduationCap, color: "text-primary bg-primary/15" },
    Internship: { icon: Briefcase, color: "text-amber-600 bg-tertiary/15" },
    Hackathon: { icon: CodeXml, color: "text-purple-600 bg-purple-100" },
    Scholarship: { icon: Award, color: "text-tertiary bg-tertiary/15" }
}

export default function ApplicationTracker() {
    const { user } = useAuth?.() || {}
    const [apps, setApps] = useState(DEMO_APPS)
    const [showAdd, setShowAdd] = useState(false)
    const [newApp, setNewApp] = useState({ title: "", type: "College", deadline: "", notes: "" })

    function addApplication() {
        if (!newApp.title) return
        const app = {
            id: "new-" + Date.now(),
            ...newApp,
            status: "wishlist",
            city: "",
            state: "",
        }
        setApps(prev => [app, ...prev])
        setNewApp({ title: "", type: "College", deadline: "", notes: "" })
        setShowAdd(false)
    }

    function moveApp(id, newStatus) {
        setApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
    }

    function removeApp(id) {
        setApps(prev => prev.filter(a => a.id !== id))
    }

    const nextStatus = { wishlist: "applied", applied: "docs_sent", docs_sent: "admitted" }

    return (
        <div className="space-y-6">
            {/* Hero */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-lg p-8 text-center text-white shadow-xl md:p-10"
            >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl glass/20 shadow-lg">
                    <Kanban size={40} />
                </div>
                <h1 className="text-4xl font-extrabold md:text-5xl">Opportunity Tracker</h1>
                <p className="mt-3 text-lg text-white/80">Track everything: College Apps, Internships, Hackathons, and Scholarships</p>
            </motion.section>

            {/* Add Button */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
                >
                    <Plus size={16} /> Add Opportunity
                </button>
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="mx-4 w-full max-w-md space-y-4 rounded-lg glass p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-on-surface">Add to Tracker</h3>
                                <button type="button" onClick={() => setShowAdd(false)} className="text-on-surface-variant/60 hover:text-on-surface-variant"><X size={18} /></button>
                            </div>

                            <select
                                value={newApp.type}
                                onChange={e => setNewApp(p => ({ ...p, type: e.target.value }))}
                                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-sm outline-none focus:border-primary/40 font-semibold"
                            >
                                <option value="College">🎓 College Application</option>
                                <option value="Internship">💼 Internship / Job</option>
                                <option value="Hackathon">💻 Hackathon / Competition</option>
                                <option value="Scholarship">🏆 Scholarship</option>
                            </select>

                            <input
                                value={newApp.title}
                                onChange={e => setNewApp(p => ({ ...p, title: e.target.value }))}
                                placeholder="Name (e.g. Google STEP, IIT B)"
                                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-sm outline-none focus:border-primary/40"
                            />
                            <input
                                type="date"
                                value={newApp.deadline}
                                onChange={e => setNewApp(p => ({ ...p, deadline: e.target.value }))}
                                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-sm"
                            />
                            <input
                                value={newApp.notes}
                                onChange={e => setNewApp(p => ({ ...p, notes: e.target.value }))}
                                placeholder="Notes (optional)"
                                className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-sm outline-none"
                            />
                            <button
                                type="button"
                                onClick={addApplication}
                                disabled={!newApp.title}
                                className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50"
                            >
                                Track Opportunity
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Kanban Board */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {COLUMNS.map(col => {
                    const colApps = apps.filter(a => a.status === col.id)
                    return (
                        <div key={col.id} className={`rounded-lg border p-4 ${col.color}`}>
                            <h3 className="mb-3 text-sm font-bold text-on-surface">
                                {col.label} <span className="ml-1 text-on-surface-variant/60">({colApps.length})</span>
                            </h3>
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {colApps.map(app => {
                                        const daysLeft = app.deadline ? getDaysLeft(app.deadline) : null
                                        const TypeIcon = TYPE_CONFIG[app.type]?.icon || GraduationCap;

                                        return (
                                            <motion.div
                                                key={app.id}
                                                layout
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="scroll-3d-card rounded-2xl border border-white glass p-4 shadow-[0_0_20px_rgba(255,180,165,0.08)] transition hover:-translate-y-0.5"
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`p-1.5 rounded-md ${TYPE_CONFIG[app.type]?.color || 'bg-surface-container'}`}>
                                                            <TypeIcon size={14} />
                                                        </div>
                                                        <p className="text-sm font-bold text-on-surface leading-tight">{app.title}</p>
                                                    </div>
                                                    <button type="button" onClick={() => removeApp(app.id)} className="text-on-surface-variant/40 hover:text-rose-500 shrink-0">
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>

                                                {app.city && <p className="text-[11px] font-medium text-on-surface-variant mb-1">{app.city}{app.state ? `, ${app.state}` : ""}</p>}

                                                {app.deadline && (
                                                    <p className={`text-xs font-medium ${daysLeft <= 5 ? "text-error font-bold bg-error/10 px-1 inline-block rounded" : "text-on-surface-variant"}`}>
                                                        ⏳ {formatDate(app.deadline)} {daysLeft >= 0 ? `(${daysLeft}d left)` : ""}
                                                    </p>
                                                )}

                                                {app.notes && <p className="mt-2 text-xs italic text-on-surface-variant bg-surface-container-low p-2 rounded-lg border border-outline-variant/10">{app.notes}</p>}

                                                {nextStatus[col.id] && (
                                                    <button
                                                        type="button"
                                                        onClick={() => moveApp(app.id, nextStatus[col.id])}
                                                        className="mt-3 flex items-center justify-center w-full gap-1 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 p-1.5 rounded-lg transition-colors"
                                                    >
                                                        Move Next <ChevronRight size={12} />
                                                    </button>
                                                )}
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                                {colApps.length === 0 && (
                                    <p className="py-6 text-center text-xs font-medium text-on-surface-variant/60 glass/50 rounded-xl border border-dashed border-outline-variant/20">Empty Area</p>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
