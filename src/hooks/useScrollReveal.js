import { useEffect, useRef, useState } from 'react'

/**
 * IntersectionObserver-based scroll reveal.
 * Returns { ref, isVisible }.
 * Automatically disabled when prefers-reduced-motion: reduce is set.
 *
 * @param {object} options
 * @param {number} options.threshold - default 0.18
 * @param {boolean} options.once    - default true (trigger once and stop observing)
 * @param {string}  options.rootMargin - default "-40px"
 */
export function useScrollReveal({ threshold = 0.18, once = true, rootMargin = '-40px' } = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once, rootMargin])

  return { ref, isVisible }
}

// Keep the old API for legacy usage: useAutoReveal
export function useAutoReveal() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'))
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    )

    const elements = document.querySelectorAll('.reveal:not(.revealed)')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

// Legacy default export
export default useScrollReveal
