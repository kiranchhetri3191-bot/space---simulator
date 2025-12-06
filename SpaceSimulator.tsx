import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useState, useCallback, useRef, useEffect } from "react";
import { SolarSystem } from "./SolarSystem";
import { Galaxy } from "./Galaxy";
import { BlackHole, SmallBlackHoles } from "./BlackHole";
import { Starfield } from "./Starfield";
import { CameraController } from "./CameraController";
import { Labels } from "./Labels";
import { ControlPanel } from "./ControlPanel";
import { PostProcessing } from "./PostProcessing";
import { GravitationalLensing } from "./GravitationalLensing";
import { InfoPanel, CELESTIAL_INFO } from "./InfoPanel";
import { useSpaceConfig } from "@/lib/stores/useSpaceConfig";
import { PlanetData } from "./Planet";
import { DwarfPlanetData } from "./KuiperBelt";

interface SelectedObject {
  name: string;
  info: string;
}

function ScreenshotHelper({ onScreenshot }: { onScreenshot: (fn: () => void) => void }) {
  const { gl, scene, camera } = useThree();
  
  useEffect(() => {
    const takeScreenshot = () => {
      gl.render(scene, camera);
      const dataURL = gl.domElement.toDataURL("image/png");
      
      const link = document.createElement("a");
      link.download = `space-simulator-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
    };
    
    onScreenshot(takeScreenshot);
  }, [gl, scene, camera, onScreenshot]);
  
  return null;
}

function Scene({ 
  onPlanetClick, 
  onDwarfPlanetClick, 
  onSunClick,
  onBlackHoleClick,
  onScreenshotReady
}: { 
  onPlanetClick: (data: PlanetData) => void;
  onDwarfPlanetClick: (data: DwarfPlanetData) => void;
  onSunClick: () => void;
  onBlackHoleClick: () => void;
  onScreenshotReady: (fn: () => void) => void;
}) {
  const { viewMode } = useSpaceConfig();
  
  return (
    <>
      <color attach="background" args={["#000008"]} />
      
      <ambientLight intensity={0.1} />
      
      {viewMode === "blackhole" && (
        <ambientLight intensity={0.05} color="#220033" />
      )}
      
      <CameraController />
      <ScreenshotHelper onScreenshot={onScreenshotReady} />
      
      <Suspense fallback={null}>
        <Starfield />
        <SolarSystem 
          onPlanetClick={onPlanetClick}
          onDwarfPlanetClick={onDwarfPlanetClick}
          onSunClick={onSunClick}
        />
        <Galaxy />
        <group onClick={viewMode !== "solar" ? onBlackHoleClick : undefined}>
          <BlackHole />
          <GravitationalLensing />
        </group>
        <SmallBlackHoles />
        <Labels />
      </Suspense>
      
      <PostProcessing />
    </>
  );
}

export function SpaceSimulator() {
  const [selectedObject, setSelectedObject] = useState<SelectedObject | null>(null);
  const screenshotFnRef = useRef<(() => void) | null>(null);

  const handlePlanetClick = useCallback((data: PlanetData) => {
    setSelectedObject({ name: data.name, info: data.info });
  }, []);

  const handleDwarfPlanetClick = useCallback((data: DwarfPlanetData) => {
    setSelectedObject({ name: data.name, info: data.info });
  }, []);

  const handleSunClick = useCallback(() => {
    setSelectedObject({ name: "Sun", info: CELESTIAL_INFO.Sun });
  }, []);

  const handleBlackHoleClick = useCallback(() => {
    setSelectedObject({ name: "Sagittarius A*", info: CELESTIAL_INFO["Sagittarius A*"] });
  }, []);

  const handleCloseInfo = useCallback(() => {
    setSelectedObject(null);
  }, []);

  const handleScreenshotReady = useCallback((fn: () => void) => {
    screenshotFnRef.current = fn;
  }, []);

  const handleTakeScreenshot = useCallback(() => {
    if (screenshotFnRef.current) {
      screenshotFnRef.current();
    }
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas
        camera={{
          position: [0, 40, 80],
          fov: 60,
          near: 0.1,
          far: 2000,
        }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
        }}
        dpr={[1, 2]}
      >
        <Scene 
          onPlanetClick={handlePlanetClick}
          onDwarfPlanetClick={handleDwarfPlanetClick}
          onSunClick={handleSunClick}
          onBlackHoleClick={handleBlackHoleClick}
          onScreenshotReady={handleScreenshotReady}
        />
      </Canvas>
      
      <ControlPanel onScreenshot={handleTakeScreenshot} />
      
      {selectedObject && (
        <InfoPanel 
          title={selectedObject.name}
          info={selectedObject.info}
          onClose={handleCloseInfo}
        />
      )}
    </div>
  );
}
