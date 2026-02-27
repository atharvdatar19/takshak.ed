import DataState from "../components/DataState"
import PageHeader from "../components/PageHeader"
import { formatDate } from "../lib/date"
import { trackEvent } from "../lib/analytics"
import { useAsyncData } from "../hooks/useAsyncData"
import { getExamsTimeline } from "../services/api"

export default function Timeline() {
  const { data, loading, error } = useAsyncData(getExamsTimeline, [])

  // Ensure safe fallback
  const exams = data || []

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageHeader
        title="Upcoming Exams & Deadlines"
        description="Time-sequenced exam and registration visibility for high-conversion planning."
      />

      <DataState
        loading={loading}
        error={error}
        empty={!loading && exams.length === 0}
      >
        <div className="space-y-4">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-all border border-slate-100"
            >
              <h3 className="font-semibold text-slate-900 text-lg">
                {exam.exam_name}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Registration Ends: {formatDate(exam.registration_end)}
              </p>

              <p className="text-sm text-slate-600">
                Exam Date: {formatDate(exam.exam_date)}
              </p>

              {exam.official_link && (
                <a
                  href={exam.official_link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    trackEvent("open_exam_link", { examId: exam.id })
                  }
                  className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Official Website →
                </a>
              )}
            </div>
          ))}
        </div>
      </DataState>
    </div>
  )
}
