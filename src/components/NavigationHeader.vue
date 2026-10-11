<template>
  <nav
    class="navigation-header w-full transition-all duration-300"
    :class="colors.navHeaderBackground"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="flex items-center h-16 relative">
        <!-- Left Section: Logo + Title -->
        <div
          class="flex items-center space-x-4 min-w-0"
          style="min-width: 180px"
        >
          <!-- Logo/Home Button -->
          <router-link
            to="/"
            class="flex items-center space-x-2 group transition-all duration-300 hover:scale-105"
          >
            <div
              class="w-9 h-9 rounded-xl border flex items-center justify-center shadow-lg transition-colors"
              :class="colors.navHeaderLogoButton || colors.header3DLogoButton"
            >
              <HugeiconsIcon :icon="AiMagicIcon" :size="20" />
            </div>
            <div class="hidden sm:block">
              <h1 class="text-base font-bold">
                <span
                  class="transition-colors duration-300"
                  :class="colors.navHeaderTitle"
                >
                  {{ strings.siteTitle }}
                </span>
              </h1>
            </div>
          </router-link>
        </div>

        <!-- Center Section: Navigation Links -->
        <div
          v-if="!isLoadingSections"
          ref="navLinksRef"
          class="hidden md:flex items-center space-x-1 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style="z-index: 1"
        >
          <!-- About Link -->
          <router-link
            to="/about"
            class="nav-link group px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium flex items-center overflow-hidden"
            :class="isSectionActive('about') ? colors.navHeaderLinkActive : colors.navHeaderLink"
          >
            <component :is="getSectionIcon('about', 'w-5 h-5 flex-shrink-0')" />
            <span class="nav-text whitespace-nowrap">About</span>
          </router-link>

          <router-link
            v-for="section in sections"
            :key="section.id"
            :to="`/post/${section.id}`"
            class="nav-link group px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium flex items-center overflow-hidden"
            :class="isSectionActive(section.id) ? colors.navHeaderLinkActive : colors.navHeaderLink"
          >
            <component
              :is="getSectionIcon(section.id, 'w-5 h-5 flex-shrink-0')"
            />
            <span class="nav-text whitespace-nowrap">{{ section.title }}</span>
          </router-link>
        </div>

        <!-- Right Section: Controls -->
        <div
          class="flex items-center space-x-2 min-w-0 justify-end ml-auto"
          style="min-width: 180px"
        >
          <!-- Mobile Menu Toggle -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg transition-all duration-200 border"
            :class="colors.navHeaderButtonBg || colors.header3DButtonBg"
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
            class="p-2.5 rounded-lg transition-all duration-300 group border"
            :class="colors.navHeaderButtonBg || colors.header3DButtonBg"
            :title="isDayMode ? 'Switch to Night Mode' : 'Switch to Day Mode'"
          >
            <!-- Day icon (sun) -->
            <div
              v-if="isDayMode"
              class="w-5 h-5 text-amber-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
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
              class="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12"
              :class="colors.accentColor"
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

      <!-- Mobile Menu -->
      <div
        v-if="showMobileMenu && !isLoadingSections"
        class="md:hidden border-t py-2"
        :class="colors.cardBorder"
      >
        <!-- About Link (Mobile) -->
        <router-link
          to="/about"
          class="block px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium mb-1 flex items-center gap-2"
          :class="isSectionActive('about') ? colors.navHeaderLinkActive : colors.navHeaderLink"
        >
          <component :is="getSectionIcon('about', 'w-5 h-5')" />
          <span>About</span>
        </router-link>
        <!-- Other Section Links -->
        <router-link
          v-for="section in sections"
          :key="section.id"
          :to="`/post/${section.id}`"
          class="block px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium mb-1 flex items-center gap-2"
          :class="isSectionActive(section.id) ? colors.navHeaderLinkActive : colors.navHeaderLink"
        >
          <component :is="getSectionIcon(section.id, 'w-5 h-5')" />
          <span>{{ section.title }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import { AiMagicIcon } from "@hugeicons/core-free-icons";
import { getAllSectionDescriptions } from "@/config/sectionDescriptions";
import { getSectionIcon } from "@/config/sectionIcons";
import { apiWithCache } from "@/services/apiWithCache";
import { useTheme } from "@/stores/themeStore";
import router from "@/router";

const { strings, colors } = useTheme();

defineProps<{
  isDayMode: boolean;
  toggleDayNightMode: () => void;
}>();

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
  currentPath.value = router.currentRoute.value.fullPath;
  await loadVisibleSections();
});

// Watch for route changes to update the current path
watch(
  () => router.currentRoute.value.fullPath,
  (newPath) => {
    currentPath.value = newPath;
  }
);
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
