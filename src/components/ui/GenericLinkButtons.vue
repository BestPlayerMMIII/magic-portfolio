<template>
  <button
    v-for="(link, index) in links"
    @click="link.onClick"
    :key="String(link.key + '_' + index)"
    :class="[
      baseButtonLink,
      genericGetClass(String(link.key), props.isDayMode),
    ]"
  >
    <span v-html="genericGetSvgIcon(String(link.key))"></span>
    {{ genericGetName(String(link.key)) }}
  </button>
</template>

<script setup lang="ts">
import { baseButtonLink } from "@/utils/links";
import { getClass, getSvgIcon, getName } from "@/utils/links";

interface Link {
  key: string;
  onClick: () => any;
}

const props = defineProps<{
  links: Link[];
  getClass?: (key: string, isDayMode: boolean) => string;
  getSvgIcon?: (key: string) => string;
  getName?: (key: string) => string;
  preprocessLinks?: (links: Link[]) => Link[];
  isDayMode: boolean;
}>();

const links = props.preprocessLinks
  ? props.preprocessLinks(props.links)
  : props.links;

const genericGetClass = props.getClass || getClass;
const genericGetSvgIcon = props.getSvgIcon || getSvgIcon;
const genericGetName = props.getName || getName;
</script>
