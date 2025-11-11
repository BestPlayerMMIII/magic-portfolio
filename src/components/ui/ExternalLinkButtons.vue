<template>
  <GenericLinkButtons :links="clickableLinks" :isDayMode="isDayMode" />
</template>

<script setup lang="ts">
import GenericLinkButtons from "./GenericLinkButtons.vue";

const props = defineProps<{
  links: { key: string; url: string }[];
  isDayMode: boolean;
}>();

const clickableLinks = props.links
  .filter((link) => link.url && link.url.trim() !== "")
  .map((link) => ({
    key: link.key.toLowerCase(),
    onClick: () => window.open(link.url, "_blank"),
  }));
</script>
