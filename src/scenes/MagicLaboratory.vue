<template>
  <div class="w-full h-full relative overflow-hidden">
    <!-- Magical Preloader -->
    <div
      v-if="isPreloading"
      class="absolute inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center"
    >
      <div class="text-center">
        <!-- Magical loading animation -->
        <div class="relative mb-8">
          <div
            class="w-32 h-32 rounded-full border-4 border-purple-300/30 relative"
          >
            <div
              class="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 border-r-pink-400 animate-spin"
              style="animation-duration: 2s"
            ></div>
            <div
              class="absolute inset-2 rounded-full border-4 border-transparent border-t-pink-400 border-r-indigo-400 animate-spin"
              style="animation-duration: 1.5s; animation-direction: reverse"
            ></div>
            <div
              class="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center"
            >
              <span class="text-4xl">✨</span>
            </div>
          </div>
        </div>

        <!-- Progress bar -->
        <div
          class="w-80 h-2 bg-purple-900/50 rounded-full mb-4 overflow-hidden"
        >
          <div
            class="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-300 ease-out"
            :style="{ width: `${preloadProgress}%` }"
          ></div>
        </div>

        <!-- Status text -->
        <p class="text-white text-lg mb-2">{{ preloadStatus }}</p>
        <p class="text-purple-300 text-sm">
          {{ Math.round(preloadProgress) }}% complete
        </p>
      </div>
    </div>

    <!-- Three.js Canvas Container -->
    <div
      ref="threeContainer"
      class="absolute inset-0 w-full h-full"
      style="z-index: 1"
    ></div>

    <!-- Modal Event Interceptor - Elegant Universal Blocker -->
    <div
      v-if="showModal"
      class="absolute inset-0 w-full h-full bg-transparent"
      style="z-index: 999; pointer-events: auto; cursor: default"
      @click.stop.prevent
      @mousedown.stop.prevent
      @mouseup.stop.prevent
      @mousemove.stop.prevent
      @wheel.stop.prevent
      @contextmenu.stop.prevent
      @dblclick.stop.prevent
      @mouseenter.stop.prevent
      @mouseleave.stop.prevent
      @touchstart.stop.prevent
      @touchend.stop.prevent
      @touchmove.stop.prevent
    ></div>

    <!-- UI Overlay - always on top -->
    <div
      class="ui-overlay absolute inset-0 w-full h-full"
      style="pointer-events: none"
    >
      <!-- Top Navigation - Improved Banner -->
      <nav class="flex p-4">
        <div
          class="nav-container flex justify-between items-center transition-all duration-700 ease-in-out"
          :class="
            isNavigationMinimized
              ? 'bg-black/30 backdrop-blur-sm px-6 py-3'
              : 'bg-black/70 backdrop-blur-md px-6 py-4'
          "
          :style="{
            borderRadius: isNavigationMinimized ? '50px' : '16px',
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          }"
        >
          <!-- Logo/Title Section -->
          <div class="flex items-center space-x-4">
            <div
              class="flex items-center space-x-3"
              style="pointer-events: auto; cursor: pointer"
            >
              <div
                @click="toggleNavigation"
                class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
              >
                <span class="text-white text-lg font-bold">✨</span>
              </div>
              <h1
                v-if="!isNavigationMinimized"
                class="ui-title text-2xl font-bold text-white transition-all duration-300"
              >
                <span
                  class="gradient-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
                >
                  Magic Portfolio
                </span>
              </h1>
            </div>
          </div>

          <!-- Actions Section -->
          <div
            v-if="!isNavigationMinimized"
            class="flex items-center space-x-3"
          >
            <!-- Day/Night Mode Toggle -->
            <button
              @click="toggleDayNightMode"
              class="day-night-toggle relative p-3 rounded-xl transition-all duration-300 overflow-hidden group"
              :class="
                isDayMode
                  ? 'bg-orange-500/20 hover:bg-orange-500/30'
                  : 'bg-purple-500/20 hover:bg-purple-500/30'
              "
              style="pointer-events: auto; cursor: pointer"
              :title="isDayMode ? 'Switch to Night Mode' : 'Switch to Day Mode'"
            >
              <!-- Background animation -->
              <div
                class="absolute inset-0 transition-all duration-500"
                :class="
                  isDayMode
                    ? 'bg-gradient-to-r from-yellow-400/10 to-orange-400/10'
                    : 'bg-gradient-to-r from-indigo-400/10 to-purple-400/10'
                "
              ></div>

              <!-- Icon container -->
              <div class="relative z-10 flex items-center justify-center">
                <!-- Day icon (sun) -->
                <div
                  v-if="isDayMode"
                  class="w-6 h-6 text-yellow-400 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
                    />
                  </svg>
                </div>

                <!-- Night icon (moon) -->
                <div
                  v-else
                  class="w-6 h-6 text-indigo-400 transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-12"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                    />
                  </svg>
                </div>
              </div>

              <!-- Ripple effect on click -->
              <div
                class="absolute inset-0 opacity-0 group-active:opacity-20 transition-opacity duration-150 rounded-xl"
                :class="isDayMode ? 'bg-orange-400' : 'bg-purple-400'"
              ></div>
            </button>
          </div>
        </div>
      </nav>

      <!-- Interactive Hints - Enhanced -->
      <div
        v-if="hoveredObject"
        class="ui-hints absolute bottom-32 left-1/2 transform -translate-x-1/2 transition-all duration-300"
      >
        <div
          class="hints-container bg-gradient-to-r from-purple-900/95 to-pink-900/95 backdrop-blur-lg text-white px-8 py-4 rounded-2xl shadow-2xl border border-purple-400/50 relative overflow-hidden"
        >
          <!-- Animated background -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"
          ></div>
          <p class="relative z-10 text-xl font-bold text-center">
            Click to explore
            {{ getObjectTitle(hoveredObject?.contentType || "") }}
          </p>
        </div>
      </div>

      <!-- Collapsible Controls Panel -->
      <div class="ui-instructions absolute bottom-6 left-6">
        <div
          class="instructions-container transition-all duration-500 ease-in-out opacity-100 transform translate-y-0"
          v-if="showControlsPanel"
        >
          <div
            class="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg text-white p-6 rounded-2xl border border-indigo-400/50 shadow-2xl max-w-sm relative overflow-hidden"
          >
            <!-- Close button -->
            <button
              @click="toggleControlsPanel"
              class="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
              style="pointer-events: auto; cursor: pointer"
            >
              <svg
                class="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            <h3
              class="text-lg font-bold mb-4 text-indigo-300 flex items-center"
            >
              <span class="mr-2">🎮</span>
              Controls
            </h3>
            <div class="space-y-3 text-sm">
              <div class="flex items-center p-2 rounded-lg bg-white/5">
                <span class="text-2xl mr-3">🖱️</span>
                <span>Left click + drag to rotate</span>
              </div>
              <div class="flex items-center p-2 rounded-lg bg-white/5">
                <span class="text-2xl mr-3">🔍</span>
                <span>Click objects to explore</span>
              </div>
              <div class="flex items-center p-2 rounded-lg bg-white/5">
                <span class="text-2xl mr-3">🔄</span>
                <span>Mouse wheel to zoom</span>
              </div>
            </div>

            <!-- Reset View Button -->
            <button
              @click="resetCamera"
              class="ui-button group relative overflow-hidden w-full mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-white/20"
              style="pointer-events: auto; cursor: pointer"
            >
              <span
                class="relative z-10 flex items-center justify-center space-x-2 text-sm font-medium"
              >
                <svg
                  class="w-4 h-4 transition-transform group-hover:rotate-180 duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
                <span>Reset View</span>
              </span>
              <div
                class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              ></div>
            </button>
          </div>
        </div>

        <!-- Show Controls Button (when hidden) -->
        <button
          v-else
          @click="toggleControlsPanel"
          class="mt-4 p-3 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl transition-all duration-300 shadow-lg backdrop-blur-sm border border-indigo-400/50"
          style="pointer-events: auto; cursor: pointer"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Magical ambient overlay -->
      <div
        class="magical-overlay absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style="
          background: radial-gradient(
              circle at 20% 80%,
              rgba(99, 102, 241, 0.08) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 20%,
              rgba(217, 70, 239, 0.08) 0%,
              transparent 50%
            );
        "
      ></div>
    </div>

    <!-- Content Modal -->
    <ContentModal
      v-if="showModal"
      :visible="showModal"
      :content="modalContent"
      :type="selectedObject?.contentType || ''"
      :loading="isLoadingContent"
      @close="closeModal"
      style="z-index: 1000"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import apiWithCache from "../services/apiWithCache";
