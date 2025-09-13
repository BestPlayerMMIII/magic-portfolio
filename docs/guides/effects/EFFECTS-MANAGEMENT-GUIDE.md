# Effects Management System Guide

This guide explains how to use the new unified effects configuration system that allows easy management, duplication, and positioning of combined lighting and particle effects.

## 🎯 Overview

The effects system introduces a powerful template-based approach where you can:

- **Define effect templates** (e.g., flame, magical orb, crystal cluster)
- **Create multiple instances** of each template at different positions
- **Override properties** per instance (intensity, color, scale, etc.)
- **Easily duplicate** effects across your scene
- **Manage everything** from a single configuration file

## 📄 System Architecture

### 1. Effect Templates (`effectTemplates`)

Reusable blueprints that define the base properties for lighting + particles combinations.

### 2. Effect Instances (`effectsConfig.instances`)

Specific placements of templates in your 3D scene with custom positioning and overrides.

### 3. Automatic Integration

The system automatically feeds into both `lightingConfig.ts` and `specialEffectsConfig.ts`.

## 🔥 Available Effect Templates

### 🔥 **Flame**

Perfect for fireplaces, candles, torches

```typescript
{
  lighting: Orange-red point light with warm glow
  particles: Dancing fire particles moving upward
  category: 'elemental'
}
```

### 🔮 **Magical Orb**

Pulsing magical energy sphere

```typescript
{
  lighting: Purple point light with medium intensity
  particles: Floating energy particles in sphere distribution
  category: 'magical'
}
```

### 💎 **Crystal Cluster**

Shimmering crystalline formations

```typescript
{
  lighting: Cyan crystal light
  particles: Shimmering particles with gentle movement
  category: 'magical'
}
```

### 💨 **Smoke Plume**

Rising smoke effects

```typescript
{
  lighting: Dim gray illumination
  particles: Upward-drifting smoke particles
  category: 'atmospheric'
}
```

### ⚡ **Lightning Spark**

Electric energy effects

```typescript
{
  lighting: Bright blue-white electric light
  particles: Fast-moving electric sparks
  category: 'elemental'
}
```

### 💚 **Healing Aura**

Soothing healing energy

```typescript
{
  lighting: Gentle green spring light
  particles: Ring-distributed healing particles
  category: 'magical'
}
```

## 🛠️ How to Use

### Creating New Effect Instances

#### Basic Instance

```typescript
{
  id: 'flame_fireplace',
  templateName: 'flame',
  position: [-4, 2, 3],
  enabled: true,
}
```

#### Scaled Instance

```typescript
{
  id: 'flame_small_candle',
  templateName: 'flame',
  position: [2, 3.2, 1],
  scale: 0.3, // 30% of original size
  enabled: true,
}
```

#### Instance with Overrides

```typescript
{
  id: 'blue_flame',
  templateName: 'flame',
  position: [0, 2, 0],
  enabled: true,
  overrides: {
    lighting: {
      color: 0x0066ff, // Blue instead of orange
      intensity: 4,    // Brighter
    },
    particles: {
      material: {
        color: 0x4488ff,
        blending: 'additive',
      },
      particleCount: 150, // More particles
    },
  },
}
```

## 🔧 Helper Functions

### Creating Effects Programmatically

#### Create New Instance

```typescript
import { createEffectInstance } from "../config/effectsConfig";

const newFlame = createEffectInstance(
  "flame_torch_1", // Unique ID
  "flame", // Template name
  [5, 3, 2], // Position [x, y, z]
  {
    scale: 0.8,
    overrides: {
      lighting: { intensity: 2.5 },
    },
  }
);
```

#### Duplicate Existing Effect

```typescript
import { duplicateEffectInstance } from "../config/effectsConfig";

const duplicatedCandle = duplicateEffectInstance(
  "flame_candle1", // Source instance ID
  "flame_candle3", // New instance ID
  [3, 3.2, 1.5], // New position
  {
    scale: 0.25, // Modifications
  }
);
```

#### Remove Effect

```typescript
import { removeEffectInstance } from "../config/effectsConfig";

removeEffectInstance("flame_candle2");
```

### Dynamic Control

#### Toggle Effect On/Off

```typescript
import { toggleEffectInstance } from "../config/effectsConfig";

toggleEffectInstance("flame_fireplace");
```

#### Update Position

```typescript
import { updateEffectInstancePosition } from "../config/effectsConfig";

updateEffectInstancePosition("magical_orb_1", [0, 5, -2]);
```

#### Performance Adjustment

```typescript
import { setEffectPerformanceMode } from "../config/effectsConfig";

setEffectPerformanceMode("medium"); // 'high' | 'medium' | 'low'
```

## 🎨 Creating Custom Templates

### 1. Define Your Template

