import { motion } from "framer-motion"
import { useState, useEffect, useCallback, useRef } from "react"

/**
 * SplashScreen — Academic Atelier Split Gate Entry
 * Full-screen split gate with two panels that slide apart on click/keypress.
 * Only plays once per session (sessionStorage flag).
 */
export default function SplashScreen({ children }) {
    const [showSplash, setShowSplash] = useState(() => {
        return !sessionStorage.getItem("mb_splash_done")
    })
    const [gateOpen, setGateOpen] = useState(false)
    const [childrenVisible, setChildrenVisible] = useState(!showSplash)
    const triggered = useRef(false)

    const openGate = useCallback(() => {
        if (triggered.current) return
        triggered.current = true
        setGateOpen(true)

        // Fade in children behind the panels
        setTimeout(() => {
            setChildrenVisible(true)
        }, 100)

        // Remove gate and mark session
        setTimeout(() => {
            setShowSplash(false)
            sessionStorage.setItem("mb_splash_done", "1")
        }, 1300)
    }, [])

    useEffect(() => {
        if (!showSplash) return

        const handleKey = () => openGate()
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [showSplash, openGate])

    if (!showSplash) {
        return <>{children}</>
    }

    return (
        <>
            {/* Children layer — behind gate */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: childrenVisible ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: childrenVisible ? "auto" : "none",
                }}
            >
                {children}
            </motion.div>

            {/* Atmospheric blobs — behind gate */}
            <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full" style={{ filter: "blur(120px)" }} />
                <div className="absolute -bottom-20 -left-20 w-[30rem] h-[30rem] bg-secondary/5 rounded-full" style={{ filter: "blur(140px)" }} />
            </div>

            {/* Split gate */}
            <div
                className="fixed inset-0 z-50 flex cursor-pointer"
                onClick={openGate}
            >
                {/* LEFT PANEL — Warm Terracotta */}
                <div
                    className="w-full md:w-1/2 relative overflow-hidden flex flex-col justify-center px-8 md:px-16"
                    style={{
                        background: "linear-gradient(to bottom right, #b77466, #9a5e50)",
                        transform: gateOpen ? "translateX(-100%)" : "translateX(0)",
                        transition: "transform 1.2s cubic-bezier(0.85, 0, 0.15, 1)",
                    }}
                >
                    {/* Decorative giant "T" */}
                    <span
                        className="absolute bottom-[-40px] left-[-20px] font-headline font-black text-on-primary/10 pointer-events-none select-none"
                        style={{ fontSize: "400px", lineHeight: 1 }}
                    >
                        T
                    </span>

                    {/* Content */}
                    <div className="relative z-10">
                        <p className="font-label text-[10px] uppercase tracking-[0.4em] text-on-primary-fixed/80 mb-4">
                            YOUR COLLEGE JOURNEY BEGINS
                        </p>
                        <h1
                            className="font-headline font-black text-on-primary-fixed leading-[0.9] tracking-tighter mb-10"
                            style={{ fontSize: "clamp(60px, 10vw, 120px)" }}
                        >
                            Takshak.
                        </h1>
                        <div className="flex flex-wrap gap-4">
                            <button className="btn-primary" onClick={openGate}>
                                Get Started
                            </button>
                            <button className="btn-ghost" onClick={openGate}>
                                View Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL — Dark Surface */}
                <div
                    className="hidden md:flex md:w-1/2 relative overflow-hidden flex-col justify-center items-start px-16 bg-surface"
                    style={{
                        transform: gateOpen ? "translateX(100%)" : "translateX(0)",
                        transition: "transform 1.2s cubic-bezier(0.85, 0, 0.15, 1)",
                    }}
                >
                    {/* Editorial stat */}
                    <div className="relative z-10 mb-10">
                        <p className="font-headline text-[88px] font-bold text-primary-fixed-dim leading-none">
                            2,400+
                        </p>
                        <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant mt-2">
                            COLLEGES TRACKED
                        </p>
                    </div>

                    {/* 2×2 Bento stat grid */}
                    <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-md">
                        <div className="glass p-8 rounded-lg">
                            <p className="font-headline text-3xl text-secondary">94%</p>
                            <p className="font-label text-[10px] uppercase tracking-wider text-outline mt-2">Admit Rate</p>
                        </div>
                        <div className="glass p-8 rounded-lg translate-y-4">
                            <p className="font-headline text-3xl text-secondary">3.8</p>
                            <p className="font-label text-[10px] uppercase tracking-wider text-outline mt-2">Avg GPA</p>
                        </div>
                        <div className="glass p-8 rounded-lg -translate-y-4">
                            <p className="font-headline text-3xl text-secondary">12K</p>
                            <p className="font-label text-[10px] uppercase tracking-wider text-outline mt-2">Students</p>
                        </div>
                        <div className="glass p-8 rounded-lg">
                            <p className="font-headline text-3xl text-secondary">48h</p>
                            <p className="font-label text-[10px] uppercase tracking-wider text-outline mt-2">Response</p>
                        </div>
                    </div>
                </div>

                {/* CENTER INDICATOR — bottom center */}
                <div className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-3 z-[60]">
                    <span className="font-label text-[10px] uppercase tracking-[0.6em] text-on-surface/40">
                        ENTER
                    </span>
                    <div className="w-px h-16 bg-gradient-to-b from-primary/60 to-transparent" />
                </div>
            </div>
        </>
    )
}
