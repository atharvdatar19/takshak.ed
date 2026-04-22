import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Bell, Clock } from "lucide-react"
import DataState from "../components/misc/DataState"
import PageHeader from "../components/layout/PageHeader"
import { formatDate, getDaysLeft, isWithinRange } from "../lib/date"
import { useAsyncData } from "../hooks/useAsyncData"
import { getColleges } from "../services/api"
import { getExamsTimeline } from "../services/api"

async function fetchAlertData() {
  const [collegeResult, exams] = await Promise.all([
    getColleges({ status: "closingSoon" }),
    getExamsTimeline(),
  ])

  const closingColleges = (collegeResult?.records || []).filter(c =>
    isWithinRange(c.application_end, 7),
  )

  const upcomingExams = (exams || []).filter(e => {
    const d = e.end_date || e.exam_date || e.start_date
    return d && isWithinRange(d, 7)
  })

  return { closingColleges, upcomingExams }
}

export default function Alerts() {
  const { data, loading, error } = useAsyncData(fetchAlertData, [])
  const { closingColleges = [], upcomingExams = [] } = data || {}

  const totalAlerts = closingColleges.length + upcomingExams.length

  return (
    <div>
      <PageHeader
        title="Smart Alerts"
        description="Deadline intelligence — colleges closing and exams approaching within 7 days."
      />

      <DataState loading={loading} error={error} empty={totalAlerts === 0}>
        <div className="space-y-6">
          {/* ── College Deadline Alerts ── */}
          {closingColleges.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <AlertTriangle size={18} className="text-rose-600" />
                College Applications Closing
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {closingColleges.map(college => {
                    const daysLeft = getDaysLeft(college.application_end)
                    return (
                      <motion.article
                        key={college.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between rounded-xl border border-rose-200 bg-white p-5 shadow-sm"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{college.name}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {college.city}, {college.state} · {college.admission_mode || "General"}
                          </p>
                          <p className="mt-1 text-sm text-rose-600">
                            <Clock size={12} className="mr-1 inline" />
                            Closes {formatDate(college.application_end)}
                          </p>
                        </div>
                        <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${daysLeft <= 2
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                          }`}>
                          {daysLeft}d left
                        </span>
                      </motion.article>
                    )
                  })}
                </AnimatePresence>
              </div>
            </section>
          )}

          {/* ── Exam Deadline Alerts ── */}
          {upcomingExams.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Bell size={18} className="text-indigo-600" />
                Upcoming Exam Deadlines
              </h2>
              <div className="space-y-3">
                <AnimatePresence>
                  {upcomingExams.map(exam => {
                    const endDate = exam.end_date || exam.exam_date || exam.start_date
                    const daysLeft = getDaysLeft(endDate)
                    return (
                      <motion.article
                        key={exam.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between rounded-xl border border-indigo-200 bg-white p-5 shadow-sm"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{exam.title || exam.exam_name}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {exam.stream || "General"} · {exam.event_type || "Exam"}
                          </p>
                          <p className="mt-1 text-sm text-indigo-600">
                            <Clock size={12} className="mr-1 inline" />
                            {formatDate(endDate)}
                          </p>
                        </div>
                        <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${daysLeft <= 2
                            ? "bg-rose-100 text-rose-700"
                            : "bg-indigo-100 text-indigo-700"
                          }`}>
                          {daysLeft}d left
                        </span>
                      </motion.article>
                    )
                  })}
                </AnimatePresence>
              </div>
            </section>
          )}
        </div>
      </DataState>
    </div>
  )
}
