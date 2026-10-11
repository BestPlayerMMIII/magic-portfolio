<template>
  <div class="w-full h-full relative overflow-hidden">
    <!-- Magical Preloader with About Me Presentation -->
    <div
      v-if="showLoadingScreen"
      class="absolute inset-0 z-50 flex flex-col items-center justify-between p-4 sm:p-8 overflow-y-auto transition-all duration-700"
      :class="[
        is3DSceneReady
          ? 'backdrop-blur-md opacity-95'
          : 'backdrop-blur-xl',
        colors.preloaderBackdrop
      ]"
    >
      <!-- Top Bar: Title & Loading Status / Ready Action -->
      <div
        class="w-full max-w-4xl flex items-center justify-between border-b pb-4 mb-6"
        :class="colors.preloaderCardBorder"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-xl border flex items-center justify-center"
            :class="colors.header3DLogoButton"
          >
            <HugeiconsIcon :icon="AiMagicIcon" :size="20" />
          </div>
          <div>
            <h2 class="font-bold text-lg tracking-tight" :class="colors.preloaderTitle">
              {{ strings.authorName }}
            </h2>
            <p class="text-xs" :class="colors.preloaderSubtitle">
              {{ strings.themeTitle }} &bull; {{ strings.themeSubtitle }}
            </p>
          </div>
        </div>

        <!-- Right action: Loading status OR "Enter 3D Laboratory" button once loaded -->
        <div class="flex items-center gap-3">
          <!-- When still loading -->
          <template v-if="!is3DSceneReady">
            <div
              class="w-5 h-5 border-2 rounded-full animate-spin"
              :class="isDayMode ? 'border-stone-400 border-t-amber-600' : 'border-slate-700 border-t-amber-400'"
            ></div>
            <span
              class="text-xs font-semibold px-2.5 py-1 rounded-full border"
              :class="colors.preloaderStatusBadge"
            >
              Loading 3D: {{ Math.round(preloaderState.progress) }}%
            </span>
          </template>

          <!-- When 3D environment is ready (single prominent action) -->
          <template v-else>
            <button
              @click="enter3DScene"
              class="ui-button px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 flex items-center gap-2"
              :class="`${colors.primaryButtonBg} ${colors.primaryButtonHover} ${colors.primaryButtonText}`"
              style="pointer-events: auto; cursor: pointer"
            >
              <span>{{ strings.enterButton }}</span>
              <HugeiconsIcon :icon="SparklesIcon" :size="16" />
            </button>
          </template>
        </div>
      </div>

      <!-- Center Container: Full About Me view while assets load -->
      <div
        class="w-full max-w-4xl flex-1 rounded-2xl border p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[60vh] mb-6"
        :class="`${colors.cardBackground} ${colors.cardBorder}`"
      >
        <div
          class="mb-4 pb-3 border-b flex items-center justify-between"
          :class="colors.preloaderCardBorder"
        >
          <span
            class="text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
            :class="colors.accentColor"
          >
            <HugeiconsIcon :icon="Book01Icon" :size="14" />
            <span>{{ strings.aboutPrompt }}</span>
          </span>
        </div>
        <AboutContent />
      </div>

      <!-- Bottom Progress Section -->
      <div class="w-full max-w-xl text-center">
        <!-- Progress bar -->
        <div
          class="w-full h-2 rounded-full mb-3 overflow-hidden shadow-inner border"
          :class="colors.preloaderProgressTrack"
        >
          <div
            class="h-full rounded-full transition-all duration-300 ease-out"
            :class="`bg-gradient-to-r ${theme.ui?.preloaderProgressGradient || 'from-amber-500 via-amber-400 to-amber-300'}`"
            :style="{
              width: `${is3DSceneReady ? 100 : preloaderState.progress}%`,
            }"
          ></div>
        </div>
        <!-- Status text -->
        <div v-if="!is3DSceneReady">
          <p class="text-sm font-medium mb-1" :class="colors.preloaderStatusText">
            {{ preloaderState.status }}
          </p>
          <p class="text-xs" :class="colors.preloaderStatusMuted">
            {{ strings.loadingStatus }} &bull;
            {{ Math.round(preloaderState.progress) }}% complete
          </p>
        </div>
        <div v-else class="text-xs" :class="colors.preloaderStatusMuted">
          <span
            class="inline-flex items-center gap-1.5 font-medium mr-2"
            :class="colors.readyBadgeText"
          >
            <span class="w-2 h-2 rounded-full" :class="colors.readyBadgeDot || (isDayMode ? 'bg-emerald-600' : 'bg-emerald-400')"></span>
            {{ strings.readyStatus }}
          </span>
          <span>&bull; {{ strings.exploreHint }}</span>
        </div>
      </div>
    </div>

    <!-- Three.js Canvas Container -->
    <div
      ref="threeContainer"
      class="absolute inset-0 w-full h-full"
      style="z-index: 1"
    ></div>

    <!-- UI Overlay - always on top -->
    <div
      class="ui-overlay absolute inset-0 w-full h-full"
      style="pointer-events: none"
    >
      <AppHeader
        :isNavigationMinimized="isNavigationMinimized"
        :isDayMode="isDayMode"
        :toggleNavigation="toggleNavigation"
        :toggleDayNightMode="toggleDayNightMode"
        @openCredits="openCreditsModal"
      />

      <!-- Interactive Hints - Clean & refined without emojis -->
      <div
        v-if="hoveredObject"
        class="ui-hints ui-hint absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 px-4 w-full max-w-md bottom-24 sm:bottom-32"
      >
        <div
          class="hints-container relative group backdrop-blur-xl rounded-2xl shadow-2xl border hover:scale-105 transition-all duration-300 px-5 py-3 sm:px-8 sm:py-4"
          :class="[colors.panelBackground, colors.panelBorder]"
        >
          <div class="relative z-10 flex items-center justify-between gap-3">
            <div
              class="w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0"
              :class="[colors.accentBg, colors.accentBorder, colors.accentColor]"
            >
              <HugeiconsIcon :icon="AiMagicIcon" :size="20" />
            </div>
            <div class="text-center flex-1 min-w-0">
              <p
                class="text-sm sm:text-base font-bold tracking-wide truncate"
                :class="colors.panelTitle"
              >
                {{ isMobile ? "Tap" : "Click" }} {{ hoveredObject?.type }}
              </p>
              <p
                class="text-xs font-semibold uppercase tracking-wider truncate"
                :class="colors.accentColor"
              >
                {{ getObjectTitle(hoveredObject?.contentType || "") }}
              </p>
            </div>
            <div
              class="w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0"
              :class="[colors.accentBg, colors.accentBorder, colors.accentColor]"
            >
              <component
                :is="
                  getSectionIcon(hoveredObject?.contentType || '', 'w-5 h-5')
                "
                v-if="hoveredObject?.contentType"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Collapsible Controls Panel -->
      <div class="ui-instructions absolute bottom-6 left-6">
        <div class="flex items-end gap-3">
          <!-- Controls Panel Container (opens to the left) -->
          <div
            class="instructions-container transition-all duration-500 ease-in-out"
            v-if="showControlsPanel"
          >
            <div
              class="ui-panel backdrop-blur-xl p-6 rounded-2xl border shadow-2xl max-w-sm relative overflow-hidden"
              :class="[colors.panelBackground, colors.panelBorder, colors.panelText]"
            >
              <!-- Close button -->
              <button
                @click="toggleControlsPanel"
                class="ui-button absolute top-3 right-3 p-1.5 rounded-lg transition-colors duration-200"
                :class="colors.panelCloseButton"
                style="pointer-events: auto; cursor: pointer"
              >
                <svg
                  class="w-4 h-4"
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
                class="text-lg font-bold mb-4 flex items-center gap-2"
                :class="colors.panelTitle"
              >
                <HugeiconsIcon
                  :icon="GameController01Icon"
                  :size="20"
                  :class="colors.accentColor"
                />
                <span>Controls</span>
              </h3>
              <div class="space-y-3 text-sm">
                <!-- Mobile/Tablet Controls -->
                <template v-if="isMobile">
                  <div
                    class="flex items-center p-2.5 rounded-lg gap-3 border"
                    :class="[colors.cardBackground, colors.cardBorder]"
                  >
                    <HugeiconsIcon
                      :icon="Touch01Icon"
                      :size="20"
                      :class="colors.accentColor"
                      class="flex-shrink-0"
                    />
                    <span :class="colors.cardText">Tap and drag to rotate</span>
                  </div>
                  <div
                    class="flex items-center p-2.5 rounded-lg cursor-pointer transition-colors gap-3 border"
                    :class="[colors.cardBackground, colors.cardBorder, colors.cardHoverBorder]"
                    @click="toggleInteractiveObjectsPopup"
                    style="pointer-events: auto"
                  >
                    <HugeiconsIcon
                      :icon="Search01Icon"
                      :size="20"
                      :class="colors.accentColor"
                      class="flex-shrink-0"
                    />
                    <span :class="colors.cardText">Tap objects to explore</span>
                  </div>
                  <div
                    class="flex items-center p-2.5 rounded-lg gap-3 border"
                    :class="[colors.cardBackground, colors.cardBorder]"
                  >
                    <HugeiconsIcon
                      :icon="ZoomInAreaIcon"
                      :size="20"
                      :class="colors.accentColor"
                      class="flex-shrink-0"
                    />
                    <span :class="colors.cardText">Pinch to zoom</span>
                  </div>
                </template>

                <!-- Desktop Controls -->
                <template v-else>
                  <div
                    class="flex items-center p-2.5 rounded-lg gap-3 border"
                    :class="[colors.cardBackground, colors.cardBorder]"
                  >
                    <HugeiconsIcon
                      :icon="Cursor01Icon"
                      :size="20"
                      :class="colors.accentColor"
                      class="flex-shrink-0"
                    />
                    <span :class="colors.cardText">Left click + drag to rotate</span>
                  </div>
                  <div
                    class="flex items-center p-2.5 rounded-lg cursor-pointer transition-colors gap-3 border"
                    :class="[colors.cardBackground, colors.cardBorder, colors.cardHoverBorder]"
                    @click="toggleInteractiveObjectsPopup"
                    style="pointer-events: auto"
                  >
                    <HugeiconsIcon
                      :icon="Search01Icon"
                      :size="20"
                      :class="colors.accentColor"
                      class="flex-shrink-0"
                    />
                    <span :class="colors.cardText">Click objects to explore</span>
                  </div>
                  <div
                    class="flex items-center p-2.5 rounded-lg gap-3 border"
                    :class="[colors.cardBackground, colors.cardBorder]"
                  >
                    <HugeiconsIcon
                      :icon="RefreshIcon"
                      :size="20"
                      :class="colors.accentColor"
                      class="flex-shrink-0"
                    />
                    <span :class="colors.cardText">Mouse wheel to zoom</span>
                  </div>
                </template>
              </div>

              <!-- Reset View Button -->
              <button
                @click="resetCamera"
                class="ui-button group relative overflow-hidden w-full mt-4 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg border"
                :class="[
                  colors.secondaryButtonBg,
                  colors.secondaryButtonBorder,
                  colors.secondaryButtonText,
                  'hover:scale-102',
                ]"
                style="pointer-events: auto; cursor: pointer"
              >
                <span
                  class="relative z-10 flex items-center justify-center space-x-2 text-sm font-medium"
                >
                  <HugeiconsIcon
                    :icon="RefreshIcon"
                    :size="16"
                    class="transition-transform group-hover:rotate-180 duration-500"
                  />
                  <span>Reset View</span>
                </span>
              </button>
            </div>
          </div>

          <!-- Help/Controls Button -->
          <button
            v-if="!showControlsPanel"
            @click="toggleControlsPanel"
            class="ui-button group relative overflow-hidden p-3 backdrop-blur-lg rounded-xl transition-all duration-300 shadow-lg border hover:scale-105"
            :class="[colors.header3DButtonBg]"
            style="pointer-events: auto; cursor: pointer"
            title="Show Controls"
          >
            <div
              class="relative z-10 flex items-center justify-center"
              :class="colors.accentColor"
            >
              <HugeiconsIcon :icon="GameController01Icon" :size="22" />
            </div>
          </button>

          <!-- About Me Button (always visible) -->
          <button
            @click="openAboutModal"
            class="ui-button group relative overflow-hidden p-3 backdrop-blur-lg rounded-xl transition-all duration-300 shadow-lg border hover:scale-105"
            :class="[colors.header3DButtonBg]"
            style="pointer-events: auto; cursor: pointer"
            title="About Me / Wizard Profile"
          >
            <div
              class="relative z-10 flex items-center justify-center"
              :class="colors.accentColor"
            >
              <HugeiconsIcon :icon="InformationCircleIcon" :size="22" />
            </div>
          </button>
        </div>
      </div>

      <!-- Interactive Objects Info Popup -->
      <div
        v-if="showInteractiveObjectsPopup"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="pointer-events: auto"
        @click.self="toggleInteractiveObjectsPopup"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="toggleInteractiveObjectsPopup"
        ></div>

        <!-- Popup content -->
        <div
          class="relative backdrop-blur-xl p-6 rounded-2xl border shadow-2xl max-w-md w-full"
          :class="[colors.panelBackground, colors.panelBorder]"
          @click.stop
        >
          <!-- Close button -->
          <button
            @click="toggleInteractiveObjectsPopup"
            class="absolute top-3 right-3 p-1.5 rounded-lg transition-colors duration-200"
            :class="colors.panelCloseButton"
          >
            <svg
              class="w-4 h-4"
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

          <!-- Header -->
          <h3
            class="text-xl font-semibold mb-4 flex items-center gap-2"
            :class="colors.panelTitle"
          >
            <HugeiconsIcon
              :icon="SparklesIcon"
              :size="20"
              :class="colors.accentColor"
            />
            <span>{{ strings.artifactsHeader }}</span>
          </h3>

          <!-- Interactive objects list -->
          <div class="space-y-3">
            <ul class="space-y-3">
              <li
                v-for="info in sections"
                :key="info.id"
                class="flex flex-col gap-2 p-3 rounded-lg border transition-colors"
                :class="[colors.cardBackground, colors.cardBorder, colors.cardHoverBorder]"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0"
                    :class="[colors.accentBg, colors.accentBorder, colors.accentColor]"
                  >
                    <component :is="getSectionIcon(info.id, 'w-5 h-5')" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h5 class="font-semibold mb-0.5" :class="colors.cardTitle">
                      {{ info.title }}
                    </h5>
                    <p class="text-xs" :class="colors.cardTextMuted">
                      {{
                        strings.objectSearchPrompt.replace(
                          "{object}",
                          mapSectionObject[info.id] || "artifact"
                        )
                      }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Magical ambient overlay (customized by theme) -->
      <div
        class="magical-overlay absolute inset-0 pointer-events-none transition-opacity duration-1000"
        :style="{
          background: `radial-gradient(circle at 20% 80%, ${colors.ambientOverlay?.radial1 || 'transparent'} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${colors.ambientOverlay?.radial2 || 'transparent'} 0%, transparent 50%)`,
        }"
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

    <!-- Credits Modal -->
    <CreditsModal
      :visible="showCreditsModal"
      @close="closeCreditsModal"
      style="z-index: 1000"
    />

    <!-- About Modal -->
    <AboutModal
      :visible="showAboutModal"
      @close="closeAboutModal"
      style="z-index: 1000"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import router from "@/router";
