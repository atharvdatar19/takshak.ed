import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"

function FloatingShape({ position, color, speed, distort, scale }) {
    const meshRef = useRef()

    useFrame((state) => {
        if (!meshRef.current) return
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.3
        meshRef.current.rotation.y += speed * 0.002
    })

    return (
        <Float speed={speed * 0.8} rotationIntensity={0.4} floatIntensity={0.6}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={0.15}
                    roughness={0.4}
                />
            </mesh>
        </Float>
    )
}

function TorusShape({ position, color, speed, scale }) {
    const meshRef = useRef()

    useFrame((state) => {
        if (!meshRef.current) return
        meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.15
        meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * speed * 0.2) * 0.5
    })

    return (
        <Float speed={speed * 0.6} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <torusKnotGeometry args={[0.8, 0.25, 64, 16]} />
                <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={0.1}
                    roughness={0.6}
                />
            </mesh>
        </Float>
    )
}

function Scene() {
    const shapes = useMemo(() => [
        { type: "ico", position: [-4, 2, -6], color: "#6366f1", speed: 1.2, distort: 0.3, scale: 1.5 },
        { type: "ico", position: [4, -1, -8], color: "#8b5cf6", speed: 0.8, distort: 0.4, scale: 2 },
        { type: "torus", position: [0, 3, -10], color: "#3b82f6", speed: 1.0, scale: 1.2 },
        { type: "ico", position: [-3, -3, -7], color: "#06b6d4", speed: 1.5, distort: 0.25, scale: 1 },
        { type: "torus", position: [5, 1, -12], color: "#6366f1", speed: 0.6, scale: 1.8 },
        { type: "ico", position: [-6, 0, -9], color: "#a78bfa", speed: 1.1, distort: 0.35, scale: 1.3 },
    ], [])

    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.3} />
            <pointLight position={[-10, -10, -5]} intensity={0.2} color="#6366f1" />
            {shapes.map((shape, i) =>
                shape.type === "torus" ? (
                    <TorusShape key={i} {...shape} />
                ) : (
                    <FloatingShape key={i} {...shape} />
                ),
            )}
        </>
    )
}

export default function FloatingBackground() {
    return (
        <div
            className="pointer-events-none fixed inset-0 z-0"
            style={{ opacity: 0.7 }}
        >
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
            >
                <Scene />
            </Canvas>
        </div>
    )
}
