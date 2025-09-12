import type { DeepPartial } from "../types/universal";
import type { LightConfig } from "./lightingConfig";
import type { ParticleSystemConfig } from "./specialEffectsConfig";

interface EffectConfig {
  id: string;
  description: string;
  particles?: ParticleSystemConfig;
  lighting?: LightConfig;
}

const effectTemplates: EffectConfig[] = [
  {
    id: "flame",
    description: "Flickering candle flame with warm orange glow",
    particles: {
      name: "flame", // Will be overridden per instance
      particleCount: 30,
      geometry: {
        type: "sphere",
        size: 0.015,
        randomness: 0.8,
      },
      material: {
        color: 0xff4500, // Orange-red flame color
        size: 0.025,
        transparent: true,
        opacity: 0.9,
        blending: "additive",
        alphaTest: 0.1,
      },
      distribution: {
        type: "sphere",
        radius: 0.1, // Small flame area
      },
      animation: {
        enabled: true,
        speed: 2.5, // Fast flickering
        direction: [0, 0.8, 0], // Upward flame movement
        rotationSpeed: 0.0,
        floatingAmplitude: 0.15, // Small flickering range
        floatingSpeed: 3.0, // Fast flicker
      },
      position: [0, 0, 0], // Will be overridden per instance
      enabled: true,
      timeToLive: {
        enabled: true,
        minLifetime: 0.5, // Short-lived flame particles
        maxLifetime: 1.0,
        respawn: true, // Keep flame burning
      },
      fade: {
        enabled: true,
        fadeInPercentage: 0.1, // Quick ignition
        fadeOutPercentage: 0.4, // Gradual extinguish
      },
    },
    lighting: {
      type: "point",
      name: "flame", // Will be overridden per instance
      color: 0xffa500, // Warm orange light
      intensity: 1.5,
      position: [0, 0, 0], // Will be overridden per instance
      distance: 3, // Close range warm glow
      decay: 2,
      castShadow: false, // Performance optimization
      enabled: true,
    },
  },
  {
    id: "magicRunes",
    description: "Floating magical runes with mystical glow",
    particles: {
      name: "magicRunes", // Will be overridden per instance
      particleCount: 12, // Fewer particles for more defined runes
      geometry: {
        type: "sphere",
        size: 0.08, // Larger size for rune-like appearance
        randomness: 0.2, // Less randomness for more defined shapes
      },
      material: {
        color: 0xa855f7, // Slightly lighter purple
        size: 0.2, // Larger for better visibility with texture
        transparent: true,
        opacity: 0.9,
        blending: "additive",
        alphaTest: 0.15,
      },
      distribution: {
        type: "ring", // Circular distribution around the target
        innerRadius: 1.0, // Close to the target
        outerRadius: 2.0, // Not too far from the target
      },
      animation: {
        enabled: true,
        speed: 0.4, // Slow mystical movement
        direction: [0, 0.1, 0], // Slight upward drift
        rotationSpeed: 0.15, // Slow rotation for mystical effect
        floatingAmplitude: 0.8, // Moderate floating range
        floatingSpeed: 0.6, // Gentle floating speed
      },
      position: [0, 0, 0], // Will be overridden per instance
      enabled: true,
      timeToLive: {
        enabled: true,
        minLifetime: 8.0, // Long-lived for stability
        maxLifetime: 15.0,
        respawn: true, // Keep runes present
      },
      fade: {
        enabled: true,
        fadeInPercentage: 0.2, // Gradual appearance
        fadeOutPercentage: 0.3, // Gradual mystical fade out
      },
    },
    lighting: {
      type: "point",
      name: "magicRunes", // Will be overridden per instance
      color: 0x9333ea, // Purple magical light
      intensity: 0.8, // Subtle glow
      position: [0, 0, 0], // Will be overridden per instance
      distance: 4, // Medium range mystical glow
      decay: 0.2, // Slow decay for lingering effect
      castShadow: false, // Performance optimization
      enabled: true,
    },
  },
  {
    id: "liquidBubbles",
    description:
      "Bubbling liquid effect with dynamic bubbles rising from surface",
    particles: {
      name: "liquidBubbles", // Will be overridden per instance
      particleCount: 25, // Moderate amount for realistic bubbling
      geometry: {
        type: "sphere",
        size: 0.02, // Small bubble size
        randomness: 0.6, // Some size variation for realism
      },
      material: {
        color: 0x66ffcc, // Aqua/teal for magical liquid
        size: 0.08, // Visual bubble size
        transparent: true,
        opacity: 0.7, // Semi-transparent bubbles
        blending: "additive",
        alphaTest: 0.1,
      },
      distribution: {
        type: "ring", // Bubbles emerge from liquid surface in circular pattern
        innerRadius: 0.5, // Small inner area
        outerRadius: 1.2, // Cauldron surface area
      },
      animation: {
        enabled: true,
        speed: 1.2, // Moderate bubble rising speed
        direction: [0, 1.5, 0], // Bubbles rise upward
        rotationSpeed: 0.01, // Slight rotation for natural movement
        floatingAmplitude: 0.3, // Small lateral movement
        floatingSpeed: 2.0, // Quick bubble movement
      },
      position: [0, 0, 0], // Will be overridden per instance
      enabled: true,
      timeToLive: {
        enabled: true,
        minLifetime: 2.0, // Short-lived bubbles
        maxLifetime: 4.0, // Varied bubble lifetime
        respawn: true, // Continuous bubbling effect
      },
      fade: {
        enabled: true,
        fadeInPercentage: 0.1, // Quick bubble formation
        fadeOutPercentage: 0.4, // Gradual bubble pop/dissolve
      },
    },
    lighting: {
      type: "point",
      name: "liquidBubbles", // Will be overridden per instance
      color: 0x00ffaa, // Bright aqua glow from magical liquid
      intensity: 1.5, // Strong magical glow
      position: [0, 0, 0], // Will be overridden per instance
      distance: 6, // Wide glow radius for cauldron effect
      decay: 1.8,
      castShadow: false, // Performance optimization
      enabled: true,
    },
  },
  {
    id: "library",
    description: "Focused reading light for the magical library",
    lighting: {
      type: "spot",
      name: "library", // Will be overridden per instance
      color: 0xffd700, // Warm golden light for knowledge and wisdom
      intensity: 3.0, // Higher intensity for focused beam
      position: [0, 0, 0], // Will be overridden per instance
      target: [0, 0, 0], // Will be overridden per instance (where the light points)
      distance: 15, // Good range for spotlight
      decay: 1.2, // Sharp falloff for focused beam
      angle: Math.PI / 6, // 30 degrees cone angle (π/6 radians)
      penumbra: 0.3, // Soft edges on the light cone (0-1, 0 = sharp, 1 = very soft)
      castShadow: true, // Creates dramatic shadows
      enabled: true,
    },
  },
];

