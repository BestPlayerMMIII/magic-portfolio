import * as THREE from "three";
import type { LightConfig, LightingConfiguration, LightingMode } from ".";

export class LightingManager {
  // Static helpers
  public static calculateRealTimeMode(): LightingMode {
    const hours: number = new Date().getHours();
    return 6 <= hours && hours <= 20 ? "day" : "night";
  }

  // ---
  private scene: THREE.Scene;
  private lightingMode: LightingMode = LightingManager.calculateRealTimeMode();
  private lights = new Map<string, THREE.Light>();
  private originalIntensities = new Map<string, number>();
  private lightConfigs = new Map<string, LightConfig>();
  private ambientLight: THREE.AmbientLight | null = null;
  private directionalLight: THREE.DirectionalLight | null = null;
  private nightOnly: THREE.Light[] = [];
  private magicalLights: THREE.Light[] = [];
  private onModeChangeCallback?: (mode: LightingMode) => void;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  /**
   * Initialize all lights and set up the lighting system
   */
  public initialize(lightingConfig: LightingConfiguration): void {
    this.setupAmbientLight(lightingConfig.ambientLight);
    this.setupDirectionalLight(lightingConfig.directionalLight);

    // Setup dynamic lights if provided
    if (lightingConfig.dynamicLights) {
      this.setupDynamicLights(lightingConfig.dynamicLights);
    }

    // Apply initial lighting mode
    this.applyLightingMode(this.lightingMode);
    if (this.onModeChangeCallback) {
      this.onModeChangeCallback(this.lightingMode);
    }
  }

  /**
   * Set a callback function to be called when lighting mode changes
   */
  public onModeChange(callback: (mode: LightingMode) => void): void {
    this.onModeChangeCallback = callback;
  }

  /**
   * Toggle between day and night modes
   */
  public toggleMode(): LightingMode {
    this.setMode(this.lightingMode === "day" ? "night" : "day");
    return this.lightingMode;
  }

  /**
   * Get current lighting mode
   */
  public getCurrentMode(): LightingMode {
    return this.lightingMode;
  }

  /**
   * Set specific lighting mode
   */
  public setMode(mode: LightingMode): void {
    if (this.lightingMode !== mode) {
      this.lightingMode = mode;
      this.applyLightingMode(mode);

      if (this.onModeChangeCallback) {
        this.onModeChangeCallback(mode);
      }

      console.log(`🌓 Switched to ${mode} mode`);
    }
  }

  private setupAmbientLight(config: LightConfig): void {
    if (config.enabled) {
      this.ambientLight = new THREE.AmbientLight(
        config.color,
        config.intensity
      );
      this.scene.add(this.ambientLight);

      const lightKey = "ambient";
      this.lights.set(lightKey, this.ambientLight);
      this.originalIntensities.set(lightKey, config.intensity);
      this.lightConfigs.set(lightKey, config);
    }
  }

  private setupDirectionalLight(config: LightConfig): void {
    if (config.enabled) {
      this.directionalLight = new THREE.DirectionalLight(
        config.color,
        config.intensity
      );

      if (config.position) {
        this.directionalLight.position.set(...config.position);
      }

      if (config.target) {
        this.directionalLight.target.position.set(...config.target);
        this.scene.add(this.directionalLight.target);
      }

      if (config.castShadow) {
        this.directionalLight.castShadow = true;
        this.configureShadows(this.directionalLight, config);
      }

      this.scene.add(this.directionalLight);

      const lightKey = "directional";
      this.lights.set(lightKey, this.directionalLight);
      this.originalIntensities.set(lightKey, config.intensity);
      this.lightConfigs.set(lightKey, config);
    }
  }

  private setupDynamicLights(dynamicLights: LightConfig[]): void {
    dynamicLights.forEach((config: LightConfig, index: number) => {
      if (config.enabled && config.position) {
        let light: THREE.Light;

        switch (config.type) {
          case "point":
            light = new THREE.PointLight(
              config.color,
              config.intensity,
              config.distance,
              config.decay
            );
            light.position.set(
              config.position[0],
              config.position[1],
              config.position[2]
            );
            break;

          case "spot":
            light = new THREE.SpotLight(
              config.color,
              config.intensity,
              config.distance,
              config.angle,
              config.penumbra,
              config.decay
            );
            light.position.set(
              config.position[0],
              config.position[1],
              config.position[2]
            );
            if (config.target) {
              (light as THREE.SpotLight).target.position.set(
                config.target[0],
                config.target[1],
                config.target[2]
              );
              this.scene.add((light as THREE.SpotLight).target);
            }
            break;

          default:
            console.warn(`Unsupported light type: ${config.type}`);
            return;
        }

        if (config.castShadow && light.shadow) {
          light.castShadow = true;
          this.configureShadows(light, config);
        }

        this.scene.add(light);

        // Categorize lights based on tags
        const lightTags = config.tags || [];
        if (lightTags.includes("night-only")) {
          this.nightOnly.push(light);
        }
        if (lightTags.includes("magical-light")) {
          this.magicalLights.push(light);
        }

        const lightKey = config.name ?? `light_${index}`;
        this.lights.set(lightKey, light);
        this.originalIntensities.set(lightKey, config.intensity);
        this.lightConfigs.set(lightKey, config);
      }
    });
  }

