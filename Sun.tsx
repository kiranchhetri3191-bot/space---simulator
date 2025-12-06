import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceConfig } from "@/lib/stores/useSpaceConfig";

interface SunProps {
  onClick?: () => void;
}

export function Sun({ onClick }: SunProps) {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Points>(null);
  const { config } = useSpaceConfig();
  
  const coronaParticles = useMemo(() => {
    const particles = new Float32Array(3000);
    for (let i = 0; i < 1000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2.2 + Math.random() * 0.8;
      particles[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particles[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particles[i * 3 + 2] = radius * Math.cos(phi);
    }
    return particles;
  }, []);

  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      glowRef.current.scale.setScalar(scale);
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y += 0.001;
      coronaRef.current.rotation.x += 0.0005;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation?.();
    if (onClick) onClick();
  };

  return (
    <group>
      <mesh ref={sunRef} onClick={handleClick}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial color={0xffdd44} />
      </mesh>
      
      <mesh ref={glowRef} scale={1.3}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial 
          color={0xffaa00} 
          transparent 
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      <mesh scale={1.6}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial 
          color={0xff6600} 
          transparent 
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      <mesh scale={2.0}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial 
          color={0xff4400} 
          transparent 
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      <points ref={coronaRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1000}
            array={coronaParticles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.08} 
          color={0xffcc00} 
          transparent 
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      <pointLight 
        color={0xffffee} 
        intensity={config.sunGlowIntensity * 100} 
        distance={500}
        decay={2}
      />
    </group>
  );
}
