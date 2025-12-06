import { Html } from "@react-three/drei";
import { useSpaceConfig } from "@/lib/stores/useSpaceConfig";
import { PLANETS } from "./Planet";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LabelProps {
  position: [number, number, number];
  text: string;
  color?: string;
}

function Label({ position, text, color = "#ffffff" }: LabelProps) {
  return (
    <Html position={position} center style={{ pointerEvents: "none" }}>
      <div 
        style={{
          color,
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
          textShadow: "0 0 10px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)",
          whiteSpace: "nowrap",
          userSelect: "none",
          fontWeight: 500,
        }}
      >
        {text}
      </div>
    </Html>
  );
}

function PlanetLabel({ name, orbitRadius, orbitSpeed, initialAngle }: { 
  name: string; 
  orbitRadius: number; 
  orbitSpeed: number;
  initialAngle: number;
}) {
  const posRef = useRef<THREE.Vector3>(new THREE.Vector3(orbitRadius, 0.8, 0));
  const angleRef = useRef(initialAngle);
  const { config, timeSpeed, isPaused } = useSpaceConfig();

  useFrame((_, delta) => {
    if (isPaused) return;
    angleRef.current += orbitSpeed * config.orbitSpeedMultiplier * timeSpeed * delta;
    posRef.current.x = Math.cos(angleRef.current) * orbitRadius;
    posRef.current.z = Math.sin(angleRef.current) * orbitRadius;
  });

  return (
    <Html position={posRef.current} center style={{ pointerEvents: "none" }}>
      <div 
        style={{
          color: "#ffffff",
          fontSize: "11px",
          fontFamily: "Inter, sans-serif",
          textShadow: "0 0 10px rgba(0,0,0,0.8)",
          whiteSpace: "nowrap",
          userSelect: "none",
          background: "rgba(0,0,0,0.5)",
          padding: "2px 6px",
          borderRadius: "4px",
        }}
      >
        {name}
      </div>
    </Html>
  );
}

export function Labels() {
  const { showLabels, viewMode } = useSpaceConfig();

  if (!showLabels) return null;

  return (
    <group>
      {viewMode === "solar" && (
        <>
          <Label position={[0, 3.5, 0]} text="☀ Sun" color="#ffdd44" />
          {PLANETS.map((planet, index) => (
            <PlanetLabel 
              key={planet.name}
              name={planet.name}
              orbitRadius={planet.orbitRadius}
              orbitSpeed={planet.orbitSpeed}
              initialAngle={(index / PLANETS.length) * Math.PI * 2}
            />
          ))}
        </>
      )}
      
      {(viewMode === "galaxy" || viewMode === "blackhole") && (
        <>
          <Label 
            position={[0, 8, 0]} 
            text="⬤ Sagittarius A* (Supermassive Black Hole)" 
            color="#ff8800" 
          />
          <Label 
            position={[0, -10, 0]} 
            text="Milky Way Galaxy Center" 
            color="#aaccff" 
          />
        </>
      )}
    </group>
  );
}
