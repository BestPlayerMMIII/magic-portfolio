import { createRouter, createWebHistory } from "vue-router";
import MagicLaboratory from "../scenes/MagicLaboratory.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: MagicLaboratory,
    },
  ],
});

export default router;
