import { ref, computed } from "vue";

export type ViewMode = "3d" | "minimalist";

const viewMode = ref<ViewMode>("3d");
const isDayMode = ref(false);

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
