import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import apiWithCache from "./services/apiWithCache";
import "./style.css";

// Prevent multiple app initializations (for HMR)
const APP_INITIALIZED_KEY = "__MAGIC_PORTFOLIO_APP_INITIALIZED__";

declare global {
  var __MAGIC_PORTFOLIO_APP_INITIALIZED__: boolean | undefined;
}

if (!globalThis[APP_INITIALIZED_KEY]) {
  console.log("🎨 Initializing Magic Portfolio app...");

  // Create Vue app
  const app = createApp(App);

  // Create Pinia store
  const pinia = createPinia();

  // Setup app plugins
  app.use(pinia);
  app.use(router);

  // Initialize cache system after mounting
  app.mount("#app");

  // Initialize cache system with preloading
  apiWithCache.initialize().catch((error) => {
    console.error("❌ Failed to initialize cache system:", error);
    // Continue without cache - app will work with direct API calls
  });

  globalThis[APP_INITIALIZED_KEY] = true;
} else {
  console.log("♻️ App already initialized, skipping (HMR)");
}

// Optional: Add cache stats to window for debugging
if (import.meta.env.DEV) {
  (window as any).cacheStats = () => apiWithCache.getCacheStats();
  (window as any).clearCache = () => apiWithCache.clearCache();
  console.log("🔧 Debug functions available: cacheStats(), clearCache()");
}
