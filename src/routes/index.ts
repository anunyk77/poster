import { createRouter, createWebHistory } from "vue-router";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/editor",
      name: "Editor",
      component: () => import("../views/Editor.vue"),
    },
  ],
});

export default router;
