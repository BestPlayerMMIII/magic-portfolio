<template>
  <Transition name="fade-slide">
    <button
      v-if="showButton"
      @click="scrollToTop"
      class="fixed bottom-12 left-6 z-40 p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-200 border"
      :class="[
        colors.secondaryButtonBg,
        colors.secondaryButtonBorder,
        colors.accentColor,
      ]"
      title="Scroll to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useTheme } from "@/stores/themeStore";

const { colors } = useTheme();

const showButton = ref(false);
// Show button only when near the bottom of the page (within 450px from bottom, and scrolled at least 150px)
const bottomThreshold = 450;
const minScrollTop = 150;

const checkScroll = () => {
  // Check the scrollable container (the overflow-y-auto div in Post.vue)
  const scrollableContent = document.querySelector(".overflow-y-auto");
  if (scrollableContent) {
    const { scrollTop, scrollHeight, clientHeight } = scrollableContent;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    showButton.value =
      scrollTop > minScrollTop && distanceFromBottom <= bottomThreshold;
  } else {
    // Fallback to window scroll
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    showButton.value =
      scrollTop > minScrollTop && distanceFromBottom <= bottomThreshold;
  }
};

const scrollToTop = () => {
  const scrollableContent = document.querySelector(".overflow-y-auto");
  if (scrollableContent) {
    scrollableContent.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } else {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};

onMounted(() => {
  const scrollableContent = document.querySelector(".overflow-y-auto");
  if (scrollableContent) {
    scrollableContent.addEventListener("scroll", checkScroll);
  } else {
    window.addEventListener("scroll", checkScroll);
  }
  checkScroll(); // Check initial state
});

onUnmounted(() => {
  const scrollableContent = document.querySelector(".overflow-y-auto");
  if (scrollableContent) {
    scrollableContent.removeEventListener("scroll", checkScroll);
  } else {
    window.removeEventListener("scroll", checkScroll);
  }
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
