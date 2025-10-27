<template>
  <!-- Top Navigation - Enhanced Header -->
  <nav
    class="ui-nav transition-all duration-700 ease-in-out"
    :class="
      isNavigationMinimized
        ? 'flex p-4 absolute top-4 left-4 z-40'
        : 'block static w-full'
    "
  >
    <div
      class="nav-container transition-all duration-700 ease-in-out"
      :class="
        isNavigationMinimized
          ? 'flex justify-between items-center bg-black/30 backdrop-blur-sm px-6 py-3 mx-auto'
          : 'w-full bg-gradient-to-r from-black/80 via-black/90 to-black/80 backdrop-blur-md px-8 py-3 border-b border-purple-500/30 shadow-lg'
      "
      :style="{
        borderRadius: isNavigationMinimized ? '50px' : '0',
        transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        width: isNavigationMinimized ? 'auto' : '100%',
        maxWidth: isNavigationMinimized ? 'none' : '100%',
      }"
    >
      <!-- Full Width Header Layout -->
      <div
        v-if="!isNavigationMinimized"
        class="flex justify-between items-center w-full"
      >
        <!-- Left Section: Logo + Title -->
        <div class="flex items-center space-x-3">
          <div
            @click="toggleNavigation"
            class="ui-button w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
            style="pointer-events: auto; cursor: pointer"
          >
            <span class="text-white text-lg font-bold">✨</span>
          </div>
          <div class="flex flex-col">
            <h1
              class="ui-title text-2xl font-bold text-white transition-all duration-300"
            >
              <span
                class="gradient-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
              >
                Magic Portfolio
              </span>
            </h1>
            <p class="text-purple-300 text-xs font-medium tracking-wide">
              Interactive 3D Experience
            </p>
          </div>
        </div>

        <!-- Right Section: Controls -->
        <div class="flex items-center space-x-4">
          <!-- Classic Navigation Button -->
          <router-link
            to="/about"
            class="ui-button relative px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden group shadow-lg hover:shadow-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/50"
            style="pointer-events: auto; cursor: pointer"
            title="Switch to Classic Navigation"
          >
            <!-- Enhanced background animation -->
            <div
              class="absolute inset-0 transition-all duration-500 bg-gradient-to-r from-cyan-600/10 to-blue-600/10"
            ></div>

            <!-- Content -->
            <div class="relative z-10 flex items-center gap-2">
              <svg
                class="w-5 h-5 text-cyan-400 transition-all duration-300 transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <span v-if="!isMobile" class="text-cyan-300 font-medium text-sm">
                Classic View
              </span>
            </div>

            <!-- Enhanced ripple effect -->
            <div
              class="absolute inset-0 opacity-0 group-active:opacity-30 transition-opacity duration-150 rounded-xl bg-cyan-400"
            ></div>
          </router-link>

          <!-- Day/Night Mode Toggle -->
          <button
            @click="toggleDayNightMode"
            class="ui-button day-night-toggle relative p-3 rounded-xl transition-all duration-300 overflow-hidden group shadow-lg hover:shadow-xl"
            :class="
              isDayMode
                ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 hover:from-orange-500/30 hover:to-yellow-500/30 border border-orange-400/50'
                : 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 border border-purple-400/50'
            "
            style="pointer-events: auto; cursor: pointer"
            :title="isDayMode ? 'Switch to Night Mode' : 'Switch to Day Mode'"
          >
            <!-- Enhanced background animation -->
            <div
              class="absolute inset-0 transition-all duration-500"
              :class="
                isDayMode
                  ? 'bg-gradient-to-r from-yellow-400/10 to-orange-500/10'
                  : 'bg-gradient-to-r from-purple-600/10 to-indigo-600/10'
              "
            ></div>

            <!-- Icon container -->
            <div class="relative z-10 flex items-center justify-center">
              <!-- Day icon (sun) -->
              <div
                v-if="isDayMode"
                class="w-7 h-7 text-yellow-400 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12"
              >
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
                  />
                </svg>
              </div>

              <!-- Night icon (moon) -->
              <div
                v-else
                class="w-7 h-7 text-indigo-400 transition-all duration-300 transform group-hover:scale-110 group-hover:-rotate-12"
              >
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fill-rule="evenodd"
                    d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <!-- Enhanced ripple effect -->
            <div
              class="absolute inset-0 opacity-0 group-active:opacity-30 transition-opacity duration-150 rounded-xl"
              :class="isDayMode ? 'bg-orange-400' : 'bg-purple-400'"
            ></div>
          </button>
        </div>
      </div>

      <!-- Minimized Layout (existing) -->
      <div v-else class="flex justify-between items-center w-full">
        <!-- Logo/Title Section -->
        <div class="flex items-center space-x-4">
          <div
            class="flex items-center space-x-3"
            style="pointer-events: auto; cursor: pointer"
          >
            <div
              @click="toggleNavigation"
              class="ui-button w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
            >
              <span class="text-white text-lg font-bold">✨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, onUnmounted } from "vue";
import { isMobileDevice } from "@/utils/deviceDetection"; // adjust path if needed

const isMobile = ref(false);
function handleResize() {
  isMobile.value = isMobileDevice();
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

defineProps<{
  isNavigationMinimized: boolean;
  toggleNavigation: () => void;
  isDayMode: boolean;
  toggleDayNightMode: () => void;
}>();
</script>
