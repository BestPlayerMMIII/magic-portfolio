import type { PreloaderState, ObjectConfig } from ".";
import { ModelLoader } from ".";
import { threeDObjectService } from "../threeDObjectService";

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
    // Collect model paths/IDs from configuration
    const modelPaths: string[] = [];
    const modelIds: string[] = [];

    for (const config of objectsConfig) {
      if (config.modelId) {
        modelIds.push(config.modelId);
      } else if (config.modelPath) {
        modelPaths.push(config.modelPath);
      }
    }

    // Get GitCMS model URLs
    let gitcmsUrls: Map<string, string> = new Map();
    if (modelIds.length > 0) {
      console.log(`🔄 Fetching ${modelIds.length} model URLs from GitCMS...`);
      gitcmsUrls = await threeDObjectService.getModelUrlsMap(modelIds);
      console.log(`✅ Fetched ${gitcmsUrls.size} model URLs from GitCMS`);
    }

    // Combine all paths to load
    const allPaths = [...modelPaths, ...Array.from(gitcmsUrls.values())];

    if (allPaths.length === 0) {
      console.log("No models to preload");
      return;
    }

    this._state = {
      isLoading: true,
      progress: 0,
      status: "Initializing magical assets...",
      totalAssets: allPaths.length,
      loadedAssets: 0,
    };

    this.notifyProgress();

    try {
      await this._modelLoader.preloadModels(
        allPaths,
        this.handleLoadProgress.bind(this)
      );

      this._state.status = "Magic laboratory ready!";
      this._state.progress = 100;
      this.notifyProgress();

      // Small delay before completing for UX
      setTimeout(() => {
        this._state.isLoading = false;
        this.notifyComplete();
      }, 500);
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
    this._state.progress = (loaded / total) * 100;

    if (currentPath) {
      const filename = currentPath.split("/").pop() || currentPath;
      this._state.status = `Loading ${filename}...`;
    } else {
      this._state.status = `Loaded ${loaded}/${total} magical artifacts...`;
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
   * Dispose of the preloader
   */
  dispose(): void {
    this._onProgressCallback = null;
    this._onCompleteCallback = null;
    this.reset();
    console.log("🗑️ PreloaderService disposed");
  }
}
