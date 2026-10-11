<template>
  <div class="learning-paths-list space-y-4">
    <div
      v-for="path in items"
      :key="path.id"
      class="learning-path-card rounded-lg p-4 sm:p-6 border transition-all duration-300"
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
          {{ path.data.title }}
        </h3>
        <span
          class="px-3 py-1 rounded-full text-xs font-medium self-start border"
          :class="[
            colors.accentBg,
            colors.accentColor,
            colors.accentBorder,
          ]"
        >
          {{ path.data.difficulty }}
        </span>
      </div>

      <p
        class="mb-2 text-sm line-clamp-10"
        :class="colors.cardText"
      >
        {{ path.data.description }}
      </p>

      <p
        class="mb-4 text-xs"
        :class="colors.cardTextMuted"
      >
        Category: {{ path.data.category }}
      </p>

      <div class="mb-4">
        <div
          class="flex justify-between text-xs mb-2"
          :class="colors.cardTextMuted"
        >
          <span>Progress</span>
          <span>{{ path.data.progress }}%</span>
        </div>
        <div
          class="w-full h-2 rounded-full overflow-hidden border"
          :class="colors.preloaderProgressTrack"
        >
          <div
            class="h-2 rounded-full transition-all duration-300"
            :class="`bg-gradient-to-r ${theme.ui?.preloaderProgressGradient || 'from-amber-500 via-amber-400 to-amber-300'}`"
            :style="{
              width: `${path.data.progress}%`,
            }"
          ></div>
        </div>
      </div>

      <div v-if="path.data.resources && path.data.resources.length > 0">
        <p
          class="text-xs mb-2 font-medium"
          :class="colors.cardTextMuted"
        >
          Resources ({{ getCompletedCount(path.data.resources) }}/{{
            path.data.resources.length
          }}
          completed):
        </p>
        <div class="space-y-2">
          <div
            v-for="(resource, idx) in path.data.resources.slice(0, 3)"
            :key="idx"
            class="flex items-center gap-2"
          >
            <component
              :is="resource.completed ? getCompletedIcon() : getPendingIcon()"
              class="w-4 h-4 flex-shrink-0"
              :class="resource.completed ? colors.accentColor : colors.cardTextMuted"
            />
            <span
              class="text-xs flex-1"
              :class="colors.cardText"
            >
              {{ resource.title }}
            </span>
            <span
              class="text-xs px-2 py-0.5 rounded border"
              :class="[
                colors.badgeBg,
                colors.badgeText,
                colors.badgeBorder,
              ]"
            >
              {{ resource.type }}
            </span>
          </div>
          <p
            v-if="path.data.resources.length > 3"
            class="text-xs"
            :class="colors.cardTextMuted"
          >
            + {{ path.data.resources.length - 3 }} more resources
          </p>
        </div>
      </div>

      <div class="mt-4">
        <button
          :class="[
            baseButtonLink,
            colors.primaryButtonBg,
            colors.primaryButtonHover,
            colors.primaryButtonText,
          ]"
          @click="$emit('item-click', path)"
        >
          Read More &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from "vue";
import type { VNode } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import { CheckmarkCircle01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import type { ContentItem, LearningPath, LearningResource } from "@/types";
import { baseButtonLink } from "@/utils/links";
import { useTheme } from "@/stores/themeStore";

const { theme, colors } = useTheme();

defineProps<{
  items: ContentItem<LearningPath>[];
  isDayMode: boolean;
}>();

defineEmits<{
  "item-click": [item: ContentItem<LearningPath>];
}>();

const getCompletedIcon = (): VNode =>
  h(HugeiconsIcon, { icon: CheckmarkCircle01Icon, size: 16 });

const getPendingIcon = (): VNode =>
  h(HugeiconsIcon, { icon: Clock01Icon, size: 16 });

const getCompletedCount = (resources: LearningResource[]) => {
  return resources.filter((r) => r.completed).length;
};
</script>
