import { useRef, useMemo, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"

// ─── SUBTLE GRADIENT MESH ──────────────────────────────────────
// Professional glass-like material with subtle edge glow
function GlassShape({ position, color, speed, scale, geometryType = "icosahedron" }) {
    const meshRef = useRef()
    const materialRef = useRef()

    useFrame((state) => {
        if (!meshRef.current || !materialRef.current) return
        const t = state.clock.elapsedTime

        // Ultra-smooth, subtle rotation
        meshRef.current.rotation.x = Math.sin(t * speed * 0.15) * 0.15
        meshRef.current.rotation.y += speed * 0.001

        // Very subtle pulse on opacity
        materialRef.current.opacity = 0.08 + Math.sin(t * speed * 0.2) * 0.03
    })

    const geometry = useMemo(() => {
        switch(geometryType) {
            case "octahedron": return <octahedronGeometry args={[1, 0]} />
            case "dodecahedron": return <dodecahedronGeometry args={[1, 0]} />
            case "tetrahedron": return <tetrahedronGeometry args={[1, 0]} />
            default: return <icosahedronGeometry args={[1, 0]} />
        }
    }, [geometryType])

    return (
        <Float speed={speed * 0.4} rotationIntensity={0.2} floatIntensity={0.3} floatingRange={[-0.2, 0.2]}>
            <mesh ref={meshRef} position={position} scale={scale}>
                {geometry}
                <meshPhysicalMaterial
                    ref={materialRef}
                    color={color}
                    transparent
                    opacity={0.1}
                    roughness={0.1}
                    metalness={0.9}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    transmission={0.6}
                    thickness={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>
            {/* Edge highlight — very subtle */}
            <mesh scale={scale * 1.005}>
                {geometry}
                <meshBasicMaterial color={color} wireframe transparent opacity={0.03} />
            </mesh>
        </Float>
    )
}

// ─── ARCHITECTURAL RING ────────────────────────────────────────
// Clean torus with minimal distortion
function RingShape({ position, color, speed, scale }) {
    const meshRef = useRef()
    const ringRef = useRef()

    useFrame((state) => {
        if (!meshRef.current || !ringRef.current) return
        const t = state.clock.elapsedTime

        meshRef.current.rotation.x = t * speed * 0.08
        meshRef.current.rotation.y = Math.sin(t * speed * 0.1) * 0.2

        // Counter-rotate the wireframe ring
        ringRef.current.rotation.x = -t * speed * 0.05
        ringRef.current.rotation.z = Math.cos(t * speed * 0.12) * 0.3
    })

    return (
        <Float speed={speed * 0.3} rotationIntensity={0.15} floatIntensity={0.25} floatingRange={[-0.15, 0.15]}>
            <group position={position}>
                <mesh ref={meshRef} scale={scale}>
                    <torusGeometry args={[0.8, 0.15, 32, 64]} />
                    <meshPhysicalMaterial
                        color={color}
                        transparent
                        opacity={0.12}
                        roughness={0.05}
                        metalness={0.95}
                        clearcoat={1}
                        side={THREE.DoubleSide}
                    />
                </mesh>
                <mesh ref={ringRef} scale={scale * 1.02}>
                    <torusGeometry args={[0.8, 0.15, 16, 32]} />
                    <meshBasicMaterial color={color} wireframe transparent opacity={0.04} />
                </mesh>
            </group>
        </Float>
    )
}

// ─── SUBTLE PARTICLE DUST ──────────────────────────────────────
// Very few particles, slow movement, almost invisible
function AmbientDust({ count = 60 }) {
    const pointsRef = useRef()

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 25
            pos[i * 3 + 1] = (Math.random() - 0.5) * 15
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5
        }
        return pos
    }, [count])

    useFrame((state) => {
        if (!pointsRef.current) return
        pointsRef.current.rotation.y = state.clock.elapsedTime * 0.005
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                color="#8899aa"
                transparent
                opacity={0.25}
                sizeAttenuation
            />
        </points>
    )
}

// ─── SCENE COMPOSITION ─────────────────────────────────────────
function Scene() {
    const shapes = useMemo(() => [
        // Primary focal shapes — larger, slower
        { type: "glass", position: [-3.5, 1.5, -7], color: "#4a5568", speed: 0.6, scale: 2.2, geometryType: "dodecahedron" },
        { type: "ring", position: [3, -0.5, -9], color: "#64748b", speed: 0.4, scale: 1.8 },
        { type: "glass", position: [0, 2.5, -11], color: "#475569", speed: 0.5, scale: 1.6, geometryType: "octahedron" },

        // Secondary accents — smaller, varied
        { type: "glass", position: [-5, -2, -8], color: "#64748b", speed: 0.8, scale: 1.2, geometryType: "tetrahedron" },
        { type: "ring", position: [5.5, 1.5, -10], color: "#4a5568", speed: 0.5, scale: 1.4 },
        { type: "glass", position: [-2, -3.5, -9], color: "#475569", speed: 0.7, scale: 1.0, geometryType: "icosahedron" },
        { type: "glass", position: [4, 3, -12], color: "#64748b", speed: 0.4, scale: 0.9, geometryType: "dodecahedron" },
        { type: "ring", position: [-4.5, 0, -13], color: "#475569", speed: 0.6, scale: 1.6 },
    ], [])

    return (
        <>
            {/* Minimal, sophisticated lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 8, 5]} intensity={0.4} color="#e2e8f0" />
            <directionalLight position={[-5, -3, -5]} intensity={0.2} color="#94a3b8" />

            {/* Subtle rim light */}
            <pointLight position={[0, 5, -5]} intensity={0.3} color="#cbd5e1" distance={20} />

            {/* Ambient dust */}
            <AmbientDust count={60} />

            {/* Shapes */}
            {shapes.map((shape, i) =>
                shape.type === "ring" ? (
                    <RingShape key={i} {...shape} />
                ) : (
                    <GlassShape key={i} {...shape} />
                )
            )}

            {/* Very subtle fog for depth */}
            <fog attach="fog" args={["#0f1117", 12, 28]} />
        </>
    )
}

export default function FloatingBackground() {
    const containerRef = useRef()
    const [active, setActive] = useState(true)
    const scene = useMemo(() => <Scene />, [])

    useEffect(() => {
        const handleVisibility = () => setActive(!document.hidden)
        document.addEventListener("visibilitychange", handleVisibility)
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If not intersecting, we can stop the loop
                if (!document.hidden) setActive(entry.isIntersecting)
            },
            { threshold: 0.01 }
        )

        if (containerRef.current) observer.observe(containerRef.current)

        return () => {
            document.removeEventListener("visibilitychange", handleVisibility)
            observer.disconnect()
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="pointer-events-none fixed inset-0 z-0"
            style={{ 
                opacity: 0.85,
                background: "linear-gradient(180deg, #0f1117 0%, #1a1d26 50%, #0f1117 100%)"
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 5], fov: 55 }}
                dpr={[1, 1.5]}
                gl={{ 
                    antialias: true, 
                    alpha: true,
                    powerPreference: "high-performance"
                }}
                style={{ background: "transparent" }}
                // Stop rendering if not active
                frameloop={active ? "always" : "never"}
            >
                {active && scene}
            </Canvas>
        </div>
    )
}