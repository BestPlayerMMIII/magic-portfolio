<template>
  <UnifiedModal
    :visible="visible"
    :title="strings.aboutModalTitle"
    icon-type="info"
    :loading="false"
    @close="handleClose"
  >
    <AboutContent
      :initial-content="aboutContent"
      @loaded="(content) => (aboutContent = content)"
    />
  </UnifiedModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UnifiedModal from "./UnifiedModal.vue";
import AboutContent from "./AboutContent.vue";
import { useTheme } from "@/stores/themeStore";

const { strings } = useTheme();

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const aboutContent = ref<string | null>(null);

const handleClose = () => {
  emit("close");
};
</script>
