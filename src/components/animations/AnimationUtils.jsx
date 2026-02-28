import { motion } from "framer-motion"

/**
 * Stagger container — children animate in with a cascading delay.
 * Use as a wrapper around a list of items for dramatic entrance.
 *
 * Each direct child gets staggered entry with spring physics.
 */
export function StaggerContainer({
    children,
    stagger = 0.08,
    delay = 0,
    className = "",
}) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: stagger, delayChildren: delay },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/**
 * Single stagger item — use inside StaggerContainer.
 */
export function StaggerItem({ children, className = "" }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9, filter: "blur(4px)" },
                visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    transition: {
                        type: "spring",
                        stiffness: 120,
                        damping: 14,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/**
 * Float animation — element gently bobs up and down continuously.
 */
export function FloatingElement({
    children,
    className = "",
    amplitude = 8,
    duration = 4,
}) {
    return (
        <motion.div
            animate={{
                y: [-amplitude, amplitude, -amplitude],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/**
 * Pulse glow — element pulses with a glowing shadow.
 */
export function PulseGlow({
    children,
    className = "",
    color = "rgba(99, 102, 241, 0.4)",
}) {
    return (
        <motion.div
            animate={{
                boxShadow: [
                    `0 0 0px ${color}`,
                    `0 0 20px ${color}`,
                    `0 0 0px ${color}`,
                ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/**
 * Slide-in from direction — element slides in from specified edge.
 */
export function SlideIn({
    children,
    className = "",
    direction = "left",
    delay = 0,
}) {
    const offsets = {
        left: { x: -60, y: 0 },
        right: { x: 60, y: 0 },
        up: { x: 0, y: -60 },
        down: { x: 0, y: 60 },
    }
    const offset = offsets[direction]

    return (
        <motion.div
            initial={{ opacity: 0, ...offset, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay,
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
