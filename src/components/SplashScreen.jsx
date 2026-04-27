import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useMemo } from "react"

/**
 * Splash Screen — first thing a user sees.
 * Logo rocket bounces in, text reveals, then the screen fades up.
 * Only plays once per session (sessionStorage flag).
 */
export default function SplashScreen({ children }) {
    const [showSplash, setShowSplash] = useState(() => {
        return !sessionStorage.getItem("mb_splash_done")
    })

    const particles = useMemo(() =>
        Array.from({ length: 20 }, () => ({
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: Math.random() * 100,
            top: Math.random() * 100,
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
        }))
    , [])

    useEffect(() => {
        if (showSplash) {
            const timer = setTimeout(() => {
                setShowSplash(false)
                sessionStorage.setItem("mb_splash_done", "1")
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [showSplash])

    return (
        <>
            <AnimatePresence>
                {showSplash && (
                    <motion.div
                        key="splash"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                        style={{
                            background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 30%, #7c3aed 60%, #6366f1 100%)",
                        }}
                    >
                        {/* Particle dots background */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {particles.map((p, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full bg-white/20"
                                    style={{
                                        width: p.width,
                                        height: p.height,
                                        left: `${p.left}%`,
                                        top: `${p.top}%`,
                                    }}
                                    animate={{
                                        y: [0, -30, 0],
                                        opacity: [0.2, 0.6, 0.2],
                                    }}
                                    transition={{
                                        duration: p.duration,
                                        repeat: Infinity,
                                        delay: p.delay,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Logo rocket — bounces in with rotation */}
                        <motion.img
                            src="/takshak_logo.jpg"
                            alt="TAKक्षक"
                            className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-2xl"
                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                delay: 0.2,
                            }}
                        />

                        {/* Brand name — slides up with stagger */}
                        <motion.div
                            className="mt-6 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                                <span className="text-gradient-animated">TAKक्षक</span>
                            </h1>
                            <motion.p
                                className="text-indigo-200 text-sm mt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.3 }}
                            >
                                Your journey to a brighter future starts here
                            </motion.p>
                        </motion.div>

                        {/* Loading bar */}
                        <motion.div
                            className="mt-8 h-1 w-48 rounded-full bg-white/20 overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                        >
                            <motion.div
                                className="h-full bg-white rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 1.5, duration: 1.3, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {!showSplash && children}
        </>
    )
}
