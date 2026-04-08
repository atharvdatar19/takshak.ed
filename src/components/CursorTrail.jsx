import { useCallback, useEffect, useRef, useState } from "react"

export default function CursorTrail() {
    const [pos, setPos] = useState({ x: -100, y: -100 })
    const [visible, setVisible] = useState(true)
    const trailRef = useRef([])
    const rafRef = useRef(null)

    // Detect touch devices
    useEffect(() => {
        const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
        if (isTouchDevice) setVisible(false)
    }, [])

    const handleMouseMove = useCallback((e) => {
        setPos({ x: e.clientX, y: e.clientY })
    }, [])

    useEffect(() => {
        if (!visible) return
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [visible, handleMouseMove])

    if (!visible) return null

    return (
        <div className="pointer-events-none fixed inset-0 z-[300]">
            {/* Main glow dot */}
            <div
                className="absolute h-4 w-4 rounded-full"
                style={{
                    left: pos.x - 8,
                    top: pos.y - 8,
                    background: "radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)",
                    transform: "translate3d(0, 0, 0)",
                    transition: "left 0.08s ease, top 0.08s ease",
                }}
            />
            {/* Outer glow */}
            <div
                className="absolute h-10 w-10 rounded-full"
                style={{
                    left: pos.x - 20,
                    top: pos.y - 20,
                    background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
                    transform: "translate3d(0, 0, 0)",
                    transition: "left 0.15s ease, top 0.15s ease",
                }}
            />
        </div>
    )
}
