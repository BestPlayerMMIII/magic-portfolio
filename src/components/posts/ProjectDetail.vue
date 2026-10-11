<template>
  <BasePostDetail
    :post="post"
    :isDayMode="isDayMode"
    v-slot="{ enhancedContent }"
  >
    <!-- Project Header -->
    <header class="w-full text-center mb-8">
      <h1
        class="text-5xl font-bold mb-4"
        :class="colors.panelTitle"
      >
        {{ post.data.header.title }}
      </h1>

      <p
        class="text-xl mb-6 max-w-3xl mx-auto"
        :class="colors.panelTextMuted"
      >
        {{ post.data.header.excerpt }}
      </p>

      <!-- Project Metadata -->
      <div
        class="flex flex-wrap justify-center gap-4 mb-6 text-sm"
        :class="colors.cardTextMuted"
      >
        <span v-if="post.data.status" class="flex items-center gap-1.5">
          <component :is="getStatusIcon(post.data.status)" class="w-4 h-4" :class="colors.accentColor" />
          <span class="font-medium">{{ post.data.status }}</span>
        </span>
        <span v-if="post.metadata.createdAt">
          Created: {{ new Date(post.metadata.createdAt).toLocaleDateString() }}
        </span>
        <span v-if="post.metadata.updatedAt">
          Updated: {{ new Date(post.metadata.updatedAt).toLocaleDateString() }}
        </span>
      </div>

      <!-- Tags -->
      <div
        v-if="post.data.header.tags && post.data.header.tags.length"
        class="flex flex-wrap justify-center gap-2 mb-6"
      >
        <span
          v-for="tag in post.data.header.tags"
          :key="tag"
          class="px-4 py-1.5 rounded-full text-sm font-semibold shadow-md transition-all duration-200 cursor-pointer select-none border"
          :class="[
            colors.badgeBg,
            colors.badgeText,
            colors.badgeBorder,
            'hover:scale-105',
          ]"
        >
          {{ tag }}
        </span>
      </div>

      <hr class="mb-4 border-t" :class="colors.cardBorder" />
    </header>

    <h2
      class="text-2xl font-semibold mb-4 text-center"
      :class="colors.panelTitle"
    >
      Overview
    </h2>
    <!-- Render raw HTML from post.data.overview -->
    <div
      v-html="post.data.overview"
      class="prose w-full max-w-none md:min-w-[60%] mx-auto mb-4 content-wrapper"
      :class="colors.proseClass"
    ></div>

    <!-- Project Links -->
    <div class="mt-4 mb-8">
      <h2
        class="text-2xl font-semibold mb-4 text-center"
        :class="colors.panelTitle"
      >
        Links
      </h2>
      <div class="flex flex-wrap justify-center gap-4">
        <ExternalLinks
          :links="getLinksFromPost(props.post)"
          :isDayMode="isDayMode"
        />
      </div>
    </div>

    <!-- Technologies -->
    <div
      v-if="post.data.technologies && post.data.technologies.length"
      class="mt-4 mb-8"
    >
      <h2
        class="text-2xl font-semibold mb-4 text-center"
        :class="colors.panelTitle"
      >
        Technologies
      </h2>
      <div class="flex flex-wrap justify-center gap-3">
        <span
          v-for="tech in post.data.technologies"
          :key="tech"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 border"
          :class="[
            colors.badgeBg,
            colors.badgeText,
            colors.badgeBorder,
          ]"
        >
          {{ tech }}
        </span>
      </div>
    </div>

    <!-- Render raw HTML from post.data.content -->
    <div
      v-html="enhancedContent"
      class="prose w-full max-w-none md:min-w-[60%] mx-auto content-wrapper"
      :class="colors.proseClass"
    ></div>
  </BasePostDetail>
</template>

<script setup lang="ts">
import { h } from "vue";
import type { VNode } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import {
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Clock01Icon,
  Archive01Icon,
  PlayCircleIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import type { ContentItem } from "@/types";
import BasePostDetail from "./BasePostDetail.vue";
import ExternalLinks from "@/components/ui/ExternalLinkButtons.vue";
import { getLinksFromPost } from "@/utils/links";
import { useTheme } from "@/stores/themeStore";

const { colors } = useTheme();

interface Props {
  post: ContentItem<any>;
  isDayMode: boolean;
}

const props = defineProps<Props>();

const getStatusIcon = (status: string): VNode => {
  const normalized = status.toLowerCase();
  let icon = SparklesIcon;
  if (normalized === "completed") icon = CheckmarkCircle01Icon;
  else if (normalized === "in-progress") icon = Clock01Icon;
  else if (normalized === "planning") icon = AlertCircleIcon;
  else if (normalized === "archived") icon = Archive01Icon;
  else if (normalized === "active") icon = PlayCircleIcon;

  return h(HugeiconsIcon, {
    icon,
    size: 16,
  });
};
</script>
