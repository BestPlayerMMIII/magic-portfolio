import { ref, computed, watch } from "vue";
import { LightingManager } from "../services/core";
import { getDeviceType } from "@/utils/deviceDetection";

export type ViewMode = "3d" | "minimalist";

const STORAGE_KEY_VIEW_MODE = "magic-portfolio-view-mode";
const STORAGE_KEY_DAY_MODE = "magic-portfolio-day-mode";

// Check if device supports 3D mode (desktop only)
const deviceSupports3D = (): boolean => {
  const deviceType = getDeviceType();
  return deviceType === "desktop";
};

// Initialize from localStorage or defaults
// Mobile/tablet devices are ALWAYS forced to minimalist mode
const getInitialViewMode = (): ViewMode => {
  if (!deviceSupports3D()) {
    return "minimalist"; // Force minimalist on mobile/tablet
  }
  return (localStorage.getItem(STORAGE_KEY_VIEW_MODE) as ViewMode) || "3d";
};

const viewMode = ref<ViewMode>(getInitialViewMode());

// Initialize day mode from localStorage, or fancy fallback to auto-detect in real time
const getInitialDayMode = (): boolean => {
  const stored = localStorage.getItem(STORAGE_KEY_DAY_MODE);
  if (stored !== null) {
    return stored === "true";
  }
  // Auto-detect real time day mode
  return LightingManager.calculateRealTimeMode() === "day";
};

const isDayMode = ref(getInitialDayMode());

// Watch and persist changes to localStorage (only for desktop)
watch(viewMode, (newMode) => {
  if (deviceSupports3D()) {
    localStorage.setItem(STORAGE_KEY_VIEW_MODE, newMode);
  }
});

watch(isDayMode, (newMode) => {
  localStorage.setItem(STORAGE_KEY_DAY_MODE, String(newMode));
});

/**
 * Composable for managing application view mode
 *
 * IMPORTANT: View mode (3D vs Minimalist) ONLY applies to the HOME PAGE (MagicPortfolio.vue)
 * All other routes (/about, /post/...) are ALWAYS rendered in "classic/minimalist" style
 *
 * Mobile/tablet devices are ALWAYS forced to minimalist mode (no 3D) for performance
 */
export function useViewMode() {
  const is3DMode = computed(() => viewMode.value === "3d");
  const isMinimalistMode = computed(() => viewMode.value === "minimalist");
  const canUse3DMode = computed(() => deviceSupports3D());

  /**
   * Set the view mode (3D or minimalist)
   * Note: This only affects the home page. Mobile/tablet cannot use 3D mode.
   */
  function setViewMode(mode: ViewMode) {
    // Prevent setting 3D mode on mobile/tablet
    if (mode === "3d" && !deviceSupports3D()) {
      console.warn("📱 3D mode not available on mobile/tablet devices");
      return;
    }

    viewMode.value = mode;
    console.log(`🎨 View mode changed to: ${mode}`);
  }

  /**
   * Toggle between 3D and minimalist mode
   * Note: Only works on desktop. Mobile/tablet stay in minimalist mode.
   */
  function toggle3DMode() {
    if (!deviceSupports3D()) {
      console.warn("📱 3D mode not available on mobile/tablet devices");
      return;
    }
    setViewMode(is3DMode.value ? "minimalist" : "3d");
  }

  /**
   * Force minimalist mode (used for mobile detection)
   */
  function forceMinimalistMode() {
    viewMode.value = "minimalist";
    console.log("📱 Forced minimalist mode (device-based)");
  }

  function setDayMode(isDark: boolean) {
    isDayMode.value = isDark;
  }

  function toggleDayMode() {
    isDayMode.value = !isDayMode.value;
    document.documentElement.classList.toggle("dark", !isDayMode.value);
  }

  return {
    // State
    viewMode,
    is3DMode,
    isMinimalistMode,
    isDayMode,
    canUse3DMode,

    // View mode methods (only affect home page)
    setViewMode,
    toggle3DMode,
    forceMinimalistMode,

    // Day/night mode methods (affect all pages)
    setDayMode,
    toggleDayMode,
  };
}
