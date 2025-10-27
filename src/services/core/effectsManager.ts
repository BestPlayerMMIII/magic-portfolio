import * as THREE from "three";
import type {
  LightingMode,
  LightingConfiguration,
  ParticlesConfiguration,
  ParticleSystemConfig,
} from ".";
import { LightingManager, ParticleSystemManager } from ".";

/**
 * Service that orchestrates all visual effects in the scene
 * Manages lighting, particles, and their interactions
 */
export class EffectsManager {
  // @ts-ignore - Scene reference stored for future use
  private _scene: THREE.Scene | null = null;
  private _lightingManager: LightingManager | null = null;
  private _particleManager: ParticleSystemManager | null = null;
  private _isInitialized = false;
  private _timeSinceLastLODUpdate = 0;

  // Effect state
  private _isDayMode = false;
  private _effectsEnabled = true;

  constructor() {
    // Bind methods
    this.onLightingModeChange = this.onLightingModeChange.bind(this);
  }

  /**
   * Initialize the effects manager with scene and configurations
   */
  async initialize(
    scene: THREE.Scene,
    renderer: THREE.WebGLRenderer,
    lightingConfig: LightingConfiguration,
    particlesConfig: ParticlesConfiguration
  ): Promise<void> {
    if (this._isInitialized) {
      throw new Error("EffectsManager is already initialized");
    }

    this._scene = scene;

    // Initialize lighting manager
    this._lightingManager = new LightingManager(scene);
    this._lightingManager.onModeChange(this.onLightingModeChange);
    this._lightingManager.initialize(lightingConfig);

    // Configure global shadow settings
    this.configureShadows(renderer, lightingConfig.globalShadowSettings);

    // Initialize particle system manager
    this._particleManager = new ParticleSystemManager(scene);
    await this.setupParticleEffects(particlesConfig);

    // Set initial day mode state triggering effects
    this.onLightingModeChange(this._lightingManager.getCurrentMode());

    this._isInitialized = true;
    console.log("✅ EffectsManager initialized");
  }

  /**
   * Configure shadow settings on the renderer
   */
  private configureShadows(
    renderer: THREE.WebGLRenderer,
    shadowSettings: any
  ): void {
    renderer.shadowMap.enabled = shadowSettings.enabled;
    renderer.shadowMap.autoUpdate = shadowSettings.autoUpdate;

    switch (shadowSettings.type) {
      case "basic":
        renderer.shadowMap.type = THREE.BasicShadowMap;
        break;
      case "pcf":
        renderer.shadowMap.type = THREE.PCFShadowMap;
        break;
      case "pcfSoft":
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        break;
      case "vsm":
        renderer.shadowMap.type = THREE.VSMShadowMap;
        break;
    }
  }

  /**
   * Setup particle effects from configuration
   */
  private async setupParticleEffects(
    particlesConfig: ParticlesConfiguration
  ): Promise<void> {
    if (!this._particleManager) return;

    const particleSystems = [
      ...Object.values(particlesConfig.particles),
      ...particlesConfig.dynamicParticles,
    ].filter((system) => system.enabled);

    for (const config of particleSystems) {
      try {
        const particleSystem = await this._particleManager.createParticleSystem(
          config
        );
        if (particleSystem) {
          console.log(`✅ Added particle system: ${config.name}`);
        }
      } catch (error) {
        console.warn(
          `❌ Failed to create particle system: ${config.name}`,
          error
        );
      }
    }
  }

  /**
   * Update all effects (called in animation loop)
   */
  update(deltaTime: number, cameraPosition: THREE.Vector3): void {
    if (!this._isInitialized || !this._effectsEnabled) return;

    // Update particles with LOD optimization
    this.updateParticles(deltaTime, cameraPosition);

    // Update lighting if needed
    /* Lighting manager doesn't need per-frame updates currently
    if (this._lightingManager) {
      // but here is where we'd call it if needed
    }
    */
  }

  /**
   * Update particle systems with level-of-detail optimization
   */
  private updateParticles(
    deltaTime: number,
    cameraPosition: THREE.Vector3
  ): void {
    if (!this._particleManager) return;

    // Update LOD every 12 frames for performance (5 times per second at 60fps)
    this._timeSinceLastLODUpdate += deltaTime;
    if (this._timeSinceLastLODUpdate > 0.2) {
      this._timeSinceLastLODUpdate = 0;
      this._particleManager.updateLevelOfDetail(cameraPosition);
    }

    this._particleManager.animateParticles(deltaTime);
  }

