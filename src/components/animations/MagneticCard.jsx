import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef } from "react"

/**
 * Magnetic hover card — card subtly follows the cursor when hovering.
 * Creates a "living" feel like the UI is aware of you.
 * Also applies a spotlight gradient that follows the cursor.
 */
export default function MagneticCard({
    children,
    className = "",
    intensity = 0.08,
    spotlightColor = "rgba(99, 102, 241, 0.08)",
}) {
    const ref = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const springX = useSpring(x, { stiffness: 200, damping: 20 })
    const springY = useSpring(y, { stiffness: 200, damping: 20 })

    const rotateX = useTransform(springY, v => v * -0.1)
    const rotateY = useTransform(springX, v => v * 0.1)

    // Spotlight gradient position
    const spotX = useMotionValue(50)
    const spotY = useMotionValue(50)

    function handleMouse(e) {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        x.set(dx * intensity)
        y.set(dy * intensity)
        spotX.set(((e.clientX - rect.left) / rect.width) * 100)
        spotY.set(((e.clientY - rect.top) / rect.height) * 100)
    }

    function handleLeave() {
        x.set(0)
        y.set(0)
        spotX.set(50)
        spotY.set(50)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            style={{
                x: springX,
                y: springY,
                rotateX,
                rotateY,
                transformPerspective: 800,
            }}
            className={`relative ${className}`}
        >
            {/* Spotlight overlay */}
            <motion.div
                className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: useTransform(
                        [spotX, spotY],
                        ([sx, sy]) => `radial-gradient(circle at ${sx}% ${sy}%, ${spotlightColor}, transparent 60%)`
                    ),
                }}
            />
            {children}
        </motion.div>
    )
}
