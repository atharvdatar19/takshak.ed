import { useEffect, useRef, useState } from 'react'

/**
 * Animated number counter using IntersectionObserver.
 * Triggers once when element enters viewport.
 *
 * @prop {number}   target     - end value
 * @prop {number}   duration   - ms, default 1600
 * @prop {string}   suffix     - appended after number, e.g. "+"
 * @prop {string}   prefix     - prepended before number, e.g. "₹"
 * @prop {Function} formatter  - custom (n: number) => string
 * @prop {string}   className
 */
export default function CountUp({
  target,
  duration = 1600,
  suffix = '',
  prefix = '',
  formatter,
  className = '',
}) {
  const ref = useRef(null)
  const [count, setCount] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let start = null

          const easeOutExpo = (progress) => 1 - Math.pow(2, -10 * progress)

          const step = (timestamp) => {
            if (!start) start = timestamp
            const elapsed = timestamp - start
            const progress = Math.min(elapsed / duration, 1)
            const easedProgress = easeOutExpo(progress)
            setCount(Math.round(easedProgress * target))

            if (progress < 1) {
              requestAnimationFrame(step)
            } else {
              setCount(target)
            }
          }

          requestAnimationFrame(step)
          observer.unobserve(el)
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  const display = formatter
    ? formatter(count)
    : count.toLocaleString('en-IN')

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  )
}
