'use client';

import { useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { shaderMaterial, useTrailTexture } from '@react-three/drei';
import * as THREE from 'three';

// Custom shader material
const DotMaterial = shaderMaterial(
  {
    resolution: new THREE.Vector2(),
    mouseTrail: null,
    gridSize: 80,
  },
  `
    varying vec2 vUv;

    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  `
    uniform vec2 resolution;
    uniform sampler2D mouseTrail;
    uniform float gridSize;

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    /* SDF Shapes */
    float sdfCircle(vec2 p, float r) {
        return length(p - 0.5) - r;
    }

    void main() {
      float aspect = resolution.x / resolution.y;
      vec2 screenUv = gl_FragCoord.xy / resolution;
      vec2 uv = coverUv(screenUv);

      // Create a grid
      vec2 gridUv = fract(uv * gridSize);
      vec2 gridUvCenter = (floor(uv * gridSize) + 0.5) / gridSize;

      // Sample mouse trail
      float trail = texture2D(mouseTrail, gridUvCenter).r;

      // Set color based on trail, with transparency
      gl_FragColor = vec4(vec3(trail), trail);
    }
  `
);

function Scene() {
  const { size, viewport } = useThree();

  const [trail, onMove] = useTrailTexture({
    size: 1024,
    radius: 0.12,
    maxAge: 720,
    interpolate: 3,
    ease: function easeInOutCirc(x) {
      return x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    },
  });

  const dotMaterial = useMemo(() => {
    const material = new DotMaterial();
    material.uniforms.mouseTrail.value = trail;
    material.transparent = true;
    return material;
  }, [trail]);

  useEffect(() => {
    if (dotMaterial && size.width && size.height && viewport.dpr) {
      dotMaterial.uniforms.resolution.value.set(
        size.width * viewport.dpr,
        size.height * viewport.dpr
      );
    }
  }, [dotMaterial, size, viewport]);

  const scale = Math.max(viewport.width, viewport.height) / 2;

  return (
    <mesh scale={[scale, scale, 1]} onPointerMove={onMove}>
      <planeGeometry args={[2, 2]} />
      <primitive
        object={dotMaterial}
        gridSize={80}
        resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
        mouseTrail={trail}
      />
    </mesh>
  );
}

export function MouseTrail() {
  return (
    <Canvas
      style={{ opacity: 0.3 }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        alpha: true,
      }}
    >
      <Scene />
    </Canvas>
  );
}

// Add default export to support dynamic import
export default MouseTrail;
