<template>
  <div class="blog-posts-list space-y-4">
    <div
      v-for="post in items"
      :key="post.id"
      class="blog-post-card rounded-lg p-6 border cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      :class="{
        'bg-white/90 border-gray-300 hover:border-fuchsia-400 hover:shadow-xl':
          isDayMode,
        'bg-slate-800/70 border-fuchsia-500/30 hover:border-fuchsia-500/60 hover:shadow-2xl hover:shadow-fuchsia-500/20':
          !isDayMode,
      }"
      @click="$emit('item-click', post)"
    >
      <div class="flex items-start space-x-4">
        <div
          v-if="post.data.header.image?.thumbnailUrl"
          class="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden"
        >
          <img
            :src="post.data.header.image.thumbnailUrl"
            :alt="post.data.header.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="flex-1">
          <h3
            class="text-xl font-semibold mb-2"
            :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
          >
            {{ post.data.header.title }}
          </h3>
          <p
            class="mb-3 text-sm"
            :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
          >
            {{ post.data.header.excerpt }}
          </p>

          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="tag in post.data.header.tags"
              :key="tag"
              class="px-3 py-1 rounded-full text-xs font-medium transition-colors"
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
            class="text-xs"
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
