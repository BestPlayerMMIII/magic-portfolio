import { createRouter, createWebHistory } from "vue-router";
import MagicPortfolio from "../scenes/MagicPortfolio.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: MagicPortfolio,
    },
  ],
});

export default router;
