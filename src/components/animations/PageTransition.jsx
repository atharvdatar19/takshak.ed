import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"

/**
 * Smooth page transition wrapper — pages slide + fade on route change.
 * Wraps children in AnimatePresence keyed by pathname.
 */
export default function PageTransition({ children }) {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.99 }}
                transition={{
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}
