<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    @click="$emit('close')"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

    <!-- Modal Content -->
    <div
      class="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 max-w-5xl w-full max-h-[85vh] overflow-y-auto border border-magic-500/30 shadow-2xl"
      @click.stop
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-3">
          <span class="text-4xl">{{ getSectionEmoji() }}</span>
          <h2 class="text-2xl font-bold text-white pr-6">
            {{ getTitle() }}
          </h2>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

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

      <!-- Content -->
      <div class="space-y-4">
        <!-- Loading State -->
        <div
          v-if="props.loading"
          class="flex flex-col items-center justify-center py-16"
        >
          <!-- Magical Loading Animation -->
          <div class="relative mb-16">
            <!-- Spinning magical circles -->
            <div
              class="w-16 h-16 border-4 border-magic-500/30 rounded-full animate-spin border-t-magic-500"
            ></div>
            <div
              class="absolute inset-0 w-16 h-16 border-4 border-mystical-500/30 rounded-full animate-spin-reverse border-b-mystical-500"
            ></div>

            <!-- Central magical core -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="w-4 h-4 bg-gradient-to-r from-magic-500 to-mystical-500 rounded-full animate-pulse"
              ></div>
            </div>

            <!-- Floating particles -->
            <div class="absolute -inset-8">
              <div
                class="absolute top-0 left-1/2 w-1 h-1 bg-magic-400 rounded-full animate-float-1"
              ></div>
              <div
                class="absolute top-1/2 right-0 w-1 h-1 bg-mystical-400 rounded-full animate-float-2"
              ></div>
              <div
                class="absolute bottom-0 left-1/2 w-1 h-1 bg-magic-400 rounded-full animate-float-3"
              ></div>
              <div
                class="absolute top-1/2 left-0 w-1 h-1 bg-mystical-400 rounded-full animate-float-4"
              ></div>
            </div>
          </div>

          <!-- Loading Text with Magical Effect -->
          <div class="text-center">
            <p class="text-gray-400 text-sm animate-pulse delay-150">
              Gathering magical knowledge from the ethereal realm
            </p>

            <!-- Progress dots -->
            <div class="flex justify-center space-x-1 mt-4">
              <div
                class="w-2 h-2 bg-magic-500 rounded-full animate-bounce"
              ></div>
              <div
                class="w-2 h-2 bg-magic-500 rounded-full animate-bounce delay-100"
              ></div>
              <div
                class="w-2 h-2 bg-magic-500 rounded-full animate-bounce delay-200"
              ></div>
            </div>
          </div>
        </div>

        <!-- Actual Content (when not loading) -->
        <div v-else>
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
            v-else-if="type === 'fun-fact'"
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
            <p class="text-gray-500 text-sm mt-1">
              Check back later for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import router from "@/router";
import type { ContentItem, NullableSchemaType, SchemaType } from "@/types";
import {
  getSectionById,
  type SectionDescription,
} from "@/config/sectionDescriptions";
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
  const titles: Record<SchemaType, string> = {
    project: "Projects",
    "work-in-progress": "Work in Progress",
    "blog-post": "Blog Posts",
    collaboration: "Collaborations",
    "learning-path": "Learning Paths",
    "fun-fact": "Fun Facts",
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

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.8);
}

/* Magical Loading Animations */
@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.animate-spin-reverse {
  animation: spin-reverse 1.5s linear infinite;
}

/* Floating particles animations */
@keyframes float-1 {
  0%,
  100% {
    transform: translate(-50%, 0) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(-50%, -20px) scale(1.2);
    opacity: 1;
  }
}

@keyframes float-2 {
  0%,
  100% {
    transform: translate(0, -50%) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(20px, -50%) scale(1.2);
    opacity: 1;
  }
}

@keyframes float-3 {
  0%,
  100% {
    transform: translate(-50%, 0) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(-50%, 20px) scale(1.2);
    opacity: 1;
  }
}

@keyframes float-4 {
  0%,
  100% {
    transform: translate(0, -50%) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(-20px, -50%) scale(1.2);
    opacity: 1;
  }
}

.animate-float-1 {
  animation: float-1 2s ease-in-out infinite;
}

.animate-float-2 {
  animation: float-2 2.2s ease-in-out infinite;
}

.animate-float-3 {
  animation: float-3 2.4s ease-in-out infinite;
}

.animate-float-4 {
  animation: float-4 2.6s ease-in-out infinite;
}

/* Enhanced magical glow for loading */
.animate-pulse {
  animation: magical-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes magical-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

/* Bounce delay animations */
.delay-100 {
  animation-delay: 0.1s;
}

.delay-150 {
  animation-delay: 0.15s;
}

.delay-200 {
  animation-delay: 0.2s;
}
</style>
