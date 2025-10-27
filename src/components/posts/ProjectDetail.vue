<template>
  <div class="relative mt-6 p-6 flex flex-col justify-center max-w-6xl mx-auto">
    <!-- Project Header -->
    <header class="w-full text-center mb-8">
      <h1
        class="text-5xl font-bold mb-4"
        :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
      >
        {{ post.data.name }}
      </h1>

      <p
        class="text-xl mb-6 max-w-3xl mx-auto"
        :class="{ 'text-gray-600': isDayMode, 'text-gray-300': !isDayMode }"
      >
        {{ post.data.description }}
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
        v-if="post.data.tags && post.data.tags.length"
        class="flex flex-wrap justify-center gap-2 mb-6"
      >
        <span
          v-for="tag in post.data.tags"
          :key="tag"
          class="px-4 py-1.5 rounded-full text-sm font-semibold shadow-md transition-all duration-200 cursor-pointer select-none bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 text-white hover:scale-105 hover:from-blue-600 hover:to-teal-500"
        >
          {{ tag }}
        </span>
      </div>

      <hr class="mb-8 border-t" />
    </header>

    <!-- Project Links -->
    <div
      v-if="post.data.links && Object.keys(post.data.links).length"
      class="mb-8"
    >
      <h2
        class="text-2xl font-semibold mb-4 text-center"
        :class="{ 'text-gray-800': isDayMode, 'text-white': !isDayMode }"
      >
        Links
      </h2>
      <div class="flex flex-wrap justify-center gap-4">
        <a
          v-if="post.data.links.github"
          :href="post.data.links.github"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
          :class="{
            'bg-gray-800 text-white hover:bg-gray-900': isDayMode,
            'bg-gray-700 text-white hover:bg-gray-600': !isDayMode,
          }"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          GitHub
        </a>

        <a
          v-if="post.data.links.demo"
          :href="post.data.links.demo"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          Live Demo
        </a>

        <a
          v-for="(url, key) in customLinks"
          :key="String(key)"
          :href="url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
          :class="{
            'bg-blue-500 text-white hover:bg-blue-600': isDayMode,
            'bg-blue-600 text-white hover:bg-blue-500': !isDayMode,
          }"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          {{ formatLinkName(String(key)) }}
        </a>
      </div>
    </div>

    <!-- Technologies -->
    <div
      v-if="post.data.technologies && post.data.technologies.length"
      class="mb-8"
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

    <!-- Long Description / Content -->
    <div
      v-if="post.data.longDescription"
      class="mb-8 max-w-4xl mx-auto"
      :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
    >
      <h2
        class="text-2xl font-semibold mb-4"
        :class="{ 'text-gray-800': isDayMode, 'text-white': !isDayMode }"
      >
        About This Project
      </h2>
      <div class="prose max-w-none" :class="{ 'prose-invert': !isDayMode }">
        <p class="whitespace-pre-wrap">{{ post.data.longDescription }}</p>
      </div>
    </div>

    <BackButton />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ContentItem } from "@/types";
import BackButton from "@/components/BackButton.vue";

interface Props {
  post: ContentItem<any>;
  isDayMode: boolean;
}

const props = defineProps<Props>();

// Filter out known links to get custom ones
const customLinks = computed(() => {
  if (!props.post.data.links) return {};

  const { github, demo, ...rest } = props.post.data.links;
  return rest;
});

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

const formatLinkName = (key: string): string => {
  return key
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
</script>
