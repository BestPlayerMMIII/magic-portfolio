<template>
  <div class="relative mt-6 p-6 flex flex-col justify-center">
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
      class="prose min-w-[60%] mx-auto"
      :class="{ 'prose-invert': !isDayMode }"
    ></div>

    <BackButton />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ContentItem } from "@/types";
import mediaService from "@/services/mediaService";
import BackButton from "@/components/BackButton.vue";
import { apiService } from "@/services/api";

interface Props {
  post: ContentItem<any>;
  isDayMode: boolean;
}

const props = defineProps<Props>();

// Media loading states
const loadedImageUrl = ref<string | null>(null);
const imageLoading = ref(false);
const enhancedContent = ref<string>("");
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

// Progressive enhancement for content HTML
const enhanceContentMedia = async (schemaId: string, postId: string) => {
  contentLoading.value = true;
  try {
    // Fetch the FULL version using the API service
    const fullPost = await apiService.getPostByIdFull(schemaId, postId);

    if (fullPost?.data?.content) {
      // Update only the content with full resolution
      enhancedContent.value = fullPost.data.content;
    }
  } catch (e) {
    console.error("Failed to enhance content media:", e);
    // Fallback to original content
    enhancedContent.value = props.post.data.content || "";
  } finally {
    contentLoading.value = false;
  }
};

// Initialize content
enhancedContent.value = props.post.data.content || "";

// Watch for image changes and load full resolution
watch(
  () => props.post.data.header.image,
  (imageField) => {
    if (imageField) {
      loadedImageUrl.value = null;
      fetchFullImage(imageField);
    } else {
      loadedImageUrl.value = null;
    }
  },
  { immediate: true }
);

// Watch for post changes and enhance content
watch(
  () => props.post.id,
  () => {
    enhancedContent.value = props.post.data.content || "";
    enhanceContentMedia(props.post.schemaId, props.post.id);
  },
  { immediate: true }
);
</script>
