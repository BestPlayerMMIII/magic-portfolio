<template>
  <UnifiedModal
    :visible="visible"
    :title="getTitle()"
    :sectionId="props.type"
    :loading="props.loading"
    loading-text="Gathering magical knowledge from the ethereal realm..."
    @close="$emit('close')"
  >
    <!-- Section Description -->
    <div
      v-if="sectionDescription && !props.loading"
      class="mb-6 p-5 rounded-2xl border transition-all"
      :class="isDayMode ? 'bg-amber-50/80 border-amber-200/90 shadow-sm' : 'bg-slate-900/60 border-slate-800'"
    >
      <p class="text-sm leading-relaxed mb-4" :class="colors.panelText">
        {{ sectionDescription.longDescription }}
      </p>
      <router-link
        :to="`/post/${sectionDescription.id}`"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-md !no-underline"
        :class="[
          colors.primaryGradient || `${colors.primaryButtonBg} ${colors.primaryButtonHover}`,
          colors.primaryGradientText || colors.primaryButtonText,
        ]"
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
        :isDayMode="isDayMode"
        @item-click="openPost"
      />

      <!-- Blog Posts -->
      <BlogPostsList
        v-else-if="type === 'blog-post'"
        :items="content"
        :isDayMode="isDayMode"
        @item-click="openPost"
      />

      <!-- Work in Progress -->
      <WIPList
        v-else-if="type === 'work-in-progress'"
        :items="content"
        :isDayMode="isDayMode"
      />

      <!-- Collaborations -->
      <CollaborationsList
        v-else-if="type === 'collaboration'"
        :items="content"
        :isDayMode="isDayMode"
      />

      <!-- Learning Paths -->
      <LearningPathsList
        v-else-if="type === 'learning-path'"
        :items="content"
        :isDayMode="isDayMode"
      />

      <!-- Fun Facts -->
      <FunFactsList
        v-else-if="type === 'fun-facts'"
        :items="content"
        :isDayMode="isDayMode"
      />

      <!-- Empty state -->
      <div
        v-if="!loading && (!content || content.length === 0)"
        class="text-center py-8"
      >
        <div class="mb-2" :class="colors.panelTextMuted">
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
        <p :class="colors.panelText">No content available yet</p>
        <p class="text-sm mt-1" :class="colors.panelTextMuted">Check back later for updates!</p>
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
import { useTheme } from "@/stores/themeStore";
import UnifiedModal from "./UnifiedModal.vue";
import ProjectsList from "./sections/ProjectsList.vue";
import BlogPostsList from "./sections/BlogPostsList.vue";
import WIPList from "./sections/WIPList.vue";
import CollaborationsList from "./sections/CollaborationsList.vue";
import LearningPathsList from "./sections/LearningPathsList.vue";
import FunFactsList from "./sections/FunFactsList.vue";

const { colors, isDayMode } = useTheme();

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

const openPost = <T>(post: ContentItem<T>) => {
  // Navigate to the post using Vue Router (SPA navigation)
  router.push(`/post/${post.schemaId}/${post.id}`);
};
</script>
