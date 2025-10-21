<template>
  <div class="blog-posts-list space-y-4">
    <div
      v-for="post in items"
      :key="post.id"
      class="blog-post-card rounded-lg p-4 sm:p-6 border cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      :class="{
        'bg-white/90 border-gray-300 hover:border-fuchsia-400 hover:shadow-xl':
          isDayMode,
        'bg-slate-800/70 border-fuchsia-500/30 hover:border-fuchsia-500/60 hover:shadow-2xl hover:shadow-fuchsia-500/20':
          !isDayMode,
      }"
      @click="$emit('item-click', post)"
    >
      <div
        class="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4"
      >
        <div
          v-if="post.data.header.image?.thumbnailUrl"
          class="flex-shrink-0 w-full sm:w-32 h-48 sm:h-32 rounded-lg overflow-hidden"
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
            :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
          >
            {{ post.data.header.title }}
          </h3>
          <p
            class="mb-3 text-sm line-clamp-10"
            :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
          >
            {{ post.data.header.excerpt }}
          </p>

          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="tag in post.data.header.tags"
              :key="tag"
              class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors"
              :class="{
                'bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200':
                  isDayMode,
                'bg-fuchsia-500/20 text-fuchsia-300 hover:bg-fuchsia-500/30':
                  !isDayMode,
              }"
            >
              #{{ tag }}
            </span>
          </div>

          <p
            class="text-xs truncate"
            :class="{ 'text-gray-600': isDayMode, 'text-gray-400': !isDayMode }"
          >
            By {{ post.metadata.author }} •
            {{ formatDate(post.metadata.updatedAt) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem, BlogPost } from "@/types";

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
