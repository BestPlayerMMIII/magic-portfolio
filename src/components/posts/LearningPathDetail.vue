<template>
  <div class="relative mt-6 p-6 flex flex-col justify-center max-w-4xl mx-auto">
    <header class="w-full text-center mb-6">
      <h1
        class="text-4xl font-bold mb-4"
        :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
      >
        {{ post.data.title || "Learning Path" }}
      </h1>
      <p
        v-if="post.data.description"
        class="text-lg mb-4"
        :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
      >
        {{ post.data.description }}
      </p>
    </header>

    <!-- Topics/Steps if available -->
    <div v-if="post.data.topics" class="mb-6">
      <h2
        class="text-2xl font-semibold mb-3 text-center"
        :class="{ 'text-gray-800': isDayMode, 'text-white': !isDayMode }"
      >
        Topics Covered
      </h2>
      <div class="space-y-2">
        <div
          v-for="(topic, index) in post.data.topics"
          :key="index"
          class="p-3 rounded-lg transition-all duration-200"
          :class="{
            'bg-green-100 hover:bg-green-200': isDayMode,
            'bg-green-500/20 hover:bg-green-500/30': !isDayMode,
          }"
        >
          <span
            class="font-medium"
            :class="{
              'text-green-700': isDayMode,
              'text-green-300': !isDayMode,
            }"
          >
            {{ index + 1 }}. {{ topic }}
          </span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div
      class="prose max-w-none mx-auto"
      :class="{ 'prose-invert': !isDayMode }"
    >
      <p v-if="post.data.content" class="whitespace-pre-wrap">
        {{ post.data.content }}
      </p>
      <p v-else class="text-center text-gray-500">
        More details about this learning path coming soon...
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
