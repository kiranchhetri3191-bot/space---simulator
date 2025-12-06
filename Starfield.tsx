import { useMemo } from "react";
import * as THREE from "three";
import { useSpaceConfig } from "@/lib/stores/useSpaceConfig";

export function Starfield() {
  const { showStarfield, config } = useSpaceConfig();

  const starData = useMemo(() => {
    const count = 15000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const radius = 300 + Math.random() * 500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      const colorType = Math.random();
      if (colorType < 0.1) {
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.5 + Math.random() * 0.2;
      } else if (colorType < 0.2) {
        colors[i * 3] = 0.7 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      }
      
      sizes[i] = (0.5 + Math.random() * 2) * config.starBrightness;
    }
    
    return { positions, colors, sizes };
  }, [config.starBrightness]);

  if (!showStarfield) return null;

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={15000}
          array={starData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={15000}
          array={starData.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation={false}
      />
    </points>
  );
}