export const getTemplateById = (id: string): EffectConfig | undefined => {
  return effectTemplates.find((template) => template.id === id);
};

type Vector3 = [number, number, number];
type EffectInstance = {
  name: string;
  config: EffectConfig;
  position: Vector3;
  tags?: string[]; // Optional tags for categorization
};

const ensureVector3 = (
  elem:
    | [(number | undefined)?, (number | undefined)?, (number | undefined)?]
    | undefined,
  prev: Vector3
): Vector3 => {
  if (!elem) return prev;
  const [x, y, z] = elem;
  return [x ?? 0, y ?? 0, z ?? 0];
};

function overrideEffectConfig(
  config: EffectConfig,
  overrides?: {
    description?: string;
    particles?: DeepPartial<ParticleSystemConfig>;
    lighting?: DeepPartial<LightConfig>;
  }
): EffectConfig {
  const result: EffectConfig = {
    ...config,
    ...(overrides?.description && { description: overrides.description }),
  };

  // Apply particle overrides if provided
  if (overrides?.particles && config.particles) {
    result.particles = {
      ...config.particles,
      ...{
        ...overrides.particles,
        position: ensureVector3(
          overrides.particles.position,
          config.particles.position
        ),
      },
      // Handle nested objects properly
      geometry: {
        ...config.particles.geometry,
        ...overrides.particles.geometry,
      },
      material: {
        ...config.particles.material,
        ...overrides.particles.material,
      },
      distribution: {
        ...config.particles.distribution,
        ...overrides.particles.distribution,
      },
      animation: {
        ...config.particles.animation,
        ...overrides.particles.animation,
        direction: ensureVector3(
          overrides.particles.animation?.direction,
          config.particles.animation.direction
        ),
      },
      timeToLive: {
        ...config.particles.timeToLive,
        ...overrides.particles.timeToLive,
      },
      fade: {
        ...config.particles.fade,
        ...overrides.particles.fade,
      },
    };
  }

  // Apply lighting overrides if provided
  if (overrides?.lighting && config.lighting) {
    result.lighting = {
      ...config.lighting,
      ...overrides.lighting,
    };
  }

  return result;
}

