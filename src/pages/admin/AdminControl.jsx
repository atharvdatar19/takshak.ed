import { useMemo, useState } from "react"
import PageHeader from "../../components/PageHeader"
import DataState from "../../components/DataState"
import { useAsyncData } from "../../hooks/useAsyncData"
import { getColleges, getExamsTimeline } from "../../services/api"

export default function AdminControl() {
  const [query, setQuery] = useState("")
  const collegesData = useAsyncData(getColleges, [])
  const examsData = useAsyncData(getExamsTimeline, [])

  const loading = collegesData.loading || examsData.loading
  const error = collegesData.error || examsData.error

  const filteredColleges = useMemo(
    () =>
      collegesData.data.filter(college =>
        college.name?.toLowerCase().includes(query.toLowerCase()),
      ),
    [collegesData.data, query],
  )

  return (
    <div>
      <PageHeader
        title="Admin Control Center"
        description="Operational guardrails for catalog quality, compliance and growth planning."
      />

      <DataState loading={loading} error={error} empty={!collegesData.data.length && !examsData.data.length}>
        <section className="grid gap-4 md:grid-cols-3">
          <AdminMetric label="Colleges Indexed" value={collegesData.data.length} />
          <AdminMetric label="Exam Records" value={examsData.data.length} />
          <AdminMetric label="Search Coverage" value="Realtime" />
        </section>

        <section className="mt-5 rounded-xl bg-white p-5 shadow-sm">
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Filter colleges for moderation..."
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
          />

          <ul className="mt-4 space-y-2">
            {filteredColleges.slice(0, 12).map(college => (
              <li key={college.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {college.name} — {college.city}, {college.state}
              </li>
            ))}
          </ul>
        </section>
      </DataState>
    </div>
  )
}

function AdminMetric({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}
