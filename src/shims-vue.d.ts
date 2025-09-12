/// <reference types="vue/macros-global" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Vue Router types
declare module "vue-router" {
  export * from "vue-router/dist/vue-router";
  export {
    createRouter,
    createWebHistory,
    createWebHashHistory,
  } from "vue-router/dist/vue-router";
}

// Three.js type extensions
declare global {
  interface Window {
    // Add any global window properties here
  }
}
