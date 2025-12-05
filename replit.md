# Space Simulator

An interactive 3D space simulator featuring a realistic solar system, Milky Way galaxy, and supermassive black hole visualization.

## Overview

This project is a comprehensive 3D space simulation built with React Three Fiber and Three.js. It allows users to explore:
- Our Solar System with all 8 planets and dwarf planets
- The Milky Way Galaxy with spiral arms
- A supermassive black hole with dramatic accretion disk effects

## Features

### Solar System View
- Sun with realistic glow and corona effects
- 8 planets (Mercury → Neptune) with correct ordering and relative sizes
- Elliptical orbits with Kepler's laws (faster near Sun, slower at aphelion)
- Planet rotation on their axes with varying speeds
- Earth's Moon and Jupiter's 4 Galilean moons (Io, Europa, Ganymede, Callisto)
- Saturn's moons: Titan, Enceladus, Rhea, Dione
- Uranus's moons: Miranda, Ariel, Umbriel, Titania, Oberon
- Neptune's moons: Triton, Proteus
- Saturn and Uranus with ring systems
- Visible elliptical orbit paths
- Asteroid belt between Mars and Jupiter (3000 particles)
- Kuiper belt with dwarf planets: Pluto, Eris, Makemake, Haumea

### Galaxy View
- Spiral galaxy with 8,000+ particle stars in 4 arms
- Rotating nebula dust effects
- Central supermassive black hole (Sagittarius A*)
- 3 smaller black holes scattered throughout the galaxy
- Gravitational lensing visual effects around black holes

### Black Hole Focus
- Dramatic close-up view of the supermassive black hole
- Animated accretion disk with particle effects
- Pulsing glow effects and gravitational lensing rings
- Faster rotation when focused

### Post-Processing Effects
- Bloom and glow for stars and accretion disks
- Vignette effect for dramatic atmosphere
- Enhanced visual quality in black hole mode

### Educational Info Panels
- Click any planet, dwarf planet, sun, or black hole
- View fascinating facts and data about each object
- Beautiful animated slide-in panels

### Controls
- Mouse drag to rotate camera
- Scroll wheel to zoom
- Right-click to pan
- Screenshot button to save current view
- Control panel for view modes, time speed, and visibility toggles

## Configuration

The simulation parameters can be customized in `client/src/lib/stores/useSpaceConfig.tsx`:

```typescript
const DEFAULT_CONFIG: SpaceConfig = {
  planetSizeMultiplier: 1.0,      // Scale all planets
  orbitSpeedMultiplier: 1.0,      // Speed up/slow down orbits
  galaxyRotationSpeed: 0.05,      // Galaxy spiral rotation
  accretionDiskColor: 0xffaa00,   // Black hole disk color (orange)
  starBrightness: 1.0,            // Background star brightness
  galaxyStarCount: 8000,          // Number of galaxy particles
  sunGlowIntensity: 2.0,          // Sun light intensity
  blackHoleSize: 3.0,             // Central black hole size
};
```

## Project Structure

```
client/src/
├── components/
│   └── space/
│       ├── SpaceSimulator.tsx   # Main simulator component
│       ├── SolarSystem.tsx      # Solar system container
│       ├── Sun.tsx              # Sun with glow effects
│       ├── Planet.tsx           # Planet component + PLANETS data
│       ├── OrbitPaths.tsx       # Elliptical orbital path lines
│       ├── AsteroidBelt.tsx     # Asteroid belt particles
│       ├── KuiperBelt.tsx       # Kuiper belt + dwarf planets
│       ├── Galaxy.tsx           # Spiral galaxy particles
│       ├── BlackHole.tsx        # Black hole + accretion disk
│       ├── GravitationalLensing.tsx # Lensing visual effects
│       ├── PostProcessing.tsx   # Bloom and vignette effects
│       ├── Starfield.tsx        # Background stars
│       ├── CameraController.tsx # Camera transitions
│       ├── Labels.tsx           # Object labels
│       ├── InfoPanel.tsx        # Educational info panels
│       └── ControlPanel.tsx     # UI controls + screenshot
└── lib/stores/
    └── useSpaceConfig.tsx       # State management
```

## Recent Changes

- December 5, 2025: Phase 2 enhancements
  - Elliptical orbits with Kepler's laws for realistic orbital mechanics
  - Additional moons for Saturn, Uranus, and Neptune
  - Asteroid belt between Mars and Jupiter (3000 particles)
  - Kuiper belt with Pluto, Eris, Makemake, Haumea dwarf planets
  - Post-processing bloom and glow effects
  - Gravitational lensing visual effects around black holes
  - Planet rotation on axes with varied speeds
  - Educational info panels when clicking objects
  - Screenshot capability to save views

- December 5, 2025: Initial MVP implementation
  - Solar system with 8 planets, moons, and orbit paths
  - Galaxy view with spiral arms and rotating particles
  - Supermassive black hole with accretion disk
  - 3 smaller black holes in galaxy
  - 15,000 particle starfield background
  - Camera controls with smooth transitions
  - Full UI control panel

## Technologies

- React 18 with TypeScript
- Three.js via React Three Fiber
- React Three Postprocessing for bloom effects
- Drei for camera controls and utilities
- Zustand for state management
- TailwindCSS for UI styling
