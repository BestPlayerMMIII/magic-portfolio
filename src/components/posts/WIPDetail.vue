<template>
  <BasePostDetail :post="post" :isDayMode="isDayMode">
    <header class="w-full text-center mb-6">
      <h1
        class="text-4xl font-bold mb-4"
        :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
      >
        {{ post.data.title || post.data.name || "Work in Progress" }}
      </h1>
      <p
        v-if="post.data.description"
        class="text-lg mb-4"
        :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
      >
        {{ post.data.description }}
      </p>
    </header>

    <!-- Status Badge -->
    <div class="flex justify-center mb-6">
      <span
        class="px-6 py-3 rounded-full text-sm font-bold shadow-lg bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-white animate-pulse"
      >
        🚧 Work in Progress
      </span>
    </div>

    <!-- Content -->
    <div
      class="prose max-w-none mx-auto"
      :class="{ 'prose-invert': !isDayMode }"
    >
      <p v-if="post.data.notes" class="whitespace-pre-wrap">
        {{ post.data.notes }}
      </p>
      <p v-else class="text-center text-gray-500">
        More details coming soon...
      </p>
    </div>
  </BasePostDetail>
</template>

<script setup lang="ts">
import type { ContentItem } from "@/types";
import BasePostDetail from "./BasePostDetail.vue";

interface Props {
  post: ContentItem<any>;
  isDayMode: boolean;
}

defineProps<Props>();
</script>
