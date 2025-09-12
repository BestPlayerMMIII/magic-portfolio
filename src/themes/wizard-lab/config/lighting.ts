import type { LightingConfiguration } from "../../../types/3d";
import { retrieveLighting } from "./effects";

// WIZARD LABORATORY THEME - LIGHTING CONFIGURATION
// This file contains the specific lighting setup for the wizard laboratory theme
// Core lighting logic is now managed in LightingManager service

export const wizardLabLighting: LightingConfiguration = {
  // Ambient lighting for overall scene illumination
  ambientLight: {
    type: "ambient",
    color: 0x404040,
    intensity: 0.8,
    enabled: true,
  },

  // Main directional light (sun-like lighting)
  directionalLight: {
    type: "directional",
    color: 0xffffff,
    intensity: 1.6,
    position: [10, 10, 5],
    target: [0, 0, 0],
    castShadow: true,
    shadowMapSize: [2048, 2048],
    shadowCameraNear: 0.1,
    shadowCameraFar: 50,
    shadowCameraLeft: -20,
    shadowCameraRight: 20,
    shadowCameraTop: 20,
    shadowCameraBottom: -20,
    enabled: true,
  },

  dynamicLights: retrieveLighting(),

  // Global shadow settings
  globalShadowSettings: {
    enabled: true,
    type: "pcfSoft",
    autoUpdate: true,
  },
};

// Export default configuration
export default wizardLabLighting;
