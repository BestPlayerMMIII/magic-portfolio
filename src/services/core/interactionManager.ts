import * as THREE from "three";
import type { InteractiveObject, InteractionEvent } from ".";
import { ObjectManager } from ".";

/**
 * Service for handling user interactions with 3D objects
 * Manages mouse events, raycasting, hover states, and click handling
 */
export class InteractionManager {
  private _camera: THREE.PerspectiveCamera | null = null;
  private _objectManager: ObjectManager | null = null;
  private _isEnabled = true;
  private _isModalOpen = false;

  // Mouse tracking
  private _mouse = new THREE.Vector2();
  private _raycaster = new THREE.Raycaster();
  private _mouseDownObject: THREE.Mesh | null = null;

  // Hover state
  private _currentHoveredObject: InteractiveObject | null = null;

  // Event callbacks
  private _onObjectHover: ((object: InteractiveObject | null) => void) | null =
    null;
  private _onObjectClick:
    | ((object: InteractiveObject, event: InteractionEvent) => void)
    | null = null;

  constructor() {
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
  }

  /**
   * Initialize the interaction manager
   */
  initialize(
    camera: THREE.PerspectiveCamera,
    objectManager: ObjectManager
  ): void {
    this._camera = camera;
    this._objectManager = objectManager;
    this.setupEventListeners();
  }

  /**
   * Setup all mouse event listeners
   */
  private setupEventListeners(): void {
    window.addEventListener("mousemove", this.handleMouseMove, {
      passive: false,
    });
    window.addEventListener("mousedown", this.handleMouseDown, {
      passive: false,
    });
    window.addEventListener("mouseup", this.handleMouseUp, { passive: false });
    window.addEventListener("wheel", this.handleWheel, { passive: false });
    window.addEventListener("dblclick", this.handleDoubleClick, {
      passive: false,
    });
    window.addEventListener("contextmenu", this.handleContextMenu, {
      passive: false,
    });
  }

  /**
   * Remove all event listeners
   */
  private removeEventListeners(): void {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("wheel", this.handleWheel);
    window.removeEventListener("dblclick", this.handleDoubleClick);
    window.removeEventListener("contextmenu", this.handleContextMenu);
  }

  /**
   * Check if events should be blocked
   */
  private isEventBlocked(event: Event): boolean {
    // Block ALL events when modal is open
    if (this._isModalOpen || !this._isEnabled) {
      event.stopPropagation();
      event.preventDefault();
      return true;
    }

    // Check if click occurred on UI elements
    const target = event.target as HTMLElement;
    const isUIClick =
      target.closest(
        "nav, button, .ui-nav, .ui-button, .ui-title, .nav-container, .ui-overlay, .ui-panel, .ui-hint"
      ) !== null;

    if (isUIClick) {
      // Allow UI interactions but block 3D scene events
      return true;
    }

    return false;
  }

  /**
   * Update mouse coordinates and perform raycasting
   */
  private updateMouseAndRaycast(
    event: MouseEvent
  ): THREE.Intersection[] | null {
    if (!this._camera || !this._objectManager) return null;

    this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this._raycaster.setFromCamera(this._mouse, this._camera);
    return this._raycaster.intersectObjects(
      this._objectManager.getInteractiveMeshes()
    );
  }

  /**
   * Handle mouse move events (hover detection)
   */
  private handleMouseMove(event: MouseEvent): void {
    if (this.isEventBlocked(event)) return;

    const intersects = this.updateMouseAndRaycast(event);
    if (!intersects || !this._objectManager) return;

    // Reset all hover states
    this._objectManager.updateHoverStates(null);
    this._currentHoveredObject = null;

    let currentHoveredObjectId: string | null = null;

    if (intersects.length > 0) {
      const intersected = intersects[0].object as THREE.Mesh;
      const interactiveObjects = this._objectManager.getInteractiveObjects();

      // Get the parent index from userData
      const index =
        intersected.userData.parentIndex !== undefined
          ? intersected.userData.parentIndex
          : intersected.userData.index;

      if (index !== undefined && interactiveObjects[index]) {
        const hoveredObject = interactiveObjects[index];
        currentHoveredObjectId = hoveredObject.id;

        // Update hover state
        this._objectManager.updateHoverStates(currentHoveredObjectId);
        this._currentHoveredObject = hoveredObject;

        // Change cursor
        document.body.style.cursor = "pointer";

        // Trigger hover callback
        if (this._onObjectHover) {
          this._onObjectHover(hoveredObject);
        }
      }
    } else {
      document.body.style.cursor = "default";

      // Trigger hover callback with null
      if (this._onObjectHover) {
        this._onObjectHover(null);
      }
    }

    // Note: Previous object tracking is now handled in Scene3DManager
  }

  /**
   * Handle mouse down events
   */
  private handleMouseDown(event: MouseEvent): void {
    if (this.isEventBlocked(event)) return;

    // Only handle left click
    if (event.button !== 0) return;

    const intersects = this.updateMouseAndRaycast(event);
    if (!intersects) return;

    if (intersects.length > 0) {
      this._mouseDownObject = intersects[0].object as THREE.Mesh;
      console.log(
        "Mouse down on object:",
        this._mouseDownObject.userData.parentType ||
          this._mouseDownObject.userData.type
      );
    } else {
      this._mouseDownObject = null;
    }
  }

