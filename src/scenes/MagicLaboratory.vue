<template>
  <div class="w-full h-full relative overflow-hidden">
    <!-- Magical Preloader -->
    <div
      v-if="preloaderState.isLoading"
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
            :style="{ width: `${preloaderState.progress}%` }"
          ></div>
        </div>

        <!-- Status text -->
        <p class="text-white text-lg mb-2">{{ preloaderState.status }}</p>
        <p class="text-purple-300 text-sm">
          {{ Math.round(preloaderState.progress) }}% complete
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
      <!-- Top Navigation - Enhanced Header -->
      <nav
        class="ui-nav transition-all duration-700 ease-in-out"
        :class="
          isNavigationMinimized
            ? 'flex p-4 absolute top-4 left-4 z-40'
            : 'block static w-full'
        "
      >
        <div
          class="nav-container transition-all duration-700 ease-in-out"
          :class="
            isNavigationMinimized
              ? 'flex justify-between items-center bg-black/30 backdrop-blur-sm px-6 py-3 mx-auto'
              : 'w-full bg-gradient-to-r from-black/80 via-black/90 to-black/80 backdrop-blur-md px-8 py-3 border-b border-purple-500/30 shadow-lg'
          "
          :style="{
            borderRadius: isNavigationMinimized ? '50px' : '0',
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            width: isNavigationMinimized ? 'auto' : '100%',
            maxWidth: isNavigationMinimized ? 'none' : '100%',
          }"
        >
          <!-- Full Width Header Layout -->
          <div
            v-if="!isNavigationMinimized"
            class="flex justify-between items-center w-full"
          >
            <!-- Left Section: Logo + Title -->
            <div class="flex items-center space-x-3">
              <div
                @click="toggleNavigation"
                class="ui-button w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                style="pointer-events: auto; cursor: pointer"
              >
                <span class="text-white text-lg font-bold">✨</span>
              </div>
              <div class="flex flex-col">
                <h1
                  class="ui-title text-2xl font-bold text-white transition-all duration-300"
                >
                  <span
                    class="gradient-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
                  >
                    Magic Portfolio
                  </span>
                </h1>
                <p class="text-purple-300 text-xs font-medium tracking-wide">
                  Interactive 3D Experience
                </p>
              </div>
            </div>

            <!-- Right Section: Controls -->
            <div class="flex items-center space-x-4">
              <!-- Day/Night Mode Toggle -->
              <button
                @click="toggleDayNightMode"
                class="ui-button day-night-toggle relative p-3 rounded-xl transition-all duration-300 overflow-hidden group shadow-lg hover:shadow-xl"
                :class="
                  isDayMode
                    ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 hover:from-orange-500/30 hover:to-yellow-500/30 border border-orange-400/50'
                    : 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 border border-purple-400/50'
                "
                style="pointer-events: auto; cursor: pointer"
                :title="
                  isDayMode ? 'Switch to Night Mode' : 'Switch to Day Mode'
                "
              >
                <!-- Enhanced background animation -->
                <div
                  class="absolute inset-0 transition-all duration-500"
                  :class="
                    isDayMode
                      ? 'bg-gradient-to-r from-yellow-400/10 to-orange-500/10'
                      : 'bg-gradient-to-r from-purple-600/10 to-indigo-600/10'
                  "
                ></div>

                <!-- Icon container -->
                <div class="relative z-10 flex items-center justify-center">
                  <!-- Day icon (sun) -->
                  <div
                    v-if="isDayMode"
                    class="w-7 h-7 text-yellow-400 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12"
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
                    class="w-7 h-7 text-indigo-400 transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-12"
                  >
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fill-rule="evenodd"
                        d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Enhanced ripple effect -->
                <div
                  class="absolute inset-0 opacity-0 group-active:opacity-30 transition-opacity duration-150 rounded-xl"
                  :class="isDayMode ? 'bg-orange-400' : 'bg-purple-400'"
                ></div>
              </button>
            </div>
          </div>

          <!-- Minimized Layout (existing) -->
          <div v-else class="flex justify-between items-center w-full">
            <!-- Logo/Title Section -->
            <div class="flex items-center space-x-4">
              <div
                class="flex items-center space-x-3"
                style="pointer-events: auto; cursor: pointer"
              >
                <div
                  @click="toggleNavigation"
                  class="ui-button w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
                >
                  <span class="text-white text-lg font-bold">✨</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Interactive Hints - Enhanced -->
      <div
        v-if="hoveredObject"
        class="ui-hints ui-hint absolute bottom-32 left-1/2 transform -translate-x-1/2 transition-all duration-300"
      >
        <div
          class="hints-container relative group bg-gradient-to-r from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl text-white px-10 py-5 rounded-3xl shadow-2xl border border-purple-400/60 overflow-hidden hover:scale-105 transition-all duration-500"
        >
          <!-- Enhanced animated background with multiple layers -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 animate-pulse"
          ></div>
          <div
            class="absolute inset-0 bg-gradient-to-45 from-transparent via-white/5 to-transparent group-hover:via-white/10 transition-all duration-700"
          ></div>

          <!-- Sparkle effects -->
          <div
            class="absolute top-2 left-4 w-1 h-1 bg-white/60 rounded-full animate-ping"
          ></div>
          <div
            class="absolute top-4 right-6 w-1.5 h-1.5 bg-purple-300/50 rounded-full animate-pulse delay-300"
          ></div>
          <div
            class="absolute bottom-3 left-8 w-1 h-1 bg-pink-300/60 rounded-full animate-ping delay-700"
          ></div>

          <!-- Main content -->
          <div class="relative z-10 flex items-center space-x-3">
            <div class="text-2xl animate-bounce">✨</div>
            <div class="text-center">
              <p class="text-lg font-bold text-white mb-1 tracking-wide">
                Click to explore
              </p>
              <p
                class="text-sm font-medium text-purple-200 uppercase tracking-wider"
              >
                {{ getObjectTitle(hoveredObject?.contentType || "") }}
              </p>
            </div>
            <div class="text-2xl animate-bounce delay-300">🔮</div>
          </div>

          <!-- Bottom glow effect -->
          <div
            class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-purple-500/30 rounded-full blur-lg"
          ></div>
        </div>
      </div>

      <!-- Collapsible Controls Panel -->
      <div class="ui-instructions absolute bottom-6 left-6">
        <div
          class="instructions-container transition-all duration-500 ease-in-out opacity-100 transform translate-y-0"
          v-if="showControlsPanel"
        >
          <div
            class="ui-panel bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg text-white p-6 rounded-2xl border border-indigo-400/50 shadow-2xl max-w-sm relative overflow-hidden"
          >
            <!-- Close button -->
            <button
              @click="toggleControlsPanel"
              class="ui-button absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
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
          class="ui-button mt-4 p-3 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl transition-all duration-300 shadow-lg backdrop-blur-sm border border-indigo-400/50"
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
import ContentModal from "../components/ContentModal.vue";
import { Scene3DManager } from "../services/core";
import { wizardLabTheme } from "../themes/wizard-lab";
import type { InteractiveObject, PreloaderState } from "../types/3d";

