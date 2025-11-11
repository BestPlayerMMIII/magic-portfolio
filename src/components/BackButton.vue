<template>
  <div v-if="showBackButton" class="flex justify-center mt-8 gap-4">
    <!-- Back Button -->
    <button
      @click="handleBack"
      class="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-400 text-white font-bold shadow-lg hover:scale-105 hover:from-purple-600 hover:to-indigo-500 transition-all duration-200 flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {{ backButtonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import router from "@/router";
import { getDeviceType } from "@/utils/deviceDetection";

const deviceType = ref<"mobile" | "tablet" | "desktop">("desktop");
const isMobile = computed(
  () => deviceType.value === "mobile" || deviceType.value === "tablet"
);

onMounted(() => {
  deviceType.value = getDeviceType();
});

// Determine if we should show the back button
const showBackButton = computed(() => {
  const path = router.currentRoute.value.path;

  // Case 3: About or PostSection from mobile -> No button
  if (isMobile.value && (path === "/about" || path.match(/^\/post\/[^/]+$/))) {
    return false;
  }

  // All other cases: show the button
  return true;
});

// Determine the back button text
const backButtonText = computed(() => {
  const path = router.currentRoute.value.path;

  // Case 1: About or PostSection from desktop -> "Back to 3D"
  if (!isMobile.value && (path === "/about" || path.match(/^\/post\/[^/]+$/))) {
    return "Back to 3D";
  }

  // Case 2 & 4: Post detail page -> "Back"
  if (path.match(/^\/post\/[^/]+\/[^/]+$/)) {
    return "Back";
  }

  return "Back";
});

// Handle back button click
const handleBack = () => {
  const path = router.currentRoute.value.path;

  // Case 1: About or PostSection from desktop -> Go to home (3D)
  if (!isMobile.value && (path === "/about" || path.match(/^\/post\/[^/]+$/))) {
    router.push("/");
    return;
  }

  // Case 2 & 4: Post detail page
  if (path.match(/^\/post\/([^/]+)\/[^/]+$/)) {
    const schemaId = path.match(/^\/post\/([^/]+)\/[^/]+$/)?.[1];

    // Mobile case 4: Always go to section page
    if (isMobile.value && schemaId) {
      router.push(`/post/${schemaId}`);
      return;
    }

    // Desktop case 2: Check if we can go back in history
    // If history length > 2 (means we navigated within the app), try router.back()
    // Otherwise, go to section page if we have schemaId
    if (!isMobile.value) {
      if (window.history.length > 2) {
        // Try going back - router will handle it
        router.back();
      } else if (schemaId) {
        // Started from URL or external link - go to section
        router.push(`/post/${schemaId}`);
      } else {
        // Fallback to home
        router.push("/");
      }
      return;
    }
  }

  // Fallback: go back or to home
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
};
</script>