import ContentModal from "../components/ContentModal.vue";
import { objectsConfig } from "../config/objectsConfig";
import { lightingConfig } from "../config/lightingConfig";
import {
  getEnabledParticleSystems,
  type ParticleSystemConfig,
} from "../config/specialEffectsConfig";
import { ParticleSystemManager } from "../services/particleSystemManager";
import {
  LightingManager,
  type LightingMode,
} from "../services/lightingManager";
import type {
  BlogPost,
  Collaboration,
  FunFact,
  InteractiveObject,
  LearningPath,
  Project,
  WorkInProgress,
} from "../types";

// Reactive state
const threeContainer = ref<HTMLDivElement>();
const hoveredObject = ref<InteractiveObject | null>(null);
const selectedObject = ref<InteractiveObject | null>(null);
const showModal = ref(false);
const modalContent = ref<any>(null);
const isLoadingContent = ref(false);

// UI state management
const showControlsPanel = ref(false);
const isNavigationMinimized = ref(true);

// Day/Night mode state
const isDayMode = ref(false); // assume night

// Three.js variables
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: any; // OrbitControls
let animationId: number;
let interactiveObjects: InteractiveObject[] = [];
let meshes: THREE.Mesh[] = [];
let eventCleanup: (() => void) | null = null; // Store cleanup function

