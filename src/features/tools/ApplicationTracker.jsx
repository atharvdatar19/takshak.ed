import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Helmet } from "react-helmet-async"
import {
  Plus, X, Trash2, ChevronRight, GraduationCap, Briefcase,
  CodeXml, Award, Clock, CheckCircle2, AlertCircle, Loader2,
  ClipboardList,
} from "lucide-react"
import { useAuth } from "@auth/AuthContext"
import {
  getUserApplications,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
} from "@database/services/applications"

// ── Constants ─────────────────────────────────────────────────────────────────

const COLUMNS = [
  { id: "planning",         label: "Planning",         color: "#94a3b8", bg: "rgba(148,163,184,0.08)"  },
  { id: "applied",          label: "Applied",           color: "#6366f1", bg: "rgba(99,102,241,0.08)"  },
  { id: "documents_pending",label: "Docs Pending",      color: "#f59e0b", bg: "rgba(245,158,11,0.08)"  },
  { id: "under_review",     label: "Under Review",      color: "#06b6d4", bg: "rgba(6,182,212,0.08)"   },
  { id: "accepted",         label: "Accepted",          color: "#10b981", bg: "rgba(16,185,129,0.08)"  },
  { id: "rejected",         label: "Rejected",          color: "#ef4444", bg: "rgba(239,68,68,0.08)"   },
]

const STATUS_FLOW = {
  planning: "applied",
  applied: "documents_pending",
  documents_pending: "under_review",
  under_review: "accepted",
}

const TYPE_CONFIG = {
  College:     { icon: GraduationCap, color: "#6366f1" },
  Internship:  { icon: Briefcase,     color: "#f59e0b" },
  Hackathon:   { icon: CodeXml,       color: "#8b5cf6" },
  Scholarship: { icon: Award,         color: "#10b981" },
}

const DEMO_APPS = [
  { id: "d1", title: "IIT Bombay — B.Tech CSE", type: "College", status: "planning", deadline: "2026-06-15", notes: "JEE Advanced required" },
  { id: "d2", title: "Google STEP Internship", type: "Internship", status: "applied", deadline: "2026-05-01", notes: "Resume submitted" },
  { id: "d3", title: "Flipkart GRiD 6.0", type: "Hackathon", status: "under_review", deadline: "2026-05-10", notes: "Round 1 cleared" },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function daysLeft(dateStr) {
  if (!dateStr) return null
  const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000)
  return diff
}

function DeadlineBadge({ deadline }) {
  if (!deadline) return null
  const d = daysLeft(deadline)
  if (d < 0) return <span className="text-[10px] font-bold" style={{ color: "#ef4444" }}>Expired</span>
  if (d <= 3) return <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: "#ef4444" }}><AlertCircle size={10} /> {d}d left</span>
  if (d <= 10) return <span className="text-[10px] font-bold" style={{ color: "#f59e0b" }}>{d}d left</span>
  return <span className="text-[10px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>{d}d left</span>
}

// ── App Card ─────────────────────────────────────────────────────────────────

