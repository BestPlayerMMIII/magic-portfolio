import type { ParticlesConfiguration } from "../../../types/3d";
import { retrieveParticles } from "./effects";

// WIZARD LABORATORY THEME - PARTICLES CONFIGURATION
// This file contains the specific particle effects for the wizard laboratory theme
// Core particle logic is now managed in ParticleSystemManager service

export const wizardLabParticles: ParticlesConfiguration = {
  particles: {
    // Main magical particles floating around the scene
    magicalParticles: {
      name: "magicalParticles",
      tags: ["magical", "ambient"],
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
      tags: ["ambient", "atmospheric"],
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
  },

  // Dynamically retrieved particles from universal effects
  dynamicParticles: retrieveParticles(),

  // Global settings for performance optimization
  globalSettings: {
    enableAllParticles: true,
    performanceMode: "high",
    maxParticleSystems: 4,
  },
};

// Export default configuration
export default wizardLabParticles;
