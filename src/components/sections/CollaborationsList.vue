<template>
  <div class="collaborations-list space-y-4">
    <div
      v-for="collab in items"
      :key="collab.id"
      class="collab-card rounded-lg p-4 sm:p-6 border transition-all duration-300"
      :class="{
        'bg-white/90 border-gray-300 hover:shadow-lg': isDayMode,
        'bg-slate-800/70 border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/20':
          !isDayMode,
      }"
    >
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3"
      >
        <h3
          class="text-lg sm:text-xl font-semibold"
          :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
        >
          {{ collab.data.title }}
        </h3>
        <span
          class="px-3 py-1 rounded-full text-xs font-medium self-start"
          :class="getStatusClass(collab.data.cStatus)"
        >
          {{ collab.data.cStatus }}
        </span>
      </div>

      <p
        class="mb-3 sm:mb-4 text-sm line-clamp-10"
        :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
      >
        {{ collab.data.description }}
      </p>

      <div class="mb-4">
        <p
          class="text-xs mb-2"
          :class="{ 'text-gray-600': isDayMode, 'text-gray-400': !isDayMode }"
        >
          Collaborators:
        </p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="collaborator in collab.data.collaborators"
            :key="collaborator"
            class="px-3 py-1 rounded-full text-xs font-medium transition-colors"
            :class="{
              'bg-blue-100 text-blue-700 hover:bg-blue-200': isDayMode,
              'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30': !isDayMode,
            }"
          >
            {{ collaborator }}
          </span>
        </div>
      </div>

      <div class="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        <span
          v-for="tech in collab.data.technologies"
          :key="tech"
          class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors"
          :class="{
            'bg-gray-100 text-gray-700 hover:bg-gray-200': isDayMode,
            'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30': !isDayMode,
          }"
        >
          {{ tech }}
        </span>
      </div>

      <div
        v-if="collab.data.githubUrl || collab.data.liveUrl"
        class="flex flex-wrap gap-2"
      >
        <a
          v-if="collab.data.githubUrl"
          :href="collab.data.githubUrl"
          target="_blank"
          class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all"
          :class="{
            'bg-gray-800 hover:bg-gray-900 text-white': isDayMode,
            'bg-cyan-600 hover:bg-cyan-700 text-white': !isDayMode,
          }"
        >
          GitHub
        </a>
        <a
          v-if="collab.data.liveUrl"
          :href="collab.data.liveUrl"
          target="_blank"
          class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all"
          :class="{
            'bg-blue-500 hover:bg-blue-600 text-white': isDayMode,
            'bg-blue-600 hover:bg-blue-700 text-white': !isDayMode,
          }"
        >
          Live Demo
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem, Collaboration } from "@/types";

defineProps<{
  items: ContentItem<Collaboration>[];
  isDayMode: boolean;
}>();

const getStatusClass = (status: string) => {
  const classes = {
    planning: "bg-blue-100 text-blue-700",
    active: "bg-green-100 text-green-700",
    completed: "bg-purple-100 text-purple-700",
    paused: "bg-yellow-100 text-yellow-700",
  };
  return classes[status as keyof typeof classes] || "bg-gray-100 text-gray-700";
};
</script>
