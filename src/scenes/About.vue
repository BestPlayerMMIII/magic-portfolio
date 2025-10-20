<template>
  <div
    class="h-screen w-screen flex flex-col"
    :class="{ 'bg-[rgb(242,242,242)]': isDayMode }"
  >
    <!-- Navigation Header -->
    <NavigationHeader
      :isDayMode="isDayMode"
      :toggleDayNightMode="toggleDayNightMode"
    />

    <div class="w-full h-full flex-1 overflow-y-auto">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-full">
        <div class="flex flex-col items-center gap-4">
          <div
            class="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"
          ></div>
          <p
            class="text-lg font-medium"
            :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
          >
            Loading about page...
          </p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center h-full gap-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-red-400 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2
          class="text-2xl font-semibold"
          :class="{ 'text-gray-600': isDayMode, 'text-gray-300': !isDayMode }"
        >
          {{ error }}
        </h2>
        <p
          class="mb-2"
          :class="{ 'text-gray-500': isDayMode, 'text-gray-400': !isDayMode }"
        >
          The about page could not be loaded.
        </p>
        <a
          href="/"
          class="px-6 py-2 rounded-lg font-medium transition-all duration-200"
          :class="{
            'bg-purple-600 text-white hover:bg-purple-700': isDayMode,
            'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/50':
              !isDayMode,
          }"
        >
          Go Home
        </a>
      </div>

      <!-- Content -->
      <div
        v-else-if="aboutContent"
        class="relative mt-6 p-6 flex flex-col justify-center"
      >
        <!-- Special About Page Header -->
        <div class="max-w-4xl mx-auto w-full mb-8 text-center">
          <div
            class="inline-block p-4 rounded-full mb-4 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-indigo-500/20"
          >
            <svg
              class="w-12 h-12"
              :class="{
                'text-purple-600': isDayMode,
                'text-purple-400': !isDayMode,
              }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1
            class="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
          >
            About Me
          </h1>
        </div>

        <!-- Render HTML content -->
        <div
          v-html="aboutContent"
          class="prose lg:prose-xl max-w-4xl mx-auto"
          :class="{ 'prose-invert': !isDayMode }"
        ></div>

        <!-- Back Button -->
        <div class="max-w-4xl mx-auto w-full mt-12">
          <BackButton />
        </div>
      </div>

      <!-- Footer -->
      <div
        class="text-center p-6 border-t mt-12 text-sm"
        :class="{
          'text-gray-800 border-gray-200': isDayMode,
          'text-white border-purple-500/30': !isDayMode,
        }"
      >
        &copy; 2025 BestPlayer. All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import apiWithCache from "@/services/apiWithCache";
import NavigationHeader from "@/components/NavigationHeader.vue";
import BackButton from "@/components/BackButton.vue";
import { useViewMode } from "@/stores/viewModeStore";
import type { ContentItem, BlogPost } from "@/types";

// Use day mode from store
const { isDayMode, toggleDayMode } = useViewMode();

const aboutContent = ref<string | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;

    // Fetch all blog posts and find the one with id "about"
    const blogPosts = await apiWithCache.getByType("blog-post");
    const aboutPost = blogPosts.find(
      (post: ContentItem<BlogPost>) => post.id === "about"
    );

    if (!aboutPost) {
      throw new Error("About page not found");
    }

    // If we need full resolution, fetch it
    if (aboutPost.data.content) {
      aboutContent.value = aboutPost.data.content;
    } else {
      // Fetch full version if content is not available
      const response = await fetch(`/api/blog/about/full`);
      if (!response.ok) throw new Error("Failed to fetch about page");

      const result = await response.json();
      if (result.success && result.data[0]) {
        aboutContent.value = result.data[0].data.content;
      } else {
        throw new Error("About page content is empty");
      }
    }
  } catch (e) {
    console.error("Error loading about page:", e);
    error.value = e instanceof Error ? e.message : "Unknown error";
  } finally {
    loading.value = false;
  }
});

const toggleDayNightMode = () => {
  toggleDayMode();
  document.documentElement.classList.toggle("dark", !isDayMode.value);
};
</script>

<style scoped>
/* Additional prose styling for about page */
:deep(.prose) {
  @apply text-base leading-relaxed;
}

:deep(.prose h1) {
  @apply text-3xl font-bold mb-4 mt-8;
}

:deep(.prose h2) {
  @apply text-2xl font-bold mb-3 mt-6;
}

:deep(.prose h3) {
  @apply text-xl font-semibold mb-2 mt-4;
}

:deep(.prose p) {
  @apply mb-4;
}

:deep(.prose ul),
:deep(.prose ol) {
  @apply ml-6 mb-4;
}

:deep(.prose li) {
  @apply mb-2;
}

:deep(.prose a) {
  @apply text-purple-600 hover:text-purple-700 underline;
}

:deep(.prose-invert a) {
  @apply text-purple-400 hover:text-purple-300;
}

:deep(.prose img) {
  @apply rounded-lg shadow-lg my-6;
}
</style>
