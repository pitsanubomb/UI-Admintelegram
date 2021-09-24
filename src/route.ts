import BasicLayout from "./layouts/BasicLayout.vue";
import ViewLayout from "./layouts/ViewLayout.vue";
import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
  history: createWebHistory(),
  routes: [ 
    {
      path: "/",
      name: "index",
      meta: { title: "Home" },
      component: BasicLayout,
      redirect: "/app",
      children: [
        {
          path: "/app",
          name: "app",
          meta: { title: "User", icon: "UserOutlined" },
          redirect: "/app/user",
          component: ViewLayout,
          children: [
            {
              path: "user",
              name: "user",
              meta: { title: "List", icon: "TeamOutlined" },
              component: () => import("./views/user/userlist.vue"),
            },
          ],
        },
      ],
    },
  ],
});
