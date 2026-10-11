<template>
  <div class="wip-list space-y-4">
    <div
      v-for="item in items"
      :key="item.id"
      class="wip-card rounded-lg p-4 sm:p-6 border transition-all duration-300"
      :class="[
        colors.cardBackground,
        colors.cardBorder,
        colors.cardHoverBorder,
        'hover:shadow-xl',
      ]"
    >
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3"
      >
        <h3
          class="text-lg sm:text-xl font-semibold"
          :class="colors.cardTitle"
        >
          {{ item.data.title }}
        </h3>
        <span
          class="px-3 py-1 rounded-full text-xs font-medium self-start border"
          :class="[
            colors.accentBg,
            colors.accentColor,
            colors.accentBorder,
          ]"
        >
          {{ item.data.priority }}
        </span>
      </div>

      <p
        class="mb-3 sm:mb-4 text-sm line-clamp-10"
        :class="colors.cardText"
      >
        {{ item.data.description }}
      </p>

      <div class="mb-4">
        <div
          class="flex justify-between text-xs mb-2"
          :class="colors.cardTextMuted"
        >
          <span>Progress</span>
          <span>{{ item.data.progress }}%</span>
        </div>
        <div
          class="w-full h-2 rounded-full overflow-hidden border"
          :class="colors.preloaderProgressTrack"
        >
          <div
            class="h-2 rounded-full transition-all duration-300"
            :class="`bg-gradient-to-r ${theme.ui?.preloaderProgressGradient || 'from-amber-500 via-amber-400 to-amber-300'}`"
            :style="{
              width: `${item.data.progress}%`,
            }"
          ></div>
        </div>
      </div>

      <div class="flex flex-wrap gap-1.5 sm:gap-2">
        <span
          v-for="tech in item.data.technologies"
          :key="tech"
          class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors border"
          :class="[
            colors.badgeBg,
            colors.badgeText,
            colors.badgeBorder,
          ]"
        >
          {{ tech }}
        </span>
      </div>

      <p
        v-if="item.data.expectedCompletion"
        class="mt-4 text-xs"
        :class="colors.cardTextMuted"
      >
        Expected completion: {{ formatDate(item.data.expectedCompletion) }}
      </p>

      <div class="mt-4">
        <button
          :class="[
            baseButtonLink,
            colors.primaryButtonBg,
            colors.primaryButtonHover,
            colors.primaryButtonText,
          ]"
          @click="$emit('item-click', item)"
        >
          Read More &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem, WorkInProgress } from "@/types";
import { baseButtonLink } from "@/utils/links";
import { useTheme } from "@/stores/themeStore";

const { theme, colors } = useTheme();

defineProps<{
  items: ContentItem<WorkInProgress>[];
  isDayMode: boolean;
}>();

defineEmits<{
  "item-click": [item: ContentItem<WorkInProgress>];
}>();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};
</script>
