// Core services for 3D scene management
export { SceneManager } from "./sceneManager";
export { ModelLoader } from "./modelLoader";
export { ObjectManager } from "./objectManager";
export { EffectsManager } from "./effectsManager";
export { InteractionManager } from "./interactionManager";
export { PreloaderService } from "./preloaderService";
export { Scene3DManager } from "./scene3DManager";

// Re-export existing services for convenience
export { LightingManager } from "./lightingManager";
export { ParticleSystemManager } from "./particleSystemManager";

// Types
export type * from "../../types/3d";
