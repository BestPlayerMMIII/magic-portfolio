<template>
  <UnifiedModal
    :visible="visible"
    title="About Me"
    icon-type="info"
    :loading="loading"
    :error="error"
    loading-text="Loading about page..."
    @close="handleClose"
  >
    <div
      v-if="aboutContent"
      v-html="aboutContent"
      class="prose prose-invert lg:prose-lg max-w-none"
    ></div>
  </UnifiedModal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { apiService } from "@/services/api";
import UnifiedModal from "./UnifiedModal.vue";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const aboutContent = ref<string | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const loadContent = async () => {
  try {
    loading.value = true;
    error.value = null;

    const aboutPost = await apiService.getPostByIdFull("html", "about");

    if (aboutPost?.data?.content) {
      aboutContent.value = aboutPost.data.content;
    } else {
      throw new Error("About page content is empty");
    }
  } catch (e) {
    console.error("Error loading about page:", e);
    error.value = e instanceof Error ? e.message : "Unknown error";
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  emit("close");
};

// Load content when modal becomes visible
watch(
  () => props.visible,
  (newVisible) => {
    if (newVisible && !aboutContent.value && !loading.value) {
      loadContent();
    }
  },
  { immediate: true }
);
</script>
