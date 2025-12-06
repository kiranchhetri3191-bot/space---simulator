import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceConfig } from "@/lib/stores/useSpaceConfig";

export function BlackHole() {
  const diskRef = useRef<THREE.Points>(null);
  const disk2Ref = useRef<THREE.Points>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const { config, viewMode, timeSpeed, isPaused } = useSpaceConfig();

  const diskParticles = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const diskColor = new THREE.Color(config.accretionDiskColor);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const innerRadius = config.blackHoleSize * 1.2;
      const outerRadius = config.blackHoleSize * 4;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      
      const thickness = 0.3 * (1 - (radius - innerRadius) / (outerRadius - innerRadius));
      const y = (Math.random() - 0.5) * thickness;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      const distanceRatio = (radius - innerRadius) / (outerRadius - innerRadius);
      const intensity = 1 - distanceRatio * 0.6;
      
      colors[i * 3] = diskColor.r * intensity + (1 - distanceRatio) * 0.3;
      colors[i * 3 + 1] = diskColor.g * intensity * 0.8;
      colors[i * 3 + 2] = diskColor.b * intensity * 0.3 + distanceRatio * 0.2;
    }
    
    return { positions, colors };
  }, [config.accretionDiskColor, config.blackHoleSize]);

  const innerDiskParticles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const innerRadius = config.blackHoleSize * 1.05;
      const outerRadius = config.blackHoleSize * 1.5;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      
      const y = (Math.random() - 0.5) * 0.1;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.9;
      colors[i * 3 + 2] = 0.7;
    }
    
    return { positions, colors };
  }, [config.blackHoleSize]);

  useFrame((state, delta) => {
    if (isPaused || viewMode === "solar") return;
    
    const speed = timeSpeed * (viewMode === "blackhole" ? 3 : 1);
    
    if (diskRef.current) {
      diskRef.current.rotation.y += delta * speed * 0.5;
    }
    if (disk2Ref.current) {
      disk2Ref.current.rotation.y += delta * speed * 1.5;
    }
    if (outerGlowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      outerGlowRef.current.scale.setScalar(pulse);
    }
  });

  if (viewMode === "solar") return null;

  return (
    <group>
      <mesh>
        <sphereGeometry args={[config.blackHoleSize, 64, 64]} />
        <meshBasicMaterial color={0x000000} />
      </mesh>
      
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[config.blackHoleSize * 1.1, 32, 32]} />
        <meshBasicMaterial 
          color={0x220033}
          transparent
          opacity={0.5}
          side={THREE.BackSide}
        />
      </mesh>
      
      <mesh>
        <sphereGeometry args={[config.blackHoleSize * 1.3, 32, 32]} />
        <meshBasicMaterial 
          color={0x110022}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      <points ref={diskRef} rotation={[Math.PI * 0.1, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={5000}
            array={diskParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={5000}
            array={diskParticles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={disk2Ref} rotation={[Math.PI * 0.1, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2000}
            array={innerDiskParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={2000}
            array={innerDiskParticles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          vertexColors
          transparent
          opacity={1}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh rotation={[Math.PI * 0.6, 0, 0]}>
        <torusGeometry args={[config.blackHoleSize * 2.5, 0.15, 16, 100]} />
        <meshBasicMaterial 
          color={config.accretionDiskColor} 
          transparent 
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

export function SmallBlackHoles() {
  const { viewMode } = useSpaceConfig();
  
  const positions = useMemo(() => [
    { x: 80, z: 40 },
    { x: -60, z: -70 },
    { x: 30, z: -90 },
  ], []);

  if (viewMode === "solar") return null;

  return (
    <group>
      {positions.map((pos, i) => (
        <SmallBlackHole key={i} position={[pos.x, 0, pos.z]} />
      ))}
    </group>
  );
}

function SmallBlackHole({ position }: { position: [number, number, number] }) {
  const diskRef = useRef<THREE.Mesh>(null);
  const { timeSpeed, isPaused } = useSpaceConfig();

  useFrame((_, delta) => {
    if (isPaused) return;
    if (diskRef.current) {
      diskRef.current.rotation.z += delta * timeSpeed * 2;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color={0x000000} />
      </mesh>
      
      <mesh>
        <sphereGeometry args={[1.0, 16, 16]} />
        <meshBasicMaterial 
          color={0x220033}
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>
      
      <mesh ref={diskRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[1.0, 2.5, 64]} />
        <meshBasicMaterial 
          color={0xff6600}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