```typescript
// Add to effectTemplates in effectsConfig.ts
poisonCloud: {
  name: 'poisonCloud',
  description: 'Toxic green cloud with pulsing light',
  category: 'elemental',
  lighting: {
    type: 'point',
    color: 0x00ff00,    // Toxic green
    intensity: 2,
    distance: 10,
    decay: 2,
    castShadow: false,
    enabled: true,
  },
  particles: {
    name: 'poisonCloud',
    particleCount: 120,
    geometry: {
      type: 'sphere',
      size: 0.025,
      randomness: 0.8,
    },
    material: {
      color: 0x66ff66,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: 'additive',
      alphaTest: 0.1,
    },
    distribution: {
      type: 'sphere',
      radius: 1.2,
    },
    animation: {
      enabled: true,
      speed: 1.5,
      direction: [0, 0.5, 0],
      rotationSpeed: 0.02,
      floatingAmplitude: 1.5,
      floatingSpeed: 2,
    },
    position: [0, 0, 0],
    enabled: true,
  },
},
```

### 2. Create Instances

```typescript
// Add to effectsConfig.instances
{
  id: 'poison_cauldron',
  templateName: 'poisonCloud',
  position: [-2, 2.5, 1],
  enabled: true,
},
```

## 💡 Practical Examples

### Cozy Fireplace Scene

```typescript
// Multiple flame instances for realistic fireplace
const fireplaceEffects = [
  {
    id: "main_fire",
    templateName: "flame",
    position: [0, 1.5, 0],
    scale: 1.5,
    overrides: {
      lighting: { intensity: 4 },
      particles: { particleCount: 200 },
    },
  },
  {
    id: "ember_left",
    templateName: "flame",
    position: [-0.3, 1.2, 0.1],
    scale: 0.4,
  },
  {
    id: "ember_right",
    templateName: "flame",
    position: [0.3, 1.2, 0.1],
    scale: 0.3,
  },
];
```

### Magical Laboratory

```typescript
// Combine different magical effects
const labEffects = [
  {
    id: "main_crystal",
    templateName: "crystalCluster",
    position: [0, 3, -2],
    scale: 1.2,
  },
  {
    id: "healing_station",
    templateName: "healingAura",
    position: [3, 2.5, 1],
  },
  {
    id: "energy_conduit",
    templateName: "magicalOrb",
    position: [-3, 4, 0],
    overrides: {
      lighting: { color: 0x00ffff },
    },
  },
];
```

### Dynamic Lightning Storm

```typescript
// Create and trigger lightning effects
import {
  createEffectInstance,
  removeEffectInstance,
} from "../config/effectsConfig";

function triggerLightning() {
  // Create lightning at random position
  const lightningId = `lightning_${Date.now()}`;
  const randomPos: [number, number, number] = [
    (Math.random() - 0.5) * 20,
    8 + Math.random() * 5,
    (Math.random() - 0.5) * 20,
  ];

  createEffectInstance(lightningId, "lightningSpark", randomPos);

  // Remove after brief flash
  setTimeout(() => {
    removeEffectInstance(lightningId);
  }, 200);
}
```

## 🚀 Performance Optimization

### Automatic Performance Scaling

```typescript
// Effects automatically adjust based on performance mode
setEffectPerformanceMode("low"); // Reduces particle counts by 60%
setEffectPerformanceMode("medium"); // Reduces particle counts by 30%
setEffectPerformanceMode("high"); // Full quality
```

### Instance Limits

```typescript
// Automatic management of maximum instances
effectsConfig.globalSettings.maxInstances = 15;
```

### Conditional Loading

```typescript
// Load effects based on device capabilities
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  setEffectPerformanceMode("low");
  // Disable some heavy effects
  toggleEffectInstance("heavy_smoke_effect");
}
```

## 🔄 Integration with Existing Systems

The effects system automatically integrates with:

- **Lighting System**: Effect lights are added to the scene lighting
- **Particle System**: Effect particles are included in the animation loop
- **Performance Management**: Respects global performance settings
- **Memory Management**: Automatic cleanup when effects are removed

## 📋 Best Practices

### 1. **Consistent Naming**

```typescript
// Use descriptive, hierarchical IDs
"flame_fireplace_main";
"flame_candle_table_01";
"orb_crystal_power_source";
```

### 2. **Template Reuse**

Create templates for common effect combinations, then customize with overrides.

### 3. **Performance Testing**

Test effects on various devices and use performance modes appropriately.

### 4. **Gradual Loading**

Load heavy effects progressively or based on user interaction.

### 5. **Memory Management**

Remove temporary effects (like lightning) to prevent memory leaks.

## 🎮 Real-time Control

You can create UI controls to dynamically manage effects:

```typescript
// Effect control panel component
const EffectControls = {
  toggleFlames: () => {
    getInstancesByTemplate("flame").forEach((instance) => {
      toggleEffectInstance(instance.id);
    });
  },

  adjustIntensity: (multiplier: number) => {
    getAllEnabledInstances().forEach((instance) => {
      if (instance.overrides?.lighting?.intensity) {
        instance.overrides.lighting.intensity *= multiplier;
      }
    });
  },
};
```

This system provides complete control over your scene's atmospheric effects while maintaining clean, organized, and performant code!
