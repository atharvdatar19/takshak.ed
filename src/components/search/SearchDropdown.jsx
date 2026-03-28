import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, GraduationCap, Users, Building, Shield } from 'lucide-react'
import supabase, { isDemoMode } from '../../supabaseClient'
import { useNavigate } from 'react-router-dom'

const DEMO_RESULTS = [
  { id: 1, type: 'exam', title: 'JEE Advanced', subtitle: 'Joint Entrance Examination', slug: 'jee' },
  { id: 2, type: 'exam', title: 'NEET UG', subtitle: 'National Eligibility cum Entrance Test', slug: 'neet' },
  { id: 3, type: 'exam', title: 'GATE 2026', subtitle: 'Graduate Aptitude Test in Engineering', slug: 'gate' },
  { id: 4, type: 'course', title: 'JEE Complete Course', subtitle: 'Physics Wallah', slug: 'jee-complete' },
  { id: 5, type: 'mentor', title: 'Paarth Ainchwar', subtitle: 'Medic Student (NEET)', slug: 'paarth' },
  { id: 6, type: 'mentor', title: 'Anshika Pathak', subtitle: 'CBSE 10th & 12th Expert', slug: 'anshika' },
  { id: 7, type: 'college', title: 'IIT Bombay', subtitle: 'Indian Institute of Technology', slug: 'iit-bombay' },
  { id: 8, type: 'college', title: 'NIT Trichy', subtitle: 'National Institute of Technology', slug: 'nit-trichy' },
  { id: 9, type: 'defence', title: 'NDA Written Exam Prep', subtitle: 'Defence Mentorship', slug: 'nda' },
  { id: 10, type: 'defence', title: 'SSB Interview Guidance', subtitle: 'Hemant Singh Bhadoriya', slug: 'ssb' },
]

async function fetchResults(query) {
  if (isDemoMode || !supabase) {
    // Demo mode: filter static results
    const q = query.toLowerCase()
    return DEMO_RESULTS.filter(
      (r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)
    )
  }

  const [examsRes, coursesRes] = await Promise.all([
    supabase
      .from('exams')
      .select('id, name, full_name, slug')
      .ilike('name', `%${query}%`)
      .limit(4),
    supabase
      .from('courses')
      .select('id, title, provider, slug')
      .ilike('title', `%${query}%`)
      .limit(4),
  ])

  const exams = (examsRes.data || []).map((e) => ({
    id: e.id,
    type: 'exam',
    title: e.name,
    subtitle: e.full_name || '',
    slug: e.slug || e.id,
  }))

  const courses = (coursesRes.data || []).map((c) => ({
    id: c.id,
    type: 'course',
    title: c.title,
    subtitle: c.provider || '',
    slug: c.slug || c.id,
  }))

  return [...exams, ...courses]
}

/**
 * Live search dropdown — appears when query has ≥ 2 chars.
 * Dark-themed, Edura-pattern-inspired.
 */
export default function SearchDropdown({ query, visible, onSelect }) {
  const [results, setResults] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (visible && query.trim().length < 2) {
      try {
        const saved = JSON.parse(localStorage.getItem('mentorbhaiyaa_recent_searches') || '[]')
        setRecentSearches(saved)
      } catch {
        setRecentSearches([])
      }
      setResults([])
      return
    }

    if (!visible) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await fetchResults(query.trim())
        setResults(data)
      } catch (err) {
        console.error('[SearchDropdown]', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 280)

    return () => clearTimeout(debounceRef.current)
  }, [query, visible])

  const handleSelect = (item) => {
    try {
      const saved = JSON.parse(localStorage.getItem('mentorbhaiyaa_recent_searches') || '[]')
      const updated = [item, ...saved.filter(i => i.id !== item.id)].slice(0, 5)
      localStorage.setItem('mentorbhaiyaa_recent_searches', JSON.stringify(updated))
    } catch {}

    let path = '/'
    if (item.type === 'exam') path = `/timeline`
    else if (item.type === 'course') path = `/resources`
    else if (item.type === 'mentor') path = `/mentors?search=${encodeURIComponent(item.title)}`
    else if (item.type === 'college') path = `/colleges`
    else if (item.type === 'defence') path = `/defence`

    onSelect(item)
    navigate(path)
  }

  // Escape key to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onSelect(null) }
    if (visible) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, onSelect])

  const showRecents = query.trim().length < 2
  const displayItems = showRecents ? recentSearches : results
  const shouldRender = visible && (displayItems.length > 0 || loading || (!loading && !showRecents && results.length === 0))

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: [0.19, 1, 0.22, 1] }}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            zIndex: 200,
            background: 'var(--obsidian-surface)',
            border: '1px solid var(--border-glass)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '16px',
            maxHeight: '380px',
            overflowY: 'auto',
            boxShadow: '0 24px 64px var(--shadow-glass)',
          }}
        >
          {loading && (
            <div style={{ padding: '16px 20px', color: 'var(--obsidian-on-surface-variant)', fontSize: '13px' }}>
              Searching...
            </div>
          )}

          {!loading && !showRecents && results.length === 0 && (
            <div style={{ padding: '16px 20px', color: 'var(--obsidian-on-surface-variant)', fontSize: '13px' }}>
              No results for &quot;{query}&quot;
            </div>
          )}

          {showRecents && recentSearches.length > 0 && (
            <div style={{ padding: '8px 16px 4px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--obsidian-on-surface-variant)' }}>
              Recent Searches
            </div>
          )}

          {!loading && displayItems.map((item) => {
            let Icon = BookOpen
            let badgeText = 'Course'
            let colorVar = 'var(--obsidian-primary)'
            let bgVar = 'var(--accent-glow)'
            let borderVar = 'var(--accent-glow-intense)'

            if (item.type === 'exam') {
              Icon = GraduationCap
              badgeText = 'Exam'
              colorVar = 'var(--obsidian-secondary)'
              bgVar = 'rgba(99,102,241,0.1)'
              borderVar = 'rgba(99,102,241,0.2)'
            } else if (item.type === 'mentor') {
              Icon = Users
              badgeText = 'Mentor'
              colorVar = 'var(--obsidian-tertiary, #e879f9)'
              bgVar = 'rgba(232,121,249,0.1)'
              borderVar = 'rgba(232,121,249,0.2)'
            } else if (item.type === 'college') {
              Icon = Building
              badgeText = 'College'
              colorVar = '#38bdf8'
              bgVar = 'rgba(56,189,248,0.1)'
              borderVar = 'rgba(56,189,248,0.2)'
            } else if (item.type === 'defence') {
              Icon = Shield
              badgeText = 'Defence'
              colorVar = '#34d399'
              bgVar = 'rgba(52,211,153,0.1)'
              borderVar = 'rgba(52,211,153,0.2)'
            }

            return (
              <button
                key={`${item.type}-${item.id}`}
                type="button"
                onClick={() => handleSelect(item)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: '1px solid var(--obsidian-outline-variant)',
                  transition: 'background 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-glow)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none'
                }}
              >
                {/* Type icon */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: bgVar,
                  }}
                >
                  <Icon size={18} style={{ color: colorVar }} />
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--obsidian-on-surface)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.title}
                  </p>
                  {item.subtitle && (
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'var(--obsidian-on-surface-variant)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {/* Type badge */}
                <span
                  style={{
                    flexShrink: 0,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: bgVar,
                    color: colorVar,
                    border: `1px solid ${borderVar}`,
                  }}
                >
                  {badgeText}
                </span>
              </button>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
