import type { PreloaderState, ObjectConfig } from ".";
import { ModelLoader } from ".";

/**
 * Service for handling asset preloading with progress tracking
 * Manages the loading of models and provides user feedback
 */
export class PreloaderService {
  private _modelLoader: ModelLoader;
  private _state: PreloaderState = {
    isLoading: false,
    progress: 0,
    status: "Ready",
    totalAssets: 0,
    loadedAssets: 0,
  };

  // Callbacks
  private _onProgressCallback: ((state: PreloaderState) => void) | null = null;
  private _onCompleteCallback: (() => void) | null = null;

  constructor(modelLoader: ModelLoader) {
    this._modelLoader = modelLoader;
  }

  /**
   * Preload all models from object configurations
   */
  async preloadAssets(objectsConfig: ObjectConfig[]): Promise<void> {
    // Collect model paths from configuration
    const modelPaths: string[] = [];

    for (const config of objectsConfig) {
      if (config.modelPath) {
        modelPaths.push(config.modelPath);
      }
    }

    if (modelPaths.length === 0) {
      console.log("No models to preload");
      return;
    }

    this._state = {
      isLoading: true,
      progress: 0,
      status: "Initializing magical assets...",
      totalAssets: modelPaths.length,
      loadedAssets: 0,
    };

    this.notifyProgress();

    try {
      await this._modelLoader.preloadModels(
        modelPaths,
        this.handleLoadProgress.bind(this)
      );

      // Update to 90% - still need to finalize scene initialization
      this._state.status = "Finalizing scene...";
      this._state.progress = 90;
      this.notifyProgress();

      // Note: Loading state will be set to false externally when scene is fully ready
    } catch (error) {
      console.error("Failed to preload assets:", error);
      this._state.status = "Failed to load some assets";
      this._state.isLoading = false;
      this.notifyProgress();
    }
  }

  /**
   * Handle progress updates during loading
   */
  private handleLoadProgress(
    loaded: number,
    total: number,
    currentPath: string
  ): void {
    this._state.loadedAssets = loaded;
    // Models take 90% of the loading, remaining 10% is for scene finalization
    this._state.progress = (loaded / total) * 90;

    if (currentPath) {
      const filename =
        currentPath.split("/").pop()?.replace(".glb", "") || currentPath;
      this._state.status = `Loading ${filename}... (${loaded}/${total})`;
    } else {
      this._state.status = `Loading magical artifacts... (${loaded}/${total})`;
    }

    this.notifyProgress();
  }

  /**
   * Set the progress callback
   */
  onProgress(callback: (state: PreloaderState) => void): void {
    this._onProgressCallback = callback;
  }

  /**
   * Set the complete callback
   */
  onComplete(callback: () => void): void {
    this._onCompleteCallback = callback;
  }

  /**
   * Get the current preloader state
   */
  getState(): PreloaderState {
    return { ...this._state };
  }

  /**
   * Check if currently loading
   */
  isLoading(): boolean {
    return this._state.isLoading;
  }

  /**
   * Get loading progress (0-100)
   */
  getProgress(): number {
    return this._state.progress;
  }

  /**
   * Get current status message
   */
  getStatus(): string {
    return this._state.status;
  }

  /**
   * Notify progress callback
   */
  private notifyProgress(): void {
    if (this._onProgressCallback) {
      this._onProgressCallback(this.getState());
    }
  }

  /**
   * Notify complete callback
   */
  private notifyComplete(): void {
    if (this._onCompleteCallback) {
      this._onCompleteCallback();
    }
  }

  /**
   * Reset the preloader state
   */
  reset(): void {
    this._state = {
      isLoading: false,
      progress: 0,
      status: "Ready",
      totalAssets: 0,
      loadedAssets: 0,
    };
  }

  /**
   * Mark scene as ready and complete loading
   */
  setSceneReady(): void {
    if (!this._state.isLoading) {
      console.warn("PreloaderService is not in loading state");
      return;
    }

    this._state.status = "Magic laboratory ready!";
    this._state.progress = 100;
    this.notifyProgress();

    // Small delay before completing for UX
    setTimeout(() => {
      this._state.isLoading = false;
      this.notifyComplete();
    }, 500);
  }

  /**
   * Dispose of the preloader
   */
  dispose(): void {
    this._onProgressCallback = null;
    this._onCompleteCallback = null;
    this.reset();
    console.log("🗑️ PreloaderService disposed");
  }
}