function AppCard({ app, onMove, onDelete, isDemo }) {
  const cfg = TYPE_CONFIG[app.type] || TYPE_CONFIG.College
  const Icon = cfg.icon
  const next = STATUS_FLOW[app.status]
  const nextLabel = COLUMNS.find(c => c.id === next)?.label

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group rounded-xl p-3.5 space-y-2.5"
      style={{
        background: "var(--obsidian-surface)",
        border: "1px solid var(--obsidian-outline-variant)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: `${cfg.color}18` }}>
            <Icon size={13} style={{ color: cfg.color }} />
          </div>
          <p className="text-[13px] font-bold leading-snug" style={{ color: "var(--obsidian-on-surface)" }}>
            {app.title}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDelete(app.id)}
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: "var(--obsidian-on-surface-variant)" }}
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Deadline */}
      <div className="flex items-center justify-between">
        {app.deadline && (
          <div className="flex items-center gap-1" style={{ color: "var(--obsidian-on-surface-variant)" }}>
            <Clock size={10} />
            <span className="text-[10px]">{new Date(app.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
          </div>
        )}
        <DeadlineBadge deadline={app.deadline} />
      </div>

      {/* Notes */}
      {app.notes && (
        <p className="text-[11px] italic leading-relaxed" style={{ color: "var(--obsidian-on-surface-variant)", borderLeft: `2px solid var(--obsidian-outline-variant)`, paddingLeft: "8px" }}>
          {app.notes}
        </p>
      )}

      {/* Move next */}
      {next && !isDemo && (
        <button
          type="button"
          onClick={() => onMove(app.id, next)}
          className="flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-bold transition hover:opacity-80"
          style={{ background: `${cfg.color}14`, color: cfg.color }}
        >
          → {nextLabel} <ChevronRight size={11} />
        </button>
      )}
    </motion.div>
  )
}

// ── Add Modal ─────────────────────────────────────────────────────────────────

function AddModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: "", type: "College", deadline: "", notes: "" })
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function submit() {
    if (!form.title) return
    setSaving(true)
    await onAdd(form)
    setSaving(false)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-4"
        style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold" style={{ color: "var(--obsidian-on-surface)" }}>Add to Tracker</h3>
          <button type="button" onClick={onClose} style={{ color: "var(--obsidian-on-surface-variant)" }}><X size={18} /></button>
        </div>

        {/* Type select */}
        <select
          value={form.type}
          onChange={e => set("type", e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none"
          style={{ background: "var(--accent-glow)", color: "var(--obsidian-on-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
        >
          <option value="College">🎓 College Application</option>
          <option value="Internship">💼 Internship / Job</option>
          <option value="Hackathon">💻 Hackathon / Competition</option>
          <option value="Scholarship">🏆 Scholarship</option>
        </select>

        <input
          value={form.title}
          onChange={e => set("title", e.target.value)}
          placeholder="Name (e.g. IIT Bombay B.Tech CSE)"
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{ background: "var(--accent-glow)", color: "var(--obsidian-on-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold" style={{ color: "var(--obsidian-on-surface-variant)" }}>Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={e => set("deadline", e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm"
              style={{ background: "var(--accent-glow)", color: "var(--obsidian-on-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold" style={{ color: "var(--obsidian-on-surface-variant)" }}>Type</label>
            <div className="flex items-center h-[42px] rounded-xl px-3 text-[11px] font-bold" style={{ background: `${TYPE_CONFIG[form.type]?.color}18`, color: TYPE_CONFIG[form.type]?.color }}>
              {form.type}
            </div>
          </div>
        </div>

        <textarea
          value={form.notes}
          onChange={e => set("notes", e.target.value)}
          placeholder="Notes (optional)"
          rows={2}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none"
          style={{ background: "var(--accent-glow)", color: "var(--obsidian-on-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
        />

        <button
          type="button"
          onClick={submit}
          disabled={!form.title || saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, var(--obsidian-primary), var(--obsidian-secondary))" }}
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
          Track Opportunity
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ApplicationTracker() {
  const { user } = useAuth?.() || {}
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const isDemo = !user

  useEffect(() => {
    if (!user) { setApps(DEMO_APPS); setLoading(false); return }
    getUserApplications(user.email).then(data => {
      setApps(data.length ? data : [])
      setLoading(false)
    })
  }, [user])

  async function handleAdd(form) {
    if (!user) { setApps(p => [{ id: "demo-" + Date.now(), ...form, status: "planning" }, ...p]); return }
    const { data } = await createApplication({
      userEmail: user.email,
      collegeId: null,
      programName: form.title,
      applicationDeadline: form.deadline || null,
      notes: form.notes,
    })
    if (data) setApps(p => [data, ...p])
  }

  async function handleMove(id, newStatus) {
    setApps(p => p.map(a => a.id === id ? { ...a, status: newStatus } : a))
    if (user) await updateApplicationStatus(id, user.email, newStatus)
  }

  async function handleDelete(id) {
    setApps(p => p.filter(a => a.id !== id))
    if (user) await deleteApplication(id, user.email)
  }

  // Sort: soonest deadline first within each column
  function colApps(status) {
    return apps
      .filter(a => a.status === status)
      .sort((a, b) => {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline) - new Date(b.deadline)
      })
  }

  // Summary stats
  const stats = COLUMNS.slice(0, 4).map(c => ({ label: c.label, count: apps.filter(a => a.status === c.id).length, color: c.color }))

  return (
    <>
      <Helmet><title>Application Tracker — TAKक्षक</title></Helmet>

      <div className="space-y-6">
        {/* ── Page header ── */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList size={18} style={{ color: "var(--obsidian-primary)" }} />
              <h1 className="text-xl font-black" style={{ color: "var(--obsidian-on-surface)" }}>Application Tracker</h1>
            </div>
            <p className="text-sm" style={{ color: "var(--obsidian-on-surface-variant)" }}>
              Track every college, internship, hackathon and scholarship in one board.
              {isDemo && <span className="ml-1 font-semibold" style={{ color: "#f59e0b" }}>Sign in to save your data.</span>}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, var(--obsidian-primary), var(--obsidian-secondary))" }}
          >
            <Plus size={15} /> Add
          </button>
        </div>

        {/* ── Summary strip ── */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.count}</p>
              <p className="text-[11px] font-semibold" style={{ color: "var(--obsidian-on-surface-variant)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Kanban ── */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin" style={{ color: "var(--obsidian-primary)" }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {COLUMNS.map(col => {
              const items = colApps(col.status || col.id)
              return (
                <div
                  key={col.id}
                  className="flex flex-col gap-3 rounded-2xl p-3"
                  style={{ background: col.bg, border: `1px solid ${col.color}30`, minHeight: "180px" }}
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[12px] font-bold" style={{ color: col.color }}>{col.label}</span>
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black"
                      style={{ background: `${col.color}20`, color: col.color }}
                    >
                      {items.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-2">
                    <AnimatePresence>
                      {items.map(app => (
                        <AppCard
                          key={app.id}
                          app={app}
                          onMove={handleMove}
                          onDelete={handleDelete}
                          isDemo={isDemo}
                        />
                      ))}
                    </AnimatePresence>
                    {items.length === 0 && (
                      <div className="flex items-center justify-center rounded-xl py-6 text-[11px] font-medium" style={{ color: `${col.color}60`, border: `1px dashed ${col.color}30` }}>
                        Empty
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Accepted / Rejected row (full width) ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[COLUMNS[4], COLUMNS[5]].map(col => {
            const items = colApps(col.id)
            return (
              <div key={col.id} className="rounded-2xl p-4 space-y-2" style={{ background: col.bg, border: `1px solid ${col.color}30` }}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[13px] font-bold" style={{ color: col.color }}>
                    {col.id === "accepted" ? <CheckCircle2 size={15} /> : <X size={15} />} {col.label}
                  </span>
                  <span className="text-[12px] font-black" style={{ color: col.color }}>{items.length}</span>
                </div>
                {items.length === 0 ? (
                  <p className="text-[11px]" style={{ color: `${col.color}60` }}>None yet</p>
                ) : (
                  items.map(app => (
                    <div key={app.id} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}>
                      <span className="text-[13px] font-semibold" style={{ color: "var(--obsidian-on-surface)" }}>{app.title}</span>
                      <button type="button" onClick={() => handleDelete(app.id)} style={{ color: "var(--obsidian-on-surface-variant)" }}><Trash2 size={12} /></button>
                    </div>
                  ))
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      </AnimatePresence>
    </>
  )
}
