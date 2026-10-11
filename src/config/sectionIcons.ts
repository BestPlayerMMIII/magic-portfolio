import { h } from "vue";
import type { VNode } from "vue";
import { HugeiconsIcon } from "@hugeicons/vue";
import {
  SparklesIcon,
  Book01Icon,
  Wrench01Icon,
  UserGroupIcon,
  MortarboardIcon,
  Idea01Icon,
  InformationCircleIcon,
  AiMagicIcon,
} from "@hugeicons/core-free-icons";

/**
 * Standardized Hugeicons icon components for each section type.
 * Each function returns a Vue VNode that can be rendered directly.
 */

export const SectionIcons = {
  project: (className = "w-5 h-5"): VNode =>
    h(HugeiconsIcon, {
      icon: SparklesIcon,
      class: className,
      size: 20,
    }),

  "blog-post": (className = "w-5 h-5"): VNode =>
    h(HugeiconsIcon, {
      icon: Book01Icon,
      class: className,
      size: 20,
    }),

  "work-in-progress": (className = "w-5 h-5"): VNode =>
    h(HugeiconsIcon, {
      icon: Wrench01Icon,
      class: className,
      size: 20,
    }),

  collaboration: (className = "w-5 h-5"): VNode =>
    h(HugeiconsIcon, {
      icon: UserGroupIcon,
      class: className,
      size: 20,
    }),

  "learning-path": (className = "w-5 h-5"): VNode =>
    h(HugeiconsIcon, {
      icon: MortarboardIcon,
      class: className,
      size: 20,
    }),

  "fun-facts": (className = "w-5 h-5"): VNode =>
    h(HugeiconsIcon, {
      icon: Idea01Icon,
      class: className,
      size: 20,
    }),

  about: (className = "w-5 h-5"): VNode =>
    h(HugeiconsIcon, {
      icon: InformationCircleIcon,
      class: className,
      size: 20,
    }),
};

/**
 * Get icon component by section ID
 */
export function getSectionIcon(
  sectionId: string,
  className?: string
): VNode | null {
  const iconFn = SectionIcons[sectionId as keyof typeof SectionIcons];
  return iconFn ? iconFn(className) : null;
}