// 3D Model loading with enhanced preloading
let gltfLoader: GLTFLoader;
let dracoLoader: DRACOLoader;
const loadedModels = new Map<string, THREE.Group>();
const modelLoadingPromises = new Map<string, Promise<THREE.Group>>();

// Particle system manager
let particleManager: ParticleSystemManager;

// Lighting manager
let lightingManager: LightingManager;

// Time tracking for delta time calculation
let lastTime = 0;

// Preloader state
const isPreloading = ref(true);
const preloadProgress = ref(0);
const preloadStatus = ref("Initializing magical assets...");

// Preload all models at startup
const preloadAllModels = async () => {
  const modelPaths = objectsConfig.map((config) => config.modelPath);
  const totalModels = modelPaths.length;
  let loadedCount = 0;

  preloadStatus.value = "Loading magical artifacts...";

  const loadPromises = modelPaths.map(async (modelPath) => {
    try {
      preloadStatus.value = `Loading ${modelPath.split("/").pop()}...`;
      const model = await loadModel(modelPath);
      loadedCount++;
      preloadProgress.value = (loadedCount / totalModels) * 100;
      preloadStatus.value = `Loaded ${loadedCount}/${totalModels} magical artifacts...`;
      console.log(`✅ Preloaded: ${modelPath}`);
      return model;
    } catch (error) {
      console.warn(`⚠️ Failed to preload ${modelPath}:`, error);
      // Don't fail completely - just log and continue
      loadedCount++;
      preloadProgress.value = (loadedCount / totalModels) * 100;
      preloadStatus.value = `Loaded ${loadedCount}/${totalModels} magical artifacts (some using fallbacks)...`;
      return null;
    }
  });

  await Promise.allSettled(loadPromises); // Use allSettled to wait for all regardless of failures

  preloadStatus.value = "Magic laboratory ready!";
  setTimeout(() => {
    isPreloading.value = false;
  }, 500);
};

// Scene setup with preloading
const initThreeJS = async () => {
  if (!threeContainer.value) return;

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 15);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Canvas positioning - allow Three.js events but with low z-index
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.zIndex = "1";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.pointerEvents = "auto"; // allow events for OrbitControls

  threeContainer.value.appendChild(renderer.domElement);

  // Setup camera controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.enablePan = false; // disable panning
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: null, // disable right click
  };
  controls.minDistance = 5;
  controls.maxDistance = 30;
  controls.maxPolarAngle = Math.PI / 2;

  // Initialize model loaders
  initModelLoaders();

  // Preload all models first
  await preloadAllModels();

  await setupEffects();
  await createAllObjects(); // Wait for models to load
  eventCleanup = setupEventListeners(); // Store cleanup function

  // Initialize time tracking
  lastTime = Date.now() * 0.001;

  animate();
};

// Initialize 3D model loaders
const initModelLoaders = () => {
  // Initialize GLTF loader first
  gltfLoader = new GLTFLoader();

  // Try to initialize DRACO loader for compressed models (optional)
  try {
    dracoLoader = new DRACOLoader();
    // Use CDN for DRACO decoder if local files not available
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
    );
    gltfLoader.setDRACOLoader(dracoLoader);
    console.log("✅ DRACO loader initialized with CDN decoder");
  } catch (error) {
    console.warn(
      "⚠️ DRACO loader failed to initialize, falling back to regular GLB loading:",
      error
    );
  }
};

// Load a 3D model with proper cloning and material isolation
const loadModel = async (modelPath: string): Promise<THREE.Group> => {
  // Check if model is already loaded
  if (loadedModels.has(modelPath)) {
    const originalModel = loadedModels.get(modelPath)!;
    return createDeepClone(originalModel);
  }

  // Check if model is currently being loaded
  if (modelLoadingPromises.has(modelPath)) {
    const originalModel = await modelLoadingPromises.get(modelPath)!;
    return createDeepClone(originalModel);
  }

  // Load the model with timeout
  const loadPromise = new Promise<THREE.Group>((resolve, reject) => {
    // Set a timeout for loading
    const timeout = setTimeout(() => {
      reject(new Error(`Timeout loading model: ${modelPath}`));
    }, 10000); // 10 second timeout

    gltfLoader.load(
      modelPath,
      (gltf) => {
        clearTimeout(timeout);

        // Prepare the original model (this will be cached)
        const originalModel = gltf.scene;

        // Ensure the model has content
        if (!originalModel || originalModel.children.length === 0) {
          reject(new Error(`Empty model: ${modelPath}`));
          return;
        }

        // Enable shadows and prepare materials on the original
        originalModel.traverse((child) => {
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

        // Cache the prepared model
        loadedModels.set(modelPath, originalModel);
        modelLoadingPromises.delete(modelPath);

        console.log(`✅ Loaded 3D model: ${modelPath}`);
        resolve(createDeepClone(originalModel));
      },
      (_progress) => {
        // optional: could implement progress tracking
      },
      (error) => {
        clearTimeout(timeout);
        console.error(`❌ Failed to load model ${modelPath}:`, error);
        modelLoadingPromises.delete(modelPath);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        reject(
          new Error(`Failed to load model: ${modelPath} - ${errorMessage}`)
        );
      }
    );
  });

  modelLoadingPromises.set(modelPath, loadPromise);
  return loadPromise;
};

// Create a proper deep clone with isolated materials and geometries
const createDeepClone = (originalModel: THREE.Group): THREE.Group => {
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

      // Reset any transformations that might be inherited
      child.matrixAutoUpdate = true;
      child.updateMatrix();
    }
  });

  // Ensure the cloned model has its own transform matrix
  clonedModel.matrixAutoUpdate = true;
  clonedModel.updateMatrix();

  return clonedModel;
};