function createEffectInstances(
  baseName: string,
  config: EffectConfig | undefined,
  positions: Vector3[],
  overrides?: {
    description?: string;
    particles?: DeepPartial<ParticleSystemConfig>;
    lighting?: DeepPartial<LightConfig>;
  },
  tags?: string[]
): EffectInstance[] {
  if (!config) return [];

  const result: EffectInstance[] = [];

  // setup tags
  overrides = {
    ...overrides,
    particles: overrides?.particles
      ? {
          ...overrides?.particles,
          tags: tags,
        }
      : undefined,
    lighting: overrides?.lighting
      ? {
          ...overrides?.lighting,
          tags: tags,
        }
      : undefined,
  };

  positions.forEach((position, i) => {
    // Apply overrides if provided
    const finalConfig = overrides
      ? overrideEffectConfig(config, overrides)
      : config;

    result.push({
      name: `${baseName}_${i}`,
      config: finalConfig,
      position,
      tags,
    });
  });

  return result;
}

// Create effect instances for candles
const effectInstances: EffectInstance[] = [
  ...createEffectInstances(
    "candle",
    getTemplateById("flame"),
    [
      [4.52, 5, -0.78],
      [4.07, 4.8, -0.3],
      [4.97, 4.8, -1.26],
    ],
    {
      // Customize flame properties per candle
      lighting: {
        intensity: 1.8,
        color: 0x458400,
      },
      particles: {
        particleCount: 50,
        material: {
          color: 0x559400,
          size: 0.05,
        },
        distribution: {
          radius: 0.06,
        },
        timeToLive: {
          minLifetime: 0.05,
          maxLifetime: 0.2,
        },
        fade: {
          fadeInPercentage: 0.2,
          fadeOutPercentage: 5,
        },
      },
    },
    ["night-only", "dynamic"]
  ),

  ...createEffectInstances(
    "torch",
    getTemplateById("flame"),
    [
      [-8.7, 7.2, 6.9],
      [-8.7, 7.2, -1.7],
      [-6, 7.2, -9],
      [8.8, 7.2, -9],
    ],
    {
      // Customize flame properties per candle
      lighting: {
        intensity: 5,
      },
      particles: {
        particleCount: 80,
        material: {
          size: 0.2,
        },
        distribution: {
          type: "box",
          width: 0.2,
          height: 0.01,
          depth: 0.2,
        },
        timeToLive: {
          minLifetime: 0.3,
          maxLifetime: 0.6,
        },
        fade: {
          fadeInPercentage: 0,
          fadeOutPercentage: 0.2,
        },
      },
    },
    ["night-only", "dynamic"]
  ),

  /*
  // Magic runes floating around the book
  ...createEffectInstances(
    "book-runes-1",
    getTemplateById("magicRunes"),
    [
      [-6, 5, 8], // Same position as the book
    ],
    {
      // Customize rune properties - Protection (Blue/Silver)
      lighting: { enabled: false },
      particles: {
        particleCount: 3, // Fewer particles since we're using multiple instances
        material: {
          size: 0.4,
          texture: "/assets/textures/runes/rune1.svg", // Use SVG texture
        },
        timeToLive: {
          minLifetime: 3,
          maxLifetime: 6,
        },
      },
    },
    ["effect-book"]
  ),
  ...createEffectInstances(
    "book-runes-2",
    getTemplateById("magicRunes"),
    [
      [-6, 5, 8], // Same position as the book
    ],
    {
      // Customize rune properties - Wisdom (Gold/Purple)
      lighting: { enabled: false },
      particles: {
        particleCount: 4, // Fewer particles since we're using multiple instances
        material: {
          size: 0.3,
          texture: "/assets/textures/runes/rune2.svg", // Use SVG texture
        },
        animation: {
          rotationSpeed: -1,
        },
        timeToLive: {
          minLifetime: 2,
          maxLifetime: 4,
        },
      },
    },
    ["effect-book"]
  ),
  ...createEffectInstances(
    "book-runes-3",
    getTemplateById("magicRunes"),
    [
      [-6, 5, 8], // Same position as the book
    ],
    {
      // Customize rune properties - Knowledge (Emerald/Turquoise)
      lighting: { enabled: false },
      particles: {
        particleCount: 3, // Fewer particles since we're using multiple instances
        material: {
          texture: "/assets/textures/runes/rune3.svg", // Use SVG texture
        },
      },
    },
    ["effect-book"]
  ),
  */
  // Mystical light above the book
  ...createEffectInstances(
    "book-runes-light",
    getTemplateById("magicRunes"),
    [
      [-6, 5.6, 8], // Slightly above the book
    ],
    {
      // Only light for this instance
      lighting: {
        intensity: 3,
        decay: 1.5,
      },
      particles: {
        material: {
          size: 0.05,
        },
        animation: {
          rotationSpeed: -1,
        },
      },
    },
    ["effect-book"]
  ),

  // Magical liquid bubbling in the cauldron
  ...createEffectInstances(
    "cauldron-bubbles",
    getTemplateById("liquidBubbles"),
    [
      [7, 1.1, 7], // Position slightly above cauldron base (same x,z as cauldron, higher y)
    ],
    {
      // Customize liquid properties
      lighting: {
        color: 0x00cc88, // Deep emerald magical glow
        intensity: 2.0, // Strong mystical light
        distance: 8, // Wide area effect
      },
      particles: {
        particleCount: 20, // Moderate bubbling
        material: {
          color: 0x44ffaa, // Bright magical aqua bubbles
          size: 0.06, // Slightly larger bubbles for visibility
          opacity: 0.8,
        },
        distribution: {
          type: "ring",
          innerRadius: 0.3, // Inner cauldron area
          outerRadius: 0.8, // Outer cauldron rim
        },
        animation: {
          speed: 0.8, // Moderate bubble speed
          direction: [0, 1.2, 0], // Bubbles rise upward from liquid
          rotationSpeed: 0.01, // Gentle swirling motion
          floatingAmplitude: 0.3, // Natural bubble wobble
          floatingSpeed: 1.5, // Realistic bubble movement
        },
        timeToLive: {
          minLifetime: 1.5, // Quick bubble lifecycle
          maxLifetime: 4.0, // Varied bubble lifetime
          respawn: true, // Continuous magical bubbling
        },
        fade: {
          fadeInPercentage: 0.2, // Bubble formation
          fadeOutPercentage: 0.5, // Bubble bursting/dissolving
        },
      },
    },
    ["effect-cauldron"]
  ),
  ...createEffectInstances(
    "library-light",
    getTemplateById("library"),
    [
      // Positions above the library for ambient lighting
      [-6, 5.2, -6],
    ],
    {
      // Customize library lighting
      lighting: {
        color: 0xffd700, // Warm golden light for scholarly atmosphere
        intensity: 5, // Higher intensity for focused spotlight beam
        target: [-8, 5, -6], // Point directly at the library center
        distance: 12, // Good range for spotlight
        decay: 1.1, // Sharp falloff for focused effect
        angle: Math.PI / 3, // 60 degrees cone angle (slightly wider for multiple lights)
        penumbra: 0.4, // Soft edges for natural look
      },
    },
    ["effect-library", "ambient-lighting"]
  ),
];

