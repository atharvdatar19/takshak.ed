import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import DataState from "../components/DataState"
import LoadingSkeleton from "../components/LoadingSkeleton"
import PageHeader from "../components/PageHeader"
import { formatDate, getDaysLeft } from "../lib/date"
import { getCurrentUserProfile } from "../services/superapp"
import { getColleges } from "../services/api"

const PAGE_SIZE = 8

export default function CollegeDirectory() {
  const [profile, setProfile] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({
    search: "",
    state: "",
    stream: "",
    admissionMode: "",
    status: "open",
    page: 1,
  })

  useEffect(() => {
    async function hydrate() {
      const userProfile = await getCurrentUserProfile()
      setProfile(userProfile)
      setFilters(previous => ({ ...previous, stream: userProfile?.stream || "" }))
    }

    hydrate()
  }, [])

  useEffect(() => {
    async function loadColleges() {
      setLoading(true)
      setError("")

      try {
        const response = await getColleges({ ...filters, pageSize: PAGE_SIZE })
        setRecords(response.records)
        setTotal(response.total)
      } catch (err) {
        setError(err.message || "Failed to load colleges")
      } finally {
        setLoading(false)
      }
    }

    loadColleges()
  }, [filters])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total])
  const states = useMemo(() => [...new Set(records.map(item => item.state).filter(Boolean))], [records])

  function updateFilter(key, value) {
    setFilters(previous => ({ ...previous, [key]: value, page: 1 }))
  }

  return (
    <div>
      <PageHeader
        title="College Directory"
        description={`Personalized for ${profile?.stream || "All Streams"} with admission intelligence and conversion-first filtering.`}
      />

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-5"
      >
        <input
          value={filters.search}
          onChange={event => updateFilter("search", event.target.value)}
          placeholder="Search college"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={filters.state}
          onChange={event => updateFilter("state", event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All states</option>
          {states.map(state => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          value={filters.stream}
          onChange={event => updateFilter("stream", event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All streams</option>
          <option value="PCM">PCM</option>
          <option value="PCB">PCB</option>
          <option value="Commerce">Commerce</option>
          <option value="Arts">Arts</option>
          <option value="Defence">Defence</option>
        </select>
        <select
          value={filters.admissionMode}
          onChange={event => updateFilter("admissionMode", event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All modes</option>
          <option value="JEE">JEE</option>
          <option value="NEET">NEET</option>
          <option value="CUET">CUET</option>
          <option value="Lateral">Lateral</option>
          <option value="Direct">Direct</option>
        </select>
        <select
          value={filters.status}
          onChange={event => updateFilter("status", event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="open">Open</option>
          <option value="closingSoon">Closing soon</option>
          <option value="closed">Closed</option>
        </select>
      </motion.section>

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <DataState loading={false} error={error} empty={records.length === 0}>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {records.map(college => {
              const daysLeft = getDaysLeft(college.application_end)
              return (
                <motion.article
                  key={college.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -3 }}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-slate-900">{college.name}</h3>
                    {college.is_featured && (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{college.city}, {college.state}</p>
                  <p className="mt-2 text-sm text-slate-600">Mode: {college.admission_mode || "NA"}</p>
                  <p className="text-sm text-slate-600">Type: {college.type || "NA"}</p>
                  <p className="mt-2 text-sm text-slate-600">End: {formatDate(college.application_end)}</p>

                  {daysLeft >= 0 && daysLeft <= 5 && (
                    <p className="mt-3 rounded-lg bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
                      Closing in {daysLeft} days
                    </p>
                  )}
                </motion.article>
              )
            })}
          </section>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              disabled={filters.page <= 1}
              onClick={() => setFilters(previous => ({ ...previous, page: previous.page - 1 }))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-sm text-slate-600">Page {filters.page} of {totalPages}</p>
            <button
              type="button"
              disabled={filters.page >= totalPages}
              onClick={() => setFilters(previous => ({ ...previous, page: previous.page + 1 }))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </DataState>
      )}
    </div>
  )
}
