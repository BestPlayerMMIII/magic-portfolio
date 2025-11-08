import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import type { ModelLoadingOptions, ModelMetadata } from ".";

/**
 * Service for loading and managing 3D models
 * Handles GLTF/GLB loading with DRACO compression support, caching, and proper model cloning
 */
export class ModelLoader {
  private _gltfLoader: GLTFLoader;
  private _dracoLoader: DRACOLoader | null = null;
  private _loadedModels = new Map<string, THREE.Group>();
  private _loadingPromises = new Map<string, Promise<THREE.Group>>();
  private _modelMetadata = new Map<string, ModelMetadata>();
  private _options: ModelLoadingOptions;

  constructor(options: ModelLoadingOptions = {}) {
    this._options = {
      enableDRACO: true,
      dracoPath: "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
      timeout: 60000, // 1 minute timeout for large models and slower connections
      ...options,
    };

    this._gltfLoader = new GLTFLoader();
    this.initializeDRACO();
  }

  /**
   * Initialize DRACO loader for compressed models
   */
  private initializeDRACO(): void {
    if (!this._options.enableDRACO) return;

    try {
      this._dracoLoader = new DRACOLoader();
      this._dracoLoader.setDecoderPath(this._options.dracoPath!);
      this._gltfLoader.setDRACOLoader(this._dracoLoader);
      console.log("✅ DRACO loader initialized");
    } catch (error) {
      console.warn("⚠️ DRACO loader failed to initialize:", error);
      this._dracoLoader = null;
    }
  }

  /**
   * Load a 3D model with caching and proper cloning
   */
  async loadModel(modelPath: string): Promise<THREE.Group> {
    // Check if model is already loaded
    if (this._loadedModels.has(modelPath)) {
      const originalModel = this._loadedModels.get(modelPath)!;
      console.log("✅ Model loaded from cache:", modelPath);
      return this.createDeepClone(originalModel);
    }

    // Check if model is currently being loaded
    if (this._loadingPromises.has(modelPath)) {
      const originalModel = await this._loadingPromises.get(modelPath)!;
      return this.createDeepClone(originalModel);
    }

    // Load the model with timeout
    const loadPromise = this.createLoadPromise(modelPath);
    this._loadingPromises.set(modelPath, loadPromise);

    try {
      const originalModel = await loadPromise;
      return this.createDeepClone(originalModel);
    } finally {
      this._loadingPromises.delete(modelPath);
    }
  }

