import { useRef, useMemo } from "react"
import { Canvas, useFrame, extend } from "@react-three/fiber"
import { Effects } from "@react-three/drei"
import { UnrealBloomPass } from "three-stdlib"
import * as THREE from "three"

extend({ UnrealBloomPass })

const COUNT = 14000

function ParticleSwarm() {
  const meshRef = useRef()
  const dummy  = useMemo(() => new THREE.Object3D(), [])
  const target = useMemo(() => new THREE.Vector3(), [])
  const pColor = useMemo(() => new THREE.Color(), [])

  /* initial scatter positions — lerp'd toward target each frame */
  const positions = useMemo(() => {
    const arr = []
    for (let i = 0; i < COUNT; i++) {
      arr.push(new THREE.Vector3(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 120,
      ))
    }
    return arr
  }, [])

  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.18), [])
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: true }), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()

    for (let i = 0; i < COUNT; i++) {
      /* ── Fibonacci sphere with orbital breathing ── */
      const phi   = (i / COUNT) * Math.PI * 2 * 21          // golden-ratio lattice
      const theta = Math.acos(1 - 2 * (i + 0.5) / COUNT)   // uniform sphere coverage

      const breathe = 1 + 0.18 * Math.sin(time * 0.35 + i * 0.0009)
      const ripple  = Math.sin(theta * 5 + time * 0.55 + phi * 0.4) * 5
      const r       = 52 * breathe + ripple

      const rot = time * 0.028
      const x   = r * Math.sin(theta) * Math.cos(phi + rot)
      const y   = r * Math.sin(theta) * Math.sin(phi + rot) + Math.sin(i * 0.0085 + time * 0.28) * 4
      const z   = r * Math.cos(theta) + Math.cos(i * 0.0071 + time * 0.22) * 3

      target.set(x, y, z)

      /* ── indigo → violet → blue brand palette ── */
      const hue = 0.62 + 0.12 * Math.sin(i * 0.0019 + time * 0.12)
      const sat = 0.80 + 0.20 * Math.sin(i * 0.0055)
      const lit = 0.42 + 0.22 * Math.sin(theta * 3 + time * 0.45)
      pColor.setHSL(hue, sat, lit)

      positions[i].lerp(target, 0.07)
      dummy.position.copy(positions[i])
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, pColor)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return <instancedMesh ref={meshRef} args={[geometry, material, COUNT]} />
}

export default function ParticleBackground() {
  /* respect prefers-reduced-motion */
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 100], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <fog attach="fog" args={["#07080f", 50, 200]} />
        <ParticleSwarm />
        <Effects disableGamma>
          <unrealBloomPass threshold={0.05} strength={1.4} radius={0.35} />
        </Effects>
      </Canvas>
    </div>
  )
}
