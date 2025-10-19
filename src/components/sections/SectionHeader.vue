<template>
  <div class="section-header mb-8">
    <div class="flex items-center justify-center mb-4">
      <div
        class="text-6xl mb-2 animate-bounce-once"
        :style="{
          filter: `drop-shadow(0 0 20px ${description.color.accent})`,
        }"
      >
        {{ description.emoji }}
      </div>
    </div>
    <h1
      class="text-4xl md:text-5xl font-bold text-center mb-4"
      :class="{ 'text-gray-900': isDayMode, 'text-white': !isDayMode }"
    >
      {{ description.title }}
    </h1>
    <p
      class="text-lg text-center mb-2"
      :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }"
    >
      {{ description.description }}
    </p>
    <div
      class="max-w-3xl mx-auto text-center rounded-xl p-6 backdrop-blur-sm border"
      :style="{
        background: isDayMode
          ? 'rgba(255, 255, 255, 0.8)'
          : `linear-gradient(135deg, ${description.color.from}15, ${description.color.to}15)`,
        borderColor: `${description.color.accent}40`,
      }"
    >
      <p
        class="text-base leading-relaxed"
        :class="{ 'text-gray-800': isDayMode, 'text-gray-200': !isDayMode }"
      >
        {{ description.longDescription }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SectionDescription } from "@/config/sectionDescriptions";

defineProps<{
  description: SectionDescription;
  isDayMode: boolean;
}>();
</script>

<style scoped>
/* Bounce animation that plays only once */
@keyframes bounce-once {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-25%);
  }
}

.animate-bounce-once {
  animation: bounce-once 1s ease-in-out;
}
</style>
