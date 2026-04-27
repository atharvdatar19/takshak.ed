import { useCallback, useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  AlertTriangle, Building2, CalendarDays, CheckCircle2,
  GraduationCap, IndianRupee, Loader2, RefreshCw,
  TrendingUp, Users, Clock, FileWarning, BookOpen,
  ShieldAlert, Zap,
} from "lucide-react"
import { adminGetDataHealth } from "@database/services/admin"
import { useAuth } from "@auth/AuthContext"

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  const colorMap = {
    indigo:  { bg: "bg-indigo-500/8",  border: "border-indigo-500/15",  text: "text-indigo-400",  icon: "bg-indigo-500/12" },
    emerald: { bg: "bg-emerald-500/8", border: "border-emerald-500/15", text: "text-emerald-400", icon: "bg-emerald-500/12" },
    violet:  { bg: "bg-violet-500/8",  border: "border-violet-500/15",  text: "text-violet-400",  icon: "bg-violet-500/12" },
    amber:   { bg: "bg-amber-500/8",   border: "border-amber-500/15",   text: "text-amber-400",   icon: "bg-amber-500/12" },
    rose:    { bg: "bg-rose-500/8",    border: "border-rose-500/15",    text: "text-rose-400",    icon: "bg-rose-500/12" },
    blue:    { bg: "bg-blue-500/8",    border: "border-blue-500/15",    text: "text-blue-400",    icon: "bg-blue-500/12" },
    teal:    { bg: "bg-teal-500/8",    border: "border-teal-500/15",    text: "text-teal-400",    icon: "bg-teal-500/12" },
  }
  const c = colorMap[color] || colorMap.indigo
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={`rounded-2xl border ${c.border} ${c.bg} p-5 space-y-3`}>
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${c.icon} ${c.text}`}>
        <Icon size={17} />
      </div>
      <div>
        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-black mt-0.5 ${c.text}`}>{value ?? "—"}</p>
        {sub && <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </motion.article>
  )
}

