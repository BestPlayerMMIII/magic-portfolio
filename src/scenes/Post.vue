<template>
  <div
    class="h-screen w-screen flex flex-col"
    :class="{ 'bg-[rgb(242,242,242)]': isDayMode }"
  >
    <!-- Header component -->
    <AppHeader
      :isNavigationMinimized="false"
      :isDayMode="isDayMode"
      :toggleNavigation="toggleNavigation"
      :toggleDayNightMode="toggleDayNightMode"
    />

    <div class="w-full h-full flex-1 overflow-y-auto">
      <!-- Main content area -->
      <div class="relative mt-6 p-6 flex justify-center">
        <!-- Render raw HTML from post.data.content -->
        <div
          v-if="post?.schemaId === 'blog-post'"
          v-html="post.data.content"
          class="prose min-w-[60%] mx-auto"
          :class="{ 'prose-invert': !isDayMode }"
        ></div>
        <!-- TODO other post types -->
        <!-- Still loading -->
        <div v-else>Loading post...</div>
      </div>
      <!-- Footer component -->
      <div
        class="text-center p-6 border-t mt-12 text-sm text-white"
        :class="{ 'text-gray-800': isDayMode }"
      >
        &copy; 2025 BestPlayer. All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem } from "@/types";
import { onMounted, ref } from "vue";
import apiWithCache from "@/services/apiWithCache";
import AppHeader from "@/components/AppHeader.vue";

interface PostInfo {
  schemaId: string;
  postId: string;
}

const info = ref<PostInfo | null>(null);
const post = ref<ContentItem<any> | null>(null);

// Day/Night mode state
const isDayMode = ref(false);

onMounted(async () => {
  const pathname = window.location.pathname;
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 3 && segments[0] === "post") {
    const schemaId = segments[1];
    const postId = segments[2];
    info.value = { schemaId, postId };
    post.value = await apiWithCache.getByType(schemaId).then((items) => {
      return items.find((item) => item.metadata.id === postId) || null;
    });
  } else {
    console.error("Invalid URL format. Expected /post/:schemaId/:postId");
    window.location.href = "/";
  }
});

const toggleNavigation = () => {};
const toggleDayNightMode = () => {
  isDayMode.value = !isDayMode.value;
  document.documentElement.classList.toggle("dark", !isDayMode.value);
};
</script>
