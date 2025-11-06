<template>
  <footer
    class="text-center p-6 border-t mt-12 text-sm"
    :class="{
      'text-gray-800 border-gray-200 bg-white/50': isDayMode,
      'text-white border-purple-500/30 bg-black/20': !isDayMode,
    }"
  >
    <div class="max-w-7xl mx-auto mb-12">
      <p class="mb-4">
        &copy; {{ currentYear }} {{ authorName }}. All rights reserved.
      </p>
      <p class="text-xs opacity-75">
        Built with Vue 3, TypeScript, Three.js & GitCMS
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";

defineProps<{
  isDayMode: boolean;
  authorName?: string;
}>();

const currentYear = computed(() => new Date().getFullYear());
</script>
