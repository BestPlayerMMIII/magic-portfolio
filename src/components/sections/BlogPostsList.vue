<template>
  <div class="blog-posts-list space-y-4">
    <div
      v-for="post in items"
      :key="post.id"
      class="blog-post-card rounded-lg p-4 sm:p-6 border transition-all duration-300"
      :class="[
        colors.cardBackground,
        colors.cardBorder,
        colors.cardHoverBorder,
        'hover:shadow-xl',
      ]"
    >
      <div
        class="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4"
      >
        <div
          v-if="post.data.header.image?.thumbnailUrl"
          class="flex-shrink-0 w-full sm:w-48 h-48 sm:h-48 rounded-lg overflow-hidden"
        >
          <img
            :src="post.data.header.image.thumbnailUrl"
            :alt="post.data.header.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="flex-1 min-w-0 w-full">
          <h3
            class="text-lg sm:text-xl font-semibold mb-2"
            :class="colors.cardTitle"
          >
            {{ post.data.header.title }}
          </h3>
          <p
            class="mb-3 text-sm line-clamp-10"
            :class="colors.cardText"
          >
            {{ post.data.header.excerpt }}
          </p>

          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="tag in post.data.header.tags"
              :key="tag"
              class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors border"
              :class="[
                colors.badgeBg,
                colors.badgeText,
                colors.badgeBorder,
              ]"
            >
              #{{ tag }}
            </span>
          </div>

          <p
            class="text-xs truncate"
            :class="colors.cardTextMuted"
          >
            By {{ post.metadata.author }} •
            {{ formatDate(post.metadata.updatedAt) }}
          </p>

          <div class="mt-4">
            <button
              :class="[
                baseButtonLink,
                colors.primaryButtonBg,
                colors.primaryButtonHover,
                colors.primaryButtonText,
              ]"
              @click="$emit('item-click', post)"
            >
              Read More &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem, BlogPost } from "@/types";
import { baseButtonLink } from "@/utils/links";
import { useTheme } from "@/stores/themeStore";

const { colors } = useTheme();

defineProps<{
  items: ContentItem<BlogPost>[];
  isDayMode: boolean;
}>();

defineEmits<{
  "item-click": [item: ContentItem<BlogPost>];
}>();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>
