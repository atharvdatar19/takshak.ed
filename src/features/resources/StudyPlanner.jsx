import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Helmet } from "react-helmet-async"
import {
  BookOpen, CalendarDays, Check, ChevronRight,
  Clock, Loader2, Plus, RotateCcw, Sparkles, Trash2, Target,
} from "lucide-react"
import { useAuth } from "@auth/AuthContext"
import {
  getUserGoals, createGoal, updateGoalStatus,
  getUserStudyPlans, createStudyPlan,
  getStudySessions, logStudySession,
  getStudyStats,
} from "@database/services/study"

// ── Constants ─────────────────────────────────────────────────────────────────
const EXAMS = ["JEE Main", "JEE Advanced", "NEET", "CUET", "NDA", "CAT", "CLAT", "BITSAT", "GATE", "UPSC"]
const SUBJECTS_MAP = {
  "JEE Main":     ["Physics", "Chemistry", "Mathematics"],
  "JEE Advanced": ["Physics", "Chemistry", "Mathematics"],
  "NEET":         ["Physics", "Chemistry", "Biology"],
  "CUET":         ["English", "Domain Subjects", "General Test"],
  "NDA":          ["Mathematics", "General Ability"],
  "CAT":          ["Verbal Ability", "Data Interpretation", "Logical Reasoning", "Quantitative Aptitude"],
  "CLAT":         ["English", "GK", "Legal Reasoning", "Logical Reasoning", "Quant"],
  "BITSAT":       ["Physics", "Chemistry", "Mathematics", "English & Verbal Reasoning"],
  "GATE":         ["Engineering Mathematics", "Core Subject", "Aptitude"],
  "UPSC":         ["History", "Geography", "Polity", "Economy", "Science & Tech", "Current Affairs"],
}

const PHASE_CONFIG = [
  { key: "concepts", label: "Phase 1: Concept Building", color: "#6366f1", accent: "rgba(99,102,241,0.1)"  },
  { key: "practice", label: "Phase 2: Practice & PYQs",  color: "#f59e0b", accent: "rgba(245,158,11,0.1)"  },
  { key: "revision", label: "Phase 3: Revision & Mocks", color: "#10b981", accent: "rgba(16,185,129,0.1)"  },
]

function daysLeft(dateStr) {
  if (!dateStr) return 0
  return Math.max(0, Math.ceil((new Date(dateStr) - new Date()) / 86400000))
}

function generateSchedule(exam, examDate, hoursPerDay) {
  const subjects = SUBJECTS_MAP[exam] || []
  const totalDays = Math.max(7, daysLeft(examDate))
  const weeksLeft = Math.ceil(totalDays / 7)
  const phaseWeeks = Math.max(1, Math.floor(weeksLeft / 3))

  return {
    exam, examDate, hoursPerDay, totalDays, weeksLeft,
    phases: [
      {
        ...PHASE_CONFIG[0],
        weeks: phaseWeeks,
        tasks: subjects.map(s => ({ id: `c_${s}`, subject: s, task: `${s} — Full syllabus coverage (NCERT + standard textbook)`, hours: Math.round((phaseWeeks * 7 * hoursPerDay) / subjects.length) })),
      },
      {
        ...PHASE_CONFIG[1],
        weeks: phaseWeeks,
        tasks: subjects.map(s => ({ id: `p_${s}`, subject: s, task: `${s} — DPPs, chapter-wise PYQs, timed problem sets`, hours: Math.round((phaseWeeks * 7 * hoursPerDay) / subjects.length) })),
      },
      {
        ...PHASE_CONFIG[2],
        weeks: Math.max(1, weeksLeft - 2 * phaseWeeks),
        tasks: [
          { id: "r_mocks",    subject: "All", task: "Full-length mock tests — 3 per week minimum",         hours: Math.round(totalDays * hoursPerDay * 0.4) },
          { id: "r_weak",     subject: "All", task: "Weak chapter targeted revision",                       hours: Math.round(totalDays * hoursPerDay * 0.35) },
          { id: "r_formulas", subject: "All", task: "Formula sheets, shortcuts and rapid-fire revision",    hours: Math.round(totalDays * hoursPerDay * 0.25) },
        ],
      },
    ],
    checked: {},
  }
}

