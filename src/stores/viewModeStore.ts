import { ref, computed, watch } from "vue";
import { LightingManager } from "../services/core";

export type ViewMode = "3d" | "minimalist";

const STORAGE_KEY_VIEW_MODE = "magic-portfolio-view-mode";
const STORAGE_KEY_DAY_MODE = "magic-portfolio-day-mode";

// Initialize from localStorage or defaults
const viewMode = ref<ViewMode>(
  (localStorage.getItem(STORAGE_KEY_VIEW_MODE) as ViewMode) || "3d"
);

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

// Watch and persist changes to localStorage
watch(viewMode, (newMode) => {
  localStorage.setItem(STORAGE_KEY_VIEW_MODE, newMode);
});

watch(isDayMode, (newMode) => {
  localStorage.setItem(STORAGE_KEY_DAY_MODE, String(newMode));
});

/**
 * Composable for managing application view mode
 * Provides reactive state and methods for switching between 3D and minimalist views
 */
export function useViewMode() {
  const is3DMode = computed(() => viewMode.value === "3d");
  const isMinimalistMode = computed(() => viewMode.value === "minimalist");

  function setViewMode(mode: ViewMode) {
    viewMode.value = mode;
    console.log(`🎨 View mode changed to: ${mode}`);
  }

  function toggle3DMode() {
    setViewMode(is3DMode.value ? "minimalist" : "3d");
  }

  function setDayMode(isDark: boolean) {
    isDayMode.value = isDark;
  }

  function toggleDayMode() {
    isDayMode.value = !isDayMode.value;
    document.documentElement.classList.toggle("dark", !isDayMode.value);
  }

  return {
    viewMode,
    is3DMode,
    isMinimalistMode,
    isDayMode,
    setViewMode,
    toggle3DMode,
    setDayMode,
    toggleDayMode,
  };
}
