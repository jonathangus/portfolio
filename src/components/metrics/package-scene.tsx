"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Sphere } from "@react-three/drei"
import { motion } from "framer-motion-3d"
import type * as THREE from "three"

interface PackageData {
  name: string
  downloads: number
  color: string
}

interface PackageSceneProps {
  packageData: PackageData[]
  selectedPackage: string | null
}

export default function PackageScene({ packageData, selectedPackage }: PackageSceneProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current && !selectedPackage) {
      groupRef.current.rotation.y += 0.001
    }
  })

  // Calculate positions in a circular pattern
  const getPositions = () => {
    const radius = 8
    return packageData.map((_, index) => {
      const angle = (index / packageData.length) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      return [x, 0, z]
    })
  }

  const positions = getPositions()

  return (
    <group ref={groupRef}>
      {packageData.map((pkg, index) => (
        <PackageBox key={pkg.name} pkg={pkg} position={positions[index]} isSelected={selectedPackage === pkg.name} />
      ))}

      {/* Central node representing npm */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#cb3837" wireframe />
      </Sphere>

      {/* Connection lines */}
      {packageData.map((pkg, index) => (
        <Line
          key={`line-${pkg.name}`}
          start={[0, 0, 0]}
          end={positions[index]}
          color={pkg.color}
          isSelected={selectedPackage === pkg.name || selectedPackage === null}
        />
      ))}
    </group>
  )
}

interface PackageBoxProps {
  pkg: PackageData
  position: [number, number, number]
  isSelected: boolean
}

function PackageBox({ pkg, position, isSelected }: PackageBoxProps) {
  const boxRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const scale = isSelected ? 1.5 : hovered ? 1.2 : 1
  const boxSize = Math.log10(pkg.downloads) * 0.2

  useFrame((state) => {
    if (boxRef.current) {
      boxRef.current.rotation.x += 0.01
      boxRef.current.rotation.y += 0.01
    }
  })

  return (
    <group position={position}>
      <motion.mesh
        ref={boxRef}
        scale={scale}
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 100 }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[boxSize, boxSize, boxSize]} />
        <meshStandardMaterial
          color={pkg.color}
          wireframe={!isSelected && !hovered}
          emissive={pkg.color}
          emissiveIntensity={isSelected || hovered ? 0.5 : 0.2}
        />
      </motion.mesh>

      <Text
        position={[0, boxSize + 0.5, 0]}
        fontSize={0.5}
        color={isSelected || hovered ? "#ffffff" : "#22c55e"}
        anchorX="center"
        anchorY="middle"
      >
        {pkg.name}
      </Text>

      {(isSelected || hovered) && (
        <Text position={[0, boxSize + 1.2, 0]} fontSize={0.3} color="#22c55e" anchorX="center" anchorY="middle">
          {pkg.downloads.toLocaleString()}
        </Text>
      )}
    </group>
  )
}

interface LineProps {
  start: [number, number, number]
  end: [number, number, number]
  color: string
  isSelected: boolean
}

function Line({ start, end, color, isSelected }: LineProps) {
  const ref = useRef<THREE.Line>(null)

  useFrame(() => {
    if (ref.current) {
      ref.current.material.opacity = isSelected ? 0.8 : 0.3
    }
  })

  return (
    <line ref={ref}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array([...start, ...end])}
          count={2}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color={color} transparent opacity={isSelected ? 0.8 : 0.3} linewidth={1} />
    </line>
  )
}

