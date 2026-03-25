<template>
  <BasePostDetail
    :post="post"
    :isDayMode="isDayMode"
    v-slot="{ enhancedContent }"
  >
    <!-- Blog Post Header -->
    <article class="blog-post-shell w-full mx-auto">
      <header class="w-full mb-8 text-left">
      <h1
        class="blog-post-title text-4xl md:text-5xl font-bold mb-4"
        :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
      >
        {{ post.data.header.title }}
      </h1>
      
      <div class="mt-5 mb-5">
        <!-- Show loading state while fetching full resolution -->
        <div
          v-if="!loadedImageUrl && imageLoading"
          class="w-full h-64 md:h-80 rounded-2xl bg-gradient-to-br from-purple-300 via-pink-200 to-indigo-200 animate-pulse"
        ></div>
        <!-- Show full resolution image when loaded -->
        <img
          v-else-if="loadedImageUrl"
          :src="loadedImageUrl"
          alt="Post header image"
          class="blog-hero-image"
        />
      </div>

      <p
        class="text-sm mb-4 text-center"
        :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
      >
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
      class="prose prose-lg max-w-none mx-auto content-wrapper blog-post-body"
      :class="{ 'prose-invert': !isDayMode }"
    ></div>
    </article>
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

<style scoped>
.blog-post-shell {
  max-width: 860px;
}

.blog-post-title {
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.blog-hero-image {
  width: 100%;
  max-height: 62vh;
  object-fit: contain;
  border-radius: 1rem;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(148, 163, 184, 0.35);
}

.blog-post-body {
  line-height: 1.8;
}

:deep(.blog-post-body p) {
  margin-top: 1.15em;
  margin-bottom: 1.15em;
}

@media (max-width: 768px) {
  .blog-post-shell {
    max-width: 100%;
  }

  .blog-hero-image {
    max-height: 42vh;
  }
}
</style>
