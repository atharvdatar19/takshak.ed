import { useRef } from 'react'

/**
 * 3D perspective tilt card that follows the mouse cursor.
 * Adds a radial gradient light sweep following the cursor.
 *
 * @prop {React.ReactNode} children
 * @prop {number}          intensity - tilt degrees, default 12
 * @prop {string}          className
 */
export default function TiltCard({ children, intensity = 12, className = '' }) {
  const cardRef = useRef(null)
  const lightRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2

    const rotateY = ((x - cx) / cx) * intensity
    const rotateX = -((y - cy) / cy) * intensity

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`

    // Radial gradient light position
    const percentX = (x / rect.width) * 100
    const percentY = (y / rect.height) * 100
    if (lightRef.current) {
      lightRef.current.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(78,222,163,0.06) 0%, transparent 65%)`
    }
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
    card.style.transition = 'transform 0.6s ease'
    if (lightRef.current) {
      lightRef.current.style.background = 'none'
    }
  }

  const handleMouseEnter = () => {
    const card = cardRef.current
    if (!card) return
    // Remove the slow transition while actively moving
    card.style.transition = 'transform 0.08s linear'
  }

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {/* Light sweep overlay */}
      <div
        ref={lightRef}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      {children}
    </div>
  )
}
