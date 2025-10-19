<template>
  <div class="learning-paths-list space-y-4">
    <div
      v-for="path in items"
      :key="path.id"
      class="learning-path-card rounded-lg p-6 border transition-all duration-300"
      :class="{
        'bg-white/90 border-gray-300 hover:shadow-lg': isDayMode,
        'bg-slate-800/70 border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/20':
          !isDayMode,
      }"
    >
      <div class="flex justify-between items-start mb-3">
        <h3
          class="text-xl font-semibold"
          :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
        >
          {{ path.data.title }}
        </h3>
        <span
          class="px-3 py-1 rounded-full text-xs font-medium"
          :class="getDifficultyClass(path.data.difficulty)"
        >
          {{ path.data.difficulty }}
        </span>
      </div>

      <p
        class="mb-2 text-sm"
        :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
      >
        {{ path.data.description }}
      </p>

      <p
        class="mb-4 text-xs"
        :class="{ 'text-gray-600': isDayMode, 'text-gray-400': !isDayMode }"
      >
        Category: {{ path.data.category }}
      </p>

      <div class="mb-4">
        <div
          class="flex justify-between text-xs mb-2"
          :class="{ 'text-gray-600': isDayMode, 'text-gray-400': !isDayMode }"
        >
          <span>Progress</span>
          <span>{{ path.data.progress }}%</span>
        </div>
        <div
          class="w-full h-2 rounded-full overflow-hidden"
          :class="{ 'bg-gray-200': isDayMode, 'bg-gray-700': !isDayMode }"
        >
          <div
            class="h-2 rounded-full transition-all duration-300"
            :style="{
              width: `${path.data.progress}%`,
              background: `linear-gradient(90deg, #10b981, #14b8a6)`,
            }"
          ></div>
        </div>
      </div>

      <div v-if="path.data.resources && path.data.resources.length > 0">
        <p
          class="text-xs mb-2 font-medium"
          :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
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
            <span class="text-lg">{{ resource.completed ? "✅" : "⏳" }}</span>
            <span
              class="text-xs flex-1"
              :class="{
                'text-gray-700': isDayMode,
                'text-gray-300': !isDayMode,
              }"
            >
              {{ resource.title }}
            </span>
            <span
              class="text-xs px-2 py-0.5 rounded"
              :class="{
                'bg-emerald-100 text-emerald-700': isDayMode,
                'bg-emerald-500/20 text-emerald-300': !isDayMode,
              }"
            >
              {{ resource.type }}
            </span>
          </div>
          <p
            v-if="path.data.resources.length > 3"
            class="text-xs"
            :class="{ 'text-gray-600': isDayMode, 'text-gray-400': !isDayMode }"
          >
            + {{ path.data.resources.length - 3 }} more resources
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem, LearningPath, LearningResource } from "@/types";

defineProps<{
  items: ContentItem<LearningPath>[];
  isDayMode: boolean;
}>();

const getDifficultyClass = (difficulty: string) => {
  const classes = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  };
  return (
    classes[difficulty as keyof typeof classes] || "bg-gray-100 text-gray-700"
  );
};

const getCompletedCount = (resources: LearningResource[]) => {
  return resources.filter((r) => r.completed).length;
};
</script>
