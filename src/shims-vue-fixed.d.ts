/// <reference types="vue/macros-global" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Three.js type extensions
declare global {
  interface Window {
    // Add any global window properties here
  }
}
