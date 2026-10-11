<template>
  <BasePostDetail :post="post" :isDayMode="isDayMode">
    <header class="w-full text-center mb-6">
      <h1
        class="text-4xl font-bold mb-4"
        :class="colors.panelTitle"
      >
        {{ post.data.title || post.data.name || "Work in Progress" }}
      </h1>
      <p
        v-if="post.data.description"
        class="text-lg mb-4"
        :class="colors.panelTextMuted"
      >
        {{ post.data.description }}
      </p>
    </header>

    <!-- Status Badge -->
    <div class="flex justify-center mb-6">
      <span
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg border"
        :class="[
          colors.accentBg,
          colors.accentBorder,
          colors.accentColor,
        ]"
      >
        <HugeiconsIcon :icon="Wrench01Icon" :size="16" />
        <span>Work in Progress</span>
      </span>
    </div>

    <!-- Content -->
    <div
      class="prose max-w-none mx-auto"
      :class="colors.proseClass"
    >
      <p v-if="post.data.notes" class="whitespace-pre-wrap">
        {{ post.data.notes }}
      </p>
      <p v-else class="text-center" :class="colors.cardTextMuted">
        More details coming soon...
      </p>
    </div>
  </BasePostDetail>
</template>

<script setup lang="ts">
import type { ContentItem } from "@/types";
import { HugeiconsIcon } from "@hugeicons/vue";
import { Wrench01Icon } from "@hugeicons/core-free-icons";
import BasePostDetail from "./BasePostDetail.vue";
import { useTheme } from "@/stores/themeStore";

const { colors } = useTheme();

interface Props {
  post: ContentItem<any>;
  isDayMode: boolean;
}

defineProps<Props>();
</script>
