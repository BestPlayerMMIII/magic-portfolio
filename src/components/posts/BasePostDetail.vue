<template>
  <div class="relative mt-6 p-6 flex flex-col justify-center max-w-6xl mx-auto">
    <slot :enhancedContent="enhancedContent" :contentLoading="contentLoading" />
    <BackButton />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { ContentItem } from "@/types";
import BackButton from "@/components/BackButton.vue";
import { apiService } from "@/services/api";

interface Props {
  post: ContentItem<any>;
  isDayMode: boolean;
}

const props = defineProps<Props>();

const enhancedContent = ref<string>("");
const contentLoading = ref(false);

// Progressive enhancement for content HTML
const enhanceContentMedia = async (schemaId: string, postId: string) => {
  contentLoading.value = true;
  try {
    // Fetch the FULL version using the API service
    const fullPost = await apiService.getPostByIdFull(schemaId, postId);

    if (fullPost?.data?.content) {
      // Update only the content with full resolution
      enhancedContent.value = fullPost.data.content;
    }
  } catch (e) {
    console.error("Failed to enhance content media:", e);
    // Fallback to original content
    enhancedContent.value = props.post.data.content || "";
  } finally {
    contentLoading.value = false;
  }
};

// Initialize content
enhancedContent.value = props.post.data.content || "";

// Watch for post changes and enhance content
watch(
  () => props.post.id,
  () => {
    enhancedContent.value = props.post.data.content || "";
    enhanceContentMedia(props.post.schemaId, props.post.id);
  },
  { immediate: true }
);

// Expose for parent components if needed
defineExpose({
  enhancedContent,
  contentLoading,
});
</script>

<style scoped>
/* Fix media overflow on mobile devices */
:deep(.content-wrapper) {
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
}

:deep(.content-wrapper img),
:deep(.content-wrapper video),
:deep(.content-wrapper iframe) {
  max-width: 100% !important;
  width: 100% !important;
  height: auto !important;
  display: block;
  margin-left: auto;
  margin-right: auto;
  object-fit: contain;
}

/* Ensure any container elements don't overflow */
:deep(.content-wrapper *) {
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Specifically target any divs or figures containing media */
:deep(.content-wrapper figure),
:deep(.content-wrapper div) {
  max-width: 100% !important;
  overflow: hidden;
}

/* Fix for tables on mobile */
:deep(.content-wrapper table) {
  display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;
}

/* Prevent pre/code blocks from causing horizontal scroll */
:deep(.content-wrapper pre) {
  overflow-x: auto;
  max-width: 100%;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Mobile-specific constraints */
@media (max-width: 768px) {
  :deep(.content-wrapper img),
  :deep(.content-wrapper video),
  :deep(.content-wrapper iframe) {
    max-width: 100vw !important;
    width: 100% !important;
  }
}
</style>
