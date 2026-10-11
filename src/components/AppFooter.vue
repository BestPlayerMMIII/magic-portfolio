<template>
  <footer
    class="text-center border-t mt-12 text-sm mobile-safe-footer"
    :class="[
      colors.cardTextMuted,
      colors.cardBorder,
      colors.navHeaderBackground,
    ]"
  >
    <div class="max-w-7xl mx-auto py-8 px-4">
      <p class="mb-2">
        &copy; {{ currentYear }}
        <a
          href="https://bestplayer.dev"
          target="_blank"
          rel="noopener noreferrer"
          >{{ authorName || strings.authorName }}</a
        >. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "@/stores/themeStore";

const { strings, colors } = useTheme();

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
