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

    <!-- Navigation Header (shown only in minimalist mode or when not loading) -->
    <div
      v-if="!preloaderState.isLoading && isMinimalistMode"
      class="absolute top-0 left-0 right-0 z-40"
    >
      <NavigationHeader
        :isDayMode="isDayMode"
        :toggleDayNightMode="toggleDayNightMode"
      />
    </div>

    <!-- Three.js Canvas Container (hidden in minimalist mode) -->
    <div
      v-show="!isMinimalistMode"
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

    <!-- UI Overlay - always on top (hidden in minimalist mode) -->
    <div
      v-show="!isMinimalistMode"
      class="ui-overlay absolute inset-0 w-full h-full"
      style="pointer-events: none"
    >
      <AppHeader
        :isNavigationMinimized="isNavigationMinimized"
        :isDayMode="isDayMode"
        :toggleNavigation="toggleNavigation"
        :toggleDayNightMode="toggleDayNightMode"
      />

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
            <div class="text-2xl">✨</div>
            <div class="text-center">
              <p class="text-lg font-bold text-white mb-1 tracking-wide">
                Click {{ hoveredObject?.type }} to explore
              </p>
              <p
                class="text-sm font-medium text-purple-200 uppercase tracking-wider"
              >
                {{ getObjectTitle(hoveredObject?.contentType || "") }}
              </p>
            </div>
            <div class="text-2xl">🔮</div>
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

    <!-- Minimalist Mode Content -->
    <div
      v-if="isMinimalistMode && !preloaderState.isLoading"
      class="absolute inset-0 z-30 overflow-y-auto"
      :class="{
        'bg-[rgb(242,242,242)]': isDayMode,
        'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900':
          !isDayMode,
      }"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div class="text-center mb-12">
          <h1
            class="text-5xl md:text-6xl font-bold mb-4"
            :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
          >
            Welcome to My Portfolio
          </h1>
          <p
            class="text-xl mb-8"
            :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
          >
            Explore my work through these sections
          </p>
        </div>

        <!-- Loading state -->
        <div
          v-if="isLoadingSections"
          class="flex items-center justify-center py-20"
        >
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2"
            :class="{
              'border-gray-900': isDayMode,
              'border-purple-400': !isDayMode,
            }"
          ></div>
        </div>

        <!-- Section cards -->
        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <router-link
            v-for="section in sections"
            :key="section.id"
            :to="`/post/${section.id}`"
            class="group block p-6 rounded-xl transition-all duration-300 hover:scale-105 border"
            :class="{
              'bg-white/90 border-gray-300 hover:border-purple-400 hover:shadow-xl':
                isDayMode,
              'bg-slate-800/70 border-purple-500/30 hover:border-purple-500/60 hover:shadow-2xl':
                !isDayMode,
            }"
            :style="{
              boxShadow: !isDayMode
                ? `0 0 30px ${section.color.accent}20`
                : 'none',
            }"
          >
            <div class="text-center">
              <div
                class="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300"
              >
                {{ section.emoji }}
              </div>
              <h3
                class="text-xl font-bold mb-2"
                :class="{
                  'text-gray-900': isDayMode,
                  'text-white': !isDayMode,
                }"
              >
                {{ section.title }}
              </h3>
              <p
                class="text-sm"
                :class="{
                  'text-gray-600': isDayMode,
                  'text-gray-300': !isDayMode,
                }"
              >
                {{ section.description }}
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import ContentModal from "../components/ContentModal.vue";
import NavigationHeader from "../components/NavigationHeader.vue";
import { Scene3DManager } from "../services/core";
import { default as defaultTheme } from "../themes";
import type { NullableSchemaType } from "@/types";
import type { InteractiveObject, PreloaderState } from "../types/3d";
import { useViewMode } from "@/stores/viewModeStore";
import { getAllSectionDescriptions } from "@/config/sectionDescriptions";
import { apiWithCache } from "@/services/apiWithCache";

// Import UI interaction styles
import "../styles/ui-interactions.css";
import AppHeader from "@/components/AppHeader.vue";

// View mode state from store
const { isMinimalistMode, isDayMode, toggleDayMode } = useViewMode();

// Sections data
const allSections = getAllSectionDescriptions();
const visibleSectionIds = ref<string[]>([]);
const isLoadingSections = ref(true);

// Filter sections based on visibility rules
const sections = computed(() => {
  return allSections.filter((section) =>
    visibleSectionIds.value.includes(section.id)
  );
});

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
    await scene3DManager.initialize(threeContainer.value, defaultTheme);

    // Sync 3D scene with store's day mode
    const currentMode = scene3DManager.getCurrentLightingMode();
    const sceneIsDayMode = currentMode === "day";

    // If store's mode differs from scene's initial mode, toggle scene
    if (isDayMode.value !== sceneIsDayMode) {
      scene3DManager.toggleDayNightMode();
    }

    console.log("✅ Magic Portfolio initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Magic Portfolio:", error);
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
const getObjectTitle = (contentType: NullableSchemaType): string => {
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
  }
  // Update store (which persists to localStorage)
  toggleDayMode();
};

onMounted(async () => {
  // Load visible sections based on visibility rules
  try {
    const categories = await apiWithCache.getAllCategories();
    visibleSectionIds.value = categories
      .filter((cat) => cat.visible)
      .map((cat) => cat.id);
    console.log("Visible sections in 3D scene:", visibleSectionIds.value);
  } catch (error) {
    console.error("Failed to load visible sections:", error);
    // Fallback: show all sections if fetching fails
    visibleSectionIds.value = allSections.map((s) => s.id);
  } finally {
    isLoadingSections.value = false;
  }

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
