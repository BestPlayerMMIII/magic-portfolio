/**
 * Device Detection Utility
 * Provides reusable functions to detect device types and capabilities
 */

/**
 * Check if the current device is a mobile/touch device
 */
export function isMobileDevice(): boolean {
  // Check for touch support
  const hasTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - for older browsers
    navigator.msMaxTouchPoints > 0;

  // Check for mobile user agent
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileRegex.test(navigator.userAgent);

  // Check for small screen (typical mobile size)
  const isSmallScreen = window.innerWidth <= 768;

  // Consider it mobile if it has touch AND (is small screen OR has mobile UA)
  return hasTouch && (isSmallScreen || isMobileUA);
}

/**
 * Check if the device has touch capabilities
 */
export function isTouchDevice(): boolean {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - for older browsers
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Check if the device is a tablet
 */
export function isTabletDevice(): boolean {
  const hasTouch = isTouchDevice();
  const isTabletSize = window.innerWidth > 768 && window.innerWidth <= 1024;
  const tabletRegex = /iPad|Android(?!.*Mobile)/i;
  const isTabletUA = tabletRegex.test(navigator.userAgent);

  return hasTouch && (isTabletSize || isTabletUA);
}

/**
 * Get a descriptive device type
 */
export function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (isMobileDevice() && !isTabletDevice()) return "mobile";
  if (isTabletDevice()) return "tablet";
  return "desktop";
}
