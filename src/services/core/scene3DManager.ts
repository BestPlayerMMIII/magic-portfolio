import type {
  ThemeConfig,
  InteractiveObject,
  InteractionEvent,
  PreloaderState,
} from ".";
import {
  SceneManager,
  ModelLoader,
  ObjectManager,
  EffectsManager,
  InteractionManager,
  PreloaderService,
} from ".";
import type { ContentItem, NullableSchemaType, ObjectConfig } from "@/types";
import apiWithCache from "../apiWithCache";

/**
 * Main orchestrator service that manages the entire 3D scene
 * Coordinates all services and provides a clean API for the Vue component
 */
export class Scene3DManager {
  // Core services
  private _sceneManager: SceneManager;
  private _modelLoader: ModelLoader;
  private _objectManager: ObjectManager;
  private _effectsManager: EffectsManager;
  private _interactionManager: InteractionManager;
  private _preloaderService: PreloaderService;

  // State
  private _isInitialized = false;
  private _currentTheme: ThemeConfig | null = null;
  // @ts-ignore - Container reference stored for future use
  private _container: HTMLElement | null = null;

  // Callbacks
  private _onObjectHover: ((object: InteractiveObject | null) => void) | null =
    null;
  private _onObjectClick:
    | ((object: InteractiveObject, event: InteractionEvent) => void)
    | null = null;
  private _onPreloadProgress: ((state: PreloaderState) => void) | null = null;
  private _onPreloadComplete: (() => void) | null = null;

  private _previousHoveredObjectId: string | null = null;

  constructor() {
    // Initialize services
    this._modelLoader = new ModelLoader({
      enableDRACO: true,
      timeout: 10000,
    });

    this._sceneManager = new SceneManager();
    this._objectManager = new ObjectManager(this._modelLoader);
    this._effectsManager = new EffectsManager();
    this._interactionManager = new InteractionManager();
    this._preloaderService = new PreloaderService(this._modelLoader);

    // Setup service callbacks
    this.setupServiceCallbacks();
  }

  /**
   * Setup callbacks between services
   */
  private setupServiceCallbacks(): void {
    // Scene manager render callback
    this._sceneManager.onRender((deltaTime: number) => {
      this.updateAnimations(deltaTime);
    });

    // Interaction manager callbacks
    this._interactionManager.onObjectHover((object) => {
      const trigger =
        (object === null) !== (this._previousHoveredObjectId === null) ||
        this._previousHoveredObjectId !== (object?.id || null);

      if (trigger) {
        // Handle hover effects (scaling and animations) through the object manager
        // if object changed (note: trigger <===> is changed)

        if (object) {
          this._objectManager.applyHoverScale(object.id);
          this._objectManager.playHoverAnimation(object.id);
        }

        if (this._previousHoveredObjectId) {
          this._objectManager.stopHoverAnimation(this._previousHoveredObjectId);
          this._objectManager.resetScale(this._previousHoveredObjectId!);
        }

        // Update the previous hovered object
        this._previousHoveredObjectId = object?.id || null;
      }

      // Forward to external callback
      if (this._onObjectHover) {
        this._onObjectHover(object);
      }
    });

    this._interactionManager.onObjectClick((object, event) => {
      if (this._onObjectClick) {
        this._onObjectClick(object, event);
      }
    });

    // Preloader callbacks
    this._preloaderService.onProgress((state) => {
      if (this._onPreloadProgress) {
        this._onPreloadProgress(state);
      }
    });

    this._preloaderService.onComplete(() => {
      if (this._onPreloadComplete) {
        this._onPreloadComplete();
      }
    });
  }

  /**
   * Apply visibility rules to objects - makes them non-interactable instead of hiding them
   */
  private async applyVisibilityRules(
    objects: ObjectConfig[]
  ): Promise<ObjectConfig[]> {
    try {
      // Get all categories with visibility information
      const categories = await apiWithCache.getAllCategories();
      const visibleCategoryIds = new Set(
        categories.filter((cat) => cat.visible).map((cat) => cat.id)
      );

      // Mark objects as non-interactable if their category is not visible
      const processedObjects = objects.map((obj) => {
        if (!obj.contentType) return obj; // Non-content objects remain as-is

        // If category is not visible, make it non-interactable
        if (!visibleCategoryIds.has(obj.contentType)) {
          return {
            ...obj, // keep all visual properties (position, model, color, etc.)
            isInteractive: false, // makes it non-interactable
          };
        }

        return obj;
      });

      return processedObjects;
    } catch (error) {
      console.error("Failed to apply visibility rules:", error);
      // Fallback: return all objects unchanged if visibility check fails
      return objects;
    }
  }

  /**
   * Initialize the 3D scene with a theme
   */
  async initialize(container: HTMLElement, theme: ThemeConfig): Promise<void> {
    if (this._isInitialized) {
      throw new Error("Scene3DManager is already initialized");
    }

    this._container = container;
    this._currentTheme = theme;

    console.log(
      `🎬 Initializing 3D scene with theme: ${theme.metadata.displayName}`
    );

    // Initialize scene manager
    await this._sceneManager.initialize(container, theme.scene);

    if (
      !this._sceneManager.scene ||
      !this._sceneManager.camera ||
      !this._sceneManager.renderer
    ) {
      throw new Error("Failed to initialize scene manager");
    }

    // Initialize object manager
    this._objectManager.initialize(this._sceneManager.scene);

    // Initialize effects manager
    await this._effectsManager.initialize(
      this._sceneManager.scene,
      this._sceneManager.renderer,
      theme.lighting,
      theme.particles
    );

    // Initialize interaction manager
    this._interactionManager.initialize(
      this._sceneManager.camera,
      this._objectManager
    );

    // Apply visibility rules to objects (makes non-visible categories non-interactable)
    const processedObjects = await this.applyVisibilityRules(theme.objects);

    // Preload assets
    await this._preloaderService.preloadAssets(processedObjects);

    // Create objects after preloading
    await this._objectManager.createObjectsFromConfig(processedObjects);

    // Start animation loop
    this._sceneManager.startAnimation();

    this._isInitialized = true;
    console.log("✅ Scene3DManager initialized successfully");
  }

