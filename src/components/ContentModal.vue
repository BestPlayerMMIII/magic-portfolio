<template>
  <UnifiedModal
    :visible="visible"
    :title="getTitle()"
    :emoji="getSectionEmoji()"
    :loading="props.loading"
    loading-text="Gathering magical knowledge from the ethereal realm..."
    @close="$emit('close')"
  >
    <!-- Section Description -->
    <div
      v-if="sectionDescription && !props.loading"
      class="mb-6 p-4 rounded-xl backdrop-blur-sm border"
      :style="{
        background: `linear-gradient(135deg, ${sectionDescription.color.from}15, ${sectionDescription.color.to}15)`,
        borderColor: `${sectionDescription.color.accent}40`,
      }"
    >
      <p class="text-gray-300 text-sm leading-relaxed">
        {{ sectionDescription.longDescription }}
      </p>
      <router-link
        :to="`/post/${sectionDescription.id}`"
        class="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
        :style="{
          background: `linear-gradient(90deg, ${sectionDescription.color.from}, ${sectionDescription.color.to})`,
        }"
      >
        <span>View Full Section</span>
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </router-link>
    </div>

    <!-- Content Lists -->
    <div class="space-y-4">
      <!-- Projects -->
      <ProjectsList
        v-if="type === 'project'"
        :items="content"
        :isDayMode="false"
        @item-click="openPost"
      />

      <!-- Blog Posts -->
      <BlogPostsList
        v-else-if="type === 'blog-post'"
        :items="content"
        :isDayMode="false"
        @item-click="openPost"
      />

      <!-- Work in Progress -->
      <WIPList
        v-else-if="type === 'work-in-progress'"
        :items="content"
        :isDayMode="false"
      />

      <!-- Collaborations -->
      <CollaborationsList
        v-else-if="type === 'collaboration'"
        :items="content"
        :isDayMode="false"
      />

      <!-- Learning Paths -->
      <LearningPathsList
        v-else-if="type === 'learning-path'"
        :items="content"
        :isDayMode="false"
      />

      <!-- Fun Facts -->
      <FunFactsList
        v-else-if="type === 'fun-facts'"
        :items="content"
        :isDayMode="false"
      />

      <!-- Empty state -->
      <div
        v-if="!loading && (!content || content.length === 0)"
        class="text-center py-8"
      >
        <div class="text-gray-400 mb-2">
          <svg
            class="w-16 h-16 mx-auto"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <p class="text-gray-400">No content available yet</p>
        <p class="text-gray-500 text-sm mt-1">Check back later for updates!</p>
      </div>
    </div>
  </UnifiedModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import router from "@/router";
import type { ContentItem, NullableSchemaType, SchemaType } from "@/types";
import {
  getSectionById,
  type SectionDescription,
} from "@/config/sectionDescriptions";
import UnifiedModal from "./UnifiedModal.vue";
import ProjectsList from "./sections/ProjectsList.vue";
import BlogPostsList from "./sections/BlogPostsList.vue";
import WIPList from "./sections/WIPList.vue";
import CollaborationsList from "./sections/CollaborationsList.vue";
import LearningPathsList from "./sections/LearningPathsList.vue";
import FunFactsList from "./sections/FunFactsList.vue";

interface Props {
  visible: boolean;
  content: ContentItem<any>[];
  type: NullableSchemaType;
  loading?: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  close: [];
}>();

const sectionDescription = computed<SectionDescription | undefined>(() => {
  return getSectionById(props.type as any);
});

const getTitle = () => {
  const titles: Partial<Record<SchemaType, string>> = {
    project: "Projects",
    "work-in-progress": "Work in Progress",
    "blog-post": "Blog Posts",
    collaboration: "Collaborations",
    "learning-path": "Learning Paths",
    "fun-facts": "Fun Facts",
  };
  return titles[props.type as keyof typeof titles] || props.type;
};

const getSectionEmoji = () => {
  return sectionDescription.value?.emoji || "✨";
};

const openPost = <T>(post: ContentItem<T>) => {
  // Navigate to the post using Vue Router (SPA navigation)
  router.push(`/post/${post.schemaId}/${post.id}`);
};
</script>