// Fallback to create simple geometric shapes if models fail to load
const createFallbackMesh = (type: string): THREE.Mesh => {
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
      // Large room-like structure
      geometry = new THREE.BoxGeometry(20, 8, 20);
      material = new THREE.MeshStandardMaterial({
        color: 0x2d2d2d,
        roughness: 0.8,
        metalness: 0.1,
      });
      break;
    case "lectern":
      // Lectern-like stand
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

  return mesh;
};

const setupEffects = async () => {
  // Setup special effects and particles
  await setupSpecialEffects();

  // Initialize the lighting manager
  lightingManager = new LightingManager(scene);

  // Set up callback for mode changes affecting particles
  lightingManager.onModeChange((mode: LightingMode) => {
    if (particleManager) {
      // Enable/disable flame particles based on mode
      const nightOnlyPredicate = (config: ParticleSystemConfig) =>
        Boolean(config.tags?.includes("night-only"));
      if (mode === "day") {
        particleManager.setParticleSystemsEnabled(false, nightOnlyPredicate);
      } else {
        particleManager.setParticleSystemsEnabled(true, nightOnlyPredicate);
      }
    }
  });

  // Initialize all lights using the lighting configuration
  lightingManager.initialize(lightingConfig);
  isDayMode.value = lightingManager.getCurrentMode() === "day";

  // Configure global shadow settings
  renderer.shadowMap.enabled = lightingConfig.globalShadowSettings.enabled;
  renderer.shadowMap.autoUpdate =
    lightingConfig.globalShadowSettings.autoUpdate;

  switch (lightingConfig.globalShadowSettings.type) {
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
};

// Setup special effects using the new particle system manager
const setupSpecialEffects = async () => {
  // Initialize the particle system manager
  particleManager = new ParticleSystemManager(scene);

  // Get enabled particle systems from configuration
  const enabledSystems = getEnabledParticleSystems();

  // Initialize particle systems asynchronously
  for (const config of enabledSystems) {
    try {
      const particleSystem = await particleManager.createParticleSystem(config);
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
};

// Update animation to use the new particle system manager
const timeSinceLastLODUpdate = ref(0);
const animateParticles = (deltaTime: number) => {
  if (particleManager) {
    // Update LOD every 12 frames for performance
    // === 5 times per second at 60fps === every 0.2 seconds
    timeSinceLastLODUpdate.value += deltaTime;
    if (timeSinceLastLODUpdate.value > 0.2) {
      timeSinceLastLODUpdate.value = 0;
      particleManager.updateLevelOfDetail(camera.position);
    }

    particleManager.animateParticles(deltaTime);
  }
};

const createAllObjects = async () => {
  // Load all objects using configuration
  for (const [index, config] of objectsConfig.entries()) {
    // Determine if this object should be interactive
    const isInteractive =
      config.isInteractive !== false && config.contentType !== "";

    try {
      console.log(
        `🔄 Loading 3D model for ${config.type}${
          isInteractive ? " (interactive)" : " (decorative)"
        }...`
      );

      // Try to load the 3D model first with proper deep cloning
      const model = await loadModel(config.modelPath);

      // Apply configuration settings
      model.position.set(...config.position);
      model.rotation.set(...config.rotation);
      model.scale.setScalar(config.scale);

      // Create unique userData for this instance (no sharing!)
      const uniqueId = `${config.type}_${index}_${Date.now()}_${Math.random()}`;
      model.userData = {
        index,
        type: config.type,
        contentType: config.contentType,
        originalPosition: config.position, // Keep as array for compatibility
        originalRotation: config.rotation, // Keep as array for compatibility
        originalScale: config.scale,
        config: JSON.parse(JSON.stringify(config)), // Deep clone config to avoid sharing
        objectId: uniqueId,
        isInteractive,
      };

      // Handle child meshes differently for interactive vs decorative objects
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.userData = {
            parentType: config.type,
            parentId: uniqueId,
            parentIndex: index,
            isInteractive,
          };

          // Only add to interactive meshes array if the object is interactive
          if (isInteractive) {
            meshes.push(child); // Add to interactive meshes for raycasting
          }
        }
      });

      scene.add(model);
      console.log(
        `✅ Successfully loaded 3D model for ${
          config.type
        } (ID: ${uniqueId}) - ${isInteractive ? "Interactive" : "Decorative"}`
      );
    } catch (error) {
      console.warn(
        `⚠️ Failed to load 3D model for ${config.type}, using fallback:`,
        error
      );

      // Use fallback geometric shape with unique materials
      const fallbackMesh = createFallbackMesh(config.type);
      fallbackMesh.position.set(...config.position);
      fallbackMesh.rotation.set(...config.rotation);
      fallbackMesh.scale.setScalar(config.scale);

      const uniqueId = `${
        config.type
      }_${index}_fallback_${Date.now()}_${Math.random()}`;
      fallbackMesh.userData = {
        index,
        type: config.type,
        contentType: config.contentType,
        originalPosition: config.position, // Keep as array for compatibility
        originalRotation: config.rotation, // Keep as array for compatibility
        originalScale: config.scale,
        config: JSON.parse(JSON.stringify(config)),
        objectId: uniqueId,
        isFallback: true,
        isInteractive,
      };

      scene.add(fallbackMesh);

      // Only add to interactive meshes if the object is interactive
      if (isInteractive) {
        meshes.push(fallbackMesh);
      }

      console.log(
        `✅ Using fallback geometry for ${config.type} (ID: ${uniqueId}) - ${
          isInteractive ? "Interactive" : "Decorative"
        }`
      );
    }

    // Only create interactive object data for interactive objects
    if (isInteractive) {
      interactiveObjects.push({
        id: `object-${index}`,
        type: config.type as any,
        position: config.position as [number, number, number],
        rotation: config.rotation as [number, number, number],
        scale: [config.scale, config.scale, config.scale],
        contentType: config.contentType as any,
        isHovered: false,
        isClicked: false,
      });
    }
  }

  console.log(
    `🎯 Created ${interactiveObjects.length} interactive objects and ${
      objectsConfig.length - interactiveObjects.length
    } decorative objects`
  );
};

