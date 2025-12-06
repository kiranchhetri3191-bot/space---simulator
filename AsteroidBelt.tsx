import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceConfig } from "@/lib/stores/useSpaceConfig";

export function AsteroidBelt() {
  const asteroidsRef = useRef<THREE.Points>(null);
  const { viewMode, timeSpeed, isPaused, config } = useSpaceConfig();

  const asteroidData = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    
    const innerRadius = 18;
    const outerRadius = 22;
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const y = (Math.random() - 0.5) * 1.5;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      const gray = 0.4 + Math.random() * 0.4;
      colors[i * 3] = gray;
      colors[i * 3 + 1] = gray * 0.9;
      colors[i * 3 + 2] = gray * 0.8;
      
      sizes[i] = 0.02 + Math.random() * 0.08;
      
      speeds[i] = 0.15 + Math.random() * 0.1;
    }
    
    return { positions, colors, sizes, speeds, count };
  }, []);

  const anglesRef = useRef<Float32Array>(
    new Float32Array(asteroidData.count).map(() => Math.random() * Math.PI * 2)
  );
  const radiiRef = useRef<Float32Array>(
    new Float32Array(asteroidData.count).map(() => 18 + Math.random() * 4)
  );

  useFrame((_, delta) => {
    if (isPaused || viewMode !== "solar") return;
    
    if (asteroidsRef.current) {
      const positions = asteroidsRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < asteroidData.count; i++) {
        anglesRef.current[i] += asteroidData.speeds[i] * config.orbitSpeedMultiplier * timeSpeed * delta;
        
        const radius = radiiRef.current[i];
        positions[i * 3] = Math.cos(anglesRef.current[i]) * radius;
        positions[i * 3 + 2] = Math.sin(anglesRef.current[i]) * radius;
      }
      
      asteroidsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (viewMode !== "solar") return null;

  return (
    <points ref={asteroidsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={asteroidData.count}
          array={asteroidData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={asteroidData.count}
          array={asteroidData.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}
