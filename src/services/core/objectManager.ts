import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import type {
  ObjectConfig,
  InteractiveObject,
  AnimationMixerState,
  TextConfig,
  AnimationConfig,
} from ".";
import { ModelLoader } from ".";

/**
 * Service for managing 3D objects in the scene
 * Handles object creation, animations, interactions, and lifecycle management
 */
export class ObjectManager {
  private _modelLoader: ModelLoader;
  private _scene: THREE.Scene | null = null;
  private _interactiveObjects: InteractiveObject[] = [];
  private _interactiveMeshes: THREE.Mesh[] = [];
  private _animationMixers = new Map<string, AnimationMixerState>();
  private _objectMap = new Map<string, THREE.Object3D>();
  private _lastTime = 0;

  constructor(modelLoader: ModelLoader) {
    this._modelLoader = modelLoader;
  }

  /**
   * Initialize the object manager with a scene
   */
  initialize(scene: THREE.Scene): void {
    this._scene = scene;
    this._lastTime = Date.now() * 0.001;
  }

  /**
   * Create all objects from configuration array
   */
  async createObjectsFromConfig(objectsConfig: ObjectConfig[]): Promise<void> {
    if (!this._scene) {
      throw new Error("ObjectManager not initialized with scene");
    }

    console.log(`🎯 Creating ${objectsConfig.length} objects...`);

    for (const [index, config] of objectsConfig.entries()) {
      const isInteractive =
        config.isInteractive !== false && config.contentType !== "";
      const uniqueId = `${config.type}_${index}_${Date.now()}_${Math.random()}`;

      try {
        console.log(
          `🔄 Loading object for ${config.type}${
            isInteractive ? " (interactive)" : " (decorative)"
          }...`
        );

        let objectToAdd: THREE.Object3D;

        // Handle text objects
        if (config.type === "text" && config.text) {
          console.log(`📝 Creating 3D text: "${config.text.content}"`);
          objectToAdd = await this.createTextObject(config.text);
        }
        // Handle 3D model objects
        else if (config.modelPath) {
          console.log(`🎨 Loading 3D model: ${config.modelPath}`);
          objectToAdd = await this._modelLoader.loadModel(config.modelPath);
        }
        // Invalid configuration
        else {
          throw new Error(
            `Invalid object configuration: no modelPath or text config for ${config.type}`
          );
        }

        // Apply transformation
        this.applyObjectTransformation(objectToAdd, config);

        // Setup object data
        this.setupObjectUserData(
          objectToAdd,
          config,
          uniqueId,
          index,
          isInteractive
        );

        // Add to scene
        this._scene.add(objectToAdd);
        this._objectMap.set(uniqueId, objectToAdd);

        // Setup animations if it's a GLB model
        if (
          objectToAdd instanceof THREE.Group &&
          objectToAdd.userData.gltfAnimations
        ) {
          this.setupObjectAnimations(objectToAdd, config, uniqueId);
        }

        // Add to interactive objects if needed
        if (isInteractive) {
          this.addToInteractiveObjects(objectToAdd, config, uniqueId, index);
        }

        console.log(
          `✅ Successfully created object for ${
            config.type
          } (ID: ${uniqueId}) - ${isInteractive ? "Interactive" : "Decorative"}`
        );
      } catch (error) {
        console.warn(
          `⚠️ Failed to create object for ${config.type}, using fallback:`,
          error
        );

        // Create fallback object
        const fallbackObject = this.createFallbackObject(config.type);
        this.applyObjectTransformation(fallbackObject, config);
        this.setupObjectUserData(
          fallbackObject,
          config,
          uniqueId,
          index,
          isInteractive
        );

        this._scene.add(fallbackObject);
        this._objectMap.set(uniqueId, fallbackObject);

        if (isInteractive) {
          this.addToInteractiveObjects(fallbackObject, config, uniqueId, index);
        }

        console.log(
          `✅ Using fallback geometry for ${config.type} (ID: ${uniqueId}) - ${
            isInteractive ? "Interactive" : "Decorative"
          }`
        );
      }
    }

    console.log(
      `🎯 Created ${this._interactiveObjects.length} interactive objects and ${
        objectsConfig.length - this._interactiveObjects.length
      } decorative objects`
    );
  }