const setupEventListeners = () => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let mouseDownObject: THREE.Mesh | null = null;

  // Central event blocking function - elegant solution for ALL mouse events
  const isEventBlocked = (event: Event): boolean => {
    // Block ALL events when modal is open
    if (showModal.value) {
      event.stopPropagation();
      event.preventDefault();
      return true;
    }

    // Check if click occurred on UI elements
    const target = event.target as HTMLElement;
    const isUIClick =
      target.closest(
        "nav, button, .ui-nav, .ui-button, .ui-title, .nav-container, .ui-overlay"
      ) !== null;

    if (isUIClick) {
      // Allow UI interactions but block 3D scene events
      return true;
    }

    return false;
  };

  const onMouseMove = (event: MouseEvent) => {
    if (isEventBlocked(event)) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(meshes);

    // Reset all hover states
    interactiveObjects.forEach((obj) => (obj.isHovered = false));
    hoveredObject.value = null;

    if (intersects.length > 0) {
      const intersected = intersects[0].object as THREE.Mesh;
      // Get the parent index from the new userData structure
      const index =
        intersected.userData.parentIndex !== undefined
          ? intersected.userData.parentIndex
          : intersected.userData.index; // fallback for direct meshes

      if (index !== undefined && interactiveObjects[index]) {
        interactiveObjects[index].isHovered = true;
        hoveredObject.value = interactiveObjects[index];

        // Change cursor
        document.body.style.cursor = "pointer";
      }
    } else {
      document.body.style.cursor = "default";
    }
  };

  const onMouseDown = (event: MouseEvent) => {
    if (isEventBlocked(event)) return;

    // Only for left click
    if (event.button !== 0) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      mouseDownObject = intersects[0].object as THREE.Mesh;
      const objectType =
        mouseDownObject.userData.parentType || mouseDownObject.userData.type;
      console.log("Mouse down on object:", objectType);
    } else {
      mouseDownObject = null;
    }
  };

  const onMouseUp = async (event: MouseEvent) => {
    if (isEventBlocked(event)) {
      mouseDownObject = null; // Reset on blocked events
      return;
    }

    // Only for left click
    if (event.button !== 0) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(meshes);

    console.log("Mouse up detected!");

    if (intersects.length > 0 && mouseDownObject) {
      const mouseUpObject = intersects[0].object as THREE.Mesh;

      // Verify for same object
      if (mouseUpObject === mouseDownObject) {
        const objectType =
          mouseUpObject.userData.parentType || mouseUpObject.userData.type;
        console.log("Click detected! Same object:", objectType);
        console.log("Intersects:", intersects.length);

        // Get the parent index from the new userData structure
        const index =
          mouseUpObject.userData.parentIndex !== undefined
            ? mouseUpObject.userData.parentIndex
            : mouseUpObject.userData.index; // fallback for direct meshes

        if (index !== undefined && interactiveObjects[index]) {
          selectedObject.value = interactiveObjects[index];
          console.log("Selected object:", selectedObject.value);
          await loadContentForObject(selectedObject.value);
        }
      } else {
        const mouseDownType =
          mouseDownObject.userData.parentType || mouseDownObject.userData.type;
        const mouseUpType =
          mouseUpObject.userData.parentType || mouseUpObject.userData.type;
        console.log(
          "Different objects - mousedown on:",
          mouseDownType,
          "mouseup on:",
          mouseUpType
        );
      }
    } else if (!intersects.length && mouseDownObject) {
      const objectType =
        mouseDownObject.userData.parentType || mouseDownObject.userData.type;
      console.log("Mouse up outside objects - started on:", objectType);
    }

    // Reset
    mouseDownObject = null;
  };

  // Add more comprehensive event blocking for ANY future mouse events
  const onMouseWheel = (event: WheelEvent) => {
    if (isEventBlocked(event)) return;
  };

  const onMouseEnter = (event: MouseEvent) => {
    if (isEventBlocked(event)) return;
  };

  const onMouseLeave = (event: MouseEvent) => {
    if (isEventBlocked(event)) return;
  };

  const onContextMenu = (event: MouseEvent) => {
    if (isEventBlocked(event)) return;
    // Prevent browser contextual menu
    event.preventDefault();
  };

  const onDoubleClick = (event: MouseEvent) => {
    if (isEventBlocked(event)) return;
  };

  // Register ALL mouse events for comprehensive blocking
  window.addEventListener("mousemove", onMouseMove, { passive: false });
  window.addEventListener("mousedown", onMouseDown, { passive: false });
  window.addEventListener("mouseup", onMouseUp, { passive: false });
  window.addEventListener("wheel", onMouseWheel, { passive: false });
  window.addEventListener("mouseenter", onMouseEnter, { passive: false });
  window.addEventListener("mouseleave", onMouseLeave, { passive: false });
  window.addEventListener("dblclick", onDoubleClick, { passive: false });
  window.addEventListener("resize", onWindowResize);
  renderer.domElement.addEventListener("contextmenu", onContextMenu, {
    passive: false,
  });

  // Store cleanup function for later use
  return () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mousedown", onMouseDown);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("wheel", onMouseWheel);
    window.removeEventListener("mouseenter", onMouseEnter);
    window.removeEventListener("mouseleave", onMouseLeave);
    window.removeEventListener("dblclick", onDoubleClick);
    window.removeEventListener("resize", onWindowResize);
    renderer.domElement.removeEventListener("contextmenu", onContextMenu);
  };
};

