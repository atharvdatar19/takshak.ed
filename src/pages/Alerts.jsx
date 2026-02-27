import DataState from "../components/DataState"
import PageHeader from "../components/PageHeader"
import { formatDate, isWithinRange } from "../lib/date"
import { useAsyncData } from "../hooks/useAsyncData"
import { getColleges } from "../services/api"

export default function Alerts() {
  const { data: colleges, loading, error } = useAsyncData(getColleges, [])

  const alerts = colleges.filter(college => isWithinRange(college.application_end, 5))

  return (
    <div>
      <PageHeader
        title="Alerts"
        description="Urgency feed for deadlines requiring immediate counselor action."
      />

      <DataState loading={loading} error={error} empty={alerts.length === 0}>
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className="rounded-xl border border-rose-200 bg-white p-5 shadow-sm">
              <p className="font-medium text-slate-900">{alert.name}</p>
              <p className="mt-1 text-sm text-rose-700">
                Application closes on {formatDate(alert.application_end)}
              </p>
            </div>
          ))}
        </div>
      </DataState>
    </div>
  )
}
