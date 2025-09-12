import {
  createEffectInstances,
  type EffectConfig,
  type EffectInstance,
  type LightConfig,
  type ParticleSystemConfig,
} from "../../../types/3d";

// WIZARD LABORATORY THEME - EFFECTS CONFIGURATION
// This file contains the specific effects (lighting & particles) setup for
// the wizard laboratory theme
// Core effects logic is now managed in EffectsManager service

// --- Effect Templates ---
const effectTemplates: EffectConfig[] = [
  {
    id: "flame",
    description: "Flickering candle flame with warm orange glow",
    particles: {
      name: "flame",
      particleCount: 30,
      geometry: {
        type: "sphere",
        size: 0.015,
        randomness: 0.8,
      },
      material: {
        color: 0xff4500,
        size: 0.025,
        transparent: true,
        opacity: 0.9,
        blending: "additive",
        alphaTest: 0.1,
      },
      distribution: {
        type: "sphere",
        radius: 0.1,
      },
      animation: {
        enabled: true,
        speed: 2.5,
        direction: [0, 0.8, 0],
        rotationSpeed: 0.0,
        floatingAmplitude: 0.15,
        floatingSpeed: 3.0,
      },
      position: [0, 0, 0],
      enabled: true,
      timeToLive: {
        enabled: true,
        minLifetime: 0.5,
        maxLifetime: 1.0,
        respawn: true,
      },
      fade: {
        enabled: true,
        fadeInPercentage: 0.1,
        fadeOutPercentage: 0.4,
      },
    },
    lighting: {
      type: "point",
      name: "flame",
      color: 0xffa500,
      intensity: 1.5,
      position: [0, 0, 0],
      distance: 3,
      decay: 2,
      castShadow: false,
      enabled: true,
    },
  },
  {
    id: "magicRunes",
    description: "Floating magical runes with mystical glow",
    particles: {
      name: "magicRunes",
      particleCount: 12,
      geometry: {
        type: "sphere",
        size: 0.08,
        randomness: 0.2,
      },
      material: {
        color: 0xa855f7,
        size: 0.2,
        transparent: true,
        opacity: 0.9,
        blending: "additive",
        alphaTest: 0.15,
      },
      distribution: {
        type: "ring",
        innerRadius: 1.0,
        outerRadius: 2.0,
      },
      animation: {
        enabled: true,
        speed: 0.4,
        direction: [0, 0.1, 0],
        rotationSpeed: 0.15,
        floatingAmplitude: 0.8,
        floatingSpeed: 0.6,
      },
      position: [0, 0, 0],
      enabled: true,
      timeToLive: {
        enabled: true,
        minLifetime: 8.0,
        maxLifetime: 15.0,
        respawn: true,
      },
      fade: {
        enabled: true,
        fadeInPercentage: 0.2,
        fadeOutPercentage: 0.3,
      },
    },
    lighting: {
      type: "point",
      name: "magicRunes",
      color: 0x9333ea,
      intensity: 0.8,
      position: [0, 0, 0],
      distance: 4,
      decay: 0.2,
      castShadow: false,
      enabled: true,
    },
  },
  {
    id: "liquidBubbles",
    description:
      "Bubbling liquid effect with dynamic bubbles rising from surface",
    particles: {
      name: "liquidBubbles",
      particleCount: 25,
      geometry: {
        type: "sphere",
        size: 0.02,
        randomness: 0.6,
      },
      material: {
        color: 0x66ffcc,
        size: 0.08,
        transparent: true,
        opacity: 0.7,
        blending: "additive",
        alphaTest: 0.1,
      },
      distribution: {
        type: "ring",
        innerRadius: 0.5,
        outerRadius: 1.2,
      },
      animation: {
        enabled: true,
        speed: 1.2,
        direction: [0, 1.5, 0],
        rotationSpeed: 0.01,
        floatingAmplitude: 0.3,
        floatingSpeed: 2.0,
      },
      position: [0, 0, 0],
      enabled: true,
      timeToLive: {
        enabled: true,
        minLifetime: 2.0,
        maxLifetime: 4.0,
        respawn: true,
      },
      fade: {
        enabled: true,
        fadeInPercentage: 0.1,
        fadeOutPercentage: 0.4,
      },
    },
    lighting: {
      type: "point",
      name: "liquidBubbles",
      color: 0x00ffaa,
      intensity: 1.5,
      position: [0, 0, 0],
      distance: 6,
      decay: 1.8,
      castShadow: false,
      enabled: true,
    },
  },
  {
    id: "library-spotlight",
    description: "Focused reading light for the magical library",
    lighting: {
      type: "spot",
      name: "library-spotlight",
      color: 0xffd700,
      intensity: 3.0,
      position: [0, 0, 0],
      target: [0, 0, 0],
      distance: 15,
      decay: 1.2,
      angle: Math.PI / 6,
      penumbra: 0.3,
      castShadow: true,
      enabled: true,
    },
  },
  {
    id: "magical-point-light",
    description: "Magical point lights for atmospheric effects",
    lighting: {
      type: "point",
      name: "magical-point-light",
      color: 0x3d2085,
      intensity: 2.5,
      position: [0, 0, 0],
      target: [0, 0, 0],
      distance: 20,
      decay: 2,
      castShadow: false,
      enabled: true,
    },
  },
];

