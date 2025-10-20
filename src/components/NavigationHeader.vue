<template>
  <nav
    class="navigation-header w-full transition-all duration-300"
    :class="{
      'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm':
        isDayMode,
      'bg-gradient-to-r from-black/80 via-black/90 to-black/80 backdrop-blur-md border-b border-purple-500/30 shadow-lg':
        !isDayMode,
    }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Left Section: Logo + Title + View Mode -->
        <div class="flex items-center space-x-4">
          <!-- Logo/Home Button -->
          <a
            href="/"
            class="flex items-center space-x-2 group transition-all duration-300 hover:scale-105"
          >
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300"
            >
              <span class="text-white text-lg font-bold">✨</span>
            </div>
            <div class="hidden sm:block">
              <h1 class="text-lg font-bold">
                <span
                  class="gradient-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
                >
                  Magic Portfolio
                </span>
              </h1>
            </div>
          </a>

          <!-- View Mode Toggle (only on home page) -->
          <button
            v-if="isHomePage"
            @click="toggle3DMode"
            class="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm"
            :class="{
              'bg-purple-100 text-purple-700 hover:bg-purple-200': isDayMode,
              'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/50':
                !isDayMode,
            }"
          >
            <span>{{ is3DMode ? "🎨" : "🔮" }}</span>
            <span>{{ is3DMode ? "Minimalist" : "3D View" }}</span>
          </button>
        </div>

        <!-- Center Section: Navigation Links (minimalist mode) -->
        <div
          v-if="(isMinimalistMode || !isHomePage) && !isLoadingSections"
          ref="navLinksRef"
          class="hidden md:flex items-center space-x-1"
        >
          <!-- About Link -->
          <a
            href="/about"
            class="nav-link group px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium flex items-center overflow-hidden"
            :class="{
              'text-gray-700 hover:bg-gray-100 hover:text-purple-600':
                isDayMode && !isSectionActive('about'),
              'bg-purple-100 text-purple-700':
                isDayMode && isSectionActive('about'),
              'text-gray-300 hover:bg-white/10 hover:text-purple-300':
                !isDayMode && !isSectionActive('about'),
              'bg-purple-500/20 text-purple-300 border border-purple-500/50':
                !isDayMode && isSectionActive('about'),
            }"
          >
            <component :is="getSectionIcon('about', 'w-5 h-5 flex-shrink-0')" />
            <span class="nav-text whitespace-nowrap">About</span>
          </a>

          <a
            v-for="section in sections"
            :key="section.id"
            :href="`/post/${section.id}`"
            class="nav-link group px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium flex items-center overflow-hidden"
            :class="{
              'text-gray-700 hover:bg-gray-100 hover:text-purple-600':
                isDayMode && !isSectionActive(section.id),
              'bg-purple-100 text-purple-700':
                isDayMode && isSectionActive(section.id),
              'text-gray-300 hover:bg-white/10 hover:text-purple-300':
                !isDayMode && !isSectionActive(section.id),
              'bg-purple-500/20 text-purple-300 border border-purple-500/50':
                !isDayMode && isSectionActive(section.id),
            }"
          >
            <component
              :is="getSectionIcon(section.id, 'w-5 h-5 flex-shrink-0')"
            />
            <span class="nav-text whitespace-nowrap">{{ section.title }}</span>
          </a>
        </div>

        <!-- Right Section: Controls -->
        <div class="flex items-center space-x-2">
          <!-- Mobile Menu Toggle (for minimalist mode on mobile) -->
          <button
            v-if="isMinimalistMode || !isHomePage"
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg transition-all duration-200"
            :class="{
              'text-gray-700 hover:bg-gray-100': isDayMode,
              'text-gray-300 hover:bg-white/10': !isDayMode,
            }"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!showMobileMenu"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <!-- Day/Night Mode Toggle -->
          <button
            @click="toggleDayNightMode"
            class="p-2.5 rounded-lg transition-all duration-300 group"
            :class="{
              'bg-orange-100 hover:bg-orange-200': isDayMode,
              'bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50':
                !isDayMode,
            }"
            :title="isDayMode ? 'Switch to Night Mode' : 'Switch to Day Mode'"
          >
            <!-- Day icon (sun) -->
            <div
              v-if="isDayMode"
              class="w-5 h-5 text-yellow-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
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
              class="w-5 h-5 text-indigo-400 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12"
            >
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path
                  fill-rule="evenodd"
                  d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <!-- Mobile Menu (for minimalist mode) -->
      <div
        v-if="
          showMobileMenu &&
          (isMinimalistMode || !isHomePage) &&
          !isLoadingSections
        "
        class="md:hidden border-t py-2"
        :class="{
          'border-gray-200': isDayMode,
          'border-purple-500/30': !isDayMode,
        }"
      >
        <!-- About Link (Mobile) -->
        <a
          href="/about"
          class="block px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium mb-1 flex items-center gap-2"
          :class="{
            'text-gray-700 hover:bg-gray-100':
              isDayMode && !isSectionActive('about'),
            'bg-purple-100 text-purple-700':
              isDayMode && isSectionActive('about'),
            'text-gray-300 hover:bg-white/10':
              !isDayMode && !isSectionActive('about'),
            'bg-purple-500/20 text-purple-300':
              !isDayMode && isSectionActive('about'),
          }"
        >
          <component :is="getSectionIcon('about', 'w-5 h-5')" />
          <span>About</span>
        </a>
        <!-- Other Section Links -->
        <a
          v-for="section in sections"
          :key="section.id"
          :href="`/post/${section.id}`"
          class="block px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium mb-1 flex items-center gap-2"
          :class="{
            'text-gray-700 hover:bg-gray-100':
              isDayMode && !isSectionActive(section.id),
            'bg-purple-100 text-purple-700':
              isDayMode && isSectionActive(section.id),
            'text-gray-300 hover:bg-white/10':
              !isDayMode && !isSectionActive(section.id),
            'bg-purple-500/20 text-purple-300':
              !isDayMode && isSectionActive(section.id),
          }"
        >
          <component :is="getSectionIcon(section.id, 'w-5 h-5')" />
          <span>{{ section.title }}</span>
        </a>

        <!-- View Mode Toggle for Mobile -->
        <button
          v-if="isHomePage"
          @click="toggle3DMode"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm mt-2"
          :class="{
            'bg-purple-100 text-purple-700 hover:bg-purple-200': isDayMode,
            'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/50':
              !isDayMode,
          }"
        >
          <span>{{ is3DMode ? "🎨" : "🔮" }}</span>
          <span>Switch to {{ is3DMode ? "Minimalist" : "3D View" }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useViewMode } from "@/stores/viewModeStore";
