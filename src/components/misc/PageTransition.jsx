import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"

const pageVariants = {
    initial: { opacity: 0, y: 12, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.99 },
}

const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
}

export default function PageTransition({ children }) {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}
