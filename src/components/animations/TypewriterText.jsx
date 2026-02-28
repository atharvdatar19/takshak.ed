import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

/**
 * Typewriter effect — types out text character by character,
 * then pauses, then deletes and types the next quote.
 * Feels alive and conversational.
 */
export default function TypewriterText({
    texts = [],
    speed = 50,
    deleteSpeed = 30,
    pauseMs = 2500,
    className = "",
}) {
    const [idx, setIdx] = useState(0)
    const [charIdx, setCharIdx] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)

    const current = texts[idx] || ""

    useEffect(() => {
        if (!texts.length) return

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (charIdx < current.length) {
                    setCharIdx(c => c + 1)
                } else {
                    // Pause at end, then start deleting
                    setTimeout(() => setIsDeleting(true), pauseMs)
                }
            } else {
                if (charIdx > 0) {
                    setCharIdx(c => c - 1)
                } else {
                    setIsDeleting(false)
                    setIdx(i => (i + 1) % texts.length)
                }
            }
        }, isDeleting ? deleteSpeed : speed)

        return () => clearTimeout(timeout)
    }, [charIdx, isDeleting, current, texts, speed, deleteSpeed, pauseMs, idx])

    return (
        <span className={className}>
            {current.slice(0, charIdx)}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="inline-block w-[2px] h-[1em] bg-current ml-0.5 align-text-bottom"
            />
        </span>
    )
}
