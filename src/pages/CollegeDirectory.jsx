import { useMemo, useState } from "react"
import DataState from "../components/DataState"
import PageHeader from "../components/PageHeader"
import { formatDate, isWithinRange } from "../lib/date"
import { trackEvent } from "../lib/analytics"
import { useAsyncData } from "../hooks/useAsyncData"
import { getColleges } from "../services/api"

export default function CollegeDirectory() {
  const [search, setSearch] = useState("")
  const { data: colleges, loading, error } = useAsyncData(getColleges, [])

  const filtered = useMemo(
    () => colleges.filter(c => c.name?.toLowerCase().includes(search.toLowerCase())),
    [colleges, search],
  )

  return (
    <div>
      <PageHeader
        title="College Opportunities"
        description="Discovery pipeline for high-intent admissions opportunities across India."
      />

      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <input
          type="text"
          placeholder="Search college..."
          value={search}
          onChange={event => setSearch(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none focus:border-indigo-500"
        />
      </div>

      <DataState loading={loading} error={error} empty={filtered.length === 0}>
        <div className="grid gap-5 lg:grid-cols-2">
          {filtered.map(college => (
            <article key={college.id} className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{college.name}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {college.city}, {college.state}
              </p>
              <p className="mt-3 text-sm text-slate-700">Admission Type: {college.admission_type}</p>
              <p className="text-sm text-slate-700">Last Date: {formatDate(college.application_end)}</p>

              {isWithinRange(college.application_end, 5) && (
                <span className="mt-3 inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700">
                  Closing Soon
                </span>
              )}

              <a
                href={college.official_link}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("open_college_link", { collegeId: college.id })}
                className="mt-4 block text-sm font-medium text-indigo-600"
              >
                Official Link →
              </a>
            </article>
          ))}
        </div>
      </DataState>
    </div>
  )
}
