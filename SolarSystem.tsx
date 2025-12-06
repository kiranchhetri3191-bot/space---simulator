import { Sun } from "./Sun";
import { Planet, PLANETS, PlanetData } from "./Planet";
import { OrbitPaths } from "./OrbitPaths";
import { AsteroidBelt } from "./AsteroidBelt";
import { KuiperBelt, DwarfPlanetData } from "./KuiperBelt";
import { useSpaceConfig } from "@/lib/stores/useSpaceConfig";

interface SolarSystemProps {
  onPlanetClick?: (data: PlanetData) => void;
  onDwarfPlanetClick?: (data: DwarfPlanetData) => void;
  onSunClick?: () => void;
}

export function SolarSystem({ onPlanetClick, onDwarfPlanetClick, onSunClick }: SolarSystemProps) {
  const { viewMode } = useSpaceConfig();
  
  if (viewMode !== "solar") return null;

  return (
    <group>
      <Sun onClick={onSunClick} />
      <OrbitPaths />
      {PLANETS.map((planet, index) => (
        <Planet 
          key={planet.name} 
          data={planet} 
          initialAngle={(index / PLANETS.length) * Math.PI * 2}
          onClick={onPlanetClick}
        />
      ))}
      <AsteroidBelt />
      <KuiperBelt onDwarfPlanetClick={onDwarfPlanetClick} />
    </group>
  );
}
