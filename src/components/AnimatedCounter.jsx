import { useEffect, useRef, useState } from "react"

export default function AnimatedCounter({ value, duration = 1200, prefix = "", suffix = "" }) {
    const [display, setDisplay] = useState(0)
    const prevValue = useRef(0)
    const frameRef = useRef(null)

    useEffect(() => {
        const startValue = prevValue.current
        const endValue = typeof value === "number" ? value : parseInt(value, 10) || 0
        const startTime = performance.now()

        function tick(now) {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.round(startValue + (endValue - startValue) * eased)

            setDisplay(current)

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(tick)
            } else {
                prevValue.current = endValue
            }
        }

        frameRef.current = requestAnimationFrame(tick)
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current)
        }
    }, [value, duration])

    return (
        <span>
            {prefix}{display.toLocaleString("en-IN")}{suffix}
        </span>
    )
}