  private configureShadows(light: THREE.Light, config: LightConfig): void {
    if (!light.shadow) return;

    if (config.shadowMapSize && light.shadow.mapSize) {
      light.shadow.mapSize.width = config.shadowMapSize[0];
      light.shadow.mapSize.height = config.shadowMapSize[1];
    }

    if (light.shadow.camera) {
      if (config.shadowCameraNear !== undefined) {
        (light.shadow.camera as any).near = config.shadowCameraNear;
      }
      if (config.shadowCameraFar !== undefined) {
        (light.shadow.camera as any).far = config.shadowCameraFar;
      }

      // For directional lights, set orthographic camera bounds
      if (light instanceof THREE.DirectionalLight) {
        const shadowCamera = light.shadow.camera as THREE.OrthographicCamera;
        if (config.shadowCameraLeft !== undefined) {
          shadowCamera.left = config.shadowCameraLeft;
        }
        if (config.shadowCameraRight !== undefined) {
          shadowCamera.right = config.shadowCameraRight;
        }
        if (config.shadowCameraTop !== undefined) {
          shadowCamera.top = config.shadowCameraTop;
        }
        if (config.shadowCameraBottom !== undefined) {
          shadowCamera.bottom = config.shadowCameraBottom;
        }
      }
    }
  }

  private applyLightingMode(mode: LightingMode): void {
    const transitionDuration = 1000; // 1 second transition

    if (mode === "day") {
      this.transitionToDay(transitionDuration);
    } else {
      this.transitionToNight(transitionDuration);
    }
  }

  private transitionToDay(duration: number): void {
    // Day mode multipliers
    const dayMultipliers = {
      directional: 1.5, // Boost directional light
      ambient: 0.5, // Reduce ambient for dramatic shadows
      magical: 0.5, // Dim magical lights
      nightOnly: 0.0, // Turn off night-only lights completely
    };

    // Apply to directional light
    if (this.directionalLight) {
      const originalIntensity =
        this.originalIntensities.get("directional") || 1.2;
      this.animateLightIntensity(
        this.directionalLight,
        originalIntensity * dayMultipliers.directional,
        duration
      );
    }

    // Apply to ambient light
    if (this.ambientLight) {
      const originalIntensity = this.originalIntensities.get("ambient") || 0.6;
      this.animateLightIntensity(
        this.ambientLight,
        originalIntensity * dayMultipliers.ambient,
        duration
      );
    }

    // Apply to night-only lights (candles, torches)
    this.nightOnly.forEach((light) => {
      this.animateLightIntensity(light, 0, duration);
    });

    // Apply to magical lights
    this.magicalLights.forEach((light, index) => {
      const lightKey = `magical-${index}`;
      const originalIntensity = this.originalIntensities.get(lightKey) || 2.0;
      this.animateLightIntensity(
        light,
        originalIntensity * dayMultipliers.magical,
        duration
      );
    });
  }

  private transitionToNight(duration: number): void {
    // Night mode multipliers
    const nightMultipliers = {
      directional: 0.2, // Greatly reduce directional light (moonlight)
      ambient: 1.0, // Full ambient for visibility
      magical: 1.0, // Full magical lights
      nightOnly: 1.0, // Full intensity for night-only lights
    };

    // Apply to directional light
    if (this.directionalLight) {
      const originalIntensity =
        this.originalIntensities.get("directional") || 1.2;
      this.animateLightIntensity(
        this.directionalLight,
        originalIntensity * nightMultipliers.directional,
        duration
      );
    }

    // Apply to ambient light
    if (this.ambientLight) {
      const originalIntensity = this.originalIntensities.get("ambient") || 0.6;
      this.animateLightIntensity(
        this.ambientLight,
        originalIntensity * nightMultipliers.ambient,
        duration
      );
    }

    // Apply to night-only lights using their original intensities
    this.nightOnly.forEach((light) => {
      // Find the light's key to get its original intensity
      let originalIntensity = 1.0;

      for (const [key, storedLight] of this.lights.entries()) {
        if (storedLight === light) {
          originalIntensity = this.originalIntensities.get(key) || 1.0;
          break;
        }
      }

      this.animateLightIntensity(
        light,
        originalIntensity * nightMultipliers.nightOnly,
        duration
      );
    });

    // Apply to magical lights
    this.magicalLights.forEach((light, index) => {
      const lightKey = `magical-${index}`;
      const originalIntensity = this.originalIntensities.get(lightKey) || 2.0;
      this.animateLightIntensity(
        light,
        originalIntensity * nightMultipliers.magical,
        duration
      );
    });
  }

  private animateLightIntensity(
    light: THREE.Light,
    targetIntensity: number,
    duration: number
  ): void {
    const startIntensity = light.intensity;
    const intensityDelta = targetIntensity - startIntensity;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Use easing function for smooth transition
      const easeProgress = this.easeInOutQuad(progress);

      light.intensity = startIntensity + intensityDelta * easeProgress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  /**
   * Get the original intensity of a light by its key
   */
  public getOriginalIntensity(lightKey: string): number | undefined {
    return this.originalIntensities.get(lightKey);
  }

  /**
   * Get the current configuration of a light by its key
   */
  public getLightConfig(lightKey: string): LightConfig | undefined {
    return this.lightConfigs.get(lightKey);
  }

  /**
   * Get all available light keys
   */
  public getLightKeys(): string[] {
    return Array.from(this.lights.keys());
  }

  /**
   * Manually set a light intensity (useful for custom transitions)
   */
  public setLightIntensity(lightKey: string, intensity: number): boolean {
    const light = this.lights.get(lightKey);
    if (light) {
      light.intensity = intensity;
      return true;
    }
    return false;
  }

  /**
   * Clean up all lights and remove them from the scene
   */
  public dispose(): void {
    this.lights.forEach((light) => {
      this.scene.remove(light);
    });

    this.nightOnly.forEach((light) => {
      this.scene.remove(light);
    });

    this.magicalLights.forEach((light) => {
      this.scene.remove(light);
    });

    this.lights.clear();
    this.originalIntensities.clear();
    this.lightConfigs.clear();
    this.nightOnly = [];
    this.magicalLights = [];
    this.ambientLight = null;
    this.directionalLight = null;
  }
}
