import { motion } from "framer-motion"
import { BellRing, Clock3 } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import DataState from "../components/DataState"
import LoadingSkeleton from "../components/LoadingSkeleton"
import PageHeader from "../components/PageHeader"
import { formatDate, getDaysLeft } from "../lib/date"
import { getExamsTimeline } from "../services/api"
import { getCurrentUserProfile } from "../services/superapp"
import { useRealtimeSync } from "../hooks/useRealtimeSync"

export default function Timeline() {
  const [profile, setProfile] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

<<<<<<< HEAD
  useEffect(() => {
    async function loadTimeline() {
      try {
        setLoading(true)
        setError("")

        const userProfile = await getCurrentUserProfile()
        setProfile(userProfile)

        const data = await getExamsTimeline({
          stream: userProfile?.stream || "",
          state: userProfile?.state || "",
          targetExam: userProfile?.target_exam || "",
        })

        setTimeline(data || [])
      } catch (err) {
        setError(err.message || "Failed to load timeline")
      } finally {
        setLoading(false)
      }
=======
  const loadTimeline = useCallback(async () => {
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
>>>>>>> fea72e3 (Updated UI components and fixes)
    }
  }, [])

  useEffect(() => {
    loadTimeline()
  }, [loadTimeline])

  // ── Realtime: auto-reload when exams_timeline table changes ──
  useRealtimeSync("exams_timeline", () => loadTimeline())

  const now = new Date()

  const grouped = useMemo(() => {
    const upcoming = timeline.filter(
      (item) =>
        new Date(item.start_date || item.exam_date) >= now
    )

    const closingSoon = upcoming.filter((item) => {
      const end = item.end_date || item.exam_date
      const days = getDaysLeft(end)
      return days >= 0 && days <= 5
    })

    const recentlyAdded = [...timeline].slice(0, 5)

    return { upcoming, closingSoon, recentlyAdded }
<<<<<<< HEAD
  }, [timeline])
=======
  }, [timeline, now])
>>>>>>> fea72e3 (Updated UI components and fixes)

  return (
    <div>
      <PageHeader
        title="Smart Academic Timeline"
        description={`Filtered for ${profile?.stream || "all streams"}${
          profile?.state ? ` in ${profile.state}` : ""
        }.`}
      />

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <DataState
          loading={false}
          error={error}
          empty={timeline.length === 0}
        >
          <div className="grid gap-5 xl:grid-cols-3">
            <TimelineColumn
              title="Upcoming"
              items={grouped.upcoming}
              tone="indigo"
            />
            <TimelineColumn
              title="Closing Soon"
              items={grouped.closingSoon}
              tone="rose"
            />
            <TimelineColumn
              title="Recently Added"
              items={grouped.recentlyAdded}
              tone="emerald"
            />
          </div>
        </DataState>
      )}
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
      <h3 className="mb-4 text-base font-semibold text-slate-900">
        {title}
      </h3>

      {items.length === 0 ? (
        <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
          No records available.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const endDate = item.end_date || item.exam_date
            const daysLeft = getDaysLeft(endDate)

            return (
              <li
                key={item.id}
                className="rounded-lg border border-slate-100 bg-slate-50 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      {item.title || item.exam_name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {item.event_type || "exam"} •{" "}
                      {item.stream || "General"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(
                        item.start_date || item.exam_date
                      )}{" "}
                      → {formatDate(endDate)}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${toneClasses[tone]}`}
                  >
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