import ContentModal from "../components/ContentModal.vue";
import CreditsModal from "../components/CreditsModal.vue";
import AboutModal from "../components/AboutModal.vue";
import AboutContent from "../components/AboutContent.vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import {
  AiMagicIcon,
  Book01Icon,
  GameController01Icon,
  Touch01Icon,
  Search01Icon,
  ZoomInAreaIcon,
  Cursor01Icon,
  RefreshIcon,
  InformationCircleIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { getSectionIcon } from "@/config/sectionIcons";
import { Scene3DManager } from "../services/core";
import { default as defaultTheme } from "../themes";
import type { NullableSchemaType } from "@/types";
import type { InteractiveObject, PreloaderState } from "../types/3d";
import { useViewMode } from "@/stores/viewModeStore";
import { useTheme } from "@/stores/themeStore";
import { getAllSectionDescriptions } from "@/config/sectionDescriptions";
import { apiWithCache } from "@/services/apiWithCache";
import { getDeviceType } from "@/utils/deviceDetection";

// Import UI interaction styles
import "../styles/ui-interactions.css";
import AppHeader from "@/components/AppHeader.vue";

// View mode state from store
const { isDayMode, toggleDayMode } = useViewMode();

// Theme state from store
const { theme, strings, colors, sceneBackgroundColor } = useTheme();

