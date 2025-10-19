<template>
  <div class="projects-list grid gap-4 md:grid-cols-2">
    <div
      v-for="project in items"
      :key="project.id"
      class="project-card rounded-lg p-6 border transition-all duration-300 cursor-pointer hover:scale-105"
      :class="{
        'bg-white/90 border-gray-300 hover:border-purple-400 hover:shadow-xl':
          isDayMode,
        'bg-slate-800/70 border-purple-500/30 hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20':
          !isDayMode,
      }"
      @click="$emit('item-click', project)"
    >
      <h3
        class="text-xl font-semibold mb-3"
        :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
      >
        {{ project.data.title }}
      </h3>
      <p
        class="mb-4 text-sm"
        :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
      >
        {{ project.data.description }}
      </p>

      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tech in project.data.technologies"
          :key="tech"
          class="px-3 py-1 rounded-full text-xs font-medium transition-colors"
          :class="{
            'bg-purple-100 text-purple-700 hover:bg-purple-200': isDayMode,
            'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30':
              !isDayMode,
          }"
        >
          {{ tech }}
        </span>
      </div>

      <div class="flex gap-2">
        <a
          v-if="project.data.githubUrl"
          :href="project.data.githubUrl"
          target="_blank"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :class="{
            'bg-gray-800 hover:bg-gray-900 text-white': isDayMode,
            'bg-purple-600 hover:bg-purple-700 text-white': !isDayMode,
          }"
          @click.stop
        >
          GitHub
        </a>
        <a
          v-if="project.data.liveUrl"
          :href="project.data.liveUrl"
          target="_blank"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :class="{
            'bg-blue-500 hover:bg-blue-600 text-white': isDayMode,
            'bg-fuchsia-600 hover:bg-fuchsia-700 text-white': !isDayMode,
          }"
          @click.stop
        >
          Live Demo
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem, Project } from "@/types";

defineProps<{
  items: ContentItem<Project>[];
  isDayMode: boolean;
}>();

defineEmits<{
  "item-click": [item: ContentItem<Project>];
}>();
</script>
