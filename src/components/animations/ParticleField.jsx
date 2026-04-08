import { useEffect, useRef } from "react"

/**
 * Lightweight particle constellation — floating dots connected by lines.
 * No Three.js needed — pure canvas for performance.
 * Creates a techy, premium feel in hero backgrounds.
 */
export default function ParticleField({
    count = 50,
    color = "rgba(255,255,255,0.5)",
    lineColor = "rgba(255,255,255,0.1)",
    maxDist = 120,
    className = "",
}) {
    const canvasRef = useRef(null)
    const particles = useRef([])
    const animRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")

        function resize() {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio
            canvas.height = canvas.offsetHeight * window.devicePixelRatio
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
        }
        resize()
        window.addEventListener("resize", resize)

        // Create particles
        const w = canvas.offsetWidth
        const h = canvas.offsetHeight
        particles.current = Array.from({ length: count }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            r: Math.random() * 2 + 1,
        }))

        function draw() {
            const cw = canvas.offsetWidth
            const ch = canvas.offsetHeight
            ctx.clearRect(0, 0, cw, ch)

            const pts = particles.current
            // Move
            for (const p of pts) {
                p.x += p.vx
                p.y += p.vy
                if (p.x < 0 || p.x > cw) p.vx *= -1
                if (p.y < 0 || p.y > ch) p.vy *= -1
            }

            // Lines between nearby particles
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x
                    const dy = pts[i].y - pts[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < maxDist) {
                        ctx.beginPath()
                        ctx.strokeStyle = lineColor
                        ctx.globalAlpha = 1 - dist / maxDist
                        ctx.lineWidth = 0.5
                        ctx.moveTo(pts[i].x, pts[i].y)
                        ctx.lineTo(pts[j].x, pts[j].y)
                        ctx.stroke()
                        ctx.globalAlpha = 1
                    }
                }
            }

            // Dots
            for (const p of pts) {
                ctx.beginPath()
                ctx.fillStyle = color
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
                ctx.fill()
            }

            animRef.current = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener("resize", resize)
            if (animRef.current) cancelAnimationFrame(animRef.current)
        }
    }, [count, color, lineColor, maxDist])

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 pointer-events-none ${className}`}
            style={{ width: "100%", height: "100%" }}
        />
    )
}