function HealthFlag({ label, value, severity }) {
  const s = {
    ok:   { bg: "bg-emerald-500/6 border-emerald-500/12", text: "text-emerald-400", dot: "bg-emerald-400" },
    info: { bg: "bg-blue-500/6 border-blue-500/12",       text: "text-blue-400",    dot: "bg-blue-400" },
    warn: { bg: "bg-amber-500/6 border-amber-500/12",     text: "text-amber-400",   dot: "bg-amber-400" },
    crit: { bg: "bg-rose-500/6 border-rose-500/12",       text: "text-rose-400",    dot: "bg-rose-400" },
  }[severity] || { bg: "bg-slate-500/6 border-slate-500/12", text: "text-slate-400", dot: "bg-slate-400" }

  return (
    <div className={`rounded-xl border ${s.bg} px-4 py-3 flex items-center justify-between gap-3`}>
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <span className={`text-lg font-black ${s.text}`}>{value}</span>
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const result = await adminGetDataHealth()
      setHealth(result)
    } catch (err) {
      setError(err.message || "Failed to load data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n ?? 0)
  const fmtRupee = (n) => n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000
      ? `₹${(n / 1000).toFixed(1)}k`
      : `₹${n ?? 0}`

  const name = user?.displayName || user?.email?.split("@")[0] || "Admin"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Welcome back, {name} 👋
          </h1>
          <p className="text-[11px] text-slate-600 mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-500 hover:text-indigo-400 transition text-xs font-medium">
          {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/8 border border-rose-500/15 px-4 py-3 text-xs text-rose-400 flex items-center gap-2">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      {loading && !health ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/[0.02] animate-pulse border border-white/[0.03]" />
          ))}
        </div>
      ) : health ? (
        <>
          {/* ── Core Metrics ── */}
          <section>
            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap size={10} /> Platform Totals
            </p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard icon={Users}        label="Total Users"     value={fmt(health.totals.users)}       color="indigo"  delay={0.00} />
              <StatCard icon={GraduationCap} label="Total Mentors"  value={fmt(health.totals.mentors)}     color="emerald" delay={0.04} />
              <StatCard icon={Building2}    label="Colleges"        value={fmt(health.totals.colleges)}    color="violet"  delay={0.08} />
              <StatCard icon={CalendarDays} label="Exams Listed"    value={fmt(health.totals.exams)}       color="blue"    delay={0.12} />
              <StatCard icon={Clock}        label="Total Sessions"  value={fmt(health.totals.sessions)}
                sub={`${health.health.completedSessions} completed`}                                       color="teal"    delay={0.16} />
              <StatCard icon={CheckCircle2} label="Done Sessions"   value={fmt(health.health.completedSessions)} color="emerald" delay={0.20} />
              <StatCard icon={IndianRupee}  label="Total Revenue"   value={fmtRupee(health.health.totalRevenue)}
                sub="captured transactions"                                                                color="amber"   delay={0.24} />
              <StatCard icon={TrendingUp}   label="Platform Fees"   value={fmtRupee(health.health.platformFees)}
                sub="Takshak's cut"                                                                        color="rose"    delay={0.28} />
            </div>
          </section>

          {/* ── Health Monitor ── */}
          <section>
            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert size={10} /> Action Required
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              <HealthFlag
                label="Unverified mentor applications"
                value={health.health.unverifiedMentors}
                severity={health.health.unverifiedMentors > 0 ? "warn" : "ok"}
              />
              <HealthFlag
                label="Open reports"
                value={health.health.openReports}
                severity={health.health.openReports > 2 ? "crit" : health.health.openReports > 0 ? "warn" : "ok"}
              />
              <HealthFlag
                label="Pending / confirmed sessions"
                value={health.health.pendingSessions}
                severity={health.health.pendingSessions > 10 ? "warn" : "info"}
              />
              <HealthFlag
                label="Total transactions logged"
                value={health.totals.transactions}
                severity="info"
              />
              <HealthFlag
                label="Total reports filed"
                value={health.totals.reports}
                severity={health.totals.reports > 5 ? "warn" : "ok"}
              />
              <HealthFlag
                label="Revenue vs fees ratio"
                value={health.health.totalRevenue > 0
                  ? `${((health.health.platformFees / health.health.totalRevenue) * 100).toFixed(1)}%`
                  : "—"}
                severity="info"
              />
            </div>
          </section>

          {/* ── Quick Access ── */}
          <section>
            <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <BookOpen size={10} /> Quick Access
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { href: "/admin/mentor-apps", label: "Review Mentor Applications", badge: health.health.unverifiedMentors, color: "indigo" },
                { href: "/admin/reports",     label: "Handle Open Reports",         badge: health.health.openReports,       color: "rose" },
                { href: "/admin/sessions",    label: "View Pending Sessions",       badge: health.health.pendingSessions,   color: "amber" },
                { href: "/admin/users",       label: "Manage Users",                badge: health.totals.users,             color: "violet" },
                { href: "/admin/payouts",     label: "Process Payouts",             badge: null,                           color: "emerald" },
                { href: "/admin/colleges",    label: "Update College Data",         badge: health.totals.colleges,          color: "blue" },
              ].map(link => (
                <a key={link.href} href={link.href}
                  className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] px-4 py-3.5 transition group">
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition">{link.label}</span>
                  {link.badge != null && link.badge > 0 && (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full
                      ${link.color === "rose"    ? "bg-rose-500/15 text-rose-400" :
                        link.color === "amber"   ? "bg-amber-500/15 text-amber-400" :
                        link.color === "emerald" ? "bg-emerald-500/15 text-emerald-400" :
                        link.color === "violet"  ? "bg-violet-500/15 text-violet-400" :
                        link.color === "blue"    ? "bg-blue-500/15 text-blue-400" :
                        "bg-indigo-500/15 text-indigo-400"}`}>
                      {link.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}
