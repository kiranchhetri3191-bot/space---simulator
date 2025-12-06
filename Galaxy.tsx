import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceConfig } from "@/lib/stores/useSpaceConfig";

export function Galaxy() {
  const galaxyRef = useRef<THREE.Points>(null);
  const nebulaRef = useRef<THREE.Points>(null);
  const { config, viewMode, timeSpeed, isPaused } = useSpaceConfig();

  const { positions, colors, sizes } = useMemo(() => {
    const count = config.galaxyStarCount;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const arms = 4;
    const armSpread = 0.5;
    const armLength = 150;
    
    for (let i = 0; i < count; i++) {
      const armIndex = i % arms;
      const armAngle = (armIndex / arms) * Math.PI * 2;
      
      const distance = Math.random() * armLength;
      const spiralAngle = armAngle + (distance / armLength) * Math.PI * 2.5;
      
      const spreadX = (Math.random() - 0.5) * armSpread * (distance * 0.15);
      const spreadZ = (Math.random() - 0.5) * armSpread * (distance * 0.15);
      const spreadY = (Math.random() - 0.5) * 5 * Math.exp(-distance * 0.02);
      
      positions[i * 3] = Math.cos(spiralAngle) * distance + spreadX;
      positions[i * 3 + 1] = spreadY;
      positions[i * 3 + 2] = Math.sin(spiralAngle) * distance + spreadZ;
      
      const distanceRatio = distance / armLength;
      const r = 0.8 + Math.random() * 0.2;
      const g = 0.7 + Math.random() * 0.3 - distanceRatio * 0.3;
      const b = 0.9 + Math.random() * 0.1 - distanceRatio * 0.2;
      
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
      
      sizes[i] = (0.5 + Math.random() * 1.5) * config.starBrightness;
    }
    
    return { positions, colors, sizes };
  }, [config.galaxyStarCount, config.starBrightness]);

  const nebulaData = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const distance = Math.random() * 120;
      const spreadY = (Math.random() - 0.5) * 8;
      
      positions[i * 3] = Math.cos(theta) * distance + (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = spreadY;
      positions[i * 3 + 2] = Math.sin(theta) * distance + (Math.random() - 0.5) * 20;
      
      const hue = Math.random();
      if (hue < 0.33) {
        colors[i * 3] = 0.6 + Math.random() * 0.4;
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      } else if (hue < 0.66) {
        colors[i * 3] = 0.2 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
      } else {
        colors[i * 3] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.3;
        colors[i * 3 + 2] = 0.5 + Math.random() * 0.3;
      }
    }
    
    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    if (isPaused || viewMode === "solar") return;
    
    const rotationSpeed = config.galaxyRotationSpeed * timeSpeed * delta;
    
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += rotationSpeed;
    }
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += rotationSpeed * 0.5;
    }
  });

  if (viewMode === "solar") return null;

  return (
    <group>
      <points ref={galaxyRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={config.galaxyStarCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={config.galaxyStarCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={nebulaRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2000}
            array={nebulaData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={2000}
            array={nebulaData.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={3}
          vertexColors
          transparent
          opacity={0.15}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
