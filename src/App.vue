<template>
  <div id="app" class="w-full h-full relative">
    <!-- Loading Screen -->
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-magic-400 mx-auto mb-4"
        ></div>
        <h2 class="text-white text-xl font-semibold">
          Preparing the Magic Laboratory...
        </h2>
        <p class="text-magic-200 mt-2">{{ loadingMessage }}</p>
      </div>
    </div>

    <!-- Main Application -->
    <router-view v-else />

    <!-- Error Toast -->
    <div
      v-if="error"
      class="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300"
      :class="error ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ error }}</span>
        <button @click="clearError" class="ml-4 text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiService } from "./services/api";

const isLoading = ref(true);
const loadingMessage = ref("Initializing magical components...");
const error = ref<string | null>(null);

const clearError = () => {
  error.value = null;
};

const initializeApp = async () => {
  try {
    loadingMessage.value = "Connecting to the mystical database...";

    // Test API connection
    await apiService.healthCheck();

    loadingMessage.value = "Loading magical artifacts...";

    // Simulate some loading time for a better UX
    await new Promise((resolve) => setTimeout(resolve, 1500));

    isLoading.value = false;
  } catch (err) {
    console.error("Failed to initialize app:", err);
    error.value =
      "Failed to connect to the magical realm. Please try again later.";
    isLoading.value = false;
  }
};

onMounted(() => {
  initializeApp();
});
</script>

<style scoped>
/* Component-specific styles can go here */
</style>
