// Theme UI configuration bridge
// Re-exports the UI configuration and active theme accessors
export { wizardLabUi as defaultThemeUi } from "@/themes/wizard-lab/config/ui";
export { wizardLabStrings as defaultThemeStrings } from "@/themes/wizard-lab/config/strings";
export { useTheme } from "@/stores/themeStore";
export type {
  ThemeUiConfig,
  ThemeColorTokens,
  ThemeStringsConfig,
} from "@/types/3d";
