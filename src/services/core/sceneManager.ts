import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type {
  SceneConfig,
  CameraConfig,
  RendererConfig,
  ControlsConfig,
  FogConfig,
} from ".";

/**
 * Core service for managing the Three.js scene, camera, renderer, and controls
 * This service handles the fundamental 3D scene setup and provides a clean API for scene management
 */
export class SceneManager {
  private _scene: THREE.Scene | null = null;
  private _camera: THREE.PerspectiveCamera | null = null;
  private _renderer: THREE.WebGLRenderer | null = null;
  private _controls: OrbitControls | null = null;
  private _container: HTMLElement | null = null;
  private _animationId: number | null = null;
  private _isInitialized = false;

  // Event callbacks
  private _onRenderCallback: ((deltaTime: number) => void) | null = null;
  private _onResizeCallback: (() => void) | null = null;

  constructor() {
    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);
  }

  /**
   * Initialize the scene with the provided configuration
   */
  async initialize(container: HTMLElement, config: SceneConfig): Promise<void> {
    if (this._isInitialized) {
      throw new Error("SceneManager is already initialized");
    }

    this._container = container;

    // Create scene
    this._scene = new THREE.Scene();

    // Setup fog if provided
    if (config.fog) {
      this.setupFog(config.fog);
    }

    // Setup camera
    this.setupCamera(config.camera);

    // Setup renderer
    this.setupRenderer(config.renderer);

    // Setup controls
    this.setupControls(config.controls);

    // Setup event listeners
    window.addEventListener("resize", this.handleResize);

    this._isInitialized = true;
  }

  /**
   * Setup the camera with the provided configuration
   */
  private setupCamera(config: CameraConfig): void {
    this._camera = new THREE.PerspectiveCamera(
      config.fov,
      config.aspect || window.innerWidth / window.innerHeight,
      config.near,
      config.far
    );
    this._camera.position.set(...config.position);
  }

  /**
   * Setup the renderer with the provided configuration
   */
  private setupRenderer(config: RendererConfig): void {
    if (!this._container) {
      throw new Error("Container not set");
    }

    this._renderer = new THREE.WebGLRenderer({
      antialias: config.antialias,
      alpha: config.alpha,
    });

    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.setPixelRatio(window.devicePixelRatio);

    // Shadow configuration
    this._renderer.shadowMap.enabled = config.shadowMapEnabled;

    switch (config.shadowMapType) {
      case "basic":
        this._renderer.shadowMap.type = THREE.BasicShadowMap;
        break;
      case "pcf":
        this._renderer.shadowMap.type = THREE.PCFShadowMap;
        break;
      case "pcfSoft":
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        break;
      case "vsm":
        this._renderer.shadowMap.type = THREE.VSMShadowMap;
        break;
    }

    // Set color space
    if (config.outputColorSpace === "srgb") {
      this._renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    // Style the canvas
    this._renderer.domElement.style.position = "absolute";
    this._renderer.domElement.style.top = "0";
    this._renderer.domElement.style.left = "0";
    this._renderer.domElement.style.zIndex = "1";
    this._renderer.domElement.style.width = "100%";
    this._renderer.domElement.style.height = "100%";
    this._renderer.domElement.style.pointerEvents = "auto";

    this._container.appendChild(this._renderer.domElement);
  }

  /**
   * Setup the orbit controls with the provided configuration
   */
  private setupControls(config: ControlsConfig): void {
    if (!this._camera || !this._renderer) {
      throw new Error(
        "Camera and renderer must be initialized before controls"
      );
    }

    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping = config.enableDamping;
    this._controls.dampingFactor = config.dampingFactor;
    this._controls.screenSpacePanning = config.screenSpacePanning;
    this._controls.enablePan = config.enablePan;
    this._controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: null, // disable right click
    };
    this._controls.minDistance = config.minDistance;
    this._controls.maxDistance = config.maxDistance;
    this._controls.maxPolarAngle = config.maxPolarAngle;
  }

  /**
   * Setup fog for the scene
   */
  private setupFog(config: FogConfig): void {
    if (!this._scene) {
      throw new Error("Scene must be initialized before fog");
    }

    this._scene.fog = new THREE.Fog(config.color, config.near, config.far);
  }

  /**
   * Start the animation loop
   */
  startAnimation(): void {
    if (!this._isInitialized) {
      throw new Error(
        "SceneManager must be initialized before starting animation"
      );
    }

    this.animate();
  }

  /**
   * Stop the animation loop
   */
  stopAnimation(): void {
    if (this._animationId) {
      cancelAnimationFrame(this._animationId);
      this._animationId = null;
    }
  }

  /**
   * Animation loop
   */
  private animate(): void {
    this._animationId = requestAnimationFrame(this.animate);

    const deltaTime = 0.016; // Approximate 60 FPS delta time

    // Update controls
    if (this._controls) {
      this._controls.update();
    }

    // Call the render callback if provided
    if (this._onRenderCallback) {
      this._onRenderCallback(deltaTime);
    }

    // Render the scene
    if (this._scene && this._camera && this._renderer) {
      this._renderer.render(this._scene, this._camera);
    }
  }

  /**
   * Handle window resize
   */
  private handleResize(): void {
    if (!this._camera || !this._renderer) return;

    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);

    if (this._onResizeCallback) {
      this._onResizeCallback();
    }
  }

  /**
   * Reset camera to default position
   */
  resetCamera(): void {
    if (!this._camera || !this._controls) return;

    // Reset to default position (can be made configurable)
    this._camera.position.set(0, 5, 15);
    this._controls.reset();
  }

  /**
   * Enable or disable controls
   */
  setControlsEnabled(enabled: boolean): void {
    if (this._controls) {
      this._controls.enabled = enabled;
    }
  }

  /**
   * Set the render callback function
   */
  onRender(callback: (deltaTime: number) => void): void {
    this._onRenderCallback = callback;
  }

  /**
   * Set the resize callback function
   */
  onResize(callback: () => void): void {
    this._onResizeCallback = callback;
  }

  /**
   * Add an object to the scene
   */
  addToScene(object: THREE.Object3D): void {
    if (!this._scene) {
      throw new Error("Scene not initialized");
    }
    this._scene.add(object);
  }

  /**
   * Remove an object from the scene
   */
  removeFromScene(object: THREE.Object3D): void {
    if (!this._scene) {
      throw new Error("Scene not initialized");
    }
    this._scene.remove(object);
  }

  /**
   * Get the current camera position for LOD calculations
   */
  getCameraPosition(): THREE.Vector3 | null {
    return this._camera ? this._camera.position.clone() : null;
  }

  /**
   * Create a raycaster from the camera
   */
  createRaycaster(mouse: THREE.Vector2): THREE.Raycaster {
    if (!this._camera) {
      throw new Error("Camera not initialized");
    }

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this._camera);
    return raycaster;
  }

  /**
   * Dispose of all resources
   */
  dispose(): void {
    this.stopAnimation();

    // Remove event listeners
    window.removeEventListener("resize", this.handleResize);

    // Dispose of controls
    if (this._controls) {
      this._controls.dispose();
      this._controls = null;
    }

    // Dispose of renderer
    if (this._renderer) {
      if (this._container && this._renderer.domElement.parentNode) {
        this._container.removeChild(this._renderer.domElement);
      }
      this._renderer.dispose();
      this._renderer = null;
    }

    // Clear references
    this._scene = null;
    this._camera = null;
    this._container = null;
    this._onRenderCallback = null;
    this._onResizeCallback = null;
    this._isInitialized = false;
  }

  // Getters for accessing the core Three.js objects
  get scene(): THREE.Scene | null {
    return this._scene;
  }

  get camera(): THREE.PerspectiveCamera | null {
    return this._camera;
  }

  get renderer(): THREE.WebGLRenderer | null {
    return this._renderer;
  }

  get controls(): OrbitControls | null {
    return this._controls;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  /**
   * Create a default scene configuration
   */
  static createDefaultConfig(): SceneConfig {
    return {
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
  }
}
