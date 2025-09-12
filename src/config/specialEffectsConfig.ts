import { retrieveParticles } from "./effectsConfig";

export interface ParticleSystemConfig {
  name: string;
  tags?: string[]; // Optional tags for categorization
  particleCount: number;
  geometry: {
    type: "sphere" | "box" | "custom";
    size: number;
    randomness: number;
  };
  material: {
    color: number;
    size: number;
    transparent: boolean;
    opacity: number;
    blending: "normal" | "additive" | "subtractive" | "multiply";
    alphaTest?: number;
    vertexColors?: boolean;
    texture?: string; // Path to texture file (SVG, PNG, etc.)
  };
  distribution: {
    type: "sphere" | "box" | "ring" | "line";
    radius?: number;
    width?: number;
    height?: number;
    depth?: number;
    innerRadius?: number;
    outerRadius?: number;
  };
  animation: {
    enabled: boolean;
    speed: number;
    direction: [number, number, number];
    rotationSpeed: number;
    floatingAmplitude: number;
    floatingSpeed: number;
  };
  position: [number, number, number];
  enabled: boolean;
  // Time-to-live settings
  timeToLive: {
    enabled: boolean;
    minLifetime: number; // seconds
    maxLifetime: number; // seconds
    respawn: boolean; // whether particles respawn after death
  };
  // Fade settings
  fade: {
    enabled: boolean;
    fadeInPercentage: number; // 0-1, percentage of lifetime for fade in
    fadeOutPercentage: number; // 0-1, percentage of lifetime for fade out
  };
}

export interface SpecialEffectsConfiguration {
  magicalParticles: ParticleSystemConfig;
  floatingDust: ParticleSystemConfig;
  energyOrbs: ParticleSystemConfig;
  sparkles: ParticleSystemConfig;
  globalSettings: {
    enableAllParticles: boolean;
    performanceMode: "high" | "medium" | "low";
    maxParticleSystems: number;
  };
}

export const specialEffectsConfig: SpecialEffectsConfiguration = {
  // Main magical particles floating around the scene
  magicalParticles: {
    name: "magicalParticles",
    particleCount: 200,
    geometry: {
      type: "sphere",
      size: 0.02,
      randomness: 0.5,
    },
    material: {
      color: 0x6366f1,
      size: 0.03,
      transparent: true,
      opacity: 0.8,
      blending: "additive",
      alphaTest: 0.1,
    },
    distribution: {
      type: "sphere",
      radius: 15,
    },
    animation: {
      enabled: true,
      speed: 0.5,
      direction: [0, 1, 0],
      rotationSpeed: 0.1,
      floatingAmplitude: 2,
      floatingSpeed: 0.8,
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
      fadeInPercentage: 0.2, // 20% of lifetime for fade in
      fadeOutPercentage: 0.3, // 30% of lifetime for fade out
    },
  },

  // Floating dust particles for atmosphere
  floatingDust: {
    name: "floatingDust",
    particleCount: 150,
    geometry: {
      type: "sphere",
      size: 0.01,
      randomness: 0.3,
    },
    material: {
      color: 0xffffff,
      size: 0.015,
      transparent: true,
      opacity: 0.4,
      blending: "normal",
      alphaTest: 0.1,
    },
    distribution: {
      type: "box",
      width: 25,
      height: 15,
      depth: 25,
    },
    animation: {
      enabled: true,
      speed: 0.2,
      direction: [0.1, 0.3, 0.1],
      rotationSpeed: 0.005,
      floatingAmplitude: 1,
      floatingSpeed: 0.5,
    },
    position: [0, 5, 0],
    enabled: true,
    timeToLive: {
      enabled: true,
      minLifetime: 12.0,
      maxLifetime: 20.0,
      respawn: true,
    },
    fade: {
      enabled: true,
      fadeInPercentage: 0.15, // 15% of lifetime for fade in
      fadeOutPercentage: 0.25, // 25% of lifetime for fade out
    },
  },

  // Energy orbs around magical objects
  energyOrbs: {
    name: "energyOrbs",
    particleCount: 50,
    geometry: {
      type: "sphere",
      size: 0.05,
      randomness: 0.2,
    },
    material: {
      color: 0xd946ef,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
      blending: "additive",
      alphaTest: 0.2,
    },
    distribution: {
      type: "ring",
      innerRadius: 8,
      outerRadius: 12,
    },
    animation: {
      enabled: true,
      speed: 1.2,
      direction: [0, 0, 0],
      rotationSpeed: 0.02,
      floatingAmplitude: 3,
      floatingSpeed: 1.5,
    },
    position: [0, 2, 0],
    enabled: false,
    timeToLive: {
      enabled: true,
      minLifetime: 5.0,
      maxLifetime: 10.0,
      respawn: true,
    },
    fade: {
      enabled: true,
      fadeInPercentage: 0.3, // 30% of lifetime for fade in
      fadeOutPercentage: 0.4, // 40% of lifetime for fade out
    },
  },

  // Sparkle effects for magical moments
  sparkles: {
    name: "sparkles",
    particleCount: 100,
    geometry: {
      type: "sphere",
      size: 0.03,
      randomness: 0.8,
    },
    material: {
      color: 0xfbbf24,
      size: 0.04,
      transparent: true,
      opacity: 0.9,
      blending: "additive",
      alphaTest: 0.3,
    },
    distribution: {
      type: "sphere",
      radius: 20,
    },
    animation: {
      enabled: true,
      speed: 0.8,
      direction: [0, 0.1, 0],
      rotationSpeed: 0.03,
      floatingAmplitude: 4,
      floatingSpeed: 2,
    },
    position: [0, 8, 0],
    enabled: false, // Disabled by default - can be triggered on special events
    timeToLive: {
      enabled: true,
      minLifetime: 2.0,
      maxLifetime: 4.0,
      respawn: false, // Don't respawn sparkles
    },
    fade: {
      enabled: true,
      fadeInPercentage: 0.1, // 10% quick fade in
      fadeOutPercentage: 0.5, // 50% long fade out for sparkle effect
    },
  },

  // Global settings for performance optimization
  globalSettings: {
    enableAllParticles: true,
    performanceMode: "high",
    maxParticleSystems: 4,
  },
};

