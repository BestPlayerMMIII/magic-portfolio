<template>
  <div class="collaborations-list space-y-4">
    <div
      v-for="collab in items"
      :key="collab.id"
      class="collab-card rounded-lg p-4 sm:p-6 border transition-all duration-300"
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
          {{ collab.data.title }}
        </h3>
        <span
          class="px-3 py-1 rounded-full text-xs font-medium self-start border"
          :class="[
            colors.accentBg,
            colors.accentColor,
            colors.accentBorder,
          ]"
        >
          {{ collab.data.cStatus }}
        </span>
      </div>

      <p
        class="mb-3 sm:mb-4 text-sm line-clamp-10"
        :class="colors.cardText"
      >
        {{ collab.data.description }}
      </p>

      <div class="mb-4">
        <p
          class="text-xs mb-2"
          :class="colors.cardTextMuted"
        >
          Collaborators:
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="collaborator in collab.data.collaborators"
            :key="collaborator"
            class="px-3 py-1 rounded-full text-xs font-medium transition-colors border"
            :class="[
              colors.badgeBg,
              colors.badgeText,
              colors.badgeBorder,
            ]"
          >
            {{ collaborator }}
          </span>
        </div>
      </div>

      <div class="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        <span
          v-for="tech in collab.data.technologies"
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

      <div
        v-if="collab.data.githubUrl || collab.data.liveUrl"
        class="flex flex-wrap gap-2"
      >
        <button
          :class="[
            baseButtonLink,
            colors.primaryButtonBg,
            colors.primaryButtonHover,
            colors.primaryButtonText,
          ]"
          @click="$emit('item-click', collab)"
        >
          Read More &rarr;
        </button>
        <a
          v-if="collab.data.githubUrl"
          :href="collab.data.githubUrl"
          target="_blank"
          class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all border"
          :class="[
            colors.secondaryButtonBg,
            colors.secondaryButtonBorder,
            colors.secondaryButtonText,
            'hover:scale-105',
          ]"
        >
          GitHub
        </a>
        <a
          v-if="collab.data.liveUrl"
          :href="collab.data.liveUrl"
          target="_blank"
          class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all border"
          :class="[
            colors.secondaryButtonBg,
            colors.secondaryButtonBorder,
            colors.secondaryButtonText,
            'hover:scale-105',
          ]"
        >
          Live Demo
        </a>
      </div>
      <div v-else class="flex flex-wrap gap-2">
        <button
          :class="[
            baseButtonLink,
            colors.primaryButtonBg,
            colors.primaryButtonHover,
            colors.primaryButtonText,
          ]"
          @click="$emit('item-click', collab)"
        >
          Read More &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem, Collaboration } from "@/types";
import { baseButtonLink } from "@/utils/links";
import { useTheme } from "@/stores/themeStore";

const { colors } = useTheme();

defineProps<{
  items: ContentItem<Collaboration>[];
  isDayMode: boolean;
}>();

defineEmits<{
  "item-click": [item: ContentItem<Collaboration>];
}>();
</script>
