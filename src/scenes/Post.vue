<template>
  <div
    class="h-screen w-screen flex flex-col"
    :class="{ 'bg-[rgb(242,242,242)]': isDayMode }"
  >
    <!-- Navigation Header -->
    <NavigationHeader
      :isDayMode="isDayMode"
      :toggleDayNightMode="toggleDayNightMode"
    />

    <div class="w-full h-full flex-1 overflow-y-auto">
      <!-- Main content area - Dynamic component based on schemaId -->
      <component
        v-if="post"
        :is="getPostComponent(post.schemaId)"
        :post="post"
        :isDayMode="isDayMode"
      />

      <!-- Loading state -->
      <div
        v-else-if="isLoadingPost"
        class="flex flex-col items-center justify-center h-full gap-4"
      >
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-2"
          :class="{
            'border-gray-900': isDayMode,
            'border-purple-400': !isDayMode,
          }"
        ></div>
        <p
          class="text-lg"
          :class="{ 'text-gray-600': isDayMode, 'text-gray-300': !isDayMode }"
        >
          Loading post...
        </p>
      </div>
      <!-- Post not found -->
      <div
        v-else
        class="flex flex-col items-center justify-center h-full gap-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-gray-400 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
          />
        </svg>
        <h2
          class="text-2xl font-semibold"
          :class="{ 'text-gray-600': isDayMode, 'text-gray-300': !isDayMode }"
        >
          Post not found
        </h2>
        <p
          class="mb-2"
          :class="{ 'text-gray-500': isDayMode, 'text-gray-400': !isDayMode }"
        >
          Sorry, the post you are looking for does not exist or was removed.
        </p>
        <BackButton />
      </div>
      <!-- Footer -->
      <AppFooter :isDayMode="isDayMode" authorName="BestPlayer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem, SchemaType } from "@/types";
import type { Component } from "vue";
import { onMounted, ref } from "vue";
import apiWithCache from "@/services/apiWithCache";
import NavigationHeader from "@/components/NavigationHeader.vue";
import ProjectDetail from "@/components/posts/ProjectDetail.vue";
import BlogPostDetail from "@/components/posts/BlogPostDetail.vue";
import WIPDetail from "@/components/posts/WIPDetail.vue";
import CollaborationDetail from "@/components/posts/CollaborationDetail.vue";
import LearningPathDetail from "@/components/posts/LearningPathDetail.vue";
import BackButton from "@/components/BackButton.vue";
import AppFooter from "@/components/AppFooter.vue";
import { useViewMode } from "@/stores/viewModeStore";
import router from "@/router";
import { isSectionEnabled } from "@/config/sectionDescriptions";

// Use day mode from store
const { isDayMode, toggleDayMode } = useViewMode();

// Register BackButton for template usage (script setup auto-registers)
const post = ref<ContentItem<any> | null>(null);
const isLoadingPost = ref(true);

// Map schemaId to component
const getPostComponent = (schemaId: SchemaType): Component => {
  const componentMap: Partial<Record<SchemaType, Component>> = {
    project: ProjectDetail,
    "blog-post": BlogPostDetail,
    "work-in-progress": WIPDetail,
    collaboration: CollaborationDetail,
    "learning-path": LearningPathDetail,
  };

  return componentMap[schemaId] || BlogPostDetail; // fallback to blog post
};

onMounted(async () => {
  const pathname = router.currentRoute.value.path;
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 3 && segments[0] === "post") {
    const schemaId = segments[1];
    const postId = segments[2];

    // guard: check if section is enabled from frontend config
    if (!isSectionEnabled(schemaId as SchemaType)) {
      console.error(`Section ${schemaId} does not exist or is disabled.`);
      isLoadingPost.value = false;
      return;
    }

    try {
      // Fetch post data from cache
      post.value = await apiWithCache
        .getByCategory(schemaId as SchemaType)
        .then((items: ContentItem<any>[]) => {
          return (
            items.find((item: ContentItem<any>) => item.id === postId) || null
          );
        });
    } catch (error) {
      console.error("Failed to load post:", error);
      post.value = null;
    } finally {
      isLoadingPost.value = false;
    }
  } else {
    console.error("Invalid URL format. Expected /post/:schemaId/:postId");
    isLoadingPost.value = false;
    router.push("/");
  }
});

const toggleDayNightMode = () => {
  toggleDayMode();
  document.documentElement.classList.toggle("dark", !isDayMode.value);
};
</script>
