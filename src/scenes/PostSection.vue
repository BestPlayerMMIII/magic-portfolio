<template>
  <div
    class="h-screen w-screen flex flex-col"
    :class="{
      'bg-[rgb(242,242,242)]': isDayMode,
      'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900':
        !isDayMode,
    }"
  >
    <!-- Navigation Header -->
    <NavigationHeader
      :isDayMode="isDayMode"
      :toggleDayNightMode="toggleDayNightMode"
    />

    <div class="w-full h-full flex-1 overflow-y-auto">
      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center h-full"
      >
        <div
          class="w-16 h-16 border-4 rounded-full animate-spin mb-4"
          :class="{
            'border-gray-300 border-t-purple-600': isDayMode,
            'border-gray-700 border-t-purple-400': !isDayMode,
          }"
        ></div>
        <p :class="{ 'text-gray-700': isDayMode, 'text-gray-300': !isDayMode }">
          Loading {{ sectionTitle }}...
        </p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="flex flex-col items-center justify-center h-full gap-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 mb-2"
          :class="{ 'text-gray-400': isDayMode, 'text-gray-600': !isDayMode }"
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
        <h2
          class="text-2xl font-semibold"
          :class="{ 'text-gray-600': isDayMode, 'text-gray-300': !isDayMode }"
        >
          Section not found
        </h2>
        <p
          class="mb-2"
          :class="{ 'text-gray-500': isDayMode, 'text-gray-400': !isDayMode }"
        >
          {{ error }}
        </p>
        <BackButton />
      </div>

      <!-- Main Content -->
      <div v-else class="relative mt-6 p-6 max-w-7xl mx-auto">
        <!-- Section Header -->
        <SectionHeader
          v-if="sectionDescription"
          :description="sectionDescription"
          :isDayMode="isDayMode"
        />

        <!-- Divider -->
        <div class="my-8">
          <div
            class="h-px w-full"
            :style="{
              background: sectionDescription
                ? `linear-gradient(90deg, transparent, ${sectionDescription.color.accent}80, transparent)`
                : 'rgba(128, 128, 128, 0.3)',
            }"
          ></div>
        </div>

        <!-- Content List -->
        <div v-if="content.length > 0">
          <!-- Projects -->
          <ProjectsList
            v-if="schemaId === 'project'"
            :items="content"
            :isDayMode="isDayMode"
            @item-click="navigateToItem"
          />

          <!-- Blog Posts -->
          <BlogPostsList
            v-else-if="schemaId === 'blog-post'"
            :items="content"
            :isDayMode="isDayMode"
            @item-click="navigateToItem"
          />

          <!-- Work in Progress -->
          <WIPList
            v-else-if="schemaId === 'work-in-progress'"
            :items="content"
            :isDayMode="isDayMode"
          />

          <!-- Collaborations -->
          <CollaborationsList
            v-else-if="schemaId === 'collaboration'"
            :items="content"
            :isDayMode="isDayMode"
          />

          <!-- Learning Paths -->
          <LearningPathsList
            v-else-if="schemaId === 'learning-path'"
            :items="content"
            :isDayMode="isDayMode"
          />

          <!-- Fun Facts -->
          <FunFactsList
            v-else-if="schemaId === 'fun-facts'"
            :items="content"
            :isDayMode="isDayMode"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <p
            class="text-lg"
            :class="{ 'text-gray-600': isDayMode, 'text-gray-400': !isDayMode }"
          >
            No content available yet. Check back later! ✨
          </p>
        </div>

        <!-- Back Button -->
        <div class="mt-12 flex justify-center">
          <BackButton />
        </div>
      </div>

      <!-- Footer -->
      <AppFooter :isDayMode="isDayMode" authorName="BestPlayer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import router from "@/router";
import apiWithCache from "@/services/apiWithCache";
import NavigationHeader from "@/components/NavigationHeader.vue";
import BackButton from "@/components/ui/BackButton.vue";
import AppFooter from "@/components/AppFooter.vue";
import SectionHeader from "@/components/sections/SectionHeader.vue";
import ProjectsList from "@/components/sections/ProjectsList.vue";
import BlogPostsList from "@/components/sections/BlogPostsList.vue";
import WIPList from "@/components/sections/WIPList.vue";
import CollaborationsList from "@/components/sections/CollaborationsList.vue";
import LearningPathsList from "@/components/sections/LearningPathsList.vue";
import FunFactsList from "@/components/sections/FunFactsList.vue";
import { getSectionById } from "@/config/sectionDescriptions";
import type { ContentItem, SchemaType } from "@/types";
import { useViewMode } from "@/stores/viewModeStore";

// Use day mode from store
const { isDayMode, toggleDayMode } = useViewMode();

const schemaId = ref<string>("");
const content = ref<ContentItem<any>[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const sectionDescription = computed(() => {
  return schemaId.value ? getSectionById(schemaId.value as any) : undefined;
});

const sectionTitle = computed(() => {
  return sectionDescription.value?.title || "Content";
});

const loadSection = async () => {
  const pathSchemaId = router.currentRoute.value.params.schemaId as string;

  if (!pathSchemaId) {
    error.value = "Invalid section path";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;
  schemaId.value = pathSchemaId;

  try {
    // Fetch content using schemaId directly
    content.value = await apiWithCache.getByCategory(
      pathSchemaId as SchemaType
    );
    loading.value = false;
  } catch (err) {
    console.error("Failed to load section content:", err);
    error.value = "Failed to load content. Please try again later.";
    loading.value = false;
  }
};

// Watch for route changes
watch(
  () => router.currentRoute.value.params.schemaId,
  () => {
    loadSection();
  },
  { immediate: false }
);

onMounted(async () => {
  await loadSection();
});

const toggleDayNightMode = () => {
  toggleDayMode();
  document.documentElement.classList.toggle("dark", !isDayMode.value);
};

const navigateToItem = (item: ContentItem<any>) => {
  router.push(`/post/${item.schemaId}/${item.id}`);
};
</script>
