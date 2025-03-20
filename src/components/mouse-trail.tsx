'use client';

import { useMemo, useEffect, useRef } from 'react';
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

      // Debug: Output UV coordinates as colors
      gl_FragColor = vec4(uv.x, uv.y, 0.0, 1.0);

      // Comment out the rest for debugging
  
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

  // Create reference for the mesh to get its world matrix
  const meshRef = useRef<THREE.Mesh>(null);

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

  // Global mouse event implementation that perfectly replicates React Three Fiber's coordinate system
  useEffect(() => {
    // Initialize trail at center
    onMove({ uv: { x: 0.5, y: 0.5 }, distance: 0 });

    // Cache canvas element
    let canvasRef: HTMLCanvasElement | null = null;

    // Function to find the canvas element
    const getCanvas = () => {
      if (!canvasRef) {
        canvasRef = document.querySelector('canvas');
      }
      return canvasRef;
    };

    // Calculate the precise UV coordinates by analyzing the debug data
    // The key insight is that R3F uses some 3D math to calculate UVs,
    // which creates a difference in mapping compared to simple 2D coordinates
    const calculatePreciseUV = (
      clientX: number,
      clientY: number,
      rect: DOMRect
    ) => {
      // Step 1: Calculate normalized device coordinates (0-1)
      const ndcX = (clientX - rect.left) / rect.width;
      const ndcY = 1.0 - (clientY - rect.top) / rect.height; // Flip Y

      // Step 2: Calculate the scale factor based on aspect ratio
      // This exactly matches the shader's coverUv function
      const maxDimension = Math.max(rect.width, rect.height);
      const scaleX = rect.width / maxDimension;
      const scaleY = rect.height / maxDimension;

      // Step 3: Apply the same transformation as the shader
      // (uv - 0.5) * s + 0.5
      const x = (ndcX - 0.5) * scaleX + 0.5;
      const y = (ndcY - 0.5) * scaleY + 0.5;

      // Step 4: Clamp to 0-1 range (matching shader's clamp)
      return {
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
      };
    };

    // Master handler for all mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      const canvas = getCanvas();
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();

      // Check if mouse is inside the canvas
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (isInside) {
        // Inside canvas - use precise UV calculation
        const { x, y } = calculatePreciseUV(event.clientX, event.clientY, rect);

        // Debug logging
        console.log('Mouse Event Debug:', {
          clientX: event.clientX,
          clientY: event.clientY,
          rect: {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          },
          calculatedUV: { x, y },
          relativeToCenter: {
            x: (event.clientX - (rect.left + rect.width / 2)) / rect.width,
            y: (event.clientY - (rect.top + rect.height / 2)) / rect.height,
          },
        });

        onMove({
          uv: { x, y },
          distance: 0,
        });
      } else {
        // Outside canvas - use edge mapping with the same transformation
        const relX = event.clientX - (rect.left + rect.width / 2);
        const relY = rect.top + rect.height / 2 - event.clientY;

        // Determine dominant direction for edge mapping
        if (Math.abs(relX / rect.width) > Math.abs(relY / rect.height)) {
          // Horizontal dominance - map to left/right edge
          const edgeX = relX > 0 ? 1 : 0;
          // Calculate proportional Y position using the same transformation
          const ndcY = 0.5 + relY / rect.height;
          const maxDimension = Math.max(rect.width, rect.height);
          const scaleY = rect.height / maxDimension;
          const edgeY = (ndcY - 0.5) * scaleY + 0.5;

          onMove({
            uv: {
              x: edgeX,
              y: Math.max(0, Math.min(1, edgeY)),
            },
            distance: 0,
          });
        } else {
          // Vertical dominance - map to top/bottom edge
          const edgeY = relY > 0 ? 1 : 0;
          // Calculate proportional X position using the same transformation
          const ndcX = 0.5 + relX / rect.width;
          const maxDimension = Math.max(rect.width, rect.height);
          const scaleX = rect.width / maxDimension;
          const edgeX = (ndcX - 0.5) * scaleX + 0.5;

          onMove({
            uv: {
              x: Math.max(0, Math.min(1, edgeX)),
              y: edgeY,
            },
            distance: 0,
          });
        }
      }
    };

    // Add global event listener
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onMove]);

  // Scale based on viewport
  const scale = Math.max(viewport.width, viewport.height) / 2;

  // No onPointerMove, only using global mouse events
  return (
    <mesh ref={meshRef} scale={[scale, scale, 1]}>
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
      style={{ opacity: 0.2 }}
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
