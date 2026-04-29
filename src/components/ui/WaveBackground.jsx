import { useEffect, useRef } from "react"

export default function WaveBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let time = 0

    const waveData = Array.from({ length: 8 }).map(() => ({
      value: Math.random() * 0.5 + 0.1,
      targetValue: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.02 + 0.01,
    }))

    function resizeCanvas() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function updateWaveData() {
      waveData.forEach((data) => {
        if (Math.random() < 0.01) data.targetValue = Math.random() * 0.7 + 0.1
        data.value += (data.targetValue - data.value) * data.speed
      })
    }

    function draw() {
      // Dark transparent fill so page bg shows through slightly
      ctx.fillStyle = "rgba(8, 8, 20, 0.92)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      waveData.forEach((data, i) => {
        const freq = data.value * 7
        ctx.beginPath()
        for (let x = 0; x < canvas.width; x++) {
          const nx = (x / canvas.width) * 2 - 1
          const px = nx + i * 0.04 + freq * 0.03
          const py =
            Math.sin(px * 10 + time) *
            Math.cos(px * 2) *
            freq *
            0.1 *
            ((i + 1) / 8)
          const y = (py + 1) * (canvas.height / 2)
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        const intensity = Math.min(1, freq * 0.3)
        const r = Math.round(79 + intensity * 100)
        const g = Math.round(70 + intensity * 130)
        const b = 229
        ctx.lineWidth = 1 + i * 0.3
        ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`
        ctx.shadowColor = `rgba(${r},${g},${b},0.45)`
        ctx.shadowBlur = 6
        ctx.stroke()
        ctx.shadowBlur = 0
      })
    }

    function animate() {
      time += 0.02
      updateWaveData()
      draw()
      animId = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  )
}
