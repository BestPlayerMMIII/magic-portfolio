<template>
  <!-- Back button -->
  <div class="flex justify-center mt-8">
    <router-link
      to="/"
      class="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-400 text-white font-bold shadow-lg hover:scale-105 hover:from-purple-600 hover:to-indigo-500 transition-all duration-200 flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back
    </router-link>
  </div>
</template>

<script setup lang="ts">
// No script needed - using router-link for navigation
</script>
