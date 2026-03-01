import { motion } from "framer-motion"
import { ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import DataState from "../components/DataState"
import { useToast } from "../components/Toast"
import LoadingSkeleton from "../components/LoadingSkeleton"
import PageHeader from "../components/PageHeader"
import { getMentors } from "../services/api"
import { getCurrentUserProfile } from "../services/superapp"

export default function MentorMarketplace() {
  const [profile, setProfile] = useState(null)
  const [stream, setStream] = useState("")
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { addToast } = useToast()

  useEffect(() => {
    async function hydrate() {
      const userProfile = await getCurrentUserProfile()
      setProfile(userProfile)
      setStream(userProfile?.stream || "")
    }
    hydrate()
  }, [])

  useEffect(() => {
    async function loadMentors() {
      setLoading(true)
      setError("")
      try {
        const data = await getMentors({ stream })
        setMentors(data)
      } catch (err) {
        setError(err.message || "Failed to load mentors")
      } finally {
        setLoading(false)
      }
    }

    loadMentors()
  }, [stream])

  return (
    <div>
      <PageHeader
        title="Mentor Marketplace"
        description={`Discover verified mentors${profile?.stream ? ` for ${profile.stream}` : ""}.`}
      />

      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <select
          value={stream}
          onChange={event => setStream(event.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All streams</option>
          <option value="PCM">PCM</option>
          <option value="PCB">PCB</option>
          <option value="Commerce">Commerce</option>
          <option value="Arts">Arts</option>
          <option value="Defence">Defence</option>
        </select>
      </div>

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <DataState loading={false} error={error} empty={mentors.length === 0}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mentors.map(mentor => (
              <motion.article
                key={mentor.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">{mentor.name}</h3>
                  {mentor.is_verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                      <ShieldCheck size={12} /> Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600">{mentor.specialization || mentor.stream}</p>
                <p className="mt-1 text-sm text-slate-500">{mentor.experience_years || 0}+ years experience</p>
                <p className="mt-2 text-sm font-medium text-indigo-700">⭐ {mentor.rating || "NA"} • ₹{mentor.price || "NA"}</p>
                <button
                  type="button"
                  onClick={() => addToast("success", `Booking request sent to ${mentor.name}!`)}
                  className="mt-4 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                >
                  Request Booking
                </button>
              </motion.article>
            ))}
          </div>
        </DataState>
      )}
    </div>
  )
}
