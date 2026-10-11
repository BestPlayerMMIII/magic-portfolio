<template>
  <BasePostDetail :post="post" :isDayMode="isDayMode">
    <header class="w-full text-center mb-6">
      <h1
        class="text-4xl font-bold mb-4"
        :class="colors.panelTitle"
      >
        {{ post.data.title || "Learning Path" }}
      </h1>
      <p
        v-if="post.data.description"
        class="text-lg mb-4"
        :class="colors.panelTextMuted"
      >
        {{ post.data.description }}
      </p>
    </header>

    <!-- Topics/Steps if available -->
    <div v-if="post.data.topics" class="mb-6">
      <h2
        class="text-2xl font-semibold mb-3 text-center"
        :class="colors.panelTitle"
      >
        Topics Covered
      </h2>
      <div class="space-y-2">
        <div
          v-for="(topic, index) in post.data.topics"
          :key="index"
          class="p-3 rounded-lg transition-all duration-200 border"
          :class="[
            colors.badgeBg,
            colors.badgeBorder,
          ]"
        >
          <span
            class="font-medium"
            :class="colors.badgeText"
          >
            {{ index + 1 }}. {{ topic }}
          </span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div
      class="prose max-w-none mx-auto"
      :class="colors.proseClass"
    >
      <p v-if="post.data.content" class="whitespace-pre-wrap">
        {{ post.data.content }}
      </p>
      <p v-else class="text-center" :class="colors.cardTextMuted">
        More details about this learning path coming soon...
      </p>
    </div>
  </BasePostDetail>
</template>

<script setup lang="ts">
import type { ContentItem } from "@/types";
import BasePostDetail from "./BasePostDetail.vue";
import { useTheme } from "@/stores/themeStore";

const { colors } = useTheme();

interface Props {
  post: ContentItem<any>;
  isDayMode: boolean;
}

defineProps<Props>();
</script>
