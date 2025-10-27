<template>
  <div class="relative mt-6 p-6 flex flex-col justify-center max-w-3xl mx-auto">
    <header class="w-full text-center mb-6">
      <div class="text-6xl mb-4">🎉</div>
      <h1
        class="text-4xl font-bold mb-4"
        :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
      >
        {{ post.data.title || "Fun Fact" }}
      </h1>
    </header>

    <!-- Fact Content -->
    <div
      class="text-center text-xl leading-relaxed mb-8 p-6 rounded-xl shadow-lg"
      :class="{
        'bg-gradient-to-br from-yellow-50 to-orange-50 text-gray-800':
          isDayMode,
        'bg-gradient-to-br from-yellow-900/20 to-orange-900/20 text-gray-200':
          !isDayMode,
      }"
    >
      <p class="font-medium">
        {{ post.data.fact || post.data.description || "An interesting fact!" }}
      </p>
    </div>

    <!-- Additional Info if available -->
    <div
      v-if="post.data.details"
      class="prose max-w-none mx-auto"
      :class="{ 'prose-invert': !isDayMode }"
    >
      <p class="whitespace-pre-wrap">{{ post.data.details }}</p>
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
