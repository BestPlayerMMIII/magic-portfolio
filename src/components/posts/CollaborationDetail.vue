<template>
  <BasePostDetail :post="post" :isDayMode="isDayMode">
    <header class="w-full text-center mb-6">
      <h1
        class="text-4xl font-bold mb-4"
        :class="colors.panelTitle"
      >
        {{ post.data.title || post.data.name || "Collaboration" }}
      </h1>
      <p
        v-if="post.data.description"
        class="text-lg mb-4"
        :class="colors.panelTextMuted"
      >
        {{ post.data.description }}
      </p>
    </header>

    <!-- Collaborators if available -->
    <div v-if="post.data.collaborators" class="mb-6">
      <h2
        class="text-2xl font-semibold mb-3 text-center"
        :class="colors.panelTitle"
      >
        Collaborators
      </h2>
      <div class="flex flex-wrap justify-center gap-3">
        <span
          v-for="collab in post.data.collaborators"
          :key="collab"
          class="px-4 py-2 rounded-lg text-sm font-medium border"
          :class="[
            colors.badgeBg,
            colors.badgeText,
            colors.badgeBorder,
          ]"
        >
          {{ collab }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div
      class="prose max-w-none mx-auto"
      :class="colors.proseClass"
    >
      <p v-if="post.data.details" class="whitespace-pre-wrap">
        {{ post.data.details }}
      </p>
      <p v-else class="text-center" :class="colors.cardTextMuted">
        More details about this collaboration coming soon...
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