// Sections data
const allSections = getAllSectionDescriptions();
const visibleSectionIds = ref<string[]>([]);
const mapSectionObject = computed(() => {
  return (theme.value.objects || []).reduce(
    (map, obj) => {
      if (obj.contentType) {
        map[obj.contentType] = obj.type;
      }
      return map;
    },
    {} as Record<string, string>,
  );
});
const isLoadingSections = ref(true);

// Filter sections based on visibility rules
const sections = computed(() => {
  return allSections.filter((section) =>
    visibleSectionIds.value.includes(section.id),
  );
});

// Reactive state
const threeContainer = ref<HTMLDivElement>();
const hoveredObject = ref<InteractiveObject | null>(null);
const selectedObject = ref<InteractiveObject | null>(null);
const showModal = ref(false);
const modalContent = ref<any[]>([]);
const isLoadingContent = ref(false);
const showCreditsModal = ref(false);
const showAboutModal = ref(false);

// UI state management
const showControlsPanel = ref(false);
const isNavigationMinimized = ref(true);
const showInteractiveObjectsPopup = ref(false);

// Device detection
const isMobile = ref(false); // include mobile, tablet, no desktop
const handleResize = () => {
  // Detect device type
  const deviceType = getDeviceType();
  isMobile.value = deviceType === "mobile" || deviceType === "tablet";
};

