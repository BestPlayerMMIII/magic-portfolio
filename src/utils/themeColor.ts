/**
 * Utility to dynamically update mobile browser theme color
 * This affects the browser navigation bar color on mobile devices
 */

import { defaultThemeUi } from "@/config/themeUi";

export function updateThemeColor(isDayMode: boolean) {
  const color = isDayMode
    ? defaultThemeUi.light.pageBackgroundHex
    : defaultThemeUi.dark.pageBackgroundHex;

  // Update the theme-color meta tag
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", color);
  }

  // Update color-scheme for better browser integration
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  if (metaColorScheme) {
    metaColorScheme.setAttribute("content", isDayMode ? "light" : "dark");
  }

  // Update document root for CSS color-scheme
  document.documentElement.style.colorScheme = isDayMode ? "light" : "dark";
}