  /**
   * Handle mouse up events (click detection)
   */
  private handleMouseUp(event: MouseEvent): void {
    if (this.isEventBlocked(event)) {
      this._mouseDownObject = null;
      return;
    }

    // Only handle left click
    if (event.button !== 0) return;

    const intersects = this.updateMouseAndRaycast(event);
    if (!intersects || !this._objectManager) return;

    console.log("Mouse up detected!");

    if (intersects.length > 0 && this._mouseDownObject) {
      const mouseUpObject = intersects[0].object as THREE.Mesh;

      // Verify it's the same object (complete click)
      if (mouseUpObject === this._mouseDownObject) {
        const interactiveObjects = this._objectManager.getInteractiveObjects();

        // Get the parent index from userData
        const index =
          mouseUpObject.userData.parentIndex !== undefined
            ? mouseUpObject.userData.parentIndex
            : mouseUpObject.userData.index;

        if (index !== undefined && interactiveObjects[index]) {
          const clickedObject = interactiveObjects[index];

          console.log("Click detected! Object:", clickedObject.type);

          // Create interaction event
          const interactionEvent: InteractionEvent = {
            type: "click",
            object: clickedObject,
            raycastResult: {
              object: mouseUpObject,
              point: intersects[0].point,
              distance: intersects[0].distance,
              face: intersects[0].face || undefined,
              faceIndex: intersects[0].faceIndex,
              uv: intersects[0].uv,
            },
            originalEvent: event,
          };

          // Trigger click callback
          if (this._onObjectClick) {
            this._onObjectClick(clickedObject, interactionEvent);
          }
        }
      } else {
        console.log("Click canceled - different objects on down/up");
      }
    } else if (!intersects.length && this._mouseDownObject) {
      console.log("Click canceled - mouse up outside objects");
    }

    // Reset
    this._mouseDownObject = null;
  }

  /**
   * Handle wheel events
   */
  private handleWheel(event: WheelEvent): void {
    if (this.isEventBlocked(event)) return;
    // Wheel events are handled by OrbitControls
  }

  /**
   * Handle double click events
   */
  private handleDoubleClick(event: MouseEvent): void {
    if (this.isEventBlocked(event)) return;
    // Could be used for special double-click interactions
  }

  /**
   * Handle context menu events
   */
  private handleContextMenu(event: MouseEvent): void {
    if (this.isEventBlocked(event)) return;
    // Prevent browser context menu
    event.preventDefault();
  }

  /**
   * Set modal open state (blocks all interactions)
   */
  setModalOpen(isOpen: boolean): void {
    this._isModalOpen = isOpen;

    if (isOpen) {
      // Reset hover states when modal opens
      this._currentHoveredObject = null;
      document.body.style.cursor = "default";

      if (this._objectManager) {
        this._objectManager.updateHoverStates(null);
      }

      if (this._onObjectHover) {
        this._onObjectHover(null);
      }
    }
  }

  /**
   * Enable or disable interactions
   */
  setEnabled(enabled: boolean): void {
    this._isEnabled = enabled;

    if (!enabled) {
      // Reset states when disabled
      this._currentHoveredObject = null;
      document.body.style.cursor = "default";

      if (this._objectManager) {
        this._objectManager.updateHoverStates(null);
      }
    }
  }

  /**
   * Set the object hover callback
   */
  onObjectHover(callback: (object: InteractiveObject | null) => void): void {
    this._onObjectHover = callback;
  }

  /**
   * Set the object click callback
   */
  onObjectClick(
    callback: (object: InteractiveObject, event: InteractionEvent) => void
  ): void {
    this._onObjectClick = callback;
  }

  /**
   * Get the currently hovered object
   */
  getCurrentHoveredObject(): InteractiveObject | null {
    return this._currentHoveredObject;
  }

  /**
   * Force update hover state for an object
   */
  forceHoverState(objectId: string | null): void {
    if (this._objectManager) {
      this._objectManager.updateHoverStates(objectId);
    }

    if (objectId) {
      const interactiveObjects =
        this._objectManager?.getInteractiveObjects() || [];
      this._currentHoveredObject =
        interactiveObjects.find((obj) => obj.id === objectId) || null;
    } else {
      this._currentHoveredObject = null;
    }
  }

  /**
   * Get interaction statistics
   */
  getStats(): {
    enabled: boolean;
    modalOpen: boolean;
    hoveredObject: string | null;
    hasObjectManager: boolean;
  } {
    return {
      enabled: this._isEnabled,
      modalOpen: this._isModalOpen,
      hoveredObject: this._currentHoveredObject?.id || null,
      hasObjectManager: this._objectManager !== null,
    };
  }

  /**
   * Dispose of the interaction manager
   */
  dispose(): void {
    this.removeEventListeners();

    this._camera = null;
    this._objectManager = null;
    this._mouseDownObject = null;
    this._currentHoveredObject = null;
    this._onObjectHover = null;
    this._onObjectClick = null;

    // Reset cursor
    document.body.style.cursor = "default";

    console.log("🗑️ InteractionManager disposed");
  }
}
