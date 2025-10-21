import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import apiWithCache from "./services/apiWithCache";
import "./style.css";

console.log("🎨 Initializing Magic Portfolio app...");

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