const getTemplateById = (id: string): EffectConfig | undefined => {
  const result: EffectConfig | undefined = effectTemplates.find(
    (template) => template.id === id
  );
  if (!result) {
    console.warn(`⚠️ Template effect with id "${id}" not found!`);
  }
  return result;
};

// --- Effect Instances (scene-specific) ---
const effectInstances: EffectInstance[] = [
  // Candles
  ...createEffectInstances(
    "candle",
    getTemplateById("flame"),
    [
      [4.52, 5, -0.78],
      [4.07, 4.8, -0.3],
      [4.97, 4.8, -1.26],
    ],
    {
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
  // Torches
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
  // Mystical light above the book
  ...createEffectInstances(
    "book-runes-light",
    getTemplateById("magicRunes"),
    [[-6, 5.6, 8]],
    {
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
    [[7, 1.1, 7]],
    {
      lighting: {
        color: 0x00cc88,
        intensity: 2.0,
        distance: 8,
      },
      particles: {
        particleCount: 20,
        material: {
          color: 0x44ffaa,
          size: 0.06,
          opacity: 0.8,
        },
        distribution: {
          type: "ring",
          innerRadius: 0.3,
          outerRadius: 0.8,
        },
        animation: {
          speed: 0.8,
          direction: [0, 1.2, 0],
          rotationSpeed: 0.01,
          floatingAmplitude: 0.3,
          floatingSpeed: 1.5,
        },
        timeToLive: {
          minLifetime: 1.5,
          maxLifetime: 4.0,
          respawn: true,
        },
        fade: {
          fadeInPercentage: 0.2,
          fadeOutPercentage: 0.5,
        },
      },
    },
    ["effect-cauldron"]
  ),
  // Library ambient lighting
  ...createEffectInstances(
    "library-light",
    getTemplateById("library-spotlight"),
    [[-6, 5.2, -6]],
    {
      lighting: {
        color: 0xffd700,
        intensity: 5,
        target: [-8, 5, -6],
        distance: 12,
        decay: 1.1,
        angle: Math.PI / 3,
        penumbra: 0.4,
      },
    },
    ["effect-library"]
  ),
  // Magical point light - red potion
  ...createEffectInstances(
    "red-potion",
    getTemplateById("magical-point-light"),
    [[3.1, 3.05, 1.9]],
    {
      lighting: {
        color: 0xd946ef,
        intensity: 2.5,
        distance: 20,
      },
    },
    ["effect-red-potion"]
  ),
  // Magical point light - crystal
  ...createEffectInstances(
    "crystal",
    getTemplateById("magical-point-light"),
    [[0, 3, -1]],
    {
      lighting: {
        color: 0x08b7c1,
        intensity: 2.0,
        distance: 15,
      },
    },
    ["effect-crystal"]
  ),
];

// --- Retrieval Functions ---

export const retrieveParticles = (
  predicate?: (value: EffectInstance) => boolean
): ParticleSystemConfig[] => {
  if (!predicate) predicate = () => true;
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
        tags: effect.tags ?? p.tags,
      };
    });
};

export const retrieveLighting = (
  predicate?: (value: EffectInstance) => boolean
): LightConfig[] => {
  if (!predicate) predicate = () => true;
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
        tags: effect.tags ?? l.tags,
      };
    });
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
