import * as THREE from "three";
import type { ParticleSystemConfig } from ".";

interface ParticleData {
  particleSystem: THREE.Points;
  config: ParticleSystemConfig;
  startTime: number;
  originalPositions: Float32Array;
  lifetimes: Float32Array;
  ages: Float32Array;
  originalOpacities: Float32Array;
  originalColors: Float32Array; // Store original RGB values
  velocities: Float32Array;
  isAlive: Uint8Array;
}

/**
 * ParticleSystemManager - Advanced particle system with time-to-live and fade functionality
 *
 * Features:
 * - Time-to-live management with configurable lifetime ranges
 * - Fade-in and fade-out effects based on particle lifetime percentage
 * - Dynamic particle respawning for continuous effects
 * - Array repacking optimization to remove dead particles from processing
 * - Performance optimization by adjusting draw range for non-respawning particles
 * - Real-time particle statistics and configuration updates
 */
export class ParticleSystemManager {
  private particleSystems: Map<string, ParticleData> = new Map();
  private scene: THREE.Scene;
  private textureLoader: THREE.TextureLoader;
  private textureCache: Map<string, THREE.Texture> = new Map();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.textureLoader = new THREE.TextureLoader();
  }

  private async loadTexture(
    texturePath: string
  ): Promise<THREE.Texture | null> {
    // Check cache first
    if (this.textureCache.has(texturePath)) {
      return this.textureCache.get(texturePath)!;
    }

    try {
      const texture = await new Promise<THREE.Texture>((resolve, reject) => {
        this.textureLoader.load(
          texturePath,
          (loadedTexture) => {
            // Configure texture for particles
            loadedTexture.colorSpace = THREE.SRGBColorSpace;
            loadedTexture.flipY = false;
            resolve(loadedTexture);
          },
          undefined,
          (error) => reject(error)
        );
      });

      this.textureCache.set(texturePath, texture);
      return texture;
    } catch (error) {
      console.warn(`Failed to load texture: ${texturePath}`, error);
      return null;
    }
  }

  async createParticleSystem(
    config: ParticleSystemConfig
  ): Promise<THREE.Points | null> {
    try {
      const particlesGeometry = new THREE.BufferGeometry();
      const posArray = new Float32Array(config.particleCount * 3);
      const velocityArray = new Float32Array(config.particleCount * 3);
      const lifetimeArray = new Float32Array(config.particleCount);
      const ageArray = new Float32Array(config.particleCount);
      const colorArray = new Float32Array(config.particleCount * 3); // RGB for vertex colors
      const opacityArray = new Float32Array(config.particleCount); // Keep for internal tracking
      const isAliveArray = new Uint8Array(config.particleCount);

      // Base color from material configuration
      const baseColor = new THREE.Color(config.material.color);
      const baseR = baseColor.r;
      const baseG = baseColor.g;
      const baseB = baseColor.b;

      // Generate particle positions and properties
      for (let i = 0; i < config.particleCount; i++) {
        const i3 = i * 3;

        // Generate positions based on distribution type
        this.generateParticlePosition(config, posArray, i3);

        // Don't add position offset here since the particle system itself is positioned
        // The particles are now relative to the system's position
        // posArray[i3] += config.position[0];     // REMOVED: handled by system position
        // posArray[i3 + 1] += config.position[1]; // REMOVED: handled by system position
        // posArray[i3 + 2] += config.position[2]; // REMOVED: handled by system position

        // Set initial velocities for animation
        velocityArray[i3] =
          config.animation.direction[0] * (0.5 + Math.random() * 0.5);
        velocityArray[i3 + 1] =
          config.animation.direction[1] * (0.5 + Math.random() * 0.5);
        velocityArray[i3 + 2] =
          config.animation.direction[2] * (0.5 + Math.random() * 0.5);

        // Initialize time-to-live properties
        if (config.timeToLive?.enabled) {
          const minLife = config.timeToLive.minLifetime;
          const maxLife = config.timeToLive.maxLifetime;
          lifetimeArray[i] = minLife + Math.random() * (maxLife - minLife);
          ageArray[i] = Math.random() * lifetimeArray[i]; // Random starting age
          isAliveArray[i] = 1;
        } else {
          lifetimeArray[i] = Infinity;
          ageArray[i] = 0;
          isAliveArray[i] = 1;
        }

        // Store original opacity for fade calculations
        opacityArray[i] = config.material.opacity;

        // Initialize vertex colors (RGB with alpha baked into the color intensity)
        const i3color = i * 3;
        colorArray[i3color] = baseR * config.material.opacity; // Red channel
        colorArray[i3color + 1] = baseG * config.material.opacity; // Green channel
        colorArray[i3color + 2] = baseB * config.material.opacity; // Blue channel
      }

      // Set geometry attributes
      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(posArray, 3)
      );
      particlesGeometry.setAttribute(
        "velocity",
        new THREE.BufferAttribute(velocityArray, 3)
      );
      particlesGeometry.setAttribute(
        "lifetime",
        new THREE.BufferAttribute(lifetimeArray, 1)
      );
      particlesGeometry.setAttribute(
        "age",
        new THREE.BufferAttribute(ageArray, 1)
      );
      particlesGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colorArray, 3)
      );
      particlesGeometry.setAttribute(
        "opacity",
        new THREE.BufferAttribute(opacityArray, 1)
      );

      // Create particle material
      const particlesMaterial = new THREE.PointsMaterial({
        size: config.material.size,
        color: 0xffffff, // Set to white so vertex colors show through properly
        transparent: config.material.transparent,
        opacity: 1.0, // Set to full opacity, we'll control it via vertex colors
        alphaTest: config.material.alphaTest,
        vertexColors: true, // Enable vertex colors for per-particle control
      });

      // Load texture if specified
      if (config.material.texture) {
        const texture = await this.loadTexture(config.material.texture);
        if (texture) {
          particlesMaterial.map = texture;
          particlesMaterial.needsUpdate = true;
        }
      }

      // Set blending mode
      this.setBlendingMode(particlesMaterial, config.material.blending);

      const particlesMesh = new THREE.Points(
        particlesGeometry,
        particlesMaterial
      );

      // Position the particle system at the instance position so rotation works correctly
      particlesMesh.position.set(
        config.position[0],
        config.position[1],
        config.position[2]
      );

      // Store particle data for animation
      const particleData: ParticleData = {
        particleSystem: particlesMesh,
        config: config,
        startTime: Date.now(),
        originalPositions: new Float32Array(posArray),
        lifetimes: lifetimeArray,
        ages: ageArray,
        originalOpacities: opacityArray,
        originalColors: new Float32Array(colorArray), // Store original colors for fade calculations
        velocities: velocityArray,
        isAlive: isAliveArray,
      };

      this.particleSystems.set(config.name, particleData);
      this.scene.add(particlesMesh);

      console.log(
        `✅ Created particle system: ${config.name} with ${config.particleCount} particles`
      );
      return particlesMesh;
    } catch (error) {
      console.error(`Failed to create particle system ${config.name}:`, error);
      return null;
    }
  }

  private generateParticlePosition(
    config: ParticleSystemConfig,
    posArray: Float32Array,
    i3: number
  ): void {
    switch (config.distribution.type) {
      case "sphere":
        const radius = config.distribution.radius || 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = Math.random() * radius;

        posArray[i3] = r * Math.sin(phi) * Math.cos(theta);
        posArray[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        posArray[i3 + 2] = r * Math.cos(phi);
        break;

      case "box":
        const width = config.distribution.width || 10;
        const height = config.distribution.height || 10;
        const depth = config.distribution.depth || 10;

        posArray[i3] = (Math.random() - 0.5) * width;
        posArray[i3 + 1] = (Math.random() - 0.5) * height;
        posArray[i3 + 2] = (Math.random() - 0.5) * depth;
        break;

      case "ring":
        const innerRadius = config.distribution.innerRadius || 5;
        const outerRadius = config.distribution.outerRadius || 10;
        const ringRadius =
          innerRadius + Math.random() * (outerRadius - innerRadius);
        const ringAngle = Math.random() * Math.PI * 2;

        posArray[i3] = ringRadius * Math.cos(ringAngle);
        posArray[i3 + 1] = (Math.random() - 0.5) * 2;
        posArray[i3 + 2] = ringRadius * Math.sin(ringAngle);
        break;

      case "line":
        const lineLength = config.distribution.width || 10;
        posArray[i3] = (Math.random() - 0.5) * lineLength;
        posArray[i3 + 1] = 0;
        posArray[i3 + 2] = 0;
        break;

      default:
        posArray[i3] = (Math.random() - 0.5) * 10;
        posArray[i3 + 1] = (Math.random() - 0.5) * 10;
        posArray[i3 + 2] = (Math.random() - 0.5) * 10;
    }
  }

  private setBlendingMode(
    material: THREE.PointsMaterial,
    blending: string
  ): void {
    switch (blending) {
      case "additive":
        material.blending = THREE.AdditiveBlending;
        break;
      case "subtractive":
        material.blending = THREE.SubtractiveBlending;
        break;
      case "multiply":
        material.blending = THREE.MultiplyBlending;
        break;
      default:
        material.blending = THREE.NormalBlending;
    }
  }

  animateParticles(deltaTime: number): void {
    this.particleSystems.forEach((particleData) => {
      const {
        particleSystem,
        config,
        originalPositions,
        lifetimes,
        ages,
        originalColors,
        velocities,
        isAlive,
      } = particleData;

      if (!config.animation.enabled) return;

      const positions = particleSystem.geometry.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      const colors = particleSystem.geometry.getAttribute(
        "color"
      ) as THREE.BufferAttribute;

      let aliveCount = 0;
      let needsRepack = false;

      // First pass: update particles and count alive ones
      for (let i = 0; i < config.particleCount; i++) {
        if (!isAlive[i]) {
          needsRepack = true;
          continue;
        }

        const i3 = i * 3;

        // Update particle age
        ages[i] += deltaTime;

        // Check if particle should die
        if (config.timeToLive?.enabled && ages[i] >= lifetimes[i]) {
          if (config.timeToLive.respawn) {
            // Respawn particle
            this.respawnParticle(
              config,
              originalPositions,
              ages,
              lifetimes,
              i,
              isAlive
            );
          } else {
            // Kill particle
            isAlive[i] = 0;
            // Set color to black (invisible)
            colors.array[i3] = 0;
            colors.array[i3 + 1] = 0;
            colors.array[i3 + 2] = 0;
            needsRepack = true;
            continue;
          }
        }

        // Calculate fade factor
        let fadeFactor = 1.0;
        if (config.fade?.enabled && config.timeToLive?.enabled) {
          const lifeProgress = ages[i] / lifetimes[i];
          const fadeIn = config.fade.fadeInPercentage;
          const fadeOut = config.fade.fadeOutPercentage;

          if (lifeProgress < fadeIn) {
            // Fade in
            fadeFactor = lifeProgress / fadeIn;
          } else if (lifeProgress > 1.0 - fadeOut) {
            // Fade out
            const fadeOutProgress = (lifeProgress - (1.0 - fadeOut)) / fadeOut;
            fadeFactor = 1.0 - fadeOutProgress;
          }
        }

        // Apply fade to vertex colors (multiply RGB by fade factor)
        colors.array[i3] = originalColors[i3] * fadeFactor;
        colors.array[i3 + 1] = originalColors[i3 + 1] * fadeFactor;
        colors.array[i3 + 2] = originalColors[i3 + 2] * fadeFactor;

        // Floating animation
        const floatingOffset =
          Math.sin(ages[i] * config.animation.floatingSpeed + i * 0.1) *
          config.animation.floatingAmplitude;

        // Movement animation
        const movement = ages[i] * config.animation.speed;

        positions.array[i3] = originalPositions[i3] + velocities[i3] * movement;
        positions.array[i3 + 1] =
          originalPositions[i3 + 1] +
          velocities[i3 + 1] * movement +
          floatingOffset;
        positions.array[i3 + 2] =
          originalPositions[i3 + 2] + velocities[i3 + 2] * movement;

        aliveCount++;
      }

      // Optimize: repack arrays to move dead particles to the end
      if (needsRepack && !config.timeToLive?.respawn) {
        this.repackParticleArrays(particleData);
        // Update draw range to only render alive particles
        particleSystem.geometry.setDrawRange(0, aliveCount);
      }

      // DEBUG: Verify particle count consistency (only for respawning systems)
      if (config.timeToLive?.respawn && config.timeToLive.enabled) {
        const actualAliveCount = isAlive.reduce((sum, alive) => sum + alive, 0);
        if (actualAliveCount !== config.particleCount) {
          console.warn(
            `⚠️ Particle count mismatch in ${config.name}: expected ${config.particleCount}, got ${actualAliveCount}`
          );
          // Fix the issue by resetting dead particles to alive
          for (let i = 0; i < config.particleCount; i++) {
            if (!isAlive[i]) {
              isAlive[i] = 1;
              ages[i] = Math.random() * lifetimes[i]; // Random age to avoid sync
            }
          }
        }
      }

      positions.needsUpdate = true;
      colors.needsUpdate = true;

      // Rotation animation
      if (config.animation.rotationSpeed !== 0) {
        particleSystem.rotation.y += config.animation.rotationSpeed * deltaTime;
      }
    });
  }

  private repackParticleArrays(particleData: ParticleData): void {
    const {
      particleSystem,
      config,
      originalPositions,
      lifetimes,
      ages,
      originalOpacities,
      originalColors,
      velocities,
      isAlive,
    } = particleData;

    const positions = particleSystem.geometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    const colors = particleSystem.geometry.getAttribute(
      "color"
    ) as THREE.BufferAttribute;

    let writeIndex = 0;

    // Repack arrays to move alive particles to the front
    for (let readIndex = 0; readIndex < config.particleCount; readIndex++) {
      if (isAlive[readIndex]) {
        if (writeIndex !== readIndex) {
          // Move particle data from readIndex to writeIndex
          const readI3 = readIndex * 3;
          const writeI3 = writeIndex * 3;

          // Copy position data
          positions.array[writeI3] = positions.array[readI3];
          positions.array[writeI3 + 1] = positions.array[readI3 + 1];
          positions.array[writeI3 + 2] = positions.array[readI3 + 2];

          // Copy original positions
          originalPositions[writeI3] = originalPositions[readI3];
          originalPositions[writeI3 + 1] = originalPositions[readI3 + 1];
          originalPositions[writeI3 + 2] = originalPositions[readI3 + 2];

          // Copy velocities
          velocities[writeI3] = velocities[readI3];
          velocities[writeI3 + 1] = velocities[readI3 + 1];
          velocities[writeI3 + 2] = velocities[readI3 + 2];

          // Copy color data
          colors.array[writeI3] = colors.array[readI3];
          colors.array[writeI3 + 1] = colors.array[readI3 + 1];
          colors.array[writeI3 + 2] = colors.array[readI3 + 2];

          // Copy original colors
          originalColors[writeI3] = originalColors[readI3];
          originalColors[writeI3 + 1] = originalColors[readI3 + 1];
          originalColors[writeI3 + 2] = originalColors[readI3 + 2];

          // Copy other particle data
          lifetimes[writeIndex] = lifetimes[readIndex];
          ages[writeIndex] = ages[readIndex];
          originalOpacities[writeIndex] = originalOpacities[readIndex];
          isAlive[writeIndex] = isAlive[readIndex];
        }
        writeIndex++;
      }
    }

    // Mark remaining particles as dead
    for (let i = writeIndex; i < config.particleCount; i++) {
      isAlive[i] = 0;
      // Set colors to black (invisible)
      const i3 = i * 3;
      colors.array[i3] = 0;
      colors.array[i3 + 1] = 0;
      colors.array[i3 + 2] = 0;
    }

    console.log(
      `🔄 Repacked particles for ${config.name}: ${writeIndex}/${config.particleCount} alive`
    );
  }

  private respawnParticle(
    config: ParticleSystemConfig,
    originalPositions: Float32Array,
    ages: Float32Array,
    lifetimes: Float32Array,
    index: number,
    isAlive: Uint8Array // Add isAlive parameter
  ): void {
    const i3 = index * 3;

    // Reset age
    ages[index] = 0;
    isAlive[index] = 1;

    // Generate new lifetime
    if (config.timeToLive?.enabled) {
      const minLife = config.timeToLive.minLifetime;
      const maxLife = config.timeToLive.maxLifetime;
      lifetimes[index] = minLife + Math.random() * (maxLife - minLife);
    }

    // Regenerate position
    const tempPos = new Float32Array(3);
    this.generateParticlePosition(config, tempPos, 0);

    // Don't add position offset since the particle system itself is positioned
    originalPositions[i3] = tempPos[0];
    originalPositions[i3 + 1] = tempPos[1];
    originalPositions[i3 + 2] = tempPos[2];
  }

  removeParticleSystem(name: string): void {
    const particleData = this.particleSystems.get(name);
    if (particleData) {
      this.scene.remove(particleData.particleSystem);
      if (particleData.particleSystem.geometry) {
        particleData.particleSystem.geometry.dispose();
      }
      if (Array.isArray(particleData.particleSystem.material)) {
        particleData.particleSystem.material.forEach((mat) => mat.dispose());
      } else {
        particleData.particleSystem.material.dispose();
      }
      this.particleSystems.delete(name);
      console.log(`🗑️ Removed particle system: ${name}`);
    }
  }

  removeAllParticleSystems(): void {
    this.particleSystems.forEach((_, name) => {
      this.removeParticleSystem(name);
    });
  }

  getParticleSystem(name: string): THREE.Points | null {
    const particleData = this.particleSystems.get(name);
    return particleData ? particleData.particleSystem : null;
  }

  getAllParticleSystemNames(): string[] {
    return Array.from(this.particleSystems.keys());
  }

  updateParticleSystemConfig(
    name: string,
    newConfig: Partial<ParticleSystemConfig>
  ): boolean {
    const particleData = this.particleSystems.get(name);
    if (particleData) {
      // Update the stored config
      Object.assign(particleData.config, newConfig);

      // Update material properties if changed
      if (newConfig.material) {
        const material = particleData.particleSystem
          .material as THREE.PointsMaterial;
        if (newConfig.material.color !== undefined)
          material.color.setHex(newConfig.material.color);
        if (newConfig.material.size !== undefined)
          material.size = newConfig.material.size;
        if (newConfig.material.opacity !== undefined)
          material.opacity = newConfig.material.opacity;
        if (newConfig.material.transparent !== undefined)
          material.transparent = newConfig.material.transparent;
        if (newConfig.material.blending !== undefined) {
          this.setBlendingMode(material, newConfig.material.blending);
        }
        material.needsUpdate = true;
      }

      console.log(`🔄 Updated particle system config: ${name}`);
      return true;
    }
    return false;
  }

  getParticleSystemStats(): {
    [name: string]: { particleCount: number; aliveCount: number };
  } {
    const stats: {
      [name: string]: { particleCount: number; aliveCount: number };
    } = {};

    this.particleSystems.forEach((particleData, name) => {
      const aliveCount = particleData.isAlive.reduce(
        (sum, alive) => sum + alive,
        0
      );
      stats[name] = {
        particleCount: particleData.config.particleCount,
        aliveCount: aliveCount,
      };
    });

    return stats;
  }

  /**
   * Update particle colors for real-time effects
   * @param name - Name of the particle system
   * @param newColor - New base color (hex)
   * @returns boolean indicating success
   */
  updateParticleColors(name: string, newColor: number): boolean {
    const particleData = this.particleSystems.get(name);
    if (!particleData) return false;

    const colors = particleData.particleSystem.geometry.getAttribute(
      "color"
    ) as THREE.BufferAttribute;

    const newColorObj = new THREE.Color(newColor);
    const baseR = newColorObj.r;
    const baseG = newColorObj.g;
    const baseB = newColorObj.b;

    // Update both original colors and current colors
    for (let i = 0; i < particleData.config.particleCount; i++) {
      const i3 = i * 3;
      const opacity = particleData.originalOpacities[i];

      // Update original colors
      particleData.originalColors[i3] = baseR * opacity;
      particleData.originalColors[i3 + 1] = baseG * opacity;
      particleData.originalColors[i3 + 2] = baseB * opacity;

      // Update current colors (they will be modified by fade on next frame)
      colors.array[i3] = baseR * opacity;
      colors.array[i3 + 1] = baseG * opacity;
      colors.array[i3 + 2] = baseB * opacity;
    }

    colors.needsUpdate = true;
    console.log(`🎨 Updated colors for particle system: ${name}`);
    return true;
  }

  /**
   * Enable or disable all particle systems (useful for day/night mode)
   *
   * @param enabled - Whether to enable or disable particle systems
   */
  setParticleSystemsEnabled(
    enabled: boolean,
    predicate?: (name: ParticleSystemConfig) => boolean
  ): void {
    if (!predicate) predicate = () => true;
    this.particleSystems.forEach((particleData, name) => {
      if (predicate(particleData.config)) {
        particleData.particleSystem.visible = enabled;
        console.log(
          `🔥 ${enabled ? "Enabled" : "Disabled"} particle system: ${name}`
        );
      }
    });
  }

  /**
   * OPTIMIZATION: Dynamic LOD based on distance from camera
   */
  updateLevelOfDetail(cameraPosition: THREE.Vector3): void {
    this.particleSystems.forEach((particleData) => {
      const distance = cameraPosition.distanceTo(
        new THREE.Vector3(...particleData.config.position)
      );

      // LOD thresholds
      const nearThreshold = 15;
      const farThreshold = 25;

      let lodMultiplier = 1.0;
      if (distance > farThreshold) {
        lodMultiplier = 0.3; // Very far: 30% particles
      } else if (distance > nearThreshold) {
        lodMultiplier = 0.6; // Medium distance: 60% particles
      }

      const targetCount = Math.floor(
        particleData.config.particleCount * lodMultiplier
      );
      particleData.particleSystem.geometry.setDrawRange(0, targetCount);
    });
  }

  /**
   * OPTIMIZATION: Performance monitor
   */
  getPerformanceStats(): {
    totalParticles: number;
    activeParticles: number;
    systemCount: number;
    memoryUsage: number;
  } {
    let totalParticles = 0;
    let activeParticles = 0;
    let memoryUsage = 0;

    this.particleSystems.forEach((particleData) => {
      totalParticles += particleData.config.particleCount;
      activeParticles += particleData.isAlive.reduce(
        (sum, alive) => sum + alive,
        0
      );

      // Estimate memory usage (rough calculation)
      const particleCount = particleData.config.particleCount;
      memoryUsage += particleCount * (3 * 4 + 3 * 4 + 3 * 4 + 4 + 4 + 4 + 1); // bytes per particle
    });

    return {
      totalParticles,
      activeParticles,
      systemCount: this.particleSystems.size,
      memoryUsage: Math.round(memoryUsage / 1024), // KB
    };
  }

  /**
   * Enable or disable a specific particle system
   *
   * @param name - Name of the particle system
   * @param enabled - Whether to enable or disable the particle system
   * @returns True if successful, false if particle system not found
   */
  setParticleSystemEnabled(name: string, enabled: boolean): boolean {
    const particleData = this.particleSystems.get(name);
    if (!particleData) return false;

    particleData.particleSystem.visible = enabled;
    console.log(
      `🔥 ${enabled ? "Enabled" : "Disabled"} particle system: ${name}`
    );
    return true;
  }
}