export const retrieveParticles = (
  predicate?: (value: EffectInstance) => boolean
): ParticleSystemConfig[] => {
  if (!predicate) predicate = () => true; // all
  return effectInstances
    .filter(
      (effect) => effect.config.particles !== undefined && predicate(effect)
    )
    .map((effect) => {
      const p = effect.config.particles!;
      return {
        ...p,
        name: effect.name,
        position: effect.position,
      };
    });
};

export const retrieveLighting = (
  predicate?: (value: EffectInstance) => boolean
): LightConfig[] => {
  if (!predicate) predicate = () => true; // all
  return effectInstances
    .filter(
      (effect) => effect.config.lighting !== undefined && predicate(effect)
    )
    .map((effect) => {
      const l = effect.config.lighting!;
      return {
        ...l,
        name: effect.name,
        position: effect.position,
      };
    });
};

// Additional helper functions for effect management
export const addEffectInstance = (
  baseName: string,
  templateId: string,
  position: Vector3,
  overrides?: {
    description?: string;
    particles?: Partial<ParticleSystemConfig>;
    lighting?: Partial<LightConfig>;
  }
): boolean => {
  const template = getTemplateById(templateId);
  if (!template) return false;

  const newInstances = createEffectInstances(
    baseName,
    template,
    [position],
    overrides
  );
  effectInstances.push(...newInstances);
  return true;
};

export const getEffectInstanceByName = (
  name: string
): EffectInstance | undefined => {
  return effectInstances.find((instance) => instance.name === name);
};

export const getEffectInstancesByTag = (tag: string): EffectInstance[] => {
  return effectInstances.filter((instance) => instance.tags?.includes(tag));
};

export const getAllEffectNames = (): string[] => {
  return effectInstances.map((instance) => instance.name);
};

export const getAvailableTemplates = (): EffectConfig[] => {
  return [...effectTemplates];
};
