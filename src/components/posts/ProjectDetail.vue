<template>
  <BasePostDetail
    :post="post"
    :isDayMode="isDayMode"
    v-slot="{ enhancedContent }"
  >
    <!-- Project Header -->
    <header class="w-full text-center mb-8">
      <h1
        class="text-5xl font-bold mb-4"
        :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
      >
        {{ post.data.header.title }}
      </h1>

      <p
        class="text-xl mb-6 max-w-3xl mx-auto"
        :class="{ 'text-gray-600': isDayMode, 'text-gray-300': !isDayMode }"
      >
        {{ post.data.header.excerpt }}
      </p>

      <!-- Project Metadata -->
      <div
        class="flex flex-wrap justify-center gap-4 mb-6 text-sm"
        :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
      >
        <span v-if="post.data.status" class="flex items-center gap-1">
          <span class="text-lg">{{ getStatusEmoji(post.data.status) }}</span>
          <span class="font-medium">{{ post.data.status }}</span>
        </span>
        <span v-if="post.metadata.createdAt">
          Created: {{ new Date(post.metadata.createdAt).toLocaleDateString() }}
        </span>
        <span v-if="post.metadata.updatedAt">
          Updated: {{ new Date(post.metadata.updatedAt).toLocaleDateString() }}
        </span>
      </div>

      <!-- Tags -->
      <div
        v-if="post.data.header.tags && post.data.header.tags.length"
        class="flex flex-wrap justify-center gap-2 mb-6"
      >
        <span
          v-for="tag in post.data.header.tags"
          :key="tag"
          class="px-4 py-1.5 rounded-full text-sm font-semibold shadow-md transition-all duration-200 cursor-pointer select-none bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 text-white hover:scale-105 hover:from-blue-600 hover:to-teal-500"
        >
          {{ tag }}
        </span>
      </div>

      <hr class="mb-4 border-t" />
    </header>

    <h2
      class="text-2xl font-semibold mb-4 text-center"
      :class="{ 'text-gray-800': isDayMode, 'text-white': !isDayMode }"
    >
      Overview
    </h2>
    <!-- Render raw HTML from post.data.overview -->
    <div
      v-html="post.data.overview"
      class="prose w-full max-w-none md:min-w-[60%] mx-auto mb-4 content-wrapper"
      :class="{ 'prose-invert': !isDayMode }"
    ></div>

    <!-- Project Links -->
    <div class="mt-4 mb-8">
      <h2
        class="text-2xl font-semibold mb-4 text-center"
        :class="{ 'text-gray-800': isDayMode, 'text-white': !isDayMode }"
      >
        Links
      </h2>
      <div class="flex flex-wrap justify-center gap-4">
        <ExternalLinks
          :links="getLinksFromPost(props.post)"
          :isDayMode="isDayMode"
        />
      </div>
    </div>

    <!-- Technologies -->
    <div
      v-if="post.data.technologies && post.data.technologies.length"
      class="mt-4 mb-8"
    >
      <h2
        class="text-2xl font-semibold mb-4 text-center"
        :class="{ 'text-gray-800': isDayMode, 'text-white': !isDayMode }"
      >
        Technologies
      </h2>
      <div class="flex flex-wrap justify-center gap-3">
        <span
          v-for="tech in post.data.technologies"
          :key="tech"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
          :class="{
            'bg-blue-100 text-blue-700 hover:bg-blue-200': isDayMode,
            'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30': !isDayMode,
          }"
        >
          {{ tech }}
        </span>
      </div>
    </div>

    <!-- Render raw HTML from post.data.content -->
    <div
      v-html="enhancedContent"
      class="prose w-full max-w-none md:min-w-[60%] mx-auto content-wrapper"
      :class="{ 'prose-invert': !isDayMode }"
    ></div>
  </BasePostDetail>
</template>

<script setup lang="ts">
import type { ContentItem } from "@/types";
import BasePostDetail from "./BasePostDetail.vue";
import ExternalLinks from "@/components/ui/ExternalLinkButtons.vue";
import { getLinksFromPost } from "@/utils/links";

interface Props {
  post: ContentItem<any>;
  isDayMode: boolean;
}

const props = defineProps<Props>();

const getStatusEmoji = (status: string): string => {
  const statusMap: Record<string, string> = {
    completed: "✅",
    "in-progress": "🚧",
    planning: "📋",
    archived: "📦",
    active: "🟢",
  };
  return statusMap[status.toLowerCase()] || "📌";
};
</script>
