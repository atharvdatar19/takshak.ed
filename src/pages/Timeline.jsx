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
