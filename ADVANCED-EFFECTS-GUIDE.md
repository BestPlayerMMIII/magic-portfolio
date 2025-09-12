# Advanced Effects Configuration Guide

Complete guide for the enhanced effects management system with flame template implementation.

## 🎉 System Implementation Complete!

Your effects configuration system has been successfully optimized and enhanced with the following improvements:

### ✅ **Fixed Issues**

- **TypeScript Errors**: Fixed return types and proper type handling
- **Missing Properties**: Added `name` property to `LightConfig` interface
- **Deep Override System**: Implemented proper nested property merging
- **Complete Flame Template**: Added realistic flame effect with particles + lighting

### ✅ **New Features**

- **Template System**: Reusable effect definitions
- **Instance Management**: Easy duplication with position overrides
- **Dynamic Integration**: Automatic scene integration
- **Performance Options**: Mobile-friendly overrides

## 🔥 Flame Template Implementation

### Complete Flame Effect

Your flame template now includes:

#### 🎨 **Particle System**

```typescript
particles: {
  particleCount: 30,           // Small, efficient flame
  color: 0xff4500,             // Orange-red flame color
  size: 0.015,                 // Small particles
  blending: "additive",        // Glowing effect
  distribution: "sphere",      // Natural flame shape
  radius: 0.1,                 // Compact flame area

  // Realistic flame animation
  speed: 2.5,                  // Fast flickering
  direction: [0, 0.8, 0],      // Upward movement
  floatingAmplitude: 0.15,     // Subtle flicker
  floatingSpeed: 3.0,          // Rapid flicker rate
}
```

#### 💡 **Lighting System**

```typescript
lighting: {
  type: "point",
  color: 0xffa500,             // Warm orange glow
  intensity: 1.5,              // Moderate brightness
  distance: 3,                 // Close-range illumination
  decay: 2,                    // Natural light falloff
  castShadow: false,           // Performance optimized
}
```

### Current Candle Setup

Two candles are automatically created at:

- **Candle 1**: Position `[2, 3.2, 2]`
- **Candle 2**: Position `[-2, 3.2, -2]`

With performance optimizations:

- **25 particles** (reduced from 30 for better performance)
- **Increased intensity** to 1.8 for better visibility
- **Positioned slightly above table** at Y=3.2

## 🚀 How to Use the System

### 1. **Create New Effect Templates**

```typescript
// Add to effectTemplates array in effectsConfig.ts
{
  id: "torch",
  description: "Large torch flame for wall mounting",
  particles: {
    // Based on flame template but larger
    particleCount: 45,
    distribution: { radius: 0.2 },
    animation: { floatingAmplitude: 0.25 },
  },
  lighting: {
    type: "point",
    color: 0xff6600,
    intensity: 2.2,
    distance: 7,
  },
}
```

### 2. **Create Multiple Instances**

```typescript
// Add to effectInstances array
...createEffectInstances(
  "wall_torch",                    // Base name
  getTemplateById("torch"),        // Template to use
  [
    [-8, 4, 0],                   // Left wall
    [8, 4, 0],                    // Right wall
    [0, 4, -8],                   // Back wall
    [0, 4, 8],                    // Front wall
  ],
  {
    // Optional overrides for all instances
    lighting: { intensity: 2.5 },
    particles: { particleCount: 40 },
  }
),
```

### 3. **Runtime Effect Control**

```typescript
// Add new effects dynamically
addEffectInstance(
  "campfire", // Instance name
  "flame", // Template ID
  [0, 0, 0], // Position
  {
    // Campfire overrides
    particles: {
      particleCount: 60, // Larger fire
      distribution: { radius: 0.3 },
    },
    lighting: {
      intensity: 3.0, // Much brighter
      distance: 8, // Wider reach
    },
  }
);

// Get effect instance
const candle = getEffectInstanceByName("candle_0");

// Toggle effects
if (candle?.config.particles) {
  candle.config.particles.enabled = !candle.config.particles.enabled;
}
```

## 🎨 Creating Custom Effects

### Lightning Effect Template

```typescript
{
  id: "lightning",
  description: "Electric lightning bolt with blue sparks",
  particles: {
    name: "lightning",
    particleCount: 15,
    geometry: { type: "sphere", size: 0.05, randomness: 1.0 },
    material: {
      color: 0x0088ff,             // Electric blue
      size: 0.08,
      blending: "additive",
    },
    distribution: { type: "line", width: 2 },
    animation: {
      speed: 5.0,                  // Very fast
      floatingSpeed: 8.0,          // Rapid sparking
    },
    enabled: false,                // Triggered effect
  },
  lighting: {
    type: "point",
    color: 0x4488ff,
    intensity: 8.0,                // Very bright flash
    distance: 10,
    enabled: false,                // Triggered effect
  },
}
```

### Ice Crystal Effect Template

