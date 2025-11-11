<template>
  <Transition name="fade-slide">
    <button
      v-if="showButton"
      @click="scrollToTop"
      class="fixed bottom-12 left-6 z-40 p-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-400 text-white shadow-lg hover:scale-110 hover:shadow-xl"
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

const showButton = ref(false);
const scrollThreshold = 300; // Show button after scrolling 300px

const checkScroll = () => {
  // Check the scrollable container (the overflow-y-auto div in Post.vue)
  const scrollableContent = document.querySelector(".overflow-y-auto");
  if (scrollableContent) {
    showButton.value = scrollableContent.scrollTop > scrollThreshold;
  } else {
    // Fallback to window scroll
    showButton.value = window.scrollY > scrollThreshold;
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
