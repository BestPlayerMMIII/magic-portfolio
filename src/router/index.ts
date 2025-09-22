import { createRouter, createWebHistory } from "vue-router";
import { MagicPortfolio, Post } from "@/scenes";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: MagicPortfolio,
    },
    {
      path: "/post/:schemaId/:postId",
      name: "post",
      component: Post,
    },
  ],
});

export default router;
