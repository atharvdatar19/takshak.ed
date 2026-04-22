import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import {
  Bookmark,
  Calendar,
  ExternalLink,
  Filter,
  GraduationCap,
  Home,
  Laptop,
  MapPin,
  Monitor,
  Search,
  Sparkles,
  TrendingUp,
  Video,
  Wifi,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useToast } from "../components/ui/Toast"
import DataState from "../components/misc/DataState"
import LoadingSkeleton from "../components/ui/LoadingSkeleton"
import { StaggerContainer, StaggerItem, MagneticCard } from "../components/animations/AnimationUtils"
import { formatDate, getDaysLeft } from "../lib/date"
import { getCurrentUserProfile } from "../services/superapp"
import { getColleges } from "../services/api"
import { useRealtimeSync } from "../hooks/useRealtimeSync"

const PAGE_SIZE = 8
const FACILITY_ICONS = [Home, Monitor, Laptop, Wifi, GraduationCap]

export default function CollegeDirectory() {
  const [profile, setProfile] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [total, setTotal] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    state: "",
    stream: "",
    admissionMode: "",
    status: "open",
    page: 1,
  })

  const { addToast } = useToast()

  useEffect(() => {
    async function hydrate() {
      const userProfile = await getCurrentUserProfile()
      setProfile(userProfile)
      setFilters(previous => ({ ...previous, stream: userProfile?.stream || "" }))
    }
    hydrate()
  }, [])

  useEffect(() => {
    loadColleges()
  }, [filters])

  const loadColleges = useCallback(async () => {
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
  }, [filters])

  useRealtimeSync("colleges", () => loadColleges())

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total])
  const states = useMemo(() => [...new Set(records.map(item => item.state).filter(Boolean))], [records])

  function updateFilter(key, value) {
    setFilters(previous => ({ ...previous, [key]: value, page: 1 }))
  }

  return (
    <div>
      {/* ── SEO Meta ── */}
      <Helmet>
        <title>College Directory 2024 | Find Top NITs, IITs & Universities | TAKSHAK</title>
        <meta name="description" content="Explore India's premier educational institutions. Filter by state, stream, and admission mode to find your perfect college with TAKSHAK." />
      </Helmet>

      {/* ── Purple Gradient Hero ── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient mb-6 rounded-3xl p-8 text-center text-white shadow-xl md:p-12"
      >
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 shadow-lg">
          <GraduationCap size={40} />
        </div>
        <h1 className="text-4xl font-extrabold md:text-5xl">College Directory</h1>
        <p className="mt-3 text-lg text-white/80">
          Discover {total || "60+"}  premier institutions across India
        </p>
        <Link
          to="/rank-reality"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl hover:-translate-y-0.5"
        >
          <Sparkles size={18} /> Get AI Recommendations <Sparkles size={14} />
        </Link>
      </motion.section>

      {/* ── Search Bar ── */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-5 space-y-3 rounded-3xl border border-slate-200/60 bg-white p-5 shadow-card"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <Search size={16} className="text-slate-400" />
            <input
              value={filters.search}
              onChange={event => updateFilter("search", event.target.value)}
              placeholder="Search colleges, cities, or states..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <GraduationCap size={16} className="text-slate-400" />
            <input
              placeholder="Search by program (e.g., B.Tech, MBBS)"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(p => !p)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
        >
          <Filter size={14} /> {showFilters ? "Hide" : "Show"} Advanced Filters
        </button>

        {showFilters && (
          <div className="grid gap-3 pt-2 md:grid-cols-4">
            <select value={filters.state} onChange={event => updateFilter("state", event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
              <option value="">All states</option>
              {states.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
            <select value={filters.stream} onChange={event => updateFilter("stream", event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
              <option value="">All streams</option>
              <option value="PCM">PCM</option>
              <option value="PCB">PCB</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
              <option value="Defence">Defence</option>
            </select>
            <select value={filters.admissionMode} onChange={event => updateFilter("admissionMode", event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
              <option value="">All modes</option>
              <option value="JEE">JEE</option>
              <option value="NEET">NEET</option>
              <option value="CUET">CUET</option>
              <option value="Lateral">Lateral</option>
              <option value="Direct">Direct</option>
            </select>
            <select value={filters.status} onChange={event => updateFilter("status", event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
              <option value="open">Open</option>
              <option value="closingSoon">Closing soon</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        )}
      </motion.section>

      {/* ── College Cards ── */}
      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <DataState loading={false} error={error} empty={records.length === 0}>
          <StaggerContainer stagger={0.05} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {records.map((college, i) => {
              const daysLeft = getDaysLeft(college.application_end)
              const streams = college.streams_supported || []
              return (
                <StaggerItem key={college.id} className="h-full">
                  <MagneticCard intensity={0.05} className="h-full">
                    <article className="scroll-3d-card group h-full overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-card transition-all hover:shadow-card-hover">
                      <div className="card-gradient-blue relative flex h-28 items-center justify-between px-5 py-4">
                        <span className="rounded-full border border-green-300 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          {college.type || "private"}
                        </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                      <GraduationCap size={20} className="text-white" />
                    </div>
                  </div>

                  <div className="space-y-3 p-5">
                    <h3 className="text-lg font-bold text-slate-900">{college.name}</h3>
                    <p className="flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin size={13} /> {college.city}, {college.state}
                    </p>

                    {streams.length > 0 && (
                      <div>
                        <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          <GraduationCap size={12} /> Programs
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {streams.map(s => (
                            <span key={s} className="rounded-full border border-indigo-200 px-2.5 py-0.5 text-xs font-medium text-indigo-600">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <Sparkles size={12} className="text-amber-500" /> Facilities
                      </p>
                      <div className="flex gap-2">
                        {FACILITY_ICONS.map((FIcon, idx) => (
                          <div key={idx} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400">
                            <FIcon size={14} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Calendar size={13} /> Est. {college.established_year || "N/A"}
                    </p>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => addToast("success", `Tracking established for ${college.name}`)}
                        className="flex items-center gap-1.5 rounded-xl border border-amber-300 px-3 py-2 text-xs font-medium text-amber-700 transition hover:bg-amber-50"
                      >
                        <Bookmark size={12} /> Track
                      </button>
                      <button
                        type="button"
                        onClick={() => addToast("info", "Trending data will be available shortly")}
                        className="flex items-center justify-center rounded-xl border border-amber-300 px-3 py-2 text-xs font-medium text-amber-700 transition hover:bg-amber-50"
                      >
                        <TrendingUp size={12} />
                      </button>
                    </div>

                    {college.website && (
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <ExternalLink size={12} /> Visit Website
                      </a>
                    )}

                    {daysLeft >= 0 && daysLeft <= 5 && (
                      <p className="rounded-xl bg-rose-100 px-3 py-1.5 text-center text-xs font-semibold text-rose-700">
                        ⏰ Closing in {daysLeft} days
                      </p>
                    )}
                  </div>
                </article>
              </MagneticCard>
            </StaggerItem>
              )
            })}
          </StaggerContainer>

          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              disabled={filters.page <= 1}
              onClick={() => setFilters(previous => ({ ...previous, page: previous.page - 1 }))}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-sm text-slate-600">Page {filters.page} of {totalPages}</p>
            <button
              type="button"
              disabled={filters.page >= totalPages}
              onClick={() => setFilters(previous => ({ ...previous, page: previous.page + 1 }))}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </DataState>
      )}
    </div>
  )
}
