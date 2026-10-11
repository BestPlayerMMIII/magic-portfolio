<template>
  <Transition name="modal-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      style="pointer-events: auto"
    >
      <!-- Modal Container -->
      <div
        class="relative rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border"
        :class="`${colors.panelBackground} ${colors.panelBorder}`"
        @click.stop
      >
        <!-- Header -->
        <div
          class="sticky top-0 z-10 px-6 py-4 border-b"
          :class="`${colors.navHeaderBackground} ${colors.panelBorder}`"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                v-if="iconType || sectionId"
                class="w-10 h-10 rounded-xl border flex items-center justify-center"
                :class="`${colors.accentBg} ${colors.accentBorder} ${colors.accentColor}`"
              >
                <component
                  :is="getIcon"
                  v-if="iconType"
                  class="h-5 w-5"
                />
                <component
                  :is="getSectionIconComponent"
                  v-else-if="sectionId"
                  class="h-5 w-5"
                />
              </div>
              <h2 class="text-2xl font-bold" :class="colors.panelTitle">{{ title }}</h2>
            </div>
            <button
              @click="handleClose"
              class="p-2 rounded-lg transition-colors duration-200 group"
              :class="colors.panelCloseButton"
              title="Close"
            >
              <svg
                class="w-6 h-6 group-hover:rotate-90 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div
          class="overflow-y-auto max-h-[calc(90vh-100px)] p-6 modal-content-area"
          :class="[isDayMode ? 'mode-light' : 'mode-dark', colors.proseClass]"
        >
          <!-- Loading State -->
          <div
            v-if="loading"
            class="flex flex-col items-center justify-center py-12"
          >
            <div
              class="w-16 h-16 border-4 rounded-full animate-spin mb-4"
              :class="isDayMode ? 'border-stone-300 border-t-amber-600' : 'border-slate-700 border-t-amber-400'"
            ></div>
            <p class="text-lg font-medium" :class="colors.accentColor">{{ loadingText }}</p>
          </div>

          <!-- Error State -->
          <div
            v-else-if="error"
            class="flex flex-col items-center justify-center py-12"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 text-red-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 class="text-xl font-semibold mb-2" :class="colors.panelTitle">
              Failed to load
            </h3>
            <p :class="colors.panelTextMuted">{{ error }}</p>
          </div>

          <!-- Content -->
          <div v-else>
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, h } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import { InformationCircleIcon, Book01Icon } from "@hugeicons/core-free-icons";
import { getSectionIcon } from "@/config/sectionIcons";
import { useTheme } from "@/stores/themeStore";

const { colors, isDayMode } = useTheme();

const props = defineProps<{
  visible: boolean;
  title: string;
  emoji?: string;
  sectionId?: string;
  iconType?: "info" | "content";
  loading?: boolean;
  error?: string | null;
  loadingText?: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

// Get the appropriate icon based on type
const getIcon = computed(() => {
  if (props.iconType === "info") {
    return h(HugeiconsIcon, {
      icon: InformationCircleIcon,
      size: 24,
    });
  } else if (props.iconType === "content") {
    return h(HugeiconsIcon, {
      icon: Book01Icon,
      size: 24,
    });
  }
  return null;
});

const getSectionIconComponent = computed(() => {
  if (props.sectionId) {
    return getSectionIcon(props.sectionId, "h-5 w-5");
  }
  return null;
});

const handleClose = () => {
  emit("close");
};
</script>

<style scoped>
/* Modal transition animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .relative {
  transform: scale(0.9);
}

.modal-fade-leave-to .relative {
  transform: scale(0.9);
}

/* Prose styling for content */
.modal-content-area {
  @apply text-base leading-relaxed;
}

/* Dark Mode Typography */
.mode-dark :deep(h1) {
  @apply text-3xl font-bold mb-4 mt-8 text-white !important;
}
.mode-dark :deep(h2) {
  @apply text-2xl font-bold mb-3 mt-6 text-amber-200 !important;
}
.mode-dark :deep(h3) {
  @apply text-xl font-semibold mb-2 mt-4 text-indigo-200 !important;
}
.mode-dark :deep(p) {
  @apply mb-4 text-slate-200 font-normal !important;
}
.mode-dark :deep(ul),
.mode-dark :deep(ol) {
  @apply ml-6 mb-4 text-slate-200 !important;
}
.mode-dark :deep(strong) {
  @apply text-white font-bold !important;
}
.mode-dark :deep(.prose a),
.mode-dark :deep(p a),
.mode-dark :deep(li a) {
  @apply text-amber-400 hover:text-amber-300 underline font-semibold !important;
}
.mode-dark :deep(code) {
  @apply bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 border border-slate-700 font-mono text-sm !important;
}
.mode-dark :deep(pre) {
  @apply bg-black/40 p-4 rounded-lg overflow-x-auto border border-slate-800 text-slate-200 !important;
}
.mode-dark :deep(blockquote) {
  @apply border-l-4 border-amber-400 pl-4 italic text-slate-300 !important;
}

/* Light Mode Typography (High Contrast) */
.mode-light :deep(h1) {
  @apply text-3xl font-bold mb-4 mt-8 text-stone-950 !important;
}
.mode-light :deep(h2) {
  @apply text-2xl font-bold mb-3 mt-6 text-stone-900 !important;
}
.mode-light :deep(h3) {
  @apply text-xl font-semibold mb-2 mt-4 text-amber-900 !important;
}
.mode-light :deep(p) {
  @apply mb-4 text-stone-900 font-normal !important;
}
.mode-light :deep(ul),
.mode-light :deep(ol) {
  @apply ml-6 mb-4 text-stone-900 !important;
}
.mode-light :deep(strong) {
  @apply text-stone-950 font-bold !important;
}
.mode-light :deep(.prose a),
.mode-light :deep(p a),
.mode-light :deep(li a) {
  @apply text-amber-800 hover:text-amber-950 underline font-semibold !important;
}
.mode-light :deep(code) {
  @apply bg-stone-200/90 border border-stone-300 px-1.5 py-0.5 rounded text-amber-950 font-mono text-sm font-medium !important;
}
.mode-light :deep(pre) {
  @apply bg-stone-900 p-4 rounded-lg overflow-x-auto border border-stone-800 text-stone-100 !important;
}
.mode-light :deep(blockquote) {
  @apply border-l-4 border-amber-600 pl-4 italic text-stone-800 !important;
}

:deep(.prose li) {
  @apply mb-2;
}

:deep(.prose img) {
  @apply rounded-lg shadow-lg my-6;
}
</style>