  /**
   * Create a text object from configuration
   */
  private async createTextObject(
    textConfig: TextConfig
  ): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      const fontLoader = new FontLoader();
      const fontUrl =
        "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json";

      fontLoader.load(
        fontUrl,
        (font) => {
          try {
            const lines = textConfig.content
              .split("\n")
              .filter((line) => line.trim().length > 0);
            const lineHeight =
              (textConfig.size || 1) * (textConfig.lineSpacing || 1.2);
            const textGroup = new THREE.Group();

            lines.forEach((line, index) => {
              const lineGeometry = new TextGeometry(line.trim(), {
                font: font,
                size: textConfig.size || 1,
                height: textConfig.height || 0.1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5,
              });

              lineGeometry.computeBoundingBox();
              const lineBoundingBox = lineGeometry.boundingBox!;

              // Apply horizontal alignment
              if (textConfig.alignment?.horizontal === "center") {
                lineGeometry.translate(
                  -(lineBoundingBox.max.x + lineBoundingBox.min.x) / 2,
                  0,
                  0
                );
              } else if (textConfig.alignment?.horizontal === "left") {
                lineGeometry.translate(-lineBoundingBox.min.x, 0, 0);
              } else if (textConfig.alignment?.horizontal === "right") {
                lineGeometry.translate(-lineBoundingBox.max.x, 0, 0);
              }

              const material = this.createTextMaterial(textConfig);
              const lineMesh = new THREE.Mesh(lineGeometry, material);

              lineMesh.castShadow = true;
              lineMesh.receiveShadow = true;

              // Position line vertically
              const yOffset =
                (lines.length - 1 - index) * lineHeight -
                ((lines.length - 1) * lineHeight) / 2;
              lineMesh.position.y = yOffset;

              textGroup.add(lineMesh);
            });

            // Apply vertical alignment to the entire group
            this.applyVerticalAlignment(
              textGroup,
              textConfig.alignment?.vertical
            );

            textGroup.userData.textContent = textConfig.content;
            textGroup.userData.isTextMesh = true;

            console.log(
              `✅ Created advanced multi-line text group: "${textConfig.content}" (${lines.length} lines)`
            );
            resolve(textGroup);
          } catch (error) {
            console.error("❌ Failed to create advanced text geometry:", error);
            reject(error);
          }
        },
        undefined,
        (error) => {
          console.warn("⚠️ Failed to load font, using simple text:", error);
          // Fallback to simple text creation
          resolve(this.createSimpleTextObject(textConfig));
        }
      );
    });
  }

  /**
   * Create a simple text object as fallback
   */
  private createSimpleTextObject(textConfig: TextConfig): THREE.Mesh {
    const width = textConfig.content.length * 0.6 * (textConfig.size || 1);
    const height = 1 * (textConfig.size || 1);
    const depth = textConfig.height || 0.1;

    const geometry = new THREE.BoxGeometry(width, height, depth);

    // Apply alignment by translating geometry
    this.applyGeometryAlignment(geometry, textConfig.alignment, width, height);

    const material = this.createTextMaterial(textConfig);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.textContent = textConfig.content;
    mesh.userData.isTextMesh = true;

    return mesh;
  }

  /**
   * Create material for text objects
   */
  private createTextMaterial(
    textConfig: TextConfig
  ): THREE.MeshStandardMaterial {
    const materialProps: any = {
      color: textConfig.material?.color || "#ffffff",
    };

    if (textConfig.material?.emissive) {
      materialProps.emissive = textConfig.material.emissive;
    }
    if (textConfig.material?.metalness !== undefined) {
      materialProps.metalness = textConfig.material.metalness;
    }
    if (textConfig.material?.roughness !== undefined) {
      materialProps.roughness = textConfig.material.roughness;
    }

    return new THREE.MeshStandardMaterial(materialProps);
  }

  /**
   * Apply vertical alignment to a text group
   */
  private applyVerticalAlignment(
    textGroup: THREE.Group,
    alignment?: "top" | "middle" | "bottom"
  ): void {
    if (!alignment || alignment === "middle") return;

    const groupBox = new THREE.Box3().setFromObject(textGroup);
    let verticalOffset = 0;

    switch (alignment) {
      case "top":
        verticalOffset = -groupBox.max.y;
        break;
      case "bottom":
        verticalOffset = -groupBox.min.y;
        break;
    }

    if (verticalOffset !== 0) {
      textGroup.position.y = verticalOffset;
    }
  }

  /**
   * Apply alignment to geometry
   */
  private applyGeometryAlignment(
    geometry: THREE.BufferGeometry,
    alignment: any,
    width: number,
    height: number
  ): void {
    if (!alignment) return;

    let offsetX = 0;
    let offsetY = 0;

    // Horizontal alignment
    switch (alignment.horizontal) {
      case "left":
        offsetX = width / 2;
        break;
      case "right":
        offsetX = -width / 2;
        break;
    }

    // Vertical alignment
    switch (alignment.vertical) {
      case "top":
        offsetY = -height / 2;
        break;
      case "bottom":
        offsetY = height / 2;
        break;
    }

    if (offsetX !== 0 || offsetY !== 0) {
      geometry.translate(offsetX, offsetY, 0);
    }
  }

  /**
   * Apply transformation to an object
   */
  private applyObjectTransformation(
    object: THREE.Object3D,
    config: ObjectConfig
  ): void {
    object.position.set(...config.position);
    object.rotation.set(...config.rotation);
    object.scale.setScalar(config.scale);
  }

  /**
   * Setup user data for an object
   */
  private setupObjectUserData(
    object: THREE.Object3D,
    config: ObjectConfig,
    uniqueId: string,
    index: number,
    isInteractive: boolean
  ): void {
    object.userData = {
      ...object.userData,
      index,
      type: config.type,
      contentType: config.contentType,
      originalPosition: config.position,
      originalRotation: config.rotation,
      originalScale: config.scale,
      config: JSON.parse(JSON.stringify(config)),
      objectId: uniqueId,
      isInteractive,
    };

    // Handle child meshes
    if (object instanceof THREE.Group) {
      object.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.userData = {
            parentType: config.type,
            parentId: uniqueId,
            parentIndex: index,
            isInteractive,
          };

          if (isInteractive) {
            this._interactiveMeshes.push(child);
          }
        }
      });
    } else if (object instanceof THREE.Mesh) {
      object.userData = {
        ...object.userData,
        parentType: config.type,
        parentId: uniqueId,
        parentIndex: index,
        isInteractive,
        index,
      };

      if (isInteractive) {
        this._interactiveMeshes.push(object);
      }
    }
  }

  /**
   * Setup animations for an object
   */
  private setupObjectAnimations(
    object: THREE.Group,
    config: ObjectConfig,
    objectId: string
  ): void {
    console.log(`🎬 Setting up animations for ${objectId}`, {
      hasAnimations: !!object.userData.gltfAnimations,
      playOnHover: config.animation.glb.playOnHover,
      animationCount: object.userData.gltfAnimations?.length || 0,
    });

    if (!object.userData.gltfAnimations || !config.animation.glb.playOnHover) {
      console.log(
        `⚠️ Skipping animation setup for ${objectId}: no animations or playOnHover disabled`
      );
      return;
    }

    try {
      const animations: THREE.AnimationClip[] = object.userData.gltfAnimations;
      const mixer = new THREE.AnimationMixer(object);
      const actions: THREE.AnimationAction[] = [];

      animations.forEach((clip, index) => {
        try {
          const clonedClip = clip.clone();

          // Use specific animation name if provided, otherwise use first animation
          if (config.animation.glb.animationName) {
            if (clonedClip.name === config.animation.glb.animationName) {
              const action = mixer.clipAction(clonedClip);
              this.configureAnimationAction(action, config.animation.glb);
              actions.push(action);
            }
          } else if (index === 0) {
            const action = mixer.clipAction(clonedClip);
            this.configureAnimationAction(action, config.animation.glb);
            actions.push(action);
          }
        } catch (clipError) {
          console.warn(
            `⚠️ Failed to setup animation clip "${clip.name}" for ${config.type}:`,
            clipError
          );
        }
      });

      if (actions.length > 0) {
        this._animationMixers.set(objectId, {
          mixer,
          actions,
          isPlaying: false,
        });
        console.log(
          `🎬 Setup ${actions.length} animations for ${config.type} (${objectId})`
        );
      }
    } catch (error) {
      console.warn(`⚠️ Failed to setup animations for ${config.type}:`, error);
    }
  }

  /**
   * Configure an animation action
   */
  private configureAnimationAction(
    action: THREE.AnimationAction,
    glbConfig: any
  ): void {
    action.setLoop(
      glbConfig.loop ? THREE.LoopRepeat : THREE.LoopOnce,
      Infinity
    );
    action.timeScale = glbConfig.speed;
  }

  /**
   * Add object to interactive objects list
   */
  private addToInteractiveObjects(
    _object: THREE.Object3D,
    config: ObjectConfig,
    uniqueId: string,
    _index: number
  ): void {
    this._interactiveObjects.push({
      id: uniqueId,
      type: config.type as any,
      position: config.position as [number, number, number],
      rotation: config.rotation as [number, number, number],
      scale: [config.scale, config.scale, config.scale],
      contentType: config.contentType as any,
      isHovered: false,
      isClicked: false,
    });
  }

  /**
   * Create a fallback object for failed model loads
   */
  private createFallbackObject(type: string): THREE.Mesh {
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;

    switch (type) {
      case "crystal":
        geometry = new THREE.ConeGeometry(0.5, 2, 6);
        material = new THREE.MeshPhongMaterial({
          color: 0x6366f1,
          transparent: true,
          opacity: 0.8,
          emissive: 0x1a1a40,
        });
        break;
      case "cauldron":
        geometry = new THREE.SphereGeometry(0.8, 16, 16);
        material = new THREE.MeshStandardMaterial({
          color: 0x4a5568,
          metalness: 0.7,
          roughness: 0.3,
        });
        break;
      case "book":
        geometry = new THREE.BoxGeometry(1, 0.2, 1.4);
        material = new THREE.MeshPhongMaterial({
          color: 0x8b4513,
          emissive: 0x2d1810,
        });
        break;
      case "circle":
        geometry = new THREE.TorusGeometry(1, 0.1, 8, 16);
        material = new THREE.MeshPhongMaterial({
          color: 0xd946ef,
          emissive: 0x3d1a47,
        });
        break;
      case "library":
        geometry = new THREE.BoxGeometry(1.5, 2, 0.3);
        material = new THREE.MeshPhongMaterial({
          color: 0x059669,
          emissive: 0x0d2818,
        });
        break;
      case "owl":
        geometry = new THREE.SphereGeometry(0.6, 16, 16);
        material = new THREE.MeshPhongMaterial({
          color: 0xfbbf24,
          emissive: 0x451a03,
        });
        break;
      case "room":
        geometry = new THREE.BoxGeometry(20, 8, 20);
        material = new THREE.MeshStandardMaterial({
          color: 0x2d2d2d,
          roughness: 0.8,
          metalness: 0.1,
        });
        break;
      case "lectern":
        geometry = new THREE.CylinderGeometry(0.5, 0.8, 1.5, 8);
        material = new THREE.MeshStandardMaterial({
          color: 0x8b4513,
          roughness: 0.6,
          metalness: 0.2,
        });
        break;
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
        material = new THREE.MeshPhongMaterial({ color: 0x888888 });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.isFallback = true;

    return mesh;
  }

  /**
   * Update all object animations
   */
  updateAnimations(_deltaTime: number): void {
    const currentTime = Date.now() * 0.001;
    const actualDelta = currentTime - this._lastTime;
    this._lastTime = currentTime;

    // Update animation mixers
    this._animationMixers.forEach((mixerState) => {
      mixerState.mixer.update(actualDelta);
    });

    // Update object animations based on configuration
    this._interactiveObjects.forEach((interactiveObj) => {
      const object = this._objectMap.get(interactiveObj.id);
      if (!object) return;

      const config = object.userData.config as ObjectConfig;
      if (!config) return;

      this.updateObjectAnimation(object, config.animation, currentTime);
    });
  }

  /**
   * Update animation for a single object
   */
  private updateObjectAnimation(
    object: THREE.Object3D,
    config: AnimationConfig,
    time: number
  ): void {
    // Floating animation
    if (config.floating.enabled) {
      const baseY = object.userData.originalPosition[1];
      object.position.y =
        baseY +
        Math.sin(time * config.floating.speed) * config.floating.amplitude;
    }

    // Rotation animation
    if (config.rotation.enabled) {
      object.rotation.y += config.rotation.speed;
    }
  }

  /**
   * Play hover animation for an object
   */
  playHoverAnimation(objectId: string): void {
    const mixerState = this._animationMixers.get(objectId);
    if (
      !mixerState || // No animation mixer found
      mixerState.isPlaying // Animation already playing
    ) {
      return;
    }

    mixerState.actions.forEach((action) => {
      action.reset();
      action.play();
    });
    mixerState.isPlaying = true;
  }

  /**
   * Stop hover animation for an object
   */
  stopHoverAnimation(objectId: string): void {
    const mixerState = this._animationMixers.get(objectId);
    if (mixerState && mixerState.isPlaying) {
      mixerState.actions.forEach((action) => {
        action.fadeOut(0.3);
      });
      mixerState.isPlaying = false;
    }
  }

  /**
   * Get interactive objects
   */
  getInteractiveObjects(): InteractiveObject[] {
    return this._interactiveObjects;
  }

  /**
   * Get interactive meshes for raycasting
   */
  getInteractiveMeshes(): THREE.Mesh[] {
    return this._interactiveMeshes;
  }

  /**
   * Get object by ID
   */
  getObjectById(id: string): THREE.Object3D | null {
    return this._objectMap.get(id) || null;
  }

  /**
   * Update hover state for objects
   */
  updateHoverStates(hoveredObjectId: string | null): void {
    this._interactiveObjects.forEach((obj) => {
      obj.isHovered = obj.id === hoveredObjectId;
    });
  }

  /**
   * Apply hover scale effect to an object
   */
  applyHoverScale(objectId: string): void {
    const object3D = this._objectMap.get(objectId);
    if (
      object3D &&
      object3D.userData &&
      typeof object3D.userData.originalScale === "number"
    ) {
      object3D.scale.setScalar(
        object3D.userData.originalScale *
          ((object3D.userData.config as ObjectConfig).animation.hover
            .scaleMultiplier || 1.15)
      );
    }
  }

  /**
   * Reset scale for an object
   */
  resetScale(objectId: string): void {
    const object3D = this._objectMap.get(objectId);
    if (
      object3D &&
      object3D.userData &&
      typeof object3D.userData.originalScale === "number"
    ) {
      object3D.scale.setScalar(object3D.userData.originalScale);
    }
  }

  /**
   * Dispose of all objects and clean up resources
   */
  dispose(): void {
    // Dispose of animation mixers
    this._animationMixers.forEach((mixerState) => {
      mixerState.mixer.stopAllAction();
    });
    this._animationMixers.clear();

    // Clear object references
    this._objectMap.clear();
    this._interactiveObjects.length = 0;
    this._interactiveMeshes.length = 0;

    console.log("🗑️ ObjectManager disposed");
  }

  /**
   * Get statistics about managed objects
   */
  getStats(): {
    totalObjects: number;
    interactiveObjects: number;
    decorativeObjects: number;
    activeAnimations: number;
  } {
    return {
      totalObjects: this._objectMap.size,
      interactiveObjects: this._interactiveObjects.length,
      decorativeObjects: this._objectMap.size - this._interactiveObjects.length,
      activeAnimations: this._animationMixers.size,
    };
  }
}
