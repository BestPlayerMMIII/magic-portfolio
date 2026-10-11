import { ref, computed } from "vue";
import defaultTheme from "@/themes";
import type {
  ThemeConfig,
  ThemeUiConfig,
  ThemeStringsConfig,
  ThemeColorTokens,
} from "@/types/3d";
import { useViewMode } from "./viewModeStore";

const currentTheme = ref<ThemeConfig>(defaultTheme);

export function useTheme() {
  const { isDayMode } = useViewMode();

  const theme = computed(() => currentTheme.value);
  const metadata = computed(() => currentTheme.value.metadata);

  // Dynamic strings from the active theme (never hardcoded!)
  const strings = computed<ThemeStringsConfig>(() => {
    if (currentTheme.value.strings) {
      return currentTheme.value.strings;
    }
    // Safe generic fallbacks if a custom third-party theme didn't specify strings
    return {
      authorName: currentTheme.value.metadata.author || "Creator",
      siteTitle: currentTheme.value.metadata.displayName || "3D Portfolio",
      siteSubtitle: "Interactive 3D Showcase",
      themeTitle: currentTheme.value.metadata.displayName || "3D Environment",
      themeSubtitle: "Interactive 3D Portfolio",
      aboutPrompt: "Discover the creator behind this scene",
      loadingStatus: "Preloading 3D models",
      readyStatus: "3D scene ready",
      enterButton: "Explore 3D Scene",
      exploreHint: "Continue reading or enter whenever you're ready",
      objectSearchPrompt: "Search for the {object} in the scene!",
      artifactsHeader: "Interactive Artifacts",
      aboutModalTitle: "About Me",
    };
  });

  // Dynamic UI color tokens based on isDayMode
  const colors = computed<ThemeColorTokens>(() => {
    const ui = currentTheme.value.ui;
    if (!ui) {
      return isDayMode.value ? defaultTheme.ui!.light : defaultTheme.ui!.dark;
    }
    return isDayMode.value ? ui.light : ui.dark;
  });

  // Dynamic 3D Scene clear color
  const sceneBackgroundColor = computed(() => {
    const bg = currentTheme.value.scene.background;
    if (bg) {
      return isDayMode.value ? bg.day : bg.night;
    }
    return isDayMode.value ? 0x24201c : 0x0a0d16;
  });

  function setTheme(newTheme: ThemeConfig) {
    currentTheme.value = newTheme;
  }

  return {
    theme,
    metadata,
    strings,
    colors,
    sceneBackgroundColor,
    isDayMode,
    setTheme,
  };
}

export default useTheme;
