import { useEffect, useRef, useState } from 'react'

/**
 * Returns real-time scroll data, throttled via requestAnimationFrame.
 *
 * @returns {{ scrollProgress: number, scrollY: number, isScrolled: boolean }}
 *   scrollProgress — 0 to 1 (fraction of total scrollable distance)
 *   scrollY        — raw window.scrollY in px
 *   isScrolled     — true when scrollY > 80
 */
export function useScrollProgress() {
  const [state, setState] = useState({ scrollProgress: 0, scrollY: 0, isScrolled: false })
  const rafId = useRef(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      // Cancel any pending frame to avoid stale updates
      if (rafId.current) cancelAnimationFrame(rafId.current)

      rafId.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollProgress = docHeight > 0 ? Math.min(1, scrollY / docHeight) : 0

        // Only setState when value actually changes
        if (scrollY !== lastScrollY.current) {
          lastScrollY.current = scrollY
          setState({ scrollProgress, scrollY, isScrolled: scrollY > 80 })
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Seed initial state
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return state
}

export default useScrollProgress
