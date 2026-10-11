<template>
  <div class="section-header mb-8">
    <div v-if="description.emoji" class="flex items-center justify-center mb-4">
      <div
        class="text-6xl mb-2 animate-bounce-once"
      >
        {{ description.emoji }}
      </div>
    </div>
    <h1
      class="text-4xl md:text-5xl font-bold text-center mb-4"
      :class="colors.panelTitle"
    >
      {{ description.title }}
    </h1>
    <p
      class="text-lg text-center mb-2"
      :class="colors.panelTextMuted"
    >
      {{ description.description }}
    </p>
    <div
      class="max-w-3xl mx-auto text-center rounded-xl p-6 backdrop-blur-sm border shadow-lg"
      :class="[
        colors.cardBackground,
        colors.cardBorder,
      ]"
    >
      <p
        class="text-base leading-relaxed"
        :class="colors.cardText"
      >
        {{ description.longDescription }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SectionDescription } from "@/config/sectionDescriptions";
import { useTheme } from "@/stores/themeStore";

const { colors } = useTheme();

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