  /**
   * Toggle between day and night mode
   */
  toggleDayNightMode(): void {
    if (!this._lightingManager) return;

    const newMode: LightingMode = this._isDayMode ? "night" : "day";
    this._lightingManager.setMode(newMode);

    console.log(`🌓 Switched to ${newMode} mode`);
  }

  /**
   * Handle lighting mode changes
   */
  private onLightingModeChange(mode: LightingMode): void {
    this._isDayMode = mode === "day";

    // Enable/disable night-only particles based on mode
    if (this._particleManager) {
      const nightOnlyPredicate = (config: ParticleSystemConfig) =>
        Boolean(config.tags?.includes("night-only"));

      if (mode === "day") {
        this._particleManager.setParticleSystemsEnabled(
          false,
          nightOnlyPredicate
        );
      } else {
        this._particleManager.setParticleSystemsEnabled(
          true,
          nightOnlyPredicate
        );
      }
    }
  }

  /**
   * Enable or disable all effects
   */
  setEffectsEnabled(enabled: boolean): void {
    this._effectsEnabled = enabled;

    if (this._particleManager) {
      // Enable/disable all particle systems
      this._particleManager.setParticleSystemsEnabled(enabled);
    }

    if (this._lightingManager) {
      // Lighting is always needed, but we could dim it in low-performance mode
      // this._lightingManager.setIntensityMultiplier(enabled ? 1.0 : 0.5);
    }

    console.log(`🎨 Effects ${enabled ? "enabled" : "disabled"}`);
  }

  /**
   * Set performance mode for effects
   */
  setPerformanceMode(mode: "high" | "medium" | "low"): void {
    if (this._particleManager) {
      // Adjust particle counts based on performance mode
      // This would need to be implemented in ParticleSystemManager
      // const multiplier = mode === "high" ? 1 : mode === "medium" ? 0.7 : 0.4;
      // this._particleManager.setPerformanceMultiplier(multiplier);
    }

    console.log(`⚡ Performance mode set to: ${mode}`);
  }

  /**
   * Add a custom particle system
   */
  async addParticleSystem(config: ParticleSystemConfig): Promise<boolean> {
    if (!this._particleManager) return false;

    try {
      const system = await this._particleManager.createParticleSystem(config);
      console.log(`✅ Added custom particle system: ${config.name}`);
      return system !== null;
    } catch (error) {
      console.warn(
        `❌ Failed to add custom particle system: ${config.name}`,
        error
      );
      return false;
    }
  }

  /**
   * Remove a particle system by name
   */
  removeParticleSystem(name: string): void {
    if (this._particleManager) {
      // This would need to be implemented in ParticleSystemManager
      // this._particleManager.removeParticleSystem(name);
      console.log(`🗑️ Removed particle system: ${name}`);
    }
  }

  /**
   * Get current lighting mode
   */
  getCurrentLightingMode(): LightingMode {
    return this._isDayMode ? "day" : "night";
  }

  /**
   * Get effects statistics
   */
  getStats(): {
    lightingMode: LightingMode;
    effectsEnabled: boolean;
    particleSystems: number;
    activeLights: number;
  } {
    return {
      lightingMode: this.getCurrentLightingMode(),
      effectsEnabled: this._effectsEnabled,
      particleSystems: 0, // Would need getStats method in ParticleSystemManager
      activeLights: 0, // Would need getStats method in LightingManager
    };
  }

  /**
   * Dispose of all effects and clean up resources
   */
  dispose(): void {
    if (this._particleManager) {
      // ParticleSystemManager doesn't have dispose method yet
      // this._particleManager.dispose();
      this._particleManager = null;
    }

    if (this._lightingManager) {
      this._lightingManager.dispose();
      this._lightingManager = null;
    }

    this._scene = null;
    this._isInitialized = false;
    console.log("🗑️ EffectsManager disposed");
  }

  // Getters for accessing the managers
  get lightingManager(): LightingManager | null {
    return this._lightingManager;
  }

  get particleManager(): ParticleSystemManager | null {
    return this._particleManager;
  }

  get isDayMode(): boolean {
    return this._isDayMode;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }
}
