<script setup lang="ts">
import GenericLinkButtons from "./GenericLinkButtons.vue";

const props = defineProps<{
  onClick: () => void;
  isDayMode: boolean;
}>();
</script>

<template>
  <GenericLinkButtons
    :links="[
      {
        key: 'read-more',
        onClick: props.onClick,
      },
    ]"
    :isDayMode="isDayMode"
  />
</template>
