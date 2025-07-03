import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect:'/home',
      name: "Index",
      component: () => import("../views/Index.vue"),
      children: [
        { path: '/home', name: 'Home', component: () => import("../views/Home.vue") }
      ]
    },
    {
      path: '/login',
      name: "Login",
      component: () => import('../views/Login.vue')
    },
    {
      path: "/editor",
      name: "Editor",
      component: () => import("../views/Editor.vue"),
    },
  ],
});

export default router;
