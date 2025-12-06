import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceConfig } from "@/lib/stores/useSpaceConfig";

export function GravitationalLensing() {
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const { viewMode, config, timeSpeed, isPaused } = useSpaceConfig();

  useFrame((state, delta) => {
    if (isPaused || viewMode === "solar") return;
    
    const time = state.clock.elapsedTime;
    const speed = timeSpeed * (viewMode === "blackhole" ? 2 : 1);
    
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * speed * 0.3;
      const scale = 1 + Math.sin(time * 2) * 0.05;
      ringRef.current.scale.setScalar(scale);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * speed * 0.2;
      const scale = 1 + Math.sin(time * 1.5 + 1) * 0.03;
      ring2Ref.current.scale.setScalar(scale);
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * speed * 0.15;
    }
  });

  if (viewMode === "solar") return null;

  const blackHoleSize = config.blackHoleSize;

  return (
    <group>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[blackHoleSize * 1.02, blackHoleSize * 1.08, 128]} />
        <meshBasicMaterial 
          color={0x6644aa}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={ring2Ref} rotation={[Math.PI / 2 + 0.2, 0.1, 0]}>
        <ringGeometry args={[blackHoleSize * 1.1, blackHoleSize * 1.2, 128]} />
        <meshBasicMaterial 
          color={0x4422aa}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={ring3Ref} rotation={[Math.PI / 2 - 0.15, -0.1, 0]}>
        <ringGeometry args={[blackHoleSize * 1.22, blackHoleSize * 1.35, 128]} />
        <meshBasicMaterial 
          color={0x2211aa}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      <LensDistortionSphere size={blackHoleSize} />
    </group>
  );
}

function LensDistortionSphere({ size }: { size: number }) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const { timeSpeed, isPaused } = useSpaceConfig();

  useFrame((state) => {
    if (isPaused) return;
    if (sphereRef.current) {
      const material = sphereRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  return (
    <>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[size * 1.5, 64, 64]} />
        <meshBasicMaterial 
          color={0x000011}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[size * 2, 32, 32]} />
        <meshBasicMaterial 
          color={0x110022}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[size * 2.5, 32, 32]} />
        <meshBasicMaterial 
          color={0x050011}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
}
