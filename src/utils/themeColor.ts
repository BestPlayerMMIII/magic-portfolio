/**
 * Utility to dynamically update mobile browser theme color
 * This affects the browser navigation bar color on mobile devices
 */

const DAY_MODE_COLOR = "#f2f2f2"; // Light gray background for day mode
const NIGHT_MODE_COLOR = "#1e1b4b"; // Dark indigo for night mode

export function updateThemeColor(isDayMode: boolean) {
  // Update the theme-color meta tag
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      "content",
      isDayMode ? DAY_MODE_COLOR : NIGHT_MODE_COLOR
    );
  }

  // Update color-scheme for better browser integration
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  if (metaColorScheme) {
    metaColorScheme.setAttribute("content", isDayMode ? "light" : "dark");
  }

  // Update document root for CSS color-scheme
  document.documentElement.style.colorScheme = isDayMode ? "light" : "dark";
}