// Preloader state
const preloaderState = ref<PreloaderState>({
  isLoading: true,
  progress: 0,
  status: "Initializing...",
  totalAssets: 0,
  loadedAssets: 0,
});

const is3DSceneReady = ref(false);
const showLoadingScreen = ref(true);

const enter3DScene = () => {
  showLoadingScreen.value = false;
};

// Scene manager instance
let scene3DManager: Scene3DManager | null = null;

// Initialize the 3D scene
const initThreeJS = async () => {
  // Mobile/tablet users are already redirected to /about in onMounted
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
      is3DSceneReady.value = true;
    });

    // Initialize with active theme
    await scene3DManager.initialize(threeContainer.value, theme.value);

    // Sync 3D scene background and lighting with store's day mode
    scene3DManager.setLightingMode(isDayMode.value);

    console.log("✅ Magic Portfolio initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Magic Portfolio:", error);
    preloaderState.value.isLoading = false;
    preloaderState.value.status = "Failed to initialize";
    is3DSceneReady.value = false;
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

// Credits modal functions
const openCreditsModal = () => {
  showCreditsModal.value = true;

  // Disable interactions
  if (scene3DManager) {
    scene3DManager.setModalOpen(true);
  }
};

const closeCreditsModal = () => {
  showCreditsModal.value = false;

  // Re-enable interactions
  if (scene3DManager) {
    scene3DManager.setModalOpen(false);
  }
};

// About modal functions
const openAboutModal = () => {
  showAboutModal.value = true;

  // Disable interactions
  if (scene3DManager) {
    scene3DManager.setModalOpen(true);
  }
};

const closeAboutModal = () => {
  showAboutModal.value = false;

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

const toggleInteractiveObjectsPopup = () => {
  showInteractiveObjectsPopup.value = !showInteractiveObjectsPopup.value;
};

const toggleNavigation = () => {
  isNavigationMinimized.value = !isNavigationMinimized.value;
};

// Day/Night mode toggle function
const toggleDayNightMode = () => {
  toggleDayMode();
  if (scene3DManager) {
    scene3DManager.setLightingMode(isDayMode.value);
  }
};

onMounted(async () => {
  // Redirect mobile/tablet users to /about for classic view
  const deviceType = getDeviceType();
  if (deviceType === "mobile" || deviceType === "tablet") {
    console.log(`📱 ${deviceType} device detected - redirecting to /about`);
    router.push("/about");
    return;
  }

  window.addEventListener("resize", handleResize);
  handleResize();

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

  // Initialize 3D scene
  initThreeJS();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
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
