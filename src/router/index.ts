import { createRouter, createWebHistory } from "vue-router";
import { MagicPortfolio, Post, PostSection, About } from "@/scenes";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: MagicPortfolio,
    },
    {
      path: "/about",
      name: "about",
      component: About,
    },
    {
      path: "/post/:schemaId",
      name: "post-section",
      component: PostSection,
    },
    {
      path: "/post/:schemaId/:postId",
      name: "post",
      component: Post,
    },
  ],
});

export default router;
