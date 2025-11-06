# 🎨 Creating Custom Themes

Learn how to create your own custom theme for Magic Portfolio, replacing the default wizard laboratory with your unique vision.

## Table of Contents

- [Theme Structure](#theme-structure)
- [Quick Start: Customizing Wizard Lab](#quick-start-customizing-wizard-lab)
- [Creating a New Theme](#creating-a-new-theme)
- [Theme Configuration](#theme-configuration)
- [3D Objects Setup](#3d-objects-setup)
- [Lighting Configuration](#lighting-configuration)
- [Particle Effects](#particle-effects)
- [Advanced Customization](#advanced-customization)

## Theme Structure

A theme in Magic Portfolio consists of configuration files that control:

- **3D Objects** - Position, rotation, scale, colors, and models for interactive elements
- **Scene Settings** - Background color, fog, camera position
- **Lighting** - Ambient, directional, point, and spot lights
- **Particles** - Floating particle effects and their behavior

### Default Theme: Wizard Lab

Location: `src/themes/wizard-lab/`

```
wizard-lab/
├── index.ts              # Main theme export
└── config/
    ├── objects.ts        # 3D object configurations
    ├── lighting.ts       # Light setup
    ├── particles.ts      # Particle effects
    └── scene.ts          # Scene settings
```

## Quick Start: Customizing Wizard Lab

The easiest way to personalize your portfolio is to modify the existing wizard lab theme.

### Change Background and Fog

Edit `src/themes/wizard-lab/config/scene.ts`:

```typescript
export const sceneConfig = {
  scene: {
    background: "#0a0e27", // Dark blue → Try "#1a1a1a" for black
    fog: {
      color: "#1a1a2e", // Fog color → Match background
      density: 0.05, // 0.0 = no fog, 0.1 = thick fog
    },
  },
  camera: {
    position: {
      x: 0,
      y: 5, // Height above ground
      z: 15, // Distance from center
    },
    fov: 75, // Field of view (60-90 typical)
  },
};
```

### Modify Object Colors

Edit `src/themes/wizard-lab/config/objects.ts`:

Find the object you want to change (e.g., crystal for projects):

```typescript
crystal: {
  position: { x: -4, y: 2, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: 1.5,
  color: "#ff00ff",        // Magenta → Try "#00ffff" for cyan
  emissive: "#ff00ff",     // Glow color
  emissiveIntensity: 0.5,  // Glow strength (0.0-1.0)
  category: "projects",
  model: "/assets/models/crystal.glb"
}
```

**Color Palette Ideas:**

- **Cyberpunk:** `#00ffff` (cyan), `#ff00ff` (magenta), `#ffff00` (yellow)
- **Forest:** `#2d5016` (green), `#8b4513` (brown), `#4169e1` (blue)
- **Ocean:** `#006994` (deep blue), `#00ced1` (turquoise), `#ffffff` (white)
- **Sunset:** `#ff6b35` (orange), `#f7931e` (gold), `#c1272d` (red)

### Change Object Positions

Arrange objects in your scene:

```typescript
crystal: {
  position: {
    x: -4,   // Left (-) to Right (+)
    y: 2,    // Down (-) to Up (+)
    z: 0     // Far (-) to Near (+)
  },
  // ... rest of config
}
```

**Tips:**

- Keep objects between `x: -10` to `x: 10`
- Keep objects between `z: -5` to `z: 5`
- Raise important objects: `y: 2` to `y: 4`
- Lower background objects: `y: 0` to `y: 1`

### Adjust Lighting

Edit `src/themes/wizard-lab/config/lighting.ts`:

```typescript
// Ambient light - overall scene brightness
{
  type: 'ambient',
  color: "#404040",      // Gray → Try "#606060" for brighter
  intensity: 0.3         // 0.0 = dark, 1.0 = bright
}

// Directional light - like sunlight
{
  type: 'directional',
  color: "#ffffff",
  intensity: 0.5,
  position: { x: 5, y: 10, z: 5 }  // Light direction
}

// Point light - like a light bulb
{
  type: 'point',
  color: "#ff6b9d",
  intensity: 1.5,
  position: { x: 0, y: 5, z: 0 },
  distance: 20,          // How far light reaches
  decay: 2               // How fast light fades
}
```

## Creating a New Theme

Let's create a "Cyberpunk City" theme from scratch!

### 1. Create Theme Folder

```
src/themes/cyberpunk-city/
├── index.ts
└── config/
    ├── objects.ts
    ├── lighting.ts
    ├── particles.ts
    └── scene.ts
```

### 2. Scene Configuration

`src/themes/cyberpunk-city/config/scene.ts`:

```typescript
export const sceneConfig = {
  scene: {
    background: "#0a0a0a", // Almost black
    fog: {
      color: "#1a0033", // Dark purple
      density: 0.08,
    },
  },
  camera: {
    position: { x: 0, y: 8, z: 20 },
    fov: 70,
  },
};
```

### 3. Object Configuration

`src/themes/cyberpunk-city/config/objects.ts`:

```typescript
import type { ThemeObjectsConfig } from "@/types/3d";

export const objectsConfig: ThemeObjectsConfig = {
  crystal: {
    position: { x: -6, y: 3, z: -2 },
    rotation: { x: 0, y: Math.PI / 4, z: 0 },
    scale: 2,
    color: "#00ffff", // Cyan hologram
    emissive: "#00ffff",
    emissiveIntensity: 0.8,
    category: "projects",
    model: "/assets/models/crystal.glb", // or use custom model
  },

  cauldron: {
    position: { x: 6, y: 1, z: -2 },
    rotation: { x: 0, y: -Math.PI / 4, z: 0 },
    scale: 1.8,
    color: "#ff00ff", // Magenta console
    emissive: "#ff00ff",
    emissiveIntensity: 0.7,
    category: "wip",
    model: "/assets/models/cauldron.glb",
  },

  book: {
    position: { x: -3, y: 2, z: 3 },
    rotation: { x: 0, y: Math.PI / 6, z: 0 },
    scale: 1.5,
    color: "#ffff00", // Yellow data pad
    emissive: "#ffff00",
    emissiveIntensity: 0.6,
    category: "blog",
    model: "/assets/models/book.glb",
  },

  magicCircle: {
    position: { x: 0, y: 0.1, z: 0 },
    rotation: { x: -Math.PI / 2, y: 0, z: 0 }, // Flat on ground
    scale: 3,
    color: "#00ff00", // Green circuit board
    emissive: "#00ff00",
    emissiveIntensity: 0.9,
    category: "collaborations",
    model: "/assets/models/magic-circle.glb",
  },

  library: {
    position: { x: 3, y: 1.5, z: 3 },
    rotation: { x: 0, y: -Math.PI / 6, z: 0 },
    scale: 1.6,
    color: "#0099ff", // Blue server rack
    emissive: "#0099ff",
    emissiveIntensity: 0.5,
    category: "learning",
    model: "/assets/models/library.glb",
  },

  owl: {
    position: { x: 4, y: 4, z: -3 },
    rotation: { x: 0, y: Math.PI, z: 0 },
    scale: 1.2,
    color: "#ff6600", // Orange drone
    emissive: "#ff6600",
    emissiveIntensity: 0.4,
    category: "funfacts",
    model: "/assets/models/owl.glb",
  },
};
```

### 4. Lighting Configuration

`src/themes/cyberpunk-city/config/lighting.ts`:

```typescript
export const lightingConfig = [
  // Low ambient light for dark atmosphere
  {
    type: "ambient" as const,
    color: "#1a1a2e",
    intensity: 0.2,
  },

  // Main directional light (moonlight)
  {
    type: "directional" as const,
    color: "#4d4dff", // Blue-ish
    intensity: 0.4,
    position: { x: -10, y: 15, z: 10 },
  },

  // Neon point lights
  {
    type: "point" as const,
    color: "#00ffff",
    intensity: 2,
    position: { x: -6, y: 3, z: -2 }, // Near crystal
    distance: 15,
    decay: 2,
  },
  {
    type: "point" as const,
    color: "#ff00ff",
    intensity: 2,
    position: { x: 6, y: 1, z: -2 }, // Near cauldron
    distance: 15,
    decay: 2,
  },

  // Ground glow
  {
    type: "point" as const,
    color: "#00ff00",
    intensity: 1.5,
    position: { x: 0, y: 0.5, z: 0 }, // Center
    distance: 20,
    decay: 1.5,
  },
];
```

### 5. Particle Effects

`src/themes/cyberpunk-city/config/particles.ts`:

```typescript
export const particlesConfig = {
  count: 1500, // More particles for dense city
  color: "#00ffff", // Cyan data streams
  size: 0.05,
  speed: 0.3, // Faster movement
  range: {
    x: 30, // Wider area
    y: 20,
    z: 30,
  },
  opacity: 0.6,
};
```

### 6. Main Theme Export

`src/themes/cyberpunk-city/index.ts`:

```typescript
import { objectsConfig } from "./config/objects";
import { lightingConfig } from "./config/lighting";
import { particlesConfig } from "./config/particles";
import { sceneConfig } from "./config/scene";

export const cyberpunkCityTheme = {
  name: "Cyberpunk City",
  objects: objectsConfig,
  lighting: lightingConfig,
  particles: particlesConfig,
  scene: sceneConfig,
};
```

### 7. Activate Your Theme

Edit `src/themes/index.ts`:

```typescript
import { wizardLabTheme } from "./wizard-lab";
import { cyberpunkCityTheme } from "./cyberpunk-city";

// Export all themes
export const themes = {
  wizardLab: wizardLabTheme,
  cyberpunkCity: cyberpunkCityTheme,
};

// set here default theme
export default cyberpunkCityTheme;
```

## Theme Configuration

### Object Properties Reference

```typescript
{
  position: { x: number, y: number, z: number }  // 3D coordinates
  rotation: { x: number, y: number, z: number }  // Radians (use Math.PI)
  scale: number                                   // Size multiplier
  color: string                                   // Hex color
  emissive: string                                // Glow color
  emissiveIntensity: number                       // Glow strength (0-1)
  category: string                                // Content category
  model: string                                   // Path to .glb file
}
```

### Rotation Values

- `0` = No rotation
- `Math.PI / 2` = 90°
- `Math.PI` = 180°
- `Math.PI * 1.5` = 270°
- `Math.PI * 2` = 360° (full circle)

## 3D Objects Setup

### Using Default Geometric Shapes

If you don't have 3D models, the system uses fallback shapes:

- **Crystal** → Octahedron (diamond shape)
- **Cauldron** → Cylinder
- **Book** → Box
- **Magic Circle** → Torus (ring)
- **Library** → Box group
- **Owl** → Sphere

Just set `model: undefined` or use a non-existent path.

### Adding Custom 3D Models

1. **Find models** on [Sketchfab](https://sketchfab.com/) (filter: Downloadable, GLB format)
2. **Download as GLB** (not OBJ or FBX)
3. **Optimize** with [gltf.report](https://gltf.report/) - aim for <2MB
4. **Place in** `public/assets/models/your-model.glb`
5. **Update config:**

```typescript
myObject: {
  // ... other settings
  model: "/assets/models/your-model.glb";
}
```

### Model Optimization Tips

- Use **Draco compression** when exporting
- Remove unused animations and materials
- Reduce texture sizes (1024x1024 max)
- Combine meshes when possible

## Lighting Configuration

### Light Types

**Ambient Light** - Illuminates everything equally

```typescript
{
  type: 'ambient',
  color: "#404040",
  intensity: 0.5
}
```

**Directional Light** - Parallel rays (like sun)

```typescript
{
  type: 'directional',
  color: "#ffffff",
  intensity: 1.0,
  position: { x: 10, y: 20, z: 10 }
}
```

**Point Light** - Radiates from a point (like bulb)

```typescript
{
  type: 'point',
  color: "#ff00ff",
  intensity: 2.0,
  position: { x: 0, y: 5, z: 0 },
  distance: 20,    // Max range
  decay: 2         // Falloff rate
}
```

**Spot Light** - Cone of light (like flashlight)

```typescript
{
  type: 'spot',
  color: "#ffffff",
  intensity: 1.5,
  position: { x: 5, y: 10, z: 5 },
  target: { x: 0, y: 0, z: 0 },  // Where it points
  angle: Math.PI / 6,             // Cone width
  penumbra: 0.1,                  // Edge softness
  distance: 30,
  decay: 2
}
```

## Particle Effects

### Particle Configuration

```typescript
{
  count: 1000,           // Number of particles
  color: "#ffffff",      // Particle color
  size: 0.05,           // Particle size
  speed: 0.2,           // Movement speed
  range: {
    x: 20,              // Horizontal spread
    y: 15,              // Vertical spread
    z: 20               // Depth spread
  },
  opacity: 0.8          // Transparency (0-1)
}
```

### Particle Ideas

- **Snow:** White, slow speed, high count
- **Fireflies:** Yellow/green, medium speed, medium count
- **Stars:** White/blue, very slow, high count
- **Embers:** Orange/red, rising (negative gravity), low count

## Advanced Customization

### Multiple Themes System

Create a theme selector in your UI:

```typescript
// src/stores/themeStore.ts
import { defineStore } from "pinia";
import { themes } from "@/themes";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    currentTheme: "wizardLab",
  }),

  getters: {
    theme: (state) => themes[state.currentTheme],
  },

  actions: {
    setTheme(themeName: string) {
      this.currentTheme = themeName;
    },
  },
});
```

### Dynamic Object Loading

Load objects based on content availability:

```typescript
// Only show objects that have content
const activeObjects = Object.entries(objectsConfig).filter(([_, config]) => {
  const category = config.category;
  return contentStore.hasContent(category);
});
```

### Custom Animations

Add animations to objects (advanced):

```typescript
// In your scene setup
import { gsap } from "gsap";

// Floating animation
gsap.to(crystalMesh.position, {
  y: "+=0.5",
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});

// Rotation animation
gsap.to(owlMesh.rotation, {
  y: "+=6.28", // Full rotation
  duration: 10,
  repeat: -1,
  ease: "none",
});
```

## Example Themes

### Minimal Modern

- White/gray color scheme
- Geometric shapes only (no models)
- Clean directional lighting
- No particles

### Fantasy Forest

- Green/brown colors
- Nature-themed models
- Warm lighting
- Firefly particles

### Retro Arcade

- Neon pink/cyan/yellow
- Low-poly models
- Strong point lights
- Grid particles

---

## Next Steps

🎨 **Experiment!** The best way to learn is to try different values and see what happens.

📚 **Resources:**

- [Three.js Documentation](https://threejs.org/docs/)
- [Sketchfab](https://sketchfab.com/) - Free 3D models
- [Color Hunt](https://colorhunt.co/) - Color palettes

💡 **Share your theme!** If you create something cool, consider contributing it back to the project!

---

Questions? [Open an issue](../../issues) or check our [Getting Started Guide](./GETTING-STARTED.md)!
