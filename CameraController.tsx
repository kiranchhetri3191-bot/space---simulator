import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useSpaceConfig } from "@/lib/stores/useSpaceConfig";

const VIEW_POSITIONS = {
  solar: { position: new THREE.Vector3(0, 40, 80), target: new THREE.Vector3(0, 0, 0) },
  galaxy: { position: new THREE.Vector3(0, 150, 200), target: new THREE.Vector3(0, 0, 0) },
  blackhole: { position: new THREE.Vector3(15, 8, 15), target: new THREE.Vector3(0, 0, 0) },
};

export function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const { viewMode, setTransitioning, isTransitioning } = useSpaceConfig();
  
  const transitionRef = useRef({
    startPos: new THREE.Vector3(),
    endPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    progress: 1,
    duration: 2,
  });

  useEffect(() => {
    const target = VIEW_POSITIONS[viewMode];
    
    transitionRef.current.startPos.copy(camera.position);
    transitionRef.current.endPos.copy(target.position);
    
    if (controlsRef.current) {
      transitionRef.current.startTarget.copy(controlsRef.current.target);
    }
    transitionRef.current.endTarget.copy(target.target);
    
    transitionRef.current.progress = 0;
    setTransitioning(true);
  }, [viewMode, camera, setTransitioning]);

  useFrame((_, delta) => {
    if (transitionRef.current.progress < 1) {
      transitionRef.current.progress += delta / transitionRef.current.duration;
      const t = Math.min(transitionRef.current.progress, 1);
      
      const eased = 1 - Math.pow(1 - t, 3);
      
      camera.position.lerpVectors(
        transitionRef.current.startPos,
        transitionRef.current.endPos,
        eased
      );
      
      if (controlsRef.current) {
        controlsRef.current.target.lerpVectors(
          transitionRef.current.startTarget,
          transitionRef.current.endTarget,
          eased
        );
        controlsRef.current.update();
      }
      
      if (t >= 1) {
        setTransitioning(false);
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={5}
      maxDistance={500}
      zoomSpeed={1.2}
      panSpeed={0.8}
      rotateSpeed={0.5}
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
}
