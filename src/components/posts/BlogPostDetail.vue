<template>
  <BasePostDetail
    :post="post"
    :isDayMode="isDayMode"
    v-slot="{ enhancedContent }"
  >
    <!-- Blog Post Header -->
    <header class="w-full text-center mb-6">
      <h1
        class="text-4xl font-bold mb-4 text-center"
        :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
      >
        {{ post.data.header.title }}
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
      </div>

      <p
        class="text-sm mb-2 text-center"
        :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
      >
        By {{ post.metadata.author }} |
        {{ new Date(post.metadata.updatedAt).toLocaleDateString() }}
      </p>

      <!-- Tags section -->
      <div
        v-if="post.data.header.tags && post.data.header.tags.length"
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
      v-html="enhancedContent"
      class="prose w-full max-w-none md:min-w-[60%] mx-auto content-wrapper"
      :class="{ 'prose-invert': !isDayMode }"
    ></div>
  </BasePostDetail>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ContentItem } from "@/types";
import mediaService from "@/services/mediaService";
import BasePostDetail from "./BasePostDetail.vue";

interface Props {
  post: ContentItem<any>;
  isDayMode: boolean;
}

const props = defineProps<Props>();

// Media loading states
const loadedImageUrl = ref<string | null>(null);
const imageLoading = ref(false);

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

// Initialize header image
loadedImageUrl.value = props.post.data.header.image.thumbnailUrl || null;

// Watch for image changes and load full resolution
watch(
  () => props.post.data.header.image,
  (imageField) => {
    if (imageField) {
      fetchFullImage(imageField);
    } else {
      loadedImageUrl.value = null;
    }
  },
  { immediate: true }
);
</script>
