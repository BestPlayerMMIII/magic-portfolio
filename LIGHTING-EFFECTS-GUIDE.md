# Lighting and Special Effects Configuration Guide

This guide explains how to customize the lighting and special effects in your Magic Portfolio using the configuration files.

## 📄 Configuration Files

### 1. Lighting Configuration (`src/config/lightingConfig.ts`)

Controls all lighting in the 3D scene including ambient, directional, point, and spot lights.

### 2. Special Effects Configuration (`src/config/specialEffectsConfig.ts`)

Manages particle systems and special effects like magical particles, floating dust, energy orbs, and sparkles.

## 🔆 Lighting Configuration

### Basic Light Types

#### Ambient Light

```typescript
ambientLight: {
  type: 'ambient',
  color: 0x404040,        // Hex color
  intensity: 0.6,         // Light intensity (0-10)
  enabled: true,          // Enable/disable this light
}
```

#### Directional Light (Sun-like)

```typescript
mainDirectionalLight: {
  type: 'directional',
  color: 0xffffff,
  intensity: 1.2,
  position: [10, 10, 5],  // [x, y, z] position
  target: [0, 0, 0],      // [x, y, z] target point
  castShadow: true,       // Enable shadows
  shadowMapSize: [2048, 2048], // Shadow resolution
  // Shadow camera bounds
  shadowCameraLeft: -20,
  shadowCameraRight: 20,
  shadowCameraTop: 20,
  shadowCameraBottom: -20,
  enabled: true,
}
```

#### Point Lights (Magical atmosphere)

```typescript
magicalPointLights: [
  {
    type: "point",
    color: 0x6366f1, // Purple magical light
    intensity: 2.5,
    position: [-5, 3, 0],
    distance: 20, // Light reach distance
    decay: 2, // Light decay rate
    castShadow: false,
    enabled: true,
  },
];
```

#### Spot Lights (Focused beams)

```typescript
spotLights: [
  {
    type: "spot",
    color: 0xffffff,
    intensity: 3,
    position: [0, 8, 0],
    target: [0, 0, 0],
    distance: 25,
    angle: Math.PI / 6, // Spotlight cone angle
    penumbra: 0.2, // Soft edge (0-1)
    decay: 2,
    castShadow: true,
    enabled: false, // Disabled by default
  },
];
```

### Global Shadow Settings

```typescript
globalShadowSettings: {
  enabled: true,
  type: 'pcfSoft',         // 'basic' | 'pcf' | 'pcfSoft' | 'vsm'
  autoUpdate: true,
}
```

## ✨ Special Effects Configuration

### Particle System Properties

#### Basic Configuration

```typescript
{
  name: 'magicalParticles',
  particleCount: 200,              // Number of particles
  enabled: true,                   // Enable/disable system
  position: [0, 0, 0],            // System center position
}
```

#### Geometry Settings

```typescript
geometry: {
  type: 'sphere',                  // 'sphere' | 'box' | 'custom'
  size: 0.02,                     // Individual particle size
  randomness: 0.5,                // Size variation (0-1)
}
```

#### Material Settings

```typescript
material: {
  color: 0x6366f1,                // Particle color
  size: 0.03,                     // Rendered size
  transparent: true,
  opacity: 0.8,                   // Transparency (0-1)
  blending: 'additive',           // 'normal' | 'additive' | 'subtractive' | 'multiply'
  alphaTest: 0.1,                 // Alpha cutoff
}
```

#### Distribution Patterns

```typescript
distribution: {
  type: 'sphere',                 // 'sphere' | 'box' | 'ring' | 'line'
  radius: 15,                     // For sphere distribution
  width: 25,                      // For box distribution
  height: 15,                     // For box distribution
  depth: 25,                      // For box distribution
  innerRadius: 8,                 // For ring distribution
  outerRadius: 12,                // For ring distribution
}
```

#### Animation Settings

```typescript
animation: {
  enabled: true,
  speed: 0.5,                     // Movement speed
  direction: [0, 0.2, 0],         // Movement direction [x, y, z]
  rotationSpeed: 0.01,            // System rotation speed
  floatingAmplitude: 2,           // Floating distance
  floatingSpeed: 0.8,             // Floating animation speed
}
```

## 🎮 Available Particle Systems

### 1. Magical Particles

- **Purpose**: Main atmospheric particles
- **Default**: 200 purple particles in sphere distribution
- **Animation**: Slow floating with gentle movement

