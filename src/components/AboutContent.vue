<template>
  <div
    class="w-full max-w-4xl mx-auto about-container"
    :class="[isDayMode ? 'mode-light' : 'mode-dark', colors.proseClass]"
  >
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-4">
      <div
        class="w-12 h-12 border-3 rounded-full animate-spin"
        :class="isDayMode ? 'border-stone-300 border-t-amber-600' : 'border-indigo-500/20 border-t-amber-400'"
      ></div>
      <p class="text-sm font-medium" :class="colors.cardTextMuted">
        Loading about details...
      </p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center py-8 gap-3 text-center"
    >
      <HugeiconsIcon :icon="AlertCircleIcon" :size="32" class="text-rose-400" />
      <p class="text-sm" :class="colors.cardTextMuted">
        {{ error }}
      </p>
      <button
        @click="loadContent"
        class="px-4 py-1.5 rounded-lg text-xs font-medium border transition-all"
        :class="`${colors.accentBg} ${colors.accentBorder} ${colors.accentColor}`"
      >
        Retry
      </button>
    </div>

    <!-- Content -->
    <div
      v-else-if="aboutContent"
      class="about-rendered-html prose lg:prose-lg max-w-none"
      v-html="aboutContent"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { apiService } from "@/services/api";
import { useTheme } from "@/stores/themeStore";

const { colors, isDayMode } = useTheme();

const props = defineProps<{
  initialContent?: string | null;
}>();

const emit = defineEmits<{
  loaded: [content: string];
}>();

const aboutContent = ref<string | null>(props.initialContent || null);
const loading = ref(!props.initialContent);
const error = ref<string | null>(null);

const loadContent = async () => {
  if (aboutContent.value) return;

  try {
    loading.value = true;
    error.value = null;

    const res = await apiService.getAboutContent();
    if (res) {
      aboutContent.value = res;
      emit("loaded", res);
    } else {
      throw new Error("Unable to load about content");
    }
  } catch (e) {
    console.error("Error loading about content:", e);
    error.value = e instanceof Error ? e.message : "Unknown error";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!aboutContent.value) {
    loadContent();
  }
});
</script>

<style scoped>
/* Base styles */
.about-rendered-html {
  @apply text-base leading-relaxed;
}

/* HIGH CONTRAST LIGHT MODE */
.mode-light :deep(h1) {
  @apply text-3xl sm:text-4xl font-extrabold mb-4 mt-6 text-stone-950 tracking-tight !important;
}
.mode-light :deep(h2) {
  @apply text-2xl sm:text-3xl font-bold mb-3 mt-5 text-stone-900 tracking-tight !important;
}
.mode-light :deep(h3) {
  @apply text-xl sm:text-2xl font-bold mb-2 mt-4 text-amber-900 !important;
}
.mode-light :deep(p) {
  @apply mb-4 text-stone-900 text-base leading-relaxed font-normal !important;
}
.mode-light :deep(ul),
.mode-light :deep(ol) {
  @apply ml-6 mb-4 text-stone-900 !important;
}
.mode-light :deep(li) {
  @apply mb-2 text-stone-900 !important;
}
.mode-light :deep(strong) {
  @apply text-stone-950 font-bold !important;
}
.mode-light :deep(a) {
  @apply text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-4 decoration-amber-500 hover:decoration-amber-800 transition-colors !important;
}
.mode-light :deep(code) {
  @apply bg-stone-200/90 border border-stone-300 px-2 py-0.5 rounded text-amber-950 text-sm font-mono font-medium !important;
}
.mode-light :deep(pre) {
  @apply bg-stone-900 border border-stone-800 p-4 rounded-xl overflow-x-auto my-4 text-stone-100 !important;
}
.mode-light :deep(blockquote) {
  @apply border-l-4 border-amber-600 bg-amber-50/90 px-4 py-2 italic text-stone-800 my-4 rounded-r-lg !important;
}

/* HIGH CONTRAST DARK MODE */
.mode-dark :deep(h1) {
  @apply text-3xl sm:text-4xl font-extrabold mb-4 mt-6 text-white tracking-tight !important;
}
.mode-dark :deep(h2) {
  @apply text-2xl sm:text-3xl font-bold mb-3 mt-5 text-indigo-200 tracking-tight !important;
}
.mode-dark :deep(h3) {
  @apply text-lg sm:text-xl font-semibold mb-2 mt-4 text-amber-200 !important;
}
.mode-dark :deep(p) {
  @apply mb-4 text-slate-200 leading-relaxed font-normal !important;
}
.mode-dark :deep(ul),
.mode-dark :deep(ol) {
  @apply ml-6 mb-4 text-slate-200 !important;
}
.mode-dark :deep(li) {
  @apply mb-2 text-slate-200 !important;
}
.mode-dark :deep(strong) {
  @apply text-white font-bold !important;
}
.mode-dark :deep(a) {
  @apply text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-4 transition-colors !important;
}
.mode-dark :deep(code) {
  @apply bg-indigo-950/80 border border-indigo-500/40 px-2 py-0.5 rounded text-amber-200 text-sm font-mono font-medium !important;
}
.mode-dark :deep(pre) {
  @apply bg-slate-950/90 border border-indigo-500/30 p-4 rounded-xl overflow-x-auto my-4 text-slate-100 !important;
}
.mode-dark :deep(blockquote) {
  @apply border-l-4 border-amber-400 bg-amber-950/30 px-4 py-2 italic text-slate-200 my-4 rounded-r-lg !important;
}

:deep(img) {
  @apply rounded-xl shadow-xl my-6 border border-stone-300/40 max-w-full;
}
</style>
