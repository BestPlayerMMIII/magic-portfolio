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
      <!-- Main content area -->
      <div
        v-if="post?.schemaId === 'project'"
        class="relative mt-6 p-6 flex justify-center"
      >
        <!-- Project -->
        <header>
          <h1
            class="text-4xl font-bold mb-4 text-center"
            :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
          >
            Project
          </h1>
        </header>
        Content
      </div>
      <div
        v-else-if="post?.schemaId === 'blog-post'"
        class="relative mt-6 p-6 flex flex-col justify-center"
      >
        <!-- Blog Post -->
        <header class="w-full text-center mb-6">
          <h1
            class="text-4xl font-bold mb-4 text-center"
            :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
          >
            {{ post?.data.header.title }}
          </h1>

          <div class="flex justify-center mb-4">
            <!-- Show loading state while fetching full resolution -->
            <div
              v-if="!loadedImageUrl && imageLoading"
              class="w-32 h-32 rounded-xl bg-gradient-to-br from-purple-300 via-pink-200 to-indigo-200 animate-pulse"
            ></div>
            <!-- Show full resolution image when loaded -->
            <img
              v-else-if="loadedImageUrl"
              :src="loadedImageUrl"
              alt="Post header image"
              class="w-32 h-32 object-cover rounded-xl shadow-lg border-2 border-purple-300 transition-all duration-300"
            />
            <!-- Show thumbnail as fallback (comes from server) -->
            <img
              v-else-if="post.data.header.image?.thumbnailUrl"
              :src="post.data.header.image.thumbnailUrl"
              alt="Post header thumbnail"
              class="w-32 h-32 object-cover rounded-xl shadow-lg border-2 border-gray-200 transition-all duration-300"
            />
          </div>

          <p
            class="text-sm mb-2 text-center"
            :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
          >
            By {{ post?.metadata.author }} |
            {{ new Date(post?.metadata.updatedAt).toLocaleDateString() }}
          </p>

          <!-- Tags section -->
          <div
            v-if="post?.data.header.tags && post.data.header.tags.length"
            class="flex flex-wrap justify-center gap-2 mb-4"
          >
            <span
              v-for="tag in post.data.header.tags"
              :key="tag"
              class="px-3 py-1 rounded-full text-xs font-semibold shadow-md transition-all duration-200 cursor-pointer select-none bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-400 text-white hover:scale-105 hover:from-purple-600 hover:to-indigo-500"
            >
              #{{ tag }}
            </span>
          </div>

          <hr class="mb-6 border-t" />
        </header>
        <!-- Render raw HTML from post.data.content -->
        <div
          v-html="post.data.content"
          class="prose min-w-[60%] mx-auto"
          :class="{ 'prose-invert': !isDayMode }"
        ></div>
        <BackButton />
      </div>
      <!-- TODO other post types -->
      <!-- Post not found -->
      <div
        v-else
        class="flex flex-col items-center justify-center h-full gap-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-gray-400 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
          />
        </svg>
        <h2
          class="text-2xl font-semibold"
          :class="{ 'text-gray-600': isDayMode, 'text-gray-300': !isDayMode }"
        >
          Post not found
        </h2>
        <p
          class="mb-2"
          :class="{ 'text-gray-500': isDayMode, 'text-gray-400': !isDayMode }"
        >
          Sorry, the post you are looking for does not exist or was removed.
        </p>
        <BackButton />
      </div>
      <!-- Footer component -->
      <div
        class="text-center p-6 border-t mt-12 text-sm"
        :class="{ 'text-gray-800': isDayMode, 'text-white': !isDayMode }"
      >
        &copy; 2025 BestPlayer. All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem } from "@/types";
import { onMounted, ref, watch } from "vue";
import apiWithCache from "@/services/apiWithCache";
import mediaService from "@/services/mediaService";
import NavigationHeader from "@/components/NavigationHeader.vue";
import BackButton from "@/components/BackButton.vue";

interface PostInfo {
  schemaId: string;
  postId: string;
}

const info = ref<PostInfo | null>(null);
const post = ref<ContentItem<any> | null>(null);

// Day/Night mode state
const isDayMode = ref(false);

// Media loading states
const loadedImageUrl = ref<string | null>(null);
const imageLoading = ref(false);
const contentLoading = ref(false);

// Progressive enhancement for header image
const fetchFullImage = async (imageField: any) => {
  if (!imageField) return;

  // Don't show loading if we already have a thumbnail
  if (!imageField.thumbnailUrl) {
    imageLoading.value = true;
  }

  try {
    const fullData = await mediaService.fetchFullForField(imageField);
    if (fullData?.url) {
      loadedImageUrl.value = fullData.url;
    }
  } catch (e) {
    console.error("Failed to load full image:", e);
  } finally {
    imageLoading.value = false;
  }
};

// Watch for image changes and load full resolution
watch(
  () => post.value?.data.header.image,
  (imageField) => {
    if (imageField) {
      // Reset full resolution state
      loadedImageUrl.value = null;
      // Fetch full resolution in background
      fetchFullImage(imageField);
    } else {
      loadedImageUrl.value = null;
    }
  },
  { immediate: true }
);

// Progressive enhancement for content HTML
const enhanceContentMedia = async (postId: string) => {
  if (!post.value?.data.content) return;

  contentLoading.value = true;
  try {
    // Fetch the FULL version from the server (which processes original gitcms-media tags)
    const response = await fetch(`/api/blog/${postId}/full`);
    if (!response.ok) throw new Error("Failed to fetch full resolution post");

    const result = await response.json();
    if (result.success && result.data[0]) {
      // Update only the content with full resolution
      if (post.value) {
        post.value.data.content = result.data[0].data.content;
      }
    }
  } catch (e) {
    console.error("Failed to enhance content media:", e);
  } finally {
    contentLoading.value = false;
  }
};

onMounted(async () => {
  const pathname = window.location.pathname;
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 3 && segments[0] === "post") {
    const schemaId = segments[1];
    const postId = segments[2];
    info.value = { schemaId, postId };

    // Fetch post data (already has thumbnails from server)
    post.value = await apiWithCache.getByType(schemaId).then((items) => {
      return items.find((item) => item.id === postId) || null;
    });

    // Progressive enhancement: load full resolution media
    if (post.value) {
      // Header image will be loaded by the watcher (runs automatically)
      // Content media will be enhanced in background
      enhanceContentMedia(postId);
    }
  } else {
    console.error("Invalid URL format. Expected /post/:schemaId/:postId");
    window.location.href = "/";
  }
});

const toggleDayNightMode = () => {
  isDayMode.value = !isDayMode.value;
  document.documentElement.classList.toggle("dark", !isDayMode.value);
};
</script>
