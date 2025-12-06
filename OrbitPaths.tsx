import { useMemo } from "react";
import * as THREE from "three";
import { PLANETS } from "./Planet";
import { useSpaceConfig } from "@/lib/stores/useSpaceConfig";

export function OrbitPaths() {
  const { showOrbits, viewMode } = useSpaceConfig();
  
  const orbits = useMemo(() => {
    return PLANETS.map((planet) => {
      const points: THREE.Vector3[] = [];
      const segments = 128;
      
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const r = planet.orbitRadius * (1 - planet.eccentricity * planet.eccentricity) / 
                  (1 + planet.eccentricity * Math.cos(angle));
        points.push(new THREE.Vector3(
          Math.cos(angle) * r,
          0,
          Math.sin(angle) * r
        ));
      }
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);

  if (!showOrbits || viewMode !== "solar") return null;

  return (
    <group>
      {orbits.map((geometry, i) => (
        <line key={i}>
          <bufferGeometry attach="geometry" {...geometry} />
          <lineBasicMaterial 
            attach="material"
            color={0x444466} 
            transparent 
            opacity={0.4}
          />
        </line>
      ))}
    </group>
  );
}
