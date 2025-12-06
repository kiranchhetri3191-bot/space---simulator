import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceConfig } from "@/lib/stores/useSpaceConfig";

interface DwarfPlanetData {
  name: string;
  size: number;
  color: number;
  orbitRadius: number;
  orbitSpeed: number;
  eccentricity: number;
  info: string;
}

const DWARF_PLANETS: DwarfPlanetData[] = [
  {
    name: "Pluto",
    size: 0.15,
    color: 0xccaa88,
    orbitRadius: 65,
    orbitSpeed: 0.04,
    eccentricity: 0.25,
    info: "Pluto was reclassified as a dwarf planet in 2006. It has 5 moons, with Charon being so large they orbit a common center of mass."
  },
  {
    name: "Eris",
    size: 0.16,
    color: 0xeeeeee,
    orbitRadius: 80,
    orbitSpeed: 0.025,
    eccentricity: 0.44,
    info: "Eris is the most massive known dwarf planet. Its discovery was a key factor in Pluto's reclassification. It has one moon, Dysnomia."
  },
  {
    name: "Makemake",
    size: 0.1,
    color: 0xddbb99,
    orbitRadius: 72,
    orbitSpeed: 0.03,
    eccentricity: 0.16,
    info: "Makemake is one of the largest Kuiper Belt objects. It has a reddish-brown color and one known moon nicknamed MK 2."
  },
  {
    name: "Haumea",
    size: 0.12,
    color: 0xffffff,
    orbitRadius: 68,
    orbitSpeed: 0.035,
    eccentricity: 0.19,
    info: "Haumea has an elongated shape due to its rapid rotation (one day = 4 hours). It has two moons and a ring system."
  }
];

function DwarfPlanet({ data, initialAngle, onClick }: { 
  data: DwarfPlanetData; 
  initialAngle: number;
  onClick?: (data: DwarfPlanetData) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { config, timeSpeed, isPaused } = useSpaceConfig();
  const angleRef = useRef(initialAngle);

  useFrame((_, delta) => {
    if (isPaused) return;
    
    const baseSpeed = data.orbitSpeed * config.orbitSpeedMultiplier * timeSpeed;
    const r = data.orbitRadius * (1 - data.eccentricity * data.eccentricity) / 
              (1 + data.eccentricity * Math.cos(angleRef.current));
    const keplerSpeed = baseSpeed * Math.pow(data.orbitRadius / r, 1.5);
    angleRef.current += keplerSpeed * delta;
    
    if (groupRef.current) {
      groupRef.current.position.x = r * Math.cos(angleRef.current);
      groupRef.current.position.z = r * Math.sin(angleRef.current);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation?.();
    if (onClick) onClick(data);
  };

  return (
    <group ref={groupRef} position={[data.orbitRadius, 0, 0]}>
      <mesh onClick={handleClick}>
        <sphereGeometry args={[data.size * config.planetSizeMultiplier, 16, 16]} />
        <meshStandardMaterial color={data.color} roughness={0.8} />
      </mesh>
    </group>
  );
}

export function KuiperBelt({ onDwarfPlanetClick }: { onDwarfPlanetClick?: (data: DwarfPlanetData) => void }) {
  const kuiperRef = useRef<THREE.Points>(null);
  const { viewMode, timeSpeed, isPaused, config } = useSpaceConfig();

  const kuiperData = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    
    const innerRadius = 58;
    const outerRadius = 90;
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const y = (Math.random() - 0.5) * 4;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      const brightness = 0.3 + Math.random() * 0.3;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness * 0.9;
      colors[i * 3 + 2] = brightness * 1.1;
      
      speeds[i] = 0.02 + Math.random() * 0.02;
    }
    
    return { positions, colors, speeds, count };
  }, []);

  const anglesRef = useRef<Float32Array>(
    new Float32Array(kuiperData.count).map(() => Math.random() * Math.PI * 2)
  );
  const radiiRef = useRef<Float32Array>(
    new Float32Array(kuiperData.count).map(() => 58 + Math.random() * 32)
  );

  useFrame((_, delta) => {
    if (isPaused || viewMode !== "solar") return;
    
    if (kuiperRef.current) {
      const positions = kuiperRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < kuiperData.count; i++) {
        anglesRef.current[i] += kuiperData.speeds[i] * config.orbitSpeedMultiplier * timeSpeed * delta;
        
        const radius = radiiRef.current[i];
        positions[i * 3] = Math.cos(anglesRef.current[i]) * radius;
        positions[i * 3 + 2] = Math.sin(anglesRef.current[i]) * radius;
      }
      
      kuiperRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (viewMode !== "solar") return null;

  return (
    <group>
      <points ref={kuiperRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={kuiperData.count}
            array={kuiperData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={kuiperData.count}
            array={kuiperData.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {DWARF_PLANETS.map((planet, i) => (
        <DwarfPlanet 
          key={planet.name}
          data={planet}
          initialAngle={(i / DWARF_PLANETS.length) * Math.PI * 2}
          onClick={onDwarfPlanetClick}
        />
      ))}
    </group>
  );
}

export { DWARF_PLANETS };
export type { DwarfPlanetData };
