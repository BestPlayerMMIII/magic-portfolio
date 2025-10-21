<template>
  <div class="relative mt-6 p-6 flex flex-col justify-center max-w-4xl mx-auto">
    <header class="w-full text-center mb-6">
      <h1
        class="text-4xl font-bold mb-4"
        :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
      >
        {{ post.data.title || post.data.name || "Collaboration" }}
      </h1>
      <p
        v-if="post.data.description"
        class="text-lg mb-4"
        :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
      >
        {{ post.data.description }}
      </p>
    </header>

    <!-- Collaborators if available -->
    <div v-if="post.data.collaborators" class="mb-6">
      <h2
        class="text-2xl font-semibold mb-3 text-center"
        :class="{ 'text-gray-800': isDayMode, 'text-white': !isDayMode }"
      >
        Collaborators
      </h2>
      <div class="flex flex-wrap justify-center gap-3">
        <span
          v-for="collab in post.data.collaborators"
          :key="collab"
          class="px-4 py-2 rounded-lg text-sm font-medium"
          :class="{
            'bg-indigo-100 text-indigo-700': isDayMode,
            'bg-indigo-500/20 text-indigo-300': !isDayMode,
          }"
        >
          {{ collab }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div
      class="prose max-w-none mx-auto"
      :class="{ 'prose-invert': !isDayMode }"
    >
      <p v-if="post.data.details" class="whitespace-pre-wrap">
        {{ post.data.details }}
      </p>
      <p v-else class="text-center text-gray-500">
        More details about this collaboration coming soon...
      </p>
    </div>

    <BackButton />
  </div>
</template>

<script setup lang="ts">
import type { ContentItem } from "@/types";
import BackButton from "@/components/BackButton.vue";

interface Props {
  post: ContentItem<any>;
  isDayMode: boolean;
}

defineProps<Props>();
</script>
