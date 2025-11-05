<template>
  <div class="fun-facts-flashcards relative">
    <!-- Navigation Info -->
    <div class="text-center mb-4">
      <p
        class="text-sm font-medium"
        :class="{ 'text-gray-600': isDayMode, 'text-gray-400': !isDayMode }"
      >
        {{ currentIndex + 1 }} / {{ allItems.length }}
      </p>
    </div>

    <!-- Flashcard Container with Swipe -->
    <div
      class="relative min-h-[300px] flex items-center justify-center overflow-hidden"
    >
      <!-- Card Stack (shows current and preview) -->
      <div
        ref="cardContainer"
        class="relative w-full max-w-2xl"
        @mousedown="startDrag"
        @mousemove="drag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @touchstart="startDrag"
        @touchmove="drag"
        @touchend="endDrag"
        style="touch-action: pan-y; user-select: none"
      >
        <!-- Preview Card (shows next or previous based on drag direction) -->
        <div
          v-if="previewFact"
          class="absolute inset-0 rounded-2xl p-8 sm:p-12 border transition-opacity duration-200"
          :class="{
            'bg-white/95 border-gray-300': isDayMode,
            'bg-slate-800/90 border-rose-500/30': !isDayMode,
          }"
          :style="{
            opacity: Math.abs(dragOffset) / 200,
            zIndex: 0,
          }"
        >
          <div class="flex flex-col items-center text-center gap-6">
            <span class="text-5xl sm:text-6xl">{{
              getCategoryEmoji(previewFact.category)
            }}</span>
            <span
              class="px-4 py-2 rounded-full text-sm font-medium"
              :class="getCategoryClass(previewFact.category)"
            >
              {{ previewFact.category }}
            </span>
            <p
              class="text-lg sm:text-xl leading-relaxed"
              :class="{
                'text-gray-800': isDayMode,
                'text-gray-200': !isDayMode,
              }"
            >
              {{ previewFact.content }}
            </p>
          </div>
        </div>

        <!-- Current Card (center) -->
        <div
          v-if="currentFact"
          class="relative rounded-2xl p-8 sm:p-12 border transition-shadow duration-300 shadow-2xl cursor-grab active:cursor-grabbing"
          :class="{
            'bg-white/95 border-gray-300': isDayMode,
            'bg-slate-800/90 border-rose-500/30 hover:shadow-rose-500/20':
              !isDayMode,
          }"
          :style="{
            transform: `translateX(${dragOffset}px) rotate(${
              dragOffset * 0.02
            }deg)`,
            transition: 'none',
            zIndex: 1,
          }"
        >
          <div class="flex flex-col items-center text-center gap-6">
            <span class="text-5xl sm:text-6xl">{{
              getCategoryEmoji(currentFact.category)
            }}</span>
            <span
              class="px-4 py-2 rounded-full text-sm font-medium"
              :class="getCategoryClass(currentFact.category)"
            >
              {{ currentFact.category }}
            </span>
            <p
              class="text-lg sm:text-xl leading-relaxed"
              :class="{
                'text-gray-800': isDayMode,
                'text-gray-200': !isDayMode,
              }"
            >
              {{ currentFact.content }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Swipe Hint -->
    <div class="text-center mt-6">
      <p
        class="text-xs"
        :class="{ 'text-gray-500': isDayMode, 'text-gray-400': !isDayMode }"
      >
        👆 Swipe or drag to navigate
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { ContentItem, FunFact, FunFacts } from "@/types";

const { items, isDayMode } = defineProps<{
  items: ContentItem<FunFacts>[];
  isDayMode: boolean;
}>();

const allItems: FunFact[] = items
  .flatMap((item) => item.data["fun-facts"]) // Extract fun-facts array
  .sort(() => Math.random() - 0.5); // Shuffle the facts

const currentIndex = ref(0);

// Drag state
const isDragging = ref(false);
const dragStartX = ref(0);
const dragOffset = ref(0);
const cardContainer = ref<HTMLDivElement>();

// Computed properties for current, next, and previous facts
const currentFact = computed(() => allItems[currentIndex.value]);

// Pacman effect: loop around
const previousFact = computed(() => {
  const prevIndex = currentIndex.value - 1;
  return prevIndex < 0 ? allItems[allItems.length - 1] : allItems[prevIndex];
});

const nextFact = computed(() => {
  const nextIndex = currentIndex.value + 1;
  return nextIndex >= allItems.length ? allItems[0] : allItems[nextIndex];
});

// Preview fact: shows which card will appear based on drag direction
const previewFact = computed(() => {
  if (!isDragging.value || Math.abs(dragOffset.value) < 10) return null;

  // If dragging right (positive offset), show previous card
  // If dragging left (negative offset), show next card
  return dragOffset.value > 0 ? previousFact.value : nextFact.value;
});

// Navigation functions with pacman effect
const goToNext = () => {
  currentIndex.value = (currentIndex.value + 1) % allItems.length;
};

const goToPrevious = () => {
  currentIndex.value =
    currentIndex.value === 0 ? allItems.length - 1 : currentIndex.value - 1;
};

// Drag functions
const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true;
  dragStartX.value = "touches" in e ? e.touches[0].clientX : e.clientX;
  dragOffset.value = 0;
};

const drag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return;

  const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
  dragOffset.value = currentX - dragStartX.value;
};

const endDrag = () => {
  if (!isDragging.value) return;

  // Threshold for swipe (100px)
  const threshold = 100;

  if (dragOffset.value > threshold) {
    // Swiped right -> go to previous
    goToPrevious();
  } else if (dragOffset.value < -threshold) {
    // Swiped left -> go to next
    goToNext();
  }

  // Reset drag state
  isDragging.value = false;
  dragOffset.value = 0;
};

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
