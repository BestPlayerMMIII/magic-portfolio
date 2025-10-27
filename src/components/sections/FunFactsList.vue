<template>
  <div class="fun-facts-list grid gap-4 sm:grid-cols-1 md:grid-cols-2">
    <div
      v-for="fact in items"
      :key="fact.id"
      class="fun-fact-card rounded-lg p-4 sm:p-6 border transition-all duration-300 hover:scale-105"
      :class="{
        'bg-white/90 border-gray-300 hover:shadow-lg': isDayMode,
        'bg-slate-800/70 border-rose-500/30 hover:shadow-2xl hover:shadow-rose-500/20':
          !isDayMode,
      }"
    >
      <div class="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
        <span class="text-2xl sm:text-3xl flex-shrink-0">{{
          getCategoryEmoji(fact.data.category)
        }}</span>
        <span
          class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium"
          :class="getCategoryClass(fact.data.category)"
        >
          {{ fact.data.category }}
        </span>
      </div>
      <p
        class="text-sm leading-relaxed"
        :class="{ 'text-gray-800': isDayMode, 'text-gray-200': !isDayMode }"
      >
        {{ fact.data.content }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem, FunFact } from "@/types";

defineProps<{
  items: ContentItem<FunFact>[];
  isDayMode: boolean;
}>();

const getCategoryClass = (category: string) => {
  const classes = {
    personal: "bg-pink-100 text-pink-700",
    technical: "bg-blue-100 text-blue-700",
    random: "bg-purple-100 text-purple-700",
  };
  return (
    classes[category as keyof typeof classes] || "bg-gray-100 text-gray-700"
  );
};

const getCategoryEmoji = (category: string) => {
  const emojis = {
    personal: "💭",
    technical: "💻",
    random: "🎲",
  };
  return emojis[category as keyof typeof emojis] || "💡";
};
</script>
