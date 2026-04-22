import { useCallback, useRef, useState } from "react"

export default function TiltCard({ children, className = "", intensity = 10 }) {
    const cardRef = useRef(null)
    const [style, setStyle] = useState({})

    const handleMouseMove = useCallback(
        (e) => {
            if (!cardRef.current) return
            const rect = cardRef.current.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const centerX = rect.width / 2
            const centerY = rect.height / 2
            const rotateX = ((y - centerY) / centerY) * -intensity
            const rotateY = ((x - centerX) / centerX) * intensity

            setStyle({
                transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
                transition: "transform 0.1s ease",
            })
        },
        [intensity],
    )

    const handleMouseLeave = useCallback(() => {
        setStyle({
            transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
            transition: "transform 0.4s ease",
        })
    }, [])

    return (
        <div
            ref={cardRef}
            className={`relative ${className}`}
            style={{ ...style, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <div className="tilt-glare" style={{ opacity: style.transform ? 0.1 : 0 }} />
        </div>
    )
}
