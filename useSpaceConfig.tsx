import { create } from "zustand";

export interface SpaceConfig {
  planetSizeMultiplier: number;
  orbitSpeedMultiplier: number;
  galaxyRotationSpeed: number;
  accretionDiskColor: number;
  starBrightness: number;
  galaxyStarCount: number;
  sunGlowIntensity: number;
  blackHoleSize: number;
}

export type ViewMode = "solar" | "galaxy" | "blackhole";

interface SpaceState {
  config: SpaceConfig;
  viewMode: ViewMode;
  timeSpeed: number;
  isPaused: boolean;
  showOrbits: boolean;
  showLabels: boolean;
  showStarfield: boolean;
  isTransitioning: boolean;
  
  setViewMode: (mode: ViewMode) => void;
  setTimeSpeed: (speed: number) => void;
  togglePause: () => void;
  toggleOrbits: () => void;
  toggleLabels: () => void;
  toggleStarfield: () => void;
  setTransitioning: (value: boolean) => void;
  updateConfig: (updates: Partial<SpaceConfig>) => void;
}

const DEFAULT_CONFIG: SpaceConfig = {
  planetSizeMultiplier: 1.0,
  orbitSpeedMultiplier: 1.0,
  galaxyRotationSpeed: 0.05,
  accretionDiskColor: 0xffaa00,
  starBrightness: 1.0,
  galaxyStarCount: 8000,
  sunGlowIntensity: 2.0,
  blackHoleSize: 3.0,
};

export const useSpaceConfig = create<SpaceState>((set) => ({
  config: DEFAULT_CONFIG,
  viewMode: "solar",
  timeSpeed: 1.0,
  isPaused: false,
  showOrbits: true,
  showLabels: true,
  showStarfield: true,
  isTransitioning: false,
  
  setViewMode: (mode) => set({ viewMode: mode }),
  setTimeSpeed: (speed) => set({ timeSpeed: speed }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  toggleOrbits: () => set((state) => ({ showOrbits: !state.showOrbits })),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  toggleStarfield: () => set((state) => ({ showStarfield: !state.showStarfield })),
  setTransitioning: (value) => set({ isTransitioning: value }),
  updateConfig: (updates) => set((state) => ({ 
    config: { ...state.config, ...updates } 
  })),
}));
