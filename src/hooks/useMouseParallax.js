import { useEffect, useRef, useState } from 'react'

/**
 * Tracks mouse position relative to a container element.
 * Values are lerp-smoothed (factor 0.08) and normalised to −0.5..+0.5.
 *
 * @returns {{ ref: React.RefObject, x: number, y: number }}
 */
export function useMouseParallax() {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const rafId = useRef(null)

  const LERP = 0.08

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      target.current = {
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      }
    }

    const onMouseLeave = () => {
      target.current = { x: 0, y: 0 }
    }

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * LERP
      current.current.y += (target.current.y - current.current.y) * LERP
      setPos({ x: current.current.x, y: current.current.y })
      rafId.current = requestAnimationFrame(tick)
    }

    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)
    rafId.current = requestAnimationFrame(tick)

    return () => {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  return { ref, x: pos.x, y: pos.y }
}

export default useMouseParallax
