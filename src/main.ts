import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import apiWithCache from "./services/apiWithCache";
import "./style.css";

console.log("🎨 Initializing Magic Portfolio app...");

// Fix mobile viewport height (for browser navigation bars)
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// Set on load and on resize
setViewportHeight();
window.addEventListener("resize", setViewportHeight);
window.addEventListener("orientationchange", setViewportHeight);

// Create Vue app
const app = createApp(App);

// Create Pinia store
const pinia = createPinia();

// Setup app plugins
app.use(pinia);
app.use(router);

// Mount app
app.mount("#app");

// Initialize cache system with preloading
apiWithCache.initialize().catch((error) => {
  console.error("❌ Failed to initialize cache system:", error);
  // Continue without cache - app will work with direct API calls
});

// Optional: Add cache stats to window for debugging
if (import.meta.env.DEV) {
  (window as any).cacheStats = () => apiWithCache.getCacheStats();
  (window as any).clearCache = () => apiWithCache.clearCache();
  console.log("🔧 Debug functions available: cacheStats(), clearCache()");
}
