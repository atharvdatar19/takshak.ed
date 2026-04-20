import { motion } from "framer-motion"
import { ShieldCheck, Filter } from "lucide-react"
import { useEffect, useState } from "react"
import DataState from "../components/DataState"
import { useToast } from "../components/Toast"
import LoadingSkeleton from "../components/LoadingSkeleton"
import PageHeader from "../components/PageHeader"
import { getMentors } from "../services/api"
import { getCurrentUserProfile } from "../services/superapp"
import { takshakEducators, takshakFilters } from "../data/takshakData"

export default function MentorMarketplace() {
  const [profile, setProfile] = useState(null)
  const [stream, setStream] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("")
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { addToast } = useToast()

  useEffect(() => {
    async function hydrate() {
      try {
        const userProfile = await getCurrentUserProfile()
        setProfile(userProfile)
        setStream(userProfile?.stream || "")
      } catch (err) {
        console.error("Error fetching user profile:", err)
      }
    }
    hydrate()
  }, [])

  useEffect(() => {
    async function loadMentors() {
      setLoading(true)
      setError("")
      try {
        let data = []
        try {
          data = await getMentors({ stream })
        } catch (apiErr) {
          console.error("Supabase API error for mentors:", apiErr)
        }

        // Merge Edura Educators
        const eduraMapped = takshakEducators.map(e => ({
          id: e.id,
          name: e.name,
          is_verified: true,
          specialization: e.subject,
          stream: e.provider,
          experience_years: 5 + Math.floor(Math.random() * 10),
          rating: e.rating,
          price: 999,
          level: e.level,
          teachingStyle: e.teachingStyle,
          reach: e.reach,
          tags: e.tags
        }))

        setMentors([...(data || []), ...eduraMapped])
      } catch (err) {
        setError(err.message || "Failed to load mentors")
      } finally {
        setLoading(false)
      }
    }

    loadMentors()
  }, [stream])

  const filteredMentors = mentors.filter(m => {
    if (stream && stream !== "All streams") {
      const isAcademicProvider = ['PhysicsWallah', 'Unacademy', "Byju's", 'Made Easy', 'Ace Academy'].includes(m.stream);
      const isTechProvider = ['100xDevs', 'TakeUForward'].includes(m.stream);

      if (stream === 'Hackathons' || stream === 'Internships') {
        if (!m.tags?.includes(stream) && !isTechProvider && m.subject !== stream) return false;
      } else {
        if (m.stream !== stream && !isAcademicProvider) return false;
      }
    }
    if (selectedLevel && m.level && m.level !== selectedLevel) return false;
    if (selectedStyle && m.teachingStyle && m.teachingStyle !== selectedStyle) return false;
    return true;
  })

  // Deduplicate by ID
  const uniqueMentors = Array.from(new Map(filteredMentors.map(m => [m.id, m])).values());

  return (
    <div>
      <PageHeader
        title="Mentor & Educator Marketplace"
        description={`Discover verified mentors and top educators${profile?.stream ? ` for ${profile.stream}` : ""}.`}
      />

      <div className="mb-6 rounded-2xl border border-outline-variant/20 glass p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-10 transition-all">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter size={18} className="text-on-surface-variant/60 shrink-0" />
          <span className="text-sm font-bold text-on-surface shrink-0">Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full">
          <select
            value={stream}
            onChange={event => setStream(event.target.value)}
            className="flex-1 min-w-[140px] rounded-xl border border-outline-variant/20 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary/40 font-medium text-on-surface"
          >
            <option value="">All Domains & Streams</option>
            <option value="PCM">PCM</option>
            <option value="PCB">PCB</option>
            <option value="Commerce">Commerce</option>
            <option value="Arts">Arts</option>
            <option value="Hackathons">Hackathons & Open Source</option>
            <option value="Internships">Internships & Placements</option>
          </select>

          <select
            value={selectedLevel}
            onChange={event => setSelectedLevel(event.target.value)}
            className="flex-1 min-w-[140px] rounded-xl border border-outline-variant/20 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary/40 font-medium text-on-surface"
          >
            <option value="">All Levels</option>
            {takshakFilters.levels.map(l => <option key={l} value={l}>{l} Level</option>)}
          </select>

          <select
            value={selectedStyle}
            onChange={event => setSelectedStyle(event.target.value)}
            className="flex-1 min-w-[140px] rounded-xl border border-outline-variant/20 bg-surface-container-low px-3 py-2.5 text-sm outline-none focus:border-primary/40 font-medium text-on-surface"
          >
            <option value="">All Teaching Styles</option>
            {takshakFilters.teachingStyles.map(s => <option key={s} value={s}>{s} Style</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <DataState loading={false} error={error} empty={uniqueMentors.length === 0}>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {uniqueMentors.map(mentor => (
              <motion.article
                key={mentor.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-outline-variant/20 glass shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className="p-5 flex-1">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-on-surface leading-tight">{mentor.name}</h3>
                      <p className="text-sm font-semibold text-primary mt-0.5">{mentor.stream}</p>
                    </div>
                    {mentor.is_verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-tertiary/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-tertiary shadow-sm">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-on-surface-variant mb-2">{mentor.specialization}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.level && (
                      <span className="px-2 py-1 bg-primary/10 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded">
                        {mentor.level}
                      </span>
                    )}
                    {mentor.teachingStyle && (
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider rounded">
                        {mentor.teachingStyle}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-on-surface-variant bg-surface-container-low rounded-lg p-3 border border-outline-variant/10 mb-4">
                    <div className="text-center">
                      <p className="font-bold text-on-surface">{mentor.rating || "New"}</p>
                      <p className="text-[10px] uppercase">Rating ⭐</p>
                    </div>
                    <div className="w-px h-8 bg-surface-container-high"></div>
                    <div className="text-center">
                      <p className="font-bold text-on-surface">{mentor.reach || `${mentor.experience_years}+ yrs`}</p>
                      <p className="text-[10px] uppercase">Experience</p>
                    </div>
                    <div className="w-px h-8 bg-surface-container-high"></div>
                    <div className="text-center">
                      <p className="font-bold text-tertiary">₹{mentor.price || "NA"}</p>
                      <p className="text-[10px] uppercase">Session</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low border-t border-outline-variant/10">
                  <button
                    type="button"
                    onClick={() => addToast("success", `Booking request sent to ${mentor.name}!`)}
                    className="w-full rounded-xl bg-surface-container-highest px-3 py-3 text-sm font-bold text-white transition hover:bg-slate-800 shadow-md active:scale-95 flex justify-center items-center gap-2"
                  >
                    Request Session
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </DataState>
      )}
    </div>
  )
}