// Import UI interaction styles
import "../styles/ui-interactions.css";

// Reactive state
const threeContainer = ref<HTMLDivElement>();
const hoveredObject = ref<InteractiveObject | null>(null);
const selectedObject = ref<InteractiveObject | null>(null);
const showModal = ref(false);
const modalContent = ref<any[]>([]);
const isLoadingContent = ref(false);

// UI state management
const showControlsPanel = ref(false);
const isNavigationMinimized = ref(true);

// Preloader state
const preloaderState = ref<PreloaderState>({
  isLoading: true,
  progress: 0,
  status: "Initializing...",
  totalAssets: 0,
  loadedAssets: 0,
});

// Day/Night mode state
const isDayMode = ref(false);

// Scene manager instance
let scene3DManager: Scene3DManager | null = null;

// Initialize the 3D scene
const initThreeJS = async () => {
  if (!threeContainer.value) return;

  try {
    scene3DManager = new Scene3DManager();

    // Setup callbacks
    scene3DManager.onObjectHover((object) => {
      hoveredObject.value = object;
    });

    scene3DManager.onObjectClick(async (object, _event) => {
      await handleObjectClick(object);
    });

    scene3DManager.onPreloadProgress((state) => {
      preloaderState.value = { ...state };
    });

    scene3DManager.onPreloadComplete(() => {
      preloaderState.value.isLoading = false;
    });

    // Initialize with wizard lab theme
    await scene3DManager.initialize(threeContainer.value, wizardLabTheme);

    // Update day/night mode state
    isDayMode.value = scene3DManager.getCurrentLightingMode() === "day";

    console.log("✅ Magic Laboratory initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Magic Laboratory:", error);
    preloaderState.value.isLoading = false;
    preloaderState.value.status = "Failed to initialize";
  }
};

// Handle object clicks
const handleObjectClick = async (object: InteractiveObject) => {
  if (!scene3DManager) return;

  try {
    console.log("Loading content for:", object.contentType);

    // Show modal immediately with loading state
    showModal.value = true;
    isLoadingContent.value = true;
    modalContent.value = [];
    selectedObject.value = object;

    // Disable interactions
    scene3DManager.setModalOpen(true);

    // Reset hovering property immediately
    hoveredObject.value = null;

    // Load content
    const content = await scene3DManager.loadContentForObject(object);

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

// Reset camera to default position
const resetCamera = () => {
  if (scene3DManager) {
    scene3DManager.resetCamera();
  }
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  modalContent.value = [];
  selectedObject.value = null;
  isLoadingContent.value = false;

  // Re-enable interactions
  if (scene3DManager) {
    scene3DManager.setModalOpen(false);
  }
};

// Get object title for display
const getObjectTitle = (contentType: string): string => {
  if (scene3DManager) {
    return scene3DManager.getObjectTitle(contentType);
  }
  return "Unknown";
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
  if (scene3DManager) {
    scene3DManager.toggleDayNightMode();
    isDayMode.value = scene3DManager.getCurrentLightingMode() === "day";
  }
};

onMounted(() => {
  initThreeJS();
});

onUnmounted(() => {
  if (scene3DManager) {
    scene3DManager.dispose();
    scene3DManager = null;
  }
});
</script>

<style scoped>
/* Add any component-specific styles here */
.gradient-text {
  background-size: 200% auto;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>
