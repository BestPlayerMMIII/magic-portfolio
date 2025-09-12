import type { SceneConfig } from "../../../types/3d";

// WIZARD LABORATORY THEME - SCENE CONFIGURATION
// This file contains the specific scene setup for the wizard laboratory theme
// Core scene logic is now managed in SceneManager service

export const wizardLabScene: SceneConfig = {
  camera: {
    fov: 75,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 1000,
    position: [0, 5, 15],
  },
  renderer: {
    antialias: true,
    alpha: true,
    shadowMapEnabled: true,
    shadowMapType: "pcfSoft",
    outputColorSpace: "srgb",
  },
  controls: {
    enableDamping: true,
    dampingFactor: 0.05,
    screenSpacePanning: false,
    enablePan: false,
    minDistance: 5,
    maxDistance: 30,
    maxPolarAngle: Math.PI / 2,
  },
  fog: {
    color: 0x1a1a2e,
    near: 10,
    far: 50,
  },
};

// Export default configuration
export default wizardLabScene;
