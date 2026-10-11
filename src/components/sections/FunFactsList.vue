<template>
  <div class="fun-facts-flashcards relative">
    <!-- Navigation Info -->
    <div class="text-center mb-4">
      <p
        class="text-sm font-medium"
        :class="colors.cardTextMuted"
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
        <!-- Preview Card (shows next or preview based on drag direction) -->
        <div
          v-if="previewFact"
          class="absolute inset-0 rounded-2xl p-8 sm:p-12 border transition-opacity duration-200 shadow-xl"
          :class="[
            colors.cardBackground,
            colors.cardBorder,
          ]"
          :style="{
            opacity: Math.abs(dragOffset) / 200,
            zIndex: 0,
          }"
        >
          <div class="flex flex-col items-center text-center gap-6">
            <div
              class="w-14 h-14 rounded-2xl border flex items-center justify-center"
              :class="[colors.accentBg, colors.accentBorder, colors.accentColor]"
            >
              <component :is="getCategoryIcon(previewFact.category)" class="w-7 h-7" />
            </div>
            <span
              class="px-4 py-2 rounded-full text-sm font-medium border"
              :class="[
                colors.badgeBg,
                colors.badgeText,
                colors.badgeBorder,
              ]"
            >
              {{ previewFact.category }}
            </span>
            <p
              class="text-lg sm:text-xl leading-relaxed"
              :class="colors.cardText"
            >
              {{ previewFact.content }}
            </p>
          </div>
        </div>

        <!-- Current Card (center) -->
        <div
          v-if="currentFact"
          class="relative rounded-2xl p-8 sm:p-12 border transition-shadow duration-300 shadow-2xl cursor-grab active:cursor-grabbing"
          :class="[
            colors.cardBackground,
            colors.cardBorder,
            colors.cardHoverBorder,
          ]"
          :style="{
            transform: `translateX(${dragOffset}px) rotate(${
              dragOffset * 0.02
            }deg)`,
            transition: 'none',
            zIndex: 1,
          }"
        >
          <div class="flex flex-col items-center text-center gap-6">
            <div
              class="w-14 h-14 rounded-2xl border flex items-center justify-center"
              :class="[colors.accentBg, colors.accentBorder, colors.accentColor]"
            >
              <component :is="getCategoryIcon(currentFact.category)" class="w-7 h-7" />
            </div>
            <span
              class="px-4 py-2 rounded-full text-sm font-medium border"
              :class="[
                colors.badgeBg,
                colors.badgeText,
                colors.badgeBorder,
              ]"
            >
              {{ currentFact.category }}
            </span>
            <p
              class="text-lg sm:text-xl leading-relaxed"
              :class="colors.cardText"
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
        class="text-xs inline-flex items-center gap-1.5 justify-center"
        :class="colors.cardTextMuted"
      >
        <HugeiconsIcon :icon="Touch01Icon" :size="14" />
        <span>Swipe or drag to navigate</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from "vue";
import type { VNode } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import {
  Touch01Icon,
  BubbleChatIcon,
  ComputerIcon,
  DicesIcon,
  Idea01Icon,
} from "@hugeicons/core-free-icons";
import type { ContentItem, FunFact, FunFacts } from "@/types";
import { useTheme } from "@/stores/themeStore";

const { colors } = useTheme();

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

const getCategoryIcon = (category: string): VNode => {
  let icon = Idea01Icon;
  if (category === "personal") icon = BubbleChatIcon;
  else if (category === "technical") icon = ComputerIcon;
  else if (category === "random") icon = DicesIcon;

  return h(HugeiconsIcon, {
    icon,
    size: 28,
  });
};
</script>