const getSystems = (): ParticleSystemConfig[] => {
  return [
    specialEffectsConfig.magicalParticles,
    specialEffectsConfig.floatingDust,
    specialEffectsConfig.energyOrbs,
    specialEffectsConfig.sparkles,
    ...retrieveParticles(),
  ];
};

// Helper functions for special effects management
export const getParticleSystemByName = (
  name: string
): ParticleSystemConfig | null => {
  const systems = getSystems();

  return systems.find((system) => system.name === name) || null;
};

export const getEnabledParticleSystems = (): ParticleSystemConfig[] => {
  if (!specialEffectsConfig.globalSettings.enableAllParticles) {
    return [];
  }

  const systems = getSystems();

  return systems.filter((system) => system.enabled);
};

export const toggleParticleSystem = (name: string): void => {
  const system = getParticleSystemByName(name);
  if (system) {
    system.enabled = !system.enabled;
  }
};

export const updateParticleCount = (name: string, count: number): void => {
  const system = getParticleSystemByName(name);
  if (system) {
    system.particleCount = Math.max(0, Math.min(count, 1000)); // Clamp between 0 and 1000
  }
};

export const setPerformanceMode = (mode: "high" | "medium" | "low"): void => {
  specialEffectsConfig.globalSettings.performanceMode = mode;

  // Adjust particle counts based on performance mode
  const multiplier = mode === "high" ? 1 : mode === "medium" ? 0.7 : 0.4;

  specialEffectsConfig.magicalParticles.particleCount = Math.floor(
    200 * multiplier
  );
  specialEffectsConfig.floatingDust.particleCount = Math.floor(
    150 * multiplier
  );
  specialEffectsConfig.energyOrbs.particleCount = Math.floor(50 * multiplier);
  specialEffectsConfig.sparkles.particleCount = Math.floor(100 * multiplier);
};

export const enableSparkleEffect = (): void => {
  specialEffectsConfig.sparkles.enabled = true;

  // Auto-disable after 5 seconds
  setTimeout(() => {
    specialEffectsConfig.sparkles.enabled = false;
  }, 5000);
};
