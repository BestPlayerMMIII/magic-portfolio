<template>
  <footer
    class="text-center border-t mt-12 text-sm mobile-safe-footer"
    :class="{
      'text-gray-800 border-gray-200 bg-white/50': isDayMode,
      'text-white border-purple-500/30 bg-black/20': !isDayMode,
    }"
  >
    <div class="max-w-7xl mx-auto py-8 px-4">
      <p class="mb-2">
        &copy; {{ currentYear }}
        <a
          href="https://bestplayer.dev"
          target="_blank"
          rel="noopener noreferrer"
          >{{ authorName }}</a
        >. All rights reserved.
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

<style scoped>
/* Mobile-specific footer spacing to avoid browser navigation bar */
@media (max-width: 768px) {
  .mobile-safe-footer {
    /* Add padding that accounts for mobile browser UI */
    padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 80px);
    margin-bottom: 0;
  }
}
</style>