// ── Goal card ─────────────────────────────────────────────────────────────────
function GoalCard({ goal, onToggle }) {
  const done = goal.status === "completed"
  return (
    <div
      className="flex items-start gap-3 rounded-xl p-3.5"
      style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)", opacity: done ? 0.6 : 1 }}
    >
      <button type="button" onClick={() => onToggle(goal.id, done ? "active" : "completed")} className="mt-0.5 shrink-0">
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full transition"
          style={{ background: done ? "#10b981" : "transparent", border: `2px solid ${done ? "#10b981" : "var(--obsidian-outline-variant)"}` }}
        >
          {done && <Check size={11} color="#fff" />}
        </span>
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold" style={{ color: "var(--obsidian-on-surface)", textDecoration: done ? "line-through" : "none" }}>{goal.title}</p>
        {goal.target_date && (
          <p className="text-[11px]" style={{ color: daysLeft(goal.target_date) <= 3 ? "#ef4444" : "var(--obsidian-on-surface-variant)" }}>
            {daysLeft(goal.target_date)}d left
          </p>
        )}
      </div>
    </div>
  )
}

// ── Log session modal ─────────────────────────────────────────────────────────
function LogSessionModal({ exam, onClose, onLog }) {
  const subjects = SUBJECTS_MAP[exam] || []
  const [form, setForm] = useState({ subject: subjects[0] || "", durationMinutes: 60, notes: "" })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function submit() {
    setSaving(true)
    await onLog(form)
    setSaving(false)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl p-6 space-y-4"
        style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}
      >
        <h3 className="text-base font-bold" style={{ color: "var(--obsidian-on-surface)" }}>Log Study Session</h3>
        <select value={form.subject} onChange={e => set("subject", e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{ background: "var(--accent-glow)", color: "var(--obsidian-on-surface)", border: "1px solid var(--obsidian-outline-variant)" }}>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div>
          <div className="mb-1 flex justify-between">
            <label className="text-[12px] font-semibold" style={{ color: "var(--obsidian-on-surface-variant)" }}>Duration</label>
            <span className="text-[12px] font-bold" style={{ color: "var(--obsidian-primary)" }}>{form.durationMinutes} min</span>
          </div>
          <input type="range" min={15} max={300} step={15} value={form.durationMinutes} onChange={e => set("durationMinutes", +e.target.value)} className="w-full" />
        </div>
        <input value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Notes (optional)"
          className="w-full rounded-xl px-4 py-3 text-sm outline-none"
          style={{ background: "var(--accent-glow)", color: "var(--obsidian-on-surface)", border: "1px solid var(--obsidian-outline-variant)" }} />
        <button type="button" onClick={submit} disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, var(--obsidian-primary), var(--obsidian-secondary))" }}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Log Session
        </button>
      </motion.div>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function StudyPlanner() {
  const { user } = useAuth?.() || {}
  const [examChoice, setExamChoice] = useState("JEE Main")
  const [examDate, setExamDate] = useState("")
  const [hoursPerDay, setHoursPerDay] = useState(6)
  const [plan, setPlan] = useState(null)
  const [checked, setChecked] = useState({})
  const [goals, setGoals] = useState([])
  const [stats, setStats] = useState({ totalMinutes: 0, sessions: 0, subjects: {} })
  const [showLogModal, setShowLogModal] = useState(false)
  const [newGoal, setNewGoal] = useState("")
  const [loading, setLoading] = useState(!!user)
  const isDemo = !user

  // Load cloud data for logged-in users
  useEffect(() => {
    if (!user) { setLoading(false); return }
    Promise.all([
      getUserGoals(user.email),
      getStudyStats(user.email, 7),
      getUserStudyPlans(user.email),
    ]).then(([goalsData, statsData, plansData]) => {
      setGoals(goalsData)
      setStats(statsData)
      // Load most recent plan if exists
      if (plansData.length) {
        const latest = plansData[0]
        if (latest.exam_target && latest.target_date) {
          const gen = generateSchedule(latest.exam_target, latest.target_date, latest.weekly_hours ? latest.weekly_hours / 7 : 6)
          setPlan(gen)
          setExamChoice(latest.exam_target)
          setExamDate(latest.target_date)
        }
      }
      setLoading(false)
    })
  }, [user])

  function generatePlan() {
    if (!examDate) return
    const p = generateSchedule(examChoice, examDate, hoursPerDay)
    setPlan(p)
    // Save to cloud if logged in
    if (user) {
      createStudyPlan({ userEmail: user.email, title: `${examChoice} — ${examDate}`, examTarget: examChoice, targetDate: examDate, weeklyHours: hoursPerDay * 7, subjects: SUBJECTS_MAP[examChoice] || [] })
    }
  }

  function toggleTask(taskId) {
    setChecked(p => ({ ...p, [taskId]: !p[taskId] }))
  }

  async function handleGoalAdd() {
    if (!newGoal.trim()) return
    const goal = { title: newGoal.trim(), status: "active" }
    if (user) {
      const { data } = await createGoal({ userEmail: user.email, title: goal.title, category: "study" })
      if (data) setGoals(p => [data, ...p])
    } else {
      setGoals(p => [{ id: Date.now(), ...goal }, ...p])
    }
    setNewGoal("")
  }

  async function handleGoalToggle(goalId, newStatus) {
    setGoals(p => p.map(g => g.id === goalId ? { ...g, status: newStatus } : g))
    if (user) await updateGoalStatus(goalId, user.email, newStatus)
  }

  async function handleLogSession(form) {
    if (!user) return
    await logStudySession({ userEmail: user.email, ...form })
    const fresh = await getStudyStats(user.email, 7)
    setStats(fresh)
  }

  // Progress
  const allTasks = plan ? plan.phases.flatMap(p => p.tasks) : []
  const completedCount = allTasks.filter(t => checked[t.id]).length
  const progressPct = allTasks.length ? Math.round((completedCount / allTasks.length) * 100) : 0

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 size={28} className="animate-spin" style={{ color: "var(--obsidian-primary)" }} />
    </div>
  )

  return (
    <>
      <Helmet><title>Study Planner — TAKSHAK</title></Helmet>

      <div className="mx-auto max-w-4xl space-y-6">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={18} style={{ color: "var(--obsidian-primary)" }} />
              <h1 className="text-xl font-black" style={{ color: "var(--obsidian-on-surface)" }}>Study Planner</h1>
            </div>
            <p className="text-sm" style={{ color: "var(--obsidian-on-surface-variant)" }}>
              Generate a phase-wise study plan, set goals and track your sessions.
              {isDemo && <span className="ml-1 font-semibold" style={{ color: "#f59e0b" }}>Sign in to sync to the cloud.</span>}
            </p>
          </div>
          {user && (
            <button type="button" onClick={() => setShowLogModal(true)}
              className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--obsidian-primary), var(--obsidian-secondary))" }}>
              <Plus size={15} /> Log Session
            </button>
          )}
        </div>

        {/* ── Stats strip (when logged in) ── */}
        {user && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Study time (7d)",  value: `${Math.round(stats.totalMinutes / 60)}h`, icon: Clock        },
              { label: "Sessions (7d)",    value: stats.sessions,                           icon: CalendarDays  },
              { label: "Goals done",       value: goals.filter(g => g.status === "completed").length, icon: Check },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}>
                <s.icon size={16} className="mx-auto mb-1" style={{ color: "var(--obsidian-primary)" }} />
                <p className="text-xl font-black" style={{ color: "var(--obsidian-on-surface)" }}>{s.value}</p>
                <p className="text-[10px] font-semibold" style={{ color: "var(--obsidian-on-surface-variant)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Two-column layout ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Plan generator + Goals */}
          <div className="space-y-4">
            {/* Plan generator card */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}>
              <h3 className="flex items-center gap-2 text-[14px] font-bold" style={{ color: "var(--obsidian-on-surface)" }}>
                <Sparkles size={14} style={{ color: "var(--obsidian-primary)" }} /> Generate Plan
              </h3>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold" style={{ color: "var(--obsidian-on-surface-variant)" }}>Target Exam</label>
                <select value={examChoice} onChange={e => setExamChoice(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                  style={{ background: "var(--accent-glow)", color: "var(--obsidian-on-surface)", border: "1px solid var(--obsidian-outline-variant)" }}>
                  {EXAMS.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold" style={{ color: "var(--obsidian-on-surface-variant)" }}>Exam Date</label>
                <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl px-3 py-2.5 text-sm"
                  style={{ background: "var(--accent-glow)", color: "var(--obsidian-on-surface)", border: "1px solid var(--obsidian-outline-variant)" }} />
              </div>

              <div>
                <div className="mb-1 flex justify-between">
                  <label className="text-[11px] font-semibold" style={{ color: "var(--obsidian-on-surface-variant)" }}>Hours per day</label>
                  <span className="text-[12px] font-black" style={{ color: "var(--obsidian-primary)" }}>{hoursPerDay}h</span>
                </div>
                <input type="range" min={2} max={12} step={0.5} value={hoursPerDay} onChange={e => setHoursPerDay(+e.target.value)} className="w-full" />
              </div>

              {examDate && plan && (
                <div className="rounded-xl p-3 text-center" style={{ background: "var(--accent-glow)" }}>
                  <p className="text-[11px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                    <span className="text-lg font-black" style={{ color: "var(--obsidian-primary)" }}>{daysLeft(examDate)}</span> days left
                    · <span className="font-bold">{plan.weeksLeft}</span> weeks
                  </p>
                </div>
              )}

              <button type="button" onClick={generatePlan} disabled={!examDate}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, var(--obsidian-primary), var(--obsidian-secondary))" }}>
                {plan ? <><RotateCcw size={13} /> Regenerate</> : <><Sparkles size={13} /> Generate Plan</>}
              </button>
            </div>

            {/* Goals */}
            <div className="rounded-2xl p-5 space-y-3" style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}>
              <h3 className="flex items-center gap-2 text-[14px] font-bold" style={{ color: "var(--obsidian-on-surface)" }}>
                <Target size={14} style={{ color: "#10b981" }} /> Goals
              </h3>
              <div className="flex gap-2">
                <input value={newGoal} onChange={e => setNewGoal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleGoalAdd()}
                  placeholder="Add a goal..."
                  className="flex-1 rounded-xl px-3 py-2 text-[13px] outline-none"
                  style={{ background: "var(--accent-glow)", color: "var(--obsidian-on-surface)", border: "1px solid var(--obsidian-outline-variant)" }} />
                <button type="button" onClick={handleGoalAdd} className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--obsidian-primary)", color: "#fff" }}>
                  <Plus size={15} />
                </button>
              </div>
              {goals.length === 0 ? (
                <p className="text-[12px] text-center py-2" style={{ color: "var(--obsidian-on-surface-variant)" }}>No goals yet</p>
              ) : (
                <div className="space-y-2">
                  {goals.slice(0, 8).map(g => <GoalCard key={g.id} goal={g} onToggle={handleGoalToggle} />)}
                </div>
              )}
            </div>
          </div>

          {/* Right: Plan phases */}
          <div className="lg:col-span-2">
            {!plan ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl py-20 text-center" style={{ background: "var(--obsidian-surface)", border: "1px dashed var(--obsidian-outline-variant)" }}>
                <Sparkles size={32} className="opacity-30" style={{ color: "var(--obsidian-on-surface)" }} />
                <p className="font-semibold" style={{ color: "var(--obsidian-on-surface)" }}>Select your exam and date</p>
                <p className="text-sm" style={{ color: "var(--obsidian-on-surface-variant)" }}>Your personalised phase-wise plan will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Progress bar */}
                <div className="rounded-2xl p-4" style={{ background: "var(--obsidian-surface)", border: "1px solid var(--obsidian-outline-variant)" }}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[13px] font-bold" style={{ color: "var(--obsidian-on-surface)" }}>Overall Progress</span>
                    <span className="text-[13px] font-black" style={{ color: "var(--obsidian-primary)" }}>{progressPct}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full" style={{ background: "var(--obsidian-outline-variant)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, var(--obsidian-primary), var(--obsidian-secondary))" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <p className="mt-1 text-[11px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                    {completedCount} of {allTasks.length} tasks completed
                  </p>
                </div>

                {/* Phases */}
                {plan.phases.map((phase) => (
                  <div key={phase.key} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${phase.color}30` }}>
                    {/* Phase header */}
                    <div className="flex items-center justify-between px-4 py-3" style={{ background: phase.accent }}>
                      <h4 className="text-[13px] font-bold" style={{ color: phase.color }}>{phase.label}</h4>
                      <span className="text-[11px] font-semibold" style={{ color: phase.color }}>{phase.weeks}w</span>
                    </div>
                    {/* Tasks */}
                    <div className="divide-y" style={{ divideColor: "var(--obsidian-outline-variant)" }}>
                      {phase.tasks.map(task => (
                        <button
                          key={task.id}
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-white/2"
                          style={{ background: checked[task.id] ? `${phase.color}05` : "var(--obsidian-surface)" }}
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition"
                            style={{ background: checked[task.id] ? phase.color : "transparent", border: `2px solid ${checked[task.id] ? phase.color : "var(--obsidian-outline-variant)"}` }}>
                            {checked[task.id] && <Check size={11} color="#fff" />}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold" style={{ color: "var(--obsidian-on-surface)", textDecoration: checked[task.id] ? "line-through" : "none", opacity: checked[task.id] ? 0.5 : 1 }}>
                              {task.task}
                            </p>
                            <p className="text-[11px]" style={{ color: "var(--obsidian-on-surface-variant)" }}>
                              {task.subject !== "All" && `${task.subject} · `}{task.hours}h planned
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLogModal && (
          <LogSessionModal exam={examChoice} onClose={() => setShowLogModal(false)} onLog={handleLogSession} />
        )}
      </AnimatePresence>
    </>
  )
}