const loadContentForObject = async (obj: InteractiveObject) => {
  try {
    console.log("Loading content for:", obj.contentType);

    // Show modal immediately with loading state
    showModal.value = true;
    isLoadingContent.value = true;
    modalContent.value = null; // Clear previous content

    // Disable OrbitControls immediately
    if (controls) {
      controls.enabled = false;
    }

    // Reset hovering property immediately
    hoveredObject.value = null;
    document.body.style.cursor = "default";

    let content: (
      | Project
      | WorkInProgress
      | BlogPost
      | Collaboration
      | LearningPath
      | FunFact
    )[];

    switch (obj.contentType) {
      case "projects":
        console.log("Fetching projects...");
        content = await apiWithCache.getProjects();
        break;
      case "wip":
        console.log("Fetching WIP items...");
        content = await apiWithCache.getWIPItems();
        break;
      case "blog":
        console.log("Fetching blog posts...");
        content = await apiWithCache.getBlogPosts();
        break;
      case "collaborations":
        console.log("Fetching collaborations...");
        content = await apiWithCache.getCollaborations();
        break;
      case "learning":
        console.log("Fetching learning paths...");
        content = await apiWithCache.getLearningPaths();
        break;
      case "fun-facts":
        console.log("Fetching fun facts...");
        content = await apiWithCache.getFunFacts();
        break;
      default:
        content = [];
    }

    console.log("Loaded content:", content);

    // Set content and stop loading
    modalContent.value = content;
    isLoadingContent.value = false;
  } catch (error) {
    console.error("Failed to load content:", error);
    modalContent.value = [];
    isLoadingContent.value = false;
  }
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const animate = () => {
  animationId = requestAnimationFrame(animate);

  // Create a map of processed objects to avoid duplicate animations
  const processedObjects = new Set<string>();

  // Animate interactive objects using configuration
  meshes.forEach((mesh) => {
    // Get the parent index from the new userData structure
    const index =
      mesh.userData.parentIndex !== undefined
        ? mesh.userData.parentIndex
        : mesh.userData.index; // fallback for direct meshes

    const obj = interactiveObjects[index];
    if (!obj || index === undefined) return;

    // Get the root object properly - this is key!
    let rootObject: THREE.Object3D = mesh;

    // If mesh has a parent Group, use that as the root object
    if (
      mesh.parent &&
      mesh.parent.type === "Group" &&
      mesh.parent.userData.config
    ) {
      rootObject = mesh.parent;
    }
    // If mesh itself has config (fallback objects), use the mesh
    else if (mesh.userData.config) {
      rootObject = mesh;
    }
    // Last resort: try to find any parent with config
    else {
      let current = mesh.parent;
      while (current && !current.userData.config) {
        current = current.parent;
      }
      if (current && current.userData.config) {
        rootObject = current;
      }
    }

    // Get the object ID to avoid duplicate processing
    const objectId = rootObject.userData.objectId || `fallback_${index}`;
    if (processedObjects.has(objectId)) return;
    processedObjects.add(objectId);

    const config = rootObject.userData.config;
    if (!config) {
      // Remove the spam - only log once per object type
      if (
        !processedObjects.has(
          `error_${mesh.userData.parentType || mesh.userData.type}`
        )
      ) {
        console.warn(
          `No config found for object type: ${
            mesh.userData.parentType || mesh.userData.type
          }`
        );
        processedObjects.add(
          `error_${mesh.userData.parentType || mesh.userData.type}`
        );
      }
      return;
    }

    // Floating animation using configuration
    if (
      config.animation.floating.enabled &&
      rootObject.userData.originalPosition
    ) {
      const originalY = rootObject.userData.originalPosition[1]; // Get Y from array
      const time = Date.now() * 0.001 * config.animation.floating.speed;
      const floatOffset =
        Math.sin(time + index) * config.animation.floating.amplitude;
      rootObject.position.y = originalY + floatOffset;
    }

    // Rotation animation using configuration
    if (config.animation.rotation.enabled) {
      rootObject.rotation.y += config.animation.rotation.speed;
    }

    // Hover effect using configuration
    if (obj.isHovered) {
      const targetScale =
        (rootObject.userData.originalScale || 1) *
        config.animation.hover.scaleMultiplier;
      rootObject.scale.setScalar(targetScale);
    } else {
      const originalScale = rootObject.userData.originalScale || 1;
      rootObject.scale.setScalar(originalScale);
    }
  });

  // Animate particle systems with delta time
  const currentTime = Date.now() * 0.001;
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  animateParticles(deltaTime);

  // Update controls
  controls.update();

  renderer.render(scene, camera);
};

const resetCamera = () => {
  camera.position.set(0, 5, 15);
  controls.target.set(0, 0, 0);
  controls.update();
};

const closeModal = () => {
  showModal.value = false;
  selectedObject.value = null;
  modalContent.value = null;
  isLoadingContent.value = false;

  // Re-enable OrbitControls when modal is closed
  if (controls) {
    controls.enabled = true;
  }
};

const getObjectTitle = (contentType: string): string => {
  const titles = {
    projects: "Projects",
    wip: "Work in Progress",
    blog: "Blog Posts",
    collaborations: "Collaborations",
    learning: "Learning Paths",
    "fun-facts": "Fun Facts",
  };
  return titles[contentType as keyof typeof titles] || contentType;
};

// UI state management functions
const toggleControlsPanel = () => {
  showControlsPanel.value = !showControlsPanel.value;
};

const toggleNavigation = () => {
  isNavigationMinimized.value = !isNavigationMinimized.value;
};

// Day/Night mode toggle function
const toggleDayNightMode = () => {
  if (lightingManager) {
    const newMode = lightingManager.toggleMode();
    isDayMode.value = newMode === "day";
    console.log(`🌓 Toggled to ${newMode} mode`);
  } else {
    console.warn("⚠️ Lighting manager not initialized");
  }
};

onMounted(() => {
  initThreeJS();
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (eventCleanup) {
    eventCleanup(); // Clean up all event listeners
  }
  if (controls) {
    controls.dispose();
  }

  // Clean up particle systems using the manager
  if (particleManager) {
    particleManager.removeAllParticleSystems();
  }

  // Clean up lighting manager
  if (lightingManager) {
    lightingManager.dispose();
  }

  if (renderer) {
    renderer.dispose();
  }
});
</script>

<style scoped>
/* Canvas Three.js - always background */
canvas {
  display: block;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 1 !important;
  pointer-events: auto !important;
}

/* Canvas container Three.js */
div[ref="threeContainer"] {
  z-index: 1 !important;
  position: absolute !important;
}

/* Main UI Overlay - more priority */
.ui-overlay {
  z-index: 5 !important;
  position: absolute !important;
}

/* Navigation container */
.ui-nav {
  z-index: 10 !important;
  position: absolute !important;
}

.nav-container {
  z-index: 15 !important;
  position: relative !important;
}

/* Main title */
.ui-title {
  z-index: 20 !important;
  position: relative !important;
  pointer-events: auto !important;
  cursor: default !important;
}

.gradient-text {
  z-index: 21 !important;
  position: relative !important;
}

/* UI Buttons */
.ui-button {
  z-index: 25 !important;
  position: relative !important;
  pointer-events: auto !important;
  cursor: pointer !important;
}

/* Interactive hints */
.ui-hints {
  z-index: 30 !important;
  position: absolute !important;
}

.hints-container {
  z-index: 31 !important;
  position: relative !important;
}

/* Instructions panel */
.ui-instructions {
  z-index: 15 !important;
  position: absolute !important;
}

.instructions-container {
  z-index: 16 !important;
  position: relative !important;
}

/* Status indicator */
.ui-status {
  z-index: 15 !important;
  position: absolute !important;
}

.status-container {
  z-index: 16 !important;
  position: relative !important;
}

/* Magical overlay */
.magical-overlay {
  z-index: 4 !important;
  position: absolute !important;
}

/* Force all UI elements to always be visible */
.ui-overlay,
.ui-nav,
.ui-title,
.ui-button,
.ui-hints,
.ui-instructions,
.ui-status,
.nav-container,
.hints-container,
.instructions-container,
.status-container {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* Force all texts on top */
h1,
h3,
p,
span {
  z-index: 10020 !important;
  position: relative !important;
}

/* Hints animations */
@keyframes magical-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(147, 51, 234, 0.8),
      0 0 40px rgba(219, 39, 119, 0.3);
  }
}

