import { useEffect, useState } from "react"
import supabase from "../supabaseClient"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Clock3,
  TrendingUp,
} from "lucide-react"

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function getDaysLeft(date) {
  return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))
}

export default function Dashboard() {
  const [colleges, setColleges] = useState([])
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: collegeData } = await supabase.from("colleges").select("*")
      const { data: examData } = await supabase.from("exams_timeline").select("*")
      setColleges(collegeData || [])
      setExams(examData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const today = new Date()

  const closingSoon = colleges
    .filter(c => {
      if (!c.application_end) return false
      const diff = (new Date(c.application_end) - today) / (1000 * 60 * 60 * 24)
      return diff <= 7 && diff >= 0
    })
    .sort((a, b) => new Date(a.application_end) - new Date(b.application_end))

  const upcomingExams = exams
    .filter(e => {
      if (!e.exam_date) return false
      const diff = (new Date(e.exam_date) - today) / (1000 * 60 * 60 * 24)
      return diff >= 0 && diff <= 14
    })
    .sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date))

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="animate-pulse text-slate-500">Loading dashboard insights...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 p-8 text-white shadow-xl"
      >
        <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Professional Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Admissions Command Center</h1>
        <p className="mt-3 max-w-2xl text-slate-200">
          Keep your team aligned with upcoming exams, application deadlines, and active
          opportunities from one executive-ready view.
        </p>
      </motion.section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Building2}
          title="Total Opportunities"
          value={colleges.length}
          subtitle="Live records from college directory"
          color="indigo"
        />
        <StatCard
          icon={CalendarDays}
          title="Upcoming Exams"
          value={upcomingExams.length}
          subtitle="Scheduled within next 14 days"
          color="violet"
        />
        <StatCard
          icon={AlertTriangle}
          title="Deadlines Approaching"
          value={closingSoon.length}
          subtitle="Applications closing within a week"
          color="rose"
        />
        <StatCard
          icon={TrendingUp}
          title="Active Listings"
          value={colleges.length}
          subtitle="Potential opportunities to explore"
          color="emerald"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Panel
          title="Application deadlines"
          icon={Clock3}
          iconClass="text-rose-500"
          emptyText="No deadlines in the next 7 days."
          items={closingSoon.slice(0, 5).map(item => ({
            title: item.name,
            meta: `Closes ${formatDate(item.application_end)}`,
            tag: `${getDaysLeft(item.application_end)}d left`,
            tone: "rose",
          }))}
        />

        <Panel
          title="Upcoming exams"
          icon={ArrowUpRight}
          iconClass="text-indigo-500"
          emptyText="No exams scheduled in the next 14 days."
          items={upcomingExams.slice(0, 5).map(item => ({
            title: item.exam_name,
            meta: `${item.college_name || "College"} • ${formatDate(item.exam_date)}`,
            tag: `${getDaysLeft(item.exam_date)}d left`,
            tone: "indigo",
          }))}
        />
      </section>
    </div>
  )
}

function StatCard({ icon: Icon, title, value, subtitle, color }) {
  const colorMap = {
    indigo: "bg-indigo-100 text-indigo-700",
    violet: "bg-violet-100 text-violet-700",
    rose: "bg-rose-100 text-rose-700",
    emerald: "bg-emerald-100 text-emerald-700",
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5 flex items-start justify-between">
        <div className={`rounded-xl p-3 ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
    </motion.div>
  )
}

function Panel({ title, icon: Icon, iconClass, items, emptyText }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-2">
        <Icon className={iconClass} size={18} />
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl bg-slate-50 px-4 py-6 text-sm text-slate-500">{emptyText}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-800">{item.title}</p>
                <p className="text-sm text-slate-500">{item.meta}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.tone === "rose"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {item.tag}
              </span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}