### 2. Floating Dust

- **Purpose**: Atmospheric dust particles
- **Default**: 150 white particles in box distribution
- **Animation**: Gentle upward drift

### 3. Energy Orbs

- **Purpose**: Magical energy around objects
- **Default**: 50 pink particles in ring distribution
- **Animation**: Orbital movement with floating

### 4. Sparkles

- **Purpose**: Special event effects
- **Default**: 100 golden particles in sphere distribution
- **Animation**: Dynamic floating (disabled by default)

## 🛠️ Customization Examples

### Create a Cozy Warm Lighting

```typescript
// In lightingConfig.ts
ambientLight: {
  color: 0x2d1810,              // Warm brown ambient
  intensity: 0.8,
},
magicalPointLights: [
  {
    color: 0xfbbf24,            // Warm golden light
    intensity: 3,
    position: [0, 5, 0],
  }
]
```

### Add a Thunderstorm Effect

```typescript
// Add to magicalPointLights array
{
  type: 'point',
  color: 0x3b82f6,              // Electric blue
  intensity: 5,
  position: [10, 10, 10],
  distance: 30,
  decay: 1,
  enabled: false,               // Enable via code for lightning flashes
}
```

### Create Snow Effect

```typescript
// Add to specialEffectsConfig
snowParticles: {
  name: 'snow',
  particleCount: 300,
  geometry: { type: 'sphere', size: 0.01 },
  material: {
    color: 0xffffff,
    opacity: 0.9,
    blending: 'normal'
  },
  distribution: {
    type: 'box',
    width: 40,
    height: 20,
    depth: 40
  },
  animation: {
    enabled: true,
    speed: 0.3,
    direction: [0, -1, 0],      // Falling down
    floatingAmplitude: 1,
  },
  position: [0, 15, 0],
  enabled: true,
}
```

## 🔧 Helper Functions

### Lighting Controls

```typescript
import { updateLightIntensity, toggleLight } from "../config/lightingConfig";

// Adjust light intensity
updateLightIntensity("ambient", 0.8);

// Toggle lights on/off
toggleLight("directional");
```

### Particle System Controls

```typescript
import {
  toggleParticleSystem,
  updateParticleCount,
  setPerformanceMode,
  enableSparkleEffect,
} from "../config/specialEffectsConfig";

// Toggle particle systems
toggleParticleSystem("magicalParticles");

// Adjust particle count
updateParticleCount("floatingDust", 100);

// Set performance mode
setPerformanceMode("medium"); // 'high' | 'medium' | 'low'

// Trigger special effects
enableSparkleEffect(); // Auto-disables after 5 seconds
```

## 🎯 Performance Tips

### Optimize for Different Devices

```typescript
// Auto-adjust based on device performance
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  setPerformanceMode("low");
}

// Reduce particle counts for better performance
if (window.innerWidth < 768) {
  updateParticleCount("magicalParticles", 100);
  updateParticleCount("floatingDust", 75);
}
```

### Dynamic Quality Adjustment

```typescript
// Monitor FPS and adjust quality
let frameCount = 0;
let lastTime = performance.now();

function checkPerformance() {
  frameCount++;
  const currentTime = performance.now();

  if (currentTime - lastTime >= 1000) {
    const fps = frameCount;
    frameCount = 0;
    lastTime = currentTime;

    if (fps < 30) {
      setPerformanceMode("low");
    } else if (fps > 50) {
      setPerformanceMode("high");
    }
  }
}
```

## 🚀 Advanced Customization

### Custom Particle System

1. Add your configuration to `specialEffectsConfig.ts`
2. Update the `getEnabledParticleSystems()` function
3. The system will automatically be created and animated

### Custom Light Setup

1. Add your light configuration to `lightingConfig.ts`
2. Update the `setupLighting()` function in MagicLaboratory.vue
3. Add any special shadow or positioning logic

### Real-time Controls

You can create UI controls to adjust lighting and effects in real-time by importing the helper functions and calling them from your Vue components.

## 📝 Notes

- All configurations are reactive and will be applied immediately
- Shadow calculations can be performance-intensive; adjust shadow map sizes accordingly
- Particle systems are automatically cleaned up when the component unmounts
- Use performance modes to automatically adjust quality based on device capabilities
- Colors are specified in hexadecimal format (0x notation)
- Positions and directions use [x, y, z] array format
