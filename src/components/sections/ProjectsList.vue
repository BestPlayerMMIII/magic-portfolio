<template>
  <div class="projects-list grid gap-4 sm:grid-cols-1">
    <div
      v-for="project in items"
      :key="project.id"
      class="project-card rounded-lg p-4 sm:p-6 border transition-all duration-300"
      :class="{
        'bg-white/90 border-gray-300 hover:border-purple-400 hover:shadow-xl':
          isDayMode,
        'bg-slate-800/70 border-purple-500/30 hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20':
          !isDayMode,
      }"
    >
      <div
        class="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4"
      >
        <!-- Thumbnail Image -->
        <div
          v-if="project.data.header.image?.thumbnailUrl"
          class="flex-shrink-0 w-full sm:w-48 h-48 sm:h-48 rounded-lg overflow-hidden"
          :class="{
            'bg-gray-100': isDayMode,
            'bg-slate-900/50': !isDayMode,
          }"
        >
          <img
            :src="project.data.header.image.thumbnailUrl"
            :alt="project.data.header.title"
            class="w-full h-full object-contain"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 w-full">
          <h3
            class="text-lg sm:text-xl font-semibold mb-2 sm:mb-3"
            :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
          >
            {{ project.data.header.title }}
          </h3>
          <p
            class="mb-3 sm:mb-4 text-sm line-clamp-10"
            :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
          >
            {{ project.data.header.excerpt }}
          </p>

          <!-- Tags -->
          <div
            v-if="
              project.data.header.tags && project.data.header.tags.length > 0
            "
            class="flex flex-wrap gap-1.5 sm:gap-2 mb-3"
          >
            <span
              v-for="tag in project.data.header.tags"
              :key="tag"
              class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors"
              :class="{
                'bg-purple-100 text-purple-700 hover:bg-purple-200': isDayMode,
                'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30':
                  !isDayMode,
              }"
            >
              #{{ tag }}
            </span>
          </div>

          <!-- Technologies -->
          <div class="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            <span
              v-for="tech in project.data.technologies"
              :key="tech"
              class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors"
              :class="{
                'bg-indigo-100 text-indigo-700 hover:bg-indigo-200': isDayMode,
                'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30':
                  !isDayMode,
              }"
            >
              {{ tech }}
            </span>
          </div>

          <!-- Action Links -->
          <div class="flex flex-wrap gap-4">
            <button
              :class="[
                baseButtonLink,
                {
                  'bg-purple-500 hover:bg-purple-600 text-white': isDayMode,
                  'bg-purple-600 hover:bg-purple-700 text-white': !isDayMode,
                },
              ]"
              @click="$emit('item-click', project)"
            >
              Read More &rarr;
            </button>
            <ExternalLinks
              :links="getLinksFromPost(project)"
              :isDayMode="isDayMode"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem, Project } from "@/types";
import ExternalLinks from "@/components/ui/ExternalLinkButtons.vue";
import { baseButtonLink, getLinksFromPost } from "@/utils/links";

defineProps<{
  items: ContentItem<Project>[];
  isDayMode: boolean;
}>();

defineEmits<{
  "item-click": [item: ContentItem<Project>];
}>();
</script>
