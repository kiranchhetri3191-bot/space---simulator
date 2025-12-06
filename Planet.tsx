import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceConfig } from "@/lib/stores/useSpaceConfig";

interface MoonData {
  name: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  color: number;
}

interface PlanetData {
  name: string;
  size: number;
  color: number;
  orbitRadius: number;
  orbitSpeed: number;
  tilt: number;
  eccentricity: number;
  rotationSpeed: number;
  rings?: { innerRadius: number; outerRadius: number; color: number };
  moons?: MoonData[];
  info: string;
}

interface PlanetProps {
  data: PlanetData;
  initialAngle: number;
  onClick?: (data: PlanetData) => void;
}

export function Planet({ data, initialAngle, onClick }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const moonRefs = useRef<THREE.Mesh[]>([]);
  const { config, timeSpeed, isPaused } = useSpaceConfig();
  
  const angleRef = useRef(initialAngle);
  const moonAnglesRef = useRef<number[]>(
    data.moons?.map((_, i) => i * Math.PI * 0.5) || []
  );

  useFrame((_, delta) => {
    if (isPaused) return;
    
    const baseSpeed = data.orbitSpeed * config.orbitSpeedMultiplier * timeSpeed;
    
    const r = data.orbitRadius * (1 - data.eccentricity * data.eccentricity) / 
              (1 + data.eccentricity * Math.cos(angleRef.current));
    
    const keplerSpeed = baseSpeed * Math.pow(data.orbitRadius / r, 1.5);
    angleRef.current += keplerSpeed * delta;
    
    if (groupRef.current) {
      const x = r * Math.cos(angleRef.current);
      const z = r * Math.sin(angleRef.current);
      groupRef.current.position.x = x;
      groupRef.current.position.z = z;
    }
    
    if (planetRef.current) {
      planetRef.current.rotation.y += data.rotationSpeed * timeSpeed * delta;
    }
    
    if (data.moons) {
      data.moons.forEach((moon, i) => {
        moonAnglesRef.current[i] += moon.orbitSpeed * timeSpeed * delta;
        const moonMesh = moonRefs.current[i];
        if (moonMesh) {
          moonMesh.position.x = Math.cos(moonAnglesRef.current[i]) * moon.orbitRadius;
          moonMesh.position.z = Math.sin(moonAnglesRef.current[i]) * moon.orbitRadius;
        }
      });
    }
  });

  const scaledSize = data.size * config.planetSizeMultiplier;

  const handleClick = (e: any) => {
    e.stopPropagation?.();
    if (onClick) onClick(data);
  };

  return (
    <group ref={groupRef} position={[data.orbitRadius, 0, 0]}>
      <mesh 
        ref={planetRef} 
        rotation={[0, 0, data.tilt]}
        onClick={handleClick}
      >
        <sphereGeometry args={[scaledSize, 32, 32]} />
        <meshStandardMaterial 
          color={data.color}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {data.rings && (
        <mesh rotation={[Math.PI / 2 + data.tilt, 0, 0]}>
          <ringGeometry args={[
            data.rings.innerRadius * config.planetSizeMultiplier, 
            data.rings.outerRadius * config.planetSizeMultiplier, 
            64
          ]} />
          <meshBasicMaterial 
            color={data.rings.color} 
            side={THREE.DoubleSide}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
      
      {data.moons?.map((moon, i) => (
        <mesh 
          key={i}
          ref={(el) => { if (el) moonRefs.current[i] = el; }}
          position={[moon.orbitRadius, 0, 0]}
        >
          <sphereGeometry args={[moon.size * config.planetSizeMultiplier, 16, 16]} />
          <meshStandardMaterial color={moon.color} />
        </mesh>
      ))}
    </group>
  );
}

export const PLANETS: PlanetData[] = [
  {
    name: "Mercury",
    size: 0.2,
    color: 0x8c7853,
    orbitRadius: 6,
    orbitSpeed: 0.8,
    tilt: 0.03,
    eccentricity: 0.205,
    rotationSpeed: 0.02,
    info: "Mercury is the smallest planet and closest to the Sun. A year on Mercury is just 88 Earth days. Surface temperatures range from -180°C to 430°C."
  },
  {
    name: "Venus",
    size: 0.35,
    color: 0xffc649,
    orbitRadius: 9,
    orbitSpeed: 0.6,
    tilt: 0.05,
    eccentricity: 0.007,
    rotationSpeed: -0.005,
    info: "Venus rotates backwards and is the hottest planet at 465°C due to its thick atmosphere. It's often called Earth's 'twin' due to similar size."
  },
  {
    name: "Earth",
    size: 0.4,
    color: 0x6b93d6,
    orbitRadius: 12,
    orbitSpeed: 0.5,
    tilt: 0.41,
    eccentricity: 0.017,
    rotationSpeed: 0.5,
    moons: [
      { name: "Moon", size: 0.1, orbitRadius: 0.8, orbitSpeed: 2.0, color: 0xaaaaaa }
    ],
    info: "Earth is the only known planet with liquid water on its surface and life. Our Moon stabilizes Earth's axial tilt, making our climate more stable."
  },
  {
    name: "Mars",
    size: 0.25,
    color: 0xc1440e,
    orbitRadius: 16,
    orbitSpeed: 0.4,
    tilt: 0.44,
    eccentricity: 0.093,
    rotationSpeed: 0.48,
    info: "Mars is the 'Red Planet' due to iron oxide on its surface. It has the largest volcano (Olympus Mons) and canyon (Valles Marineris) in the solar system."
  },
  {
    name: "Jupiter",
    size: 1.0,
    color: 0xd8ca9d,
    orbitRadius: 24,
    orbitSpeed: 0.2,
    tilt: 0.05,
    eccentricity: 0.049,
    rotationSpeed: 1.2,
    moons: [
      { name: "Io", size: 0.15, orbitRadius: 1.8, orbitSpeed: 1.5, color: 0xffcc66 },
      { name: "Europa", size: 0.12, orbitRadius: 2.2, orbitSpeed: 1.2, color: 0xccddee },
      { name: "Ganymede", size: 0.18, orbitRadius: 2.8, orbitSpeed: 0.9, color: 0x99aacc },
      { name: "Callisto", size: 0.16, orbitRadius: 3.3, orbitSpeed: 0.7, color: 0x887766 }
    ],
    info: "Jupiter is the largest planet, with a mass 2.5x all other planets combined. The Great Red Spot is a storm that has raged for over 400 years."
  },
  {
    name: "Saturn",
    size: 0.85,
    color: 0xead6b8,
    orbitRadius: 34,
    orbitSpeed: 0.15,
    tilt: 0.47,
    eccentricity: 0.056,
    rotationSpeed: 1.1,
    rings: {
      innerRadius: 1.2,
      outerRadius: 2.0,
      color: 0xc9b896
    },
    moons: [
      { name: "Titan", size: 0.2, orbitRadius: 2.8, orbitSpeed: 0.8, color: 0xffaa55 },
      { name: "Enceladus", size: 0.08, orbitRadius: 2.2, orbitSpeed: 1.2, color: 0xeeeeff },
      { name: "Rhea", size: 0.1, orbitRadius: 3.2, orbitSpeed: 0.6, color: 0xcccccc },
      { name: "Dione", size: 0.09, orbitRadius: 2.5, orbitSpeed: 0.9, color: 0xdddddd }
    ],
    info: "Saturn's rings are made of ice and rock particles. Titan, its largest moon, has a thick atmosphere and liquid methane lakes on its surface."
  },
  {
    name: "Uranus",
    size: 0.5,
    color: 0xd1e7e7,
    orbitRadius: 44,
    orbitSpeed: 0.1,
    tilt: 1.71,
    eccentricity: 0.046,
    rotationSpeed: -0.7,
    rings: {
      innerRadius: 0.7,
      outerRadius: 0.9,
      color: 0x88ccdd
    },
    moons: [
      { name: "Miranda", size: 0.06, orbitRadius: 0.9, orbitSpeed: 1.5, color: 0xcccccc },
      { name: "Ariel", size: 0.08, orbitRadius: 1.1, orbitSpeed: 1.2, color: 0xdddddd },
      { name: "Umbriel", size: 0.08, orbitRadius: 1.3, orbitSpeed: 1.0, color: 0x888888 },
      { name: "Titania", size: 0.1, orbitRadius: 1.6, orbitSpeed: 0.8, color: 0xaabbcc },
      { name: "Oberon", size: 0.1, orbitRadius: 1.9, orbitSpeed: 0.6, color: 0x999999 }
    ],
    info: "Uranus rotates on its side, likely due to a collision. It's the coldest planet with temperatures reaching -224°C in its atmosphere."
  },
  {
    name: "Neptune",
    size: 0.48,
    color: 0x5b5ddf,
    orbitRadius: 54,
    orbitSpeed: 0.08,
    tilt: 0.49,
    eccentricity: 0.009,
    rotationSpeed: 0.65,
    moons: [
      { name: "Triton", size: 0.12, orbitRadius: 1.4, orbitSpeed: -0.8, color: 0xddccbb },
      { name: "Proteus", size: 0.06, orbitRadius: 1.0, orbitSpeed: 1.5, color: 0x999999 }
    ],
    info: "Neptune has the strongest winds in the solar system, reaching 2,100 km/h. Triton orbits backwards and may be a captured Kuiper Belt object."
  }
];

export type { PlanetData, MoonData };
