import { motion } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { BellRing, Clock3, ExternalLink } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import DataState from "../components/DataState"
import LoadingSkeleton from "../components/LoadingSkeleton"
import PageHeader from "../components/PageHeader"
import { formatDate, getDaysLeft } from "../lib/date"
import { getExamsTimeline } from "../services/api"
import { getCurrentUserProfile } from "../services/superapp"
import { useRealtimeSync } from "../hooks/useRealtimeSync"
import { takshakDeadlines } from "../data/takshakData"

export default function Timeline() {
  const [profile, setProfile] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedType, setSelectedType] = useState("All")

  const loadTimeline = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      let userProfile = null
      let data = []
      try {
        userProfile = await getCurrentUserProfile()
        setProfile(userProfile)
        data = await getExamsTimeline({
          stream: userProfile?.stream || "",
          state: userProfile?.state || "",
          targetExam: userProfile?.target_exam || "",
        })
      } catch (apiErr) {
        console.error("Timeline API Error:", apiErr)
      }

      // Merge Edura Data
      const eduraMapped = takshakDeadlines.map(d => ({
        id: d.id,
        title: d.title,
        exam_name: d.title,
        event_type: d.type,
        stream: "All Streams",
        start_date: d.date,
        exam_date: d.date,
        end_date: d.date,
        organizingBody: d.organizingBody,
        prizeOrStipend: d.prizeOrStipend,
        link: d.link,
        description: d.description
      }))

      setTimeline([...(data || []), ...eduraMapped])
    } catch (err) {
      setError(err.message || "Failed to load timeline")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTimeline()
  }, [loadTimeline])

  // ── Realtime: auto-reload when exams_timeline table changes ──
  useRealtimeSync("exams_timeline", () => loadTimeline())

  const now = new Date()

  const grouped = useMemo(() => {
    const filteredTimeline = selectedType === "All"
      ? timeline
      : timeline.filter(item => item.event_type === selectedType)

    const upcoming = filteredTimeline.filter(
      (item) =>
        new Date(item.start_date || item.exam_date) >= now
    )

    const closingSoon = upcoming.filter((item) => {
      const end = item.end_date || item.exam_date
      const days = getDaysLeft(end)
      return days >= 0 && days <= 15 // Extended closing soon threshold to capture more events
    })

    const recentlyAdded = [...filteredTimeline].slice(0, 8) // Show more recent items

    return { upcoming, closingSoon, recentlyAdded }
  }, [timeline, selectedType])

  return (
    <div>
      <Helmet>
        <title>Academic Timeline & Deadlines | TAKSHAK</title>
        <meta name="description" content="Never miss an application deadline! Track JEE, NEET, CUET, hackathons, and scholarship timelines." />
        <meta property="og:title" content="Academic Timeline & Deadlines | TAKSHAK" />
        <meta property="og:description" content="Never miss an application deadline! Track JEE, NEET, CUET, hackathons, and scholarship timelines." />
      </Helmet>

      <PageHeader
        title="Smart Academic Timeline"
        description={`Filtered for ${profile?.stream || "all streams"}${profile?.state ? ` in ${profile.state}` : ""
          }. Includes Hackathons & Internships.`}
      />

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <DataState
          loading={false}
          error={error}
          empty={timeline.length === 0}
        >
          <div className="mb-6 flex flex-wrap gap-2">
            {["All", "Exam", "Hackathon", "Internship", "Scholarship"].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${selectedType === type
                    ? "bg-indigo-600 text-white shadow-indigo-200"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
              >
                {type === "All" ? "All Targets" : type + "s"}
              </button>
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            <TimelineColumn
              title="Upcoming Opportunities"
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

  // Deduplicate items based on ID to avoid duplicate keys
  const uniqueItems = Array.from(new Map(items.map(item => [item.id, item])).values());

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h3 className="mb-4 text-base font-semibold text-slate-900">
        {title}
      </h3>

      {uniqueItems.length === 0 ? (
        <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
          No records available.
        </p>
      ) : (
        <ul className="space-y-3">
          {uniqueItems.map((item) => {
            const endDate = item.end_date || item.exam_date
            const daysLeft = getDaysLeft(endDate)

            return (
              <li
                key={item.id}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4 hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 leading-tight">
                      {item.title || item.exam_name}
                    </p>

                    {item.organizingBody && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 inline-block px-1.5 py-0.5 rounded mt-1.5 mb-1.5 label-tag">
                        By {item.organizingBody}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 mb-1.5 leading-relaxed">
                      {item.description || `${item.event_type || "Exam"} • ${item.stream || "General"}`}
                    </p>

                    {item.prizeOrStipend && item.prizeOrStipend !== 'N/A' && (
                      <div className="flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded inline-flex mb-2">
                        <span>💰</span> {item.prizeOrStipend}
                      </div>
                    )}

                    <p className="mt-1 text-xs font-medium text-slate-600">
                      📅 {formatDate(item.start_date || item.exam_date)}{" "}
                      {endDate && endDate !== (item.start_date || item.exam_date) ? `→ ${formatDate(endDate)}` : ""}
                    </p>

                    {item.link && (
                      <a href={item.link} target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors w-max">
                        Learn More <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  <span
                    className={`shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-extrabold ${toneClasses[tone]} shadow-sm`}
                  >
                    <BellRing size={12} />
                    {daysLeft}d
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </motion.section>
  )
}
