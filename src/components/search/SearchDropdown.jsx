import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, GraduationCap } from 'lucide-react'
import supabase, { isDemoMode } from '@database/supabaseClient'
import { useNavigate } from 'react-router-dom'

const DEMO_RESULTS = [
  { id: 1, type: 'exam', title: 'JEE Advanced', subtitle: 'Joint Entrance Examination Advanced', slug: 'jee-advanced' },
  { id: 2, type: 'exam', title: 'NEET UG', subtitle: 'National Eligibility cum Entrance Test', slug: 'neet' },
  { id: 3, type: 'exam', title: 'GATE 2026', subtitle: 'Graduate Aptitude Test in Engineering', slug: 'gate' },
  { id: 4, type: 'course', title: 'JEE Complete Course 2026', subtitle: 'Physics Wallah', slug: 'jee-complete' },
  { id: 5, type: 'course', title: 'NEET Droppers Batch', subtitle: 'Aakash Institute', slug: 'neet-droppers' },
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
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!visible || query.trim().length < 2) {
      setResults([])
      return
    }

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
    onSelect(item)
    if (item.type === 'exam') {
      navigate(`/timeline?q=${encodeURIComponent(item.title)}`)
    } else {
      navigate(`/marketplace?q=${encodeURIComponent(item.title)}`)
    }
  }

  // Escape key to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onSelect(null) }
    if (visible) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, onSelect])

  return (
    <AnimatePresence>
      {visible && (
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

          {!loading && results.length === 0 && (
            <div style={{ padding: '16px 20px', color: 'var(--obsidian-on-surface-variant)', fontSize: '13px' }}>
              No results for &quot;{query}&quot;
            </div>
          )}

          {!loading && results.map((item) => {
            const isExam = item.type === 'exam'
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
                    background: isExam
                      ? 'rgba(99,102,241,0.1)'
                      : 'var(--accent-glow)',
                  }}
                >
                  {isExam
                    ? <GraduationCap size={18} style={{ color: 'var(--obsidian-secondary)' }} />
                    : <BookOpen size={18} style={{ color: 'var(--obsidian-primary)' }} />
                  }
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
                    background: isExam
                      ? 'rgba(99,102,241,0.1)'
                      : 'var(--accent-glow)',
                    color: isExam ? 'var(--obsidian-secondary)' : 'var(--obsidian-primary)',
                    border: `1px solid ${isExam ? 'rgba(99,102,241,0.2)' : 'var(--accent-glow-intense)'}`,
                  }}
                >
                  {isExam ? 'Exam' : 'Course'}
                </span>
              </button>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
