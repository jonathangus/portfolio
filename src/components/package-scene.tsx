import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface Package {
  name: string;
  downloads: number;
  color: string;
}

interface PackageSceneProps {
  packageData: Package[];
  selectedPackage: string | null;
}

function PackageBox({
  pkg,
  index,
  total,
  isSelected,
  position,
}: {
  pkg: Package;
  index: number;
  total: number;
  isSelected: boolean;
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Hover animation
    meshRef.current.scale.y = THREE.MathUtils.lerp(
      meshRef.current.scale.y,
      hovered || isSelected ? 1.5 : 1,
      0.1
    );

    // Gentle floating animation
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;
  });

  const height = pkg.downloads / 20 + 0.5; // Normalize height based on downloads

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1, height, 1]} />
        <meshStandardMaterial
          color={pkg.color}
          transparent
          opacity={0.8}
          wireframe={isSelected}
        />
      </mesh>
      <Text
        position={[0, height + 0.5, 0]}
        fontSize={0.3}
        color={isSelected ? '#22c55e' : 'white'}
        anchorX="center"
        anchorY="middle"
      >
        {pkg.name}
      </Text>
      <Text
        position={[0, height + 0.2, 0]}
        fontSize={0.2}
        color="#666666"
        anchorX="center"
        anchorY="middle"
      >
        {pkg.downloads}
      </Text>
    </group>
  );
}

export default function PackageScene({
  packageData,
  selectedPackage,
}: PackageSceneProps) {
  const radius = 8;
  const total = packageData.length;

  return (
    <group position={[0, -2, 0]}>
      {packageData.map((pkg, index) => {
        const angle = (index / total) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <PackageBox
            key={pkg.name}
            pkg={pkg}
            index={index}
            total={total}
            isSelected={selectedPackage === pkg.name}
            position={[x, 0, z]}
          />
        );
      })}
    </group>
  );
}
