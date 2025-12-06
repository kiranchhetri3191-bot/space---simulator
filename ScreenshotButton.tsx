import { useThree } from "@react-three/fiber";
import { useCallback } from "react";

export function useScreenshot() {
  const { gl, scene, camera } = useThree();
  
  const takeScreenshot = useCallback(() => {
    gl.render(scene, camera);
    const dataURL = gl.domElement.toDataURL("image/png");
    
    const link = document.createElement("a");
    link.download = `space-simulator-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  }, [gl, scene, camera]);
  
  return takeScreenshot;
}

export function ScreenshotTrigger({ onReady }: { onReady: (fn: () => void) => void }) {
  const takeScreenshot = useScreenshot();
  onReady(takeScreenshot);
  return null;
}