.animate-pulse {
  animation: magical-glow 2s ease-in-out infinite;
}

/* Buttons hover effects */
.ui-button:hover {
  transform: scale(1.05) !important;
  transition: all 0.3s ease !important;
}

/* Gradient text animation */
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.gradient-text {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

/* Enhanced button animations and interactions */
.ui-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.ui-button:active {
  transform: scale(0.98) !important;
}

.ui-button:focus {
  outline: 2px solid rgba(147, 51, 234, 0.6);
  outline-offset: 2px;
}

/* Navigation and panel smooth transitions */
.nav-container {
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1) !important;
  /* Remove border-radius from CSS to let inline styles control it smoothly */
}

.nav-container * {
  transition: inherit;
}

.instructions-container {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* Enhanced magical glow for hints */
.hints-container {
  animation: magical-glow 3s ease-in-out infinite;
}

/* Day/Night toggle button animations */
.day-night-toggle {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.day-night-toggle:hover {
  transform: scale(1.05) !important;
  border-color: rgba(255, 255, 255, 0.2);
}

.day-night-toggle:active {
  transform: scale(0.95) !important;
}

.day-night-toggle svg {
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 8px currentColor);
}

/* Day mode specific glow */
.day-night-toggle:hover svg[viewBox="0 0 24 24"]:first-child {
  animation: sun-glow 2s ease-in-out infinite;
}

/* Night mode specific glow */
.day-night-toggle:hover svg[viewBox="0 0 24 24"]:last-child {
  animation: moon-glow 3s ease-in-out infinite;
}

@keyframes sun-glow {
  0%,
  100% {
    filter: drop-shadow(0 0 8px #fbbf24);
    transform: scale(1) rotate(0deg);
  }
  50% {
    filter: drop-shadow(0 0 16px #f59e0b) drop-shadow(0 0 24px #fbbf24);
    transform: scale(1.1) rotate(12deg);
  }
}

@keyframes moon-glow {
  0%,
  100% {
    filter: drop-shadow(0 0 8px #6366f1);
    transform: scale(1) rotate(0deg);
  }
  33% {
    filter: drop-shadow(0 0 12px #4f46e5) drop-shadow(0 0 20px #6366f1);
    transform: scale(1.05) rotate(-6deg);
  }
  66% {
    filter: drop-shadow(0 0 16px #3730a3) drop-shadow(0 0 24px #4f46e5);
    transform: scale(1.1) rotate(-12deg);
  }
}

/* Improved backdrop blur for modern UI */
.backdrop-blur-lg {
  backdrop-filter: blur(16px) saturate(180%);
}

/* Smooth transitions for all interactive elements */
[style*="pointer-events: auto"] {
  transition: all 0.2s ease !important;
}

/* SVG icon animations */
.ui-button svg {
  transition: transform 0.3s ease;
}

.ui-button:hover svg {
  transform: rotate(180deg);
}

/* Close button specific animations */
.ui-button:hover svg[viewBox="0 0 6 6"] {
  transform: rotate(90deg) scale(1.1);
}

/* Reset button rotating animation */
.ui-button:hover svg[viewBox="0 0 20 20"] {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
