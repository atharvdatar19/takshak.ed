import { motion } from "framer-motion"
import { BellRing, Clock3 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import DataState from "../components/DataState"
import LoadingSkeleton from "../components/LoadingSkeleton"
import PageHeader from "../components/PageHeader"
import { formatDate, getDaysLeft } from "../lib/date"
import { getExamsTimeline } from "../services/api"
import { getCurrentUserProfile } from "../services/superapp"

export default function Timeline() {
  const [profile, setProfile] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadTimeline() {
      setLoading(true)
      setError("")

      try {
        const userProfile = await getCurrentUserProfile()
        setProfile(userProfile)
        const data = await getExamsTimeline({
          stream: userProfile?.stream || "",
          state: userProfile?.state || "",
          targetExam: userProfile?.target_exam || "",
        })
        setTimeline(data)
      } catch (err) {
        setError(err.message || "Failed to load timeline")
      } finally {
        setLoading(false)
      }
    }

    loadTimeline()
  }, [])

  const now = new Date()

  const grouped = useMemo(() => {
    const upcoming = timeline.filter(item => new Date(item.start_date || item.exam_date) >= now)
    const closingSoon = upcoming.filter(item => {
      const end = item.end_date || item.exam_date
      const days = getDaysLeft(end)
      return days >= 0 && days <= 5
    })
    const recentlyAdded = [...timeline].slice(0, 5)

    return { upcoming, closingSoon, recentlyAdded }
  }, [timeline, now])
import DataState from "../components/DataState"
import PageHeader from "../components/PageHeader"
import { formatDate } from "../lib/date"
import { trackEvent } from "../lib/analytics"
import { useAsyncData } from "../hooks/useAsyncData"
import { getExamsTimeline } from "../services/api"

export default function Timeline() {
  const { data: exams, loading, error } = useAsyncData(getExamsTimeline, [])

  return (
    <div>
      <PageHeader
        title="Smart Academic Timeline"
        description={`Filtered for ${profile?.stream || "all streams"}${profile?.state ? ` in ${profile.state}` : ""}.`}
      />

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <DataState loading={false} error={error} empty={timeline.length === 0}>
          <div className="grid gap-5 xl:grid-cols-3">
            <TimelineColumn title="Upcoming" items={grouped.upcoming} tone="indigo" />
            <TimelineColumn title="Closing Soon" items={grouped.closingSoon} tone="rose" />
            <TimelineColumn title="Recently Added" items={grouped.recentlyAdded} tone="emerald" />
          </div>
        </DataState>
      )}
        title="Upcoming Exams & Deadlines"
        description="Time-sequenced exam and registration visibility for high-conversion planning."
      />

      <DataState loading={loading} error={error} empty={exams.length === 0}>
        <div className="space-y-4">
          {exams.map(exam => (
            <div key={exam.id} className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">{exam.exam_name}</h3>
              <p className="mt-2 text-sm text-slate-600">
                Registration Ends: {formatDate(exam.registration_end)}
              </p>
              <p className="text-sm text-slate-600">Exam Date: {formatDate(exam.exam_date)}</p>
              <a
                href={exam.official_link}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("open_exam_link", { examId: exam.id })}
                className="mt-4 inline-block text-sm font-medium text-indigo-600"
              >
                Official Website →
              </a>
            </div>
          ))}
        </div>
      </DataState>
    </div>
  )
}

function TimelineColumn({ title, items, tone }) {
  const toneClasses = {
    indigo: "bg-indigo-100 text-indigo-700",
    rose: "bg-rose-100 text-rose-700",
    emerald: "bg-emerald-100 text-emerald-700",
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h3 className="mb-4 text-base font-semibold text-slate-900">{title}</h3>
      {items.length === 0 ? (
        <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No records available.</p>
      ) : (
        <ul className="space-y-3">
          {items.map(item => {
            const endDate = item.end_date || item.exam_date
            const daysLeft = getDaysLeft(endDate)
            return (
              <li key={item.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{item.title || item.exam_name}</p>
                    <p className="text-xs text-slate-500">{item.event_type || "exam"} • {item.stream || "General"}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(item.start_date || item.exam_date)} → {formatDate(endDate)}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${toneClasses[tone]}`}>
                    <BellRing size={12} />
                    {daysLeft}d
                  </span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-500">
                  <Clock3 size={12} />
                  Reminder enabled
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </motion.section>
  )
}
