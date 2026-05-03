import { useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SearchDropdown from './SearchDropdown'

export default function SearchBar({ popularTags = [], onNavigate }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(handler)
  }, [query])

  const showDropdown = focused && debouncedQuery.trim().length >= 2

  const handleSearch = () => {
    const q = query.trim()
    if (!q) return
    setFocused(false)
    navigate(`/colleges?q=${encodeURIComponent(q)}`)
  }

  const handleTagClick = (tag) => {
    setQuery(tag)
    setDebouncedQuery(tag)
    inputRef.current?.focus()
    navigate(`/colleges?q=${encodeURIComponent(tag)}`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleClear = () => {
    setQuery('')
    setDebouncedQuery('')
    inputRef.current?.focus()
  }

  return (
    <div className="w-full" style={{ position: 'relative' }}>
      {/* ── Search input shell ── */}
      <div
        style={{
          position: 'relative',
          height: '56px',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: focused
            ? '1px solid var(--accent-glow-intense)'
            : '1px solid var(--border-glass)',
          borderRadius: '16px',
          boxShadow: focused
            ? '0 0 0 3px var(--accent-glow), 0 8px 32px var(--shadow-glass)'
            : '0 4px 24px var(--shadow-glass)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 16px',
        }}
      >
        <Search
          size={20}
          style={{ color: 'var(--obsidian-primary)', flexShrink: 0, transition: 'color 0.2s ease' }}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Search exams, colleges, educators..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '15px',
            fontWeight: 500,
            color: 'var(--obsidian-on-surface)',
            caretColor: 'var(--obsidian-primary)',
          }}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'var(--obsidian-outline)', border: 'none', cursor: 'pointer',
              color: 'var(--obsidian-on-surface-variant)', flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        )}

        <button
          type="button"
          onClick={handleSearch}
          style={{
            flexShrink: 0, height: '36px', padding: '0 20px', borderRadius: '10px',
            background: 'var(--obsidian-primary)', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: 700, color: 'var(--obsidian-bg)',
            whiteSpace: 'nowrap', transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 16px var(--accent-glow-intense)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Search
        </button>
      </div>

      {/* ── Live Dropdown ── */}
      <SearchDropdown
        query={query}
        visible={showDropdown}
        onSelect={(item) => {
          setQuery('')
          setFocused(false)
          if (onNavigate) onNavigate(item)
        }}
      />

      {/* ── Popular tags ── */}
      {popularTags.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--obsidian-on-surface-variant)' }}>
            Popular:
          </span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              style={{
                height: '32px', padding: '0 14px', borderRadius: '9999px',
                background: 'var(--accent-glow)', border: '1px solid var(--accent-glow-intense)',
                color: 'var(--obsidian-primary)', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-glow-intense)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-glow)' }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
