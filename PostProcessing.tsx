import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useSpaceConfig } from "@/lib/stores/useSpaceConfig";

export function PostProcessing() {
  const { viewMode, config } = useSpaceConfig();
  
  const bloomIntensity = viewMode === "blackhole" ? 1.2 : 0.6;
  
  return (
    <EffectComposer multisampling={0}>
      <Bloom 
        intensity={bloomIntensity * config.starBrightness}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette 
        eskil={false}
        offset={0.1}
        darkness={viewMode === "blackhole" ? 0.6 : 0.3}
      />
    </EffectComposer>
  );
}
