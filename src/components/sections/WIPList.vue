<template>
  <div class="wip-list space-y-4">
    <div
      v-for="item in items"
      :key="item.id"
      class="wip-card rounded-lg p-4 sm:p-6 border transition-all duration-300"
      :class="{
        'bg-white/90 border-gray-300 hover:shadow-lg': isDayMode,
        'bg-slate-800/70 border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/20':
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
          {{ item.data.title }}
        </h3>
        <span
          class="px-3 py-1 rounded-full text-xs font-medium self-start"
          :class="getPriorityClass(item.data.priority)"
        >
          {{ item.data.priority }}
        </span>
      </div>

      <p
        class="mb-3 sm:mb-4 text-sm line-clamp-10"
        :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
      >
        {{ item.data.description }}
      </p>

      <div class="mb-4">
        <div
          class="flex justify-between text-xs mb-2"
          :class="{ 'text-gray-600': isDayMode, 'text-gray-400': !isDayMode }"
        >
          <span>Progress</span>
          <span>{{ item.data.progress }}%</span>
        </div>
        <div
          class="w-full h-2 rounded-full overflow-hidden"
          :class="{ 'bg-gray-200': isDayMode, 'bg-gray-700': !isDayMode }"
        >
          <div
            class="h-2 rounded-full transition-all duration-300"
            :style="{
              width: `${item.data.progress}%`,
              background: `linear-gradient(90deg, #f59e0b, #ef4444)`,
            }"
          ></div>
        </div>
      </div>

      <div class="flex flex-wrap gap-1.5 sm:gap-2">
        <span
          v-for="tech in item.data.technologies"
          :key="tech"
          class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors"
          :class="{
            'bg-amber-100 text-amber-700 hover:bg-amber-200': isDayMode,
            'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30': !isDayMode,
          }"
        >
          {{ tech }}
        </span>
      </div>

      <p
        v-if="item.data.expectedCompletion"
        class="mt-4 text-xs"
        :class="{ 'text-gray-600': isDayMode, 'text-gray-400': !isDayMode }"
      >
        Expected completion: {{ formatDate(item.data.expectedCompletion) }}
      </p>

      <div class="mt-4">
        <button
          class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all"
          :class="{
            'bg-amber-500 hover:bg-amber-600 text-white': isDayMode,
            'bg-amber-600 hover:bg-amber-700 text-white': !isDayMode,
          }"
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

defineProps<{
  items: ContentItem<WorkInProgress>[];
  isDayMode: boolean;
}>();

defineEmits<{
  "item-click": [item: ContentItem<WorkInProgress>];
}>();

const getPriorityClass = (priority: string) => {
  const classes = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };
  return (
    classes[priority as keyof typeof classes] || "bg-gray-100 text-gray-700"
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};
</script>
