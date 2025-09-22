<template>
  <div
    class="h-screen w-screen flex flex-col"
    :class="{ 'bg-[rgb(242,242,242)]': isDayMode }"
  >
    <!-- Header component -->
    <AppHeader
      :isNavigationMinimized="false"
      :isDayMode="isDayMode"
      :toggleNavigation="toggleNavigation"
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
            <div
              v-if="imageLoading"
              class="w-32 h-32 rounded-xl bg-gradient-to-br from-purple-300 via-pink-200 to-indigo-200 animate-pulse"
            ></div>
            <img
              v-else-if="loadedImageUrl"
              :src="loadedImageUrl"
              alt="Thumbnail"
              class="w-32 h-32 object-cover rounded-xl shadow-lg border-2 border-purple-300"
            />
            <img
              v-else-if="post.data.header.image.thumbnailUrl"
              :src="post.data.header.image.thumbnailUrl"
              alt="Thumbnail"
              class="w-32 h-32 object-cover rounded-xl shadow-lg border-2 border-gray-200"
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
      </div>
      <!-- TODO other post types -->
      <!-- Still loading -->
      <div v-else class="flex justify-center items-center h-full">
        Loading post...
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
import AppHeader from "@/components/AppHeader.vue";

interface PostInfo {
  schemaId: string;
  postId: string;
}

const info = ref<PostInfo | null>(null);
const post = ref<ContentItem<any> | null>(null);

// Day/Night mode state
const isDayMode = ref(false);

// Async image loading
const loadedImageUrl = ref<string | null>(null);
const imageLoading = ref(false);

const fetchImage = async (url: string) => {
  imageLoading.value = true;
  try {
    // Simulate async fetch (could be replaced with actual fetch if needed)
    const response = await fetch(url);
    if (!response.ok) throw new Error("Image fetch failed");
    // Create a blob URL for the image
    const blob = await response.blob();
    loadedImageUrl.value = URL.createObjectURL(blob);
  } catch (e) {
    loadedImageUrl.value = null;
  } finally {
    imageLoading.value = false;
  }
};

watch(
  () => post.value?.data.header.image?.url,
  (url) => {
    if (url) fetchImage(url);
    else loadedImageUrl.value = null;
  },
  { immediate: true }
);

onMounted(async () => {
  const pathname = window.location.pathname;
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 3 && segments[0] === "post") {
    const schemaId = segments[1];
    const postId = segments[2];
    info.value = { schemaId, postId };
    post.value = await apiWithCache.getByType(schemaId).then((items) => {
      return items.find((item) => item.metadata.id === postId) || null;
    });
    // If image url is present, fetch it
    if (post.value?.data.header.image?.url) {
      fetchImage(post.value.data.header.image.url);
    }
  } else {
    console.error("Invalid URL format. Expected /post/:schemaId/:postId");
    window.location.href = "/";
  }
});

const toggleNavigation = () => {};
const toggleDayNightMode = () => {
  isDayMode.value = !isDayMode.value;
  document.documentElement.classList.toggle("dark", !isDayMode.value);
};
</script>