  /**
   * Update animations (called from scene manager)
   */
  private updateAnimations(deltaTime: number): void {
    // Update object animations
    this._objectManager.updateAnimations(deltaTime);

    // Update effects with camera position for LOD
    const cameraPosition = this._sceneManager.getCameraPosition();
    if (cameraPosition) {
      this._effectsManager.update(deltaTime, cameraPosition);
    }
  }

  /**
   * Switch to a different theme
   */
  async switchTheme(theme: ThemeConfig): Promise<void> {
    if (!this._isInitialized) {
      throw new Error("Scene3DManager not initialized");
    }

    console.log(`🎨 Switching to theme: ${theme.metadata.displayName}`);

    // Clear current objects
    // Note: This would need to be implemented in ObjectManager
    // this._objectManager.clearAllObjects();

    // Update theme
    this._currentTheme = theme;

    // Apply visibility rules to objects (makes non-visible categories non-interactable)
    const processedObjects = await this.applyVisibilityRules(theme.objects);

    // Preload new assets
    await this._preloaderService.preloadAssets(processedObjects);

    // Create new objects
    await this._objectManager.createObjectsFromConfig(processedObjects);

    console.log("✅ Theme switched successfully");
  }

  /**
   * Reset camera to default position
   */
  resetCamera(): void {
    this._sceneManager.resetCamera();
  }

  /**
   * Toggle day/night mode
   */
  toggleDayNightMode(): void {
    this._effectsManager.toggleDayNightMode();
  }

  /**
   * Get current lighting mode
   */
  getCurrentLightingMode(): "day" | "night" {
    return this._effectsManager.getCurrentLightingMode();
  }

  /**
   * Set modal open state (disables interactions)
   */
  setModalOpen(isOpen: boolean): void {
    this._interactionManager.setModalOpen(isOpen);
    this._sceneManager.setControlsEnabled(!isOpen);
  }

  /**
   * Load content for an interactive object
   */
  async loadContentForObject(object: InteractiveObject): Promise<any[]> {
    try {
      console.log("Loading content for:", object.contentType);

      let content: ContentItem<any>[] = await apiWithCache.getByCategory(
        object.contentType
      );

      console.log("Loaded content:", content);
      return content;
    } catch (error) {
      console.error("Failed to load content:", error);
      return [];
    }
  }

  /**
   * Get the title for a content type
   */
  getObjectTitle(contentType: NullableSchemaType): string {
    switch (contentType) {
      case "project":
        return "My Projects";
      case "blog-post":
        return "Blog Posts";
      case "work-in-progress":
        return "Work in Progress";
      case "collaboration":
        return "Collaborations";
      case "learning-path":
        return "Learning Paths";
      case "fun-fact":
        return "Fun Facts";
      default:
        return "Unknown";
    }
  }

  /**
   * Set hover callback
   */
  onObjectHover(callback: (object: InteractiveObject | null) => void): void {
    this._onObjectHover = callback;
  }

  /**
   * Set click callback
   */
  onObjectClick(
    callback: (object: InteractiveObject, event: InteractionEvent) => void
  ): void {
    this._onObjectClick = callback;
  }

  /**
   * Set preload progress callback
   */
  onPreloadProgress(callback: (state: PreloaderState) => void): void {
    this._onPreloadProgress = callback;
  }

  /**
   * Set preload complete callback
   */
  onPreloadComplete(callback: () => void): void {
    this._onPreloadComplete = callback;
  }

  /**
   * Get current hover object
   */
  getCurrentHoveredObject(): InteractiveObject | null {
    return this._interactionManager.getCurrentHoveredObject();
  }

  /**
   * Get preloader state
   */
  getPreloaderState(): PreloaderState {
    return this._preloaderService.getState();
  }

  /**
   * Check if currently loading
   */
  isLoading(): boolean {
    return this._preloaderService.isLoading();
  }

  /**
   * Get scene statistics
   */
  getStats() {
    return {
      scene: this._sceneManager.isInitialized,
      objects: this._objectManager.getStats(),
      effects: this._effectsManager.getStats(),
      interactions: this._interactionManager.getStats(),
      preloader: this._preloaderService.getState(),
      theme: this._currentTheme?.metadata.displayName || "None",
    };
  }

  /**
   * Dispose of all services and clean up
   */
  dispose(): void {
    this._sceneManager.stopAnimation();

    this._interactionManager.dispose();
    this._effectsManager.dispose();
    this._objectManager.dispose();
    this._modelLoader.dispose();
    this._sceneManager.dispose();
    this._preloaderService.dispose();

    this._isInitialized = false;
    this._currentTheme = null;
    this._container = null;

    // Clear callbacks
    this._onObjectHover = null;
    this._onObjectClick = null;
    this._onPreloadProgress = null;
    this._onPreloadComplete = null;

    console.log("🗑️ Scene3DManager disposed");
  }

  // Getters for accessing services if needed
  get sceneManager(): SceneManager {
    return this._sceneManager;
  }

  get effectsManager(): EffectsManager {
    return this._effectsManager;
  }

  get interactionManager(): InteractionManager {
    return this._interactionManager;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  get currentTheme(): ThemeConfig | null {
    return this._currentTheme;
  }
}