  /**
   * Create a loading promise with timeout and proper error handling
   */
  private createLoadPromise(modelPath: string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      let isComplete = false;

      // Set a timeout for loading
      const timeout = setTimeout(() => {
        if (!isComplete) {
          isComplete = true;
          reject(new Error(`Timeout loading model: ${modelPath}`));
        }
      }, this._options.timeout);

      this._gltfLoader.load(
        modelPath,
        (gltf) => {
          if (isComplete) return; // Already timed out
          isComplete = true;
          clearTimeout(timeout);
          const loadTime = Date.now() - startTime;

          try {
            const originalModel = gltf.scene;

            // Ensure the model has content
            if (!originalModel || originalModel.children.length === 0) {
              reject(new Error(`Empty model: ${modelPath}`));
              return;
            }

            // Prepare the original model
            this.prepareModel(originalModel, gltf.animations);

            // Store metadata
            this._modelMetadata.set(modelPath, {
              path: modelPath,
              loadTime,
              animations:
                gltf.animations?.map((anim) => anim.name || "unnamed") || [],
              materials: this.extractMaterialNames(originalModel),
            });

            // Cache the prepared model
            this._loadedModels.set(modelPath, originalModel);
            console.log(`✅ Loaded 3D model: ${modelPath} (${loadTime}ms)`);
            resolve(originalModel);
          } catch (error) {
            reject(error);
          }
        },
        undefined, // No progress callback - reduces console spam
        (error) => {
          if (isComplete) return; // Already timed out or resolved
          isComplete = true;
          clearTimeout(timeout);
          console.error(`❌ Failed to load model ${modelPath}:`, error);
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          reject(
            new Error(`Failed to load model: ${modelPath} - ${errorMessage}`)
          );
        }
      );
    });
  }

  /**
   * Prepare the model for use (materials, shadows, animations)
   */
  private prepareModel(
    model: THREE.Group,
    animations?: THREE.AnimationClip[]
  ): void {
    // Enable shadows and prepare materials
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Clone materials to avoid sharing between instances
        if (Array.isArray(child.material)) {
          child.material = child.material.map((mat) => mat.clone());
        } else {
          child.material = child.material.clone();
        }

        // Ensure materials work with our lighting
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.needsUpdate = true;
        }
      }
    });

    // Store animations if available
    if (animations && animations.length > 0) {
      console.log(
        `🎬 Found ${animations.length} animations:`,
        animations.map((anim) => anim.name || "unnamed")
      );

      model.userData.animationNames = animations.map((anim) => ({
        name: anim.name || `animation_${animations.indexOf(anim)}`,
        duration: anim.duration,
      }));
      model.userData.gltfAnimations = animations;
    }
  }

  /**
   * Create a proper deep clone with isolated materials and geometries
   */
  private createDeepClone(originalModel: THREE.Group): THREE.Group {
    const clonedModel = originalModel.clone();

    // Deep clone all materials and ensure proper isolation
    clonedModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Clone geometry to avoid sharing
        child.geometry = child.geometry.clone();

        // Clone materials to avoid sharing
        if (Array.isArray(child.material)) {
          child.material = child.material.map((mat) => mat.clone());
        } else {
          child.material = child.material.clone();
        }

        // Ensure each mesh has unique properties
        child.castShadow = true;
        child.receiveShadow = true;
        child.matrixAutoUpdate = true;
        child.updateMatrix();
      }
    });

    // Clone animations properly for this instance
    if (originalModel.userData.gltfAnimations) {
      try {
        clonedModel.userData.gltfAnimations =
          originalModel.userData.gltfAnimations.map(
            (anim: THREE.AnimationClip) => anim.clone()
          );
        clonedModel.userData.animationNames =
          originalModel.userData.animationNames;
        console.log(
          `🎬 Cloned ${clonedModel.userData.gltfAnimations.length} animations for instance`
        );
      } catch (error) {
        console.warn(`⚠️ Failed to clone animations:`, error);
        clonedModel.userData.gltfAnimations = null;
      }
    }

    // Ensure the cloned model has its own transform matrix
    clonedModel.matrixAutoUpdate = true;
    clonedModel.updateMatrix();

    return clonedModel;
  }

  /**
   * Extract material names from a model for metadata
   */
  private extractMaterialNames(model: THREE.Group): string[] {
    const materialNames: string[] = [];

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            if (mat.name && !materialNames.includes(mat.name)) {
              materialNames.push(mat.name);
            }
          });
        } else {
          if (
            child.material.name &&
            !materialNames.includes(child.material.name)
          ) {
            materialNames.push(child.material.name);
          }
        }
      }
    });

    return materialNames;
  }

  /**
   * Preload multiple models SEQUENTIALLY to avoid network congestion
   * Loading in parallel can cause timeouts on slower connections
   */
  async preloadModels(
    modelPaths: string[],
    onProgress?: (loaded: number, total: number, currentPath: string) => void
  ): Promise<void> {
    const totalModels = modelPaths.length;
    let loadedCount = 0;
    let failedCount = 0;

    // Load models SEQUENTIALLY to avoid overwhelming the network
    for (const modelPath of modelPaths) {
      try {
        if (onProgress) {
          onProgress(loadedCount, totalModels, modelPath);
        }

        console.log(
          `📦 Loading model ${loadedCount + 1}/${totalModels}: ${modelPath}`
        );
        await this.loadModel(modelPath);
        loadedCount++;

        if (onProgress) {
          onProgress(loadedCount, totalModels, modelPath);
        }

        console.log(
          `✅ Preloaded (${loadedCount}/${totalModels}): ${modelPath}`
        );
      } catch (error) {
        console.warn(`⚠️ Failed to preload ${modelPath}:`, error);
        failedCount++;
        loadedCount++;

        if (onProgress) {
          onProgress(loadedCount, totalModels, modelPath);
        }
      }
    }

    // Log summary
    const successCount = loadedCount - failedCount;
    if (failedCount > 0) {
      console.warn(
        `⚠️ Preloading complete: ${successCount}/${totalModels} models loaded successfully, ${failedCount} failed`
      );
    } else {
      console.log(
        `✅ Preloading complete: ${successCount}/${totalModels} models loaded successfully`
      );
    }
  }

  /**
   * Get metadata for a loaded model
   */
  getModelMetadata(modelPath: string): ModelMetadata | null {
    return this._modelMetadata.get(modelPath) || null;
  }

  /**
   * Check if a model is loaded
   */
  isModelLoaded(modelPath: string): boolean {
    return this._loadedModels.has(modelPath);
  }

  /**
   * Get all loaded model paths
   */
  getLoadedModelPaths(): string[] {
    return Array.from(this._loadedModels.keys());
  }

  /**
   * Clear the model cache
   */
  clearCache(): void {
    // Dispose of cached models
    this._loadedModels.forEach((model) => {
      this.disposeModel(model);
    });

    this._loadedModels.clear();
    this._modelMetadata.clear();
    console.log("🗑️ Model cache cleared");
  }

  /**
   * Dispose of a model and its resources
   */
  private disposeModel(model: THREE.Group): void {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }

  /**
   * Dispose of the loader and clean up resources
   */
  dispose(): void {
    this.clearCache();

    if (this._dracoLoader) {
      this._dracoLoader.dispose();
      this._dracoLoader = null;
    }

    this._loadingPromises.clear();
    console.log("🗑️ ModelLoader disposed");
  }

  /**
   * Get loading statistics
   */
  getStats(): {
    loadedModels: number;
    cachedSize: number;
    loadingInProgress: number;
  } {
    return {
      loadedModels: this._loadedModels.size,
      cachedSize: this._loadedModels.size, // Could calculate actual memory usage
      loadingInProgress: this._loadingPromises.size,
    };
  }
}