import { getAllSectionDescriptions } from "@/config/sectionDescriptions";
import { getSectionIcon } from "@/config/sectionIcons";
import { apiWithCache } from "@/services/apiWithCache";

defineProps<{
  isDayMode: boolean;
  toggleDayNightMode: () => void;
}>();

const { is3DMode, isMinimalistMode, toggle3DMode } = useViewMode();

const showMobileMenu = ref(false);
const currentPath = ref("");
const visibleSections = ref<string[]>([]);
const isLoadingSections = ref(true);

const allSections = getAllSectionDescriptions();

// Filter sections based on visibility rules
const sections = computed(() => {
  return allSections.filter((section) =>
    visibleSections.value.includes(section.id)
  );
});

const isHomePage = computed(() => {
  return currentPath.value === "/" || currentPath.value === "";
});

const isSectionActive = (sectionId: string) => {
  return currentPath.value.includes(`/post/${sectionId}`);
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

// Load visible sections based on visibility rules and item counts
const loadVisibleSections = async () => {
  try {
    isLoadingSections.value = true;
    const categories = await apiWithCache.getAllCategories();

    // Filter to only visible categories
    visibleSections.value = categories
      .filter((cat) => cat.visible)
      .map((cat) => cat.id);

    console.log("Visible sections:", visibleSections.value);
  } catch (error) {
    console.error("Failed to load visible sections:", error);
    // Fallback: show all sections if fetching fails
    visibleSections.value = allSections.map((s) => s.id);
  } finally {
    isLoadingSections.value = false;
  }
};

onMounted(async () => {
  currentPath.value = window.location.pathname;
  await loadVisibleSections();
});
</script>

<style scoped>
.gradient-text {
  background-size: 200% auto;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Cool hover text reveal effect */
.nav-link {
  position: relative;
}

.nav-text {
  max-width: 0;
  opacity: 0;
  margin-left: 0;
  transform: translateX(-10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link:hover .nav-text {
  max-width: 200px;
  opacity: 1;
  margin-left: 0.5rem;
  transform: translateX(0);
}

/* Add smooth scale effect to icon on hover */
.nav-link:hover :deep(svg) {
  transform: scale(1.1) rotate(5deg);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-link :deep(svg) {
  transition: transform 0.3s ease;
}
</style>
