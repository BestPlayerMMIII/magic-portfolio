<template>
  <Transition name="modal-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      style="pointer-events: auto"
    >
      <!-- Modal Container -->
      <div
        class="relative bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-purple-400/50"
        @click.stop
      >
        <!-- Header -->
        <div
          class="sticky top-0 z-10 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-md px-6 py-4 border-b border-purple-400/30"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                v-if="iconType"
                class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center"
              >
                <component :is="getIcon" class="h-6 w-6 text-white" />
              </div>
              <span v-else-if="emoji" class="text-4xl">{{ emoji }}</span>
              <h2 class="text-2xl font-bold text-white">{{ title }}</h2>
            </div>
            <button
              @click="handleClose"
              class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 group"
              title="Close"
            >
              <svg
                class="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200"
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
        <div class="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
          <!-- Loading State -->
          <div
            v-if="loading"
            class="flex flex-col items-center justify-center py-12"
          >
            <div
              class="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mb-4"
            ></div>
            <p class="text-purple-300 text-lg">{{ loadingText }}</p>
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
            <h3 class="text-xl font-semibold text-white mb-2">
              Failed to load
            </h3>
            <p class="text-purple-300">{{ error }}</p>
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

const props = defineProps<{
  visible: boolean;
  title: string;
  emoji?: string;
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
    return h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
      },
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      })
    );
  } else if (props.iconType === "content") {
    return h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
      },
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      })
    );
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
:deep(.prose) {
  @apply text-base leading-relaxed;
}

:deep(.prose h1) {
  @apply text-3xl font-bold mb-4 mt-8 text-white;
}

:deep(.prose h2) {
  @apply text-2xl font-bold mb-3 mt-6 text-purple-200;
}

:deep(.prose h3) {
  @apply text-xl font-semibold mb-2 mt-4 text-purple-300;
}

:deep(.prose p) {
  @apply mb-4 text-gray-200;
}

:deep(.prose ul),
:deep(.prose ol) {
  @apply ml-6 mb-4 text-gray-200;
}

:deep(.prose li) {
  @apply mb-2;
}

:deep(.prose a) {
  @apply text-purple-400 hover:text-purple-300 underline;
}

:deep(.prose img) {
  @apply rounded-lg shadow-lg my-6;
}

:deep(.prose strong) {
  @apply text-white font-semibold;
}

:deep(.prose code) {
  @apply bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-300;
}

:deep(.prose pre) {
  @apply bg-black/30 p-4 rounded-lg overflow-x-auto;
}

:deep(.prose blockquote) {
  @apply border-l-4 border-purple-400 pl-4 italic text-purple-200;
}
</style>