```typescript
{
  id: "ice_crystal",
  description: "Frozen crystal with blue glow",
  particles: {
    name: "ice_crystal",
    particleCount: 20,
    geometry: { type: "sphere", size: 0.01, randomness: 0.3 },
    material: {
      color: 0x87ceeb,             // Sky blue
      size: 0.02,
      opacity: 0.6,
      blending: "normal",
    },
    distribution: { type: "sphere", radius: 0.5 },
    animation: {
      speed: 0.3,                  // Slow drift
      direction: [0, 0.1, 0],      // Gentle upward
      floatingAmplitude: 0.1,
      floatingSpeed: 1.0,
    },
  },
  lighting: {
    type: "point",
    color: 0x4169e1,               // Royal blue
    intensity: 1.2,
    distance: 4,
    decay: 2,
  },
}
```

## 🔧 Advanced Features

### Performance Optimization

```typescript
// Mobile device detection and optimization
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const mobileOverrides = isMobile
  ? {
      particles: { particleCount: 15 }, // Reduce particles
      lighting: { castShadow: false }, // Disable shadows
    }
  : {};

// Apply to all flame effects
const optimizedFlames = createEffectInstances(
  "candle",
  getTemplateById("flame"),
  positions,
  mobileOverrides
);
```

### Effect Sequences

```typescript
// Create thunderstorm sequence
const createThunderStorm = () => {
  const positions = [
    [5, 10, 5],
    [-3, 12, -2],
    [0, 8, 8],
  ];

  positions.forEach((pos, index) => {
    setTimeout(() => {
      addEffectInstance(`lightning_${Date.now()}`, "lightning", pos);

      // Auto-disable after flash
      setTimeout(() => {
        const effect = getEffectInstanceByName(`lightning_${Date.now()}`);
        if (effect) {
          effect.config.particles!.enabled = false;
          effect.config.lighting!.enabled = false;
        }
      }, 200);
    }, index * 500); // Stagger strikes
  });
};
```

### Effect State Management

```typescript
class MagicEffectController {
  private activeEffects = new Map<string, boolean>();

  toggleEffect(name: string) {
    const effect = getEffectInstanceByName(name);
    if (!effect) return;

    const isActive = this.activeEffects.get(name) || false;
    const newState = !isActive;

    if (effect.config.particles) {
      effect.config.particles.enabled = newState;
    }
    if (effect.config.lighting) {
      effect.config.lighting.enabled = newState;
    }

    this.activeEffects.set(name, newState);
  }

  dimAllLights(factor: number = 0.5) {
    getAllEffectNames().forEach((name) => {
      const effect = getEffectInstanceByName(name);
      if (effect?.config.lighting) {
        effect.config.lighting.intensity *= factor;
      }
    });
  }
}
```

## 🎮 Interactive Controls

### Real-time Effect Adjustment

```typescript
// Create UI controls for effects
const createEffectControls = () => {
  const controls = {
    candleIntensity: 1.8,
    flameSize: 25,
    flameColor: 0xff4500,
  };

  // Update effects when controls change
  const updateCandles = () => {
    ["candle_0", "candle_1"].forEach((name) => {
      const effect = getEffectInstanceByName(name);
      if (effect) {
        if (effect.config.lighting) {
          effect.config.lighting.intensity = controls.candleIntensity;
        }
        if (effect.config.particles) {
          effect.config.particles.particleCount = controls.flameSize;
          effect.config.particles.material.color = controls.flameColor;
        }
      }
    });
  };

  return { controls, updateCandles };
};
```

## 📊 System Benefits

### ✅ **Performance**

- **Optimized Particle Counts**: Mobile-friendly defaults
- **Efficient Lighting**: No unnecessary shadows on flames
- **Memory Management**: Proper cleanup and reuse

### ✅ **Flexibility**

- **Template Reuse**: Define once, use everywhere
- **Per-Instance Overrides**: Customize each placement
- **Runtime Control**: Add/remove/modify effects dynamically

### ✅ **Maintainability**

- **Centralized Configuration**: All effects in one place
- **Type Safety**: Full TypeScript support
- **Clear Structure**: Easy to understand and modify

### ✅ **Scalability**

- **Unlimited Instances**: Add as many as needed
- **Easy Duplication**: Position-based instance creation
- **Modular Design**: Add new templates without breaking existing ones

## 🚀 Next Steps

Your effects system is now ready for:

1. **Adding More Templates**: Create ice, electricity, magic, fire variations
2. **Scene Population**: Add torches, braziers, magical crystals
3. **Interactive Effects**: User-triggered lightning, spell effects
4. **Environmental Events**: Weather effects, day/night cycles
5. **Performance Optimization**: LOD system, culling, adaptive quality

The flame template is working and integrated! You now have realistic candle flames with proper lighting and particle effects, all manageable through the centralized configuration system.
