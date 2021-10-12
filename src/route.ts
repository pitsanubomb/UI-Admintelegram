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
          path: "/app/user",
          name: "app",
          meta: { title: "User", icon: "UserOutlined" },
          redirect: "/app/user",
          component: ViewLayout,
          children: [
            {
              path: "list",
              name: "user",
              meta: { title: "List", icon: "AuditOutlined" },
              component: () => import("./views/user/userlist.vue"),
            },
            {
              path: "message",
              name: "usermessage",
              meta: { title: "Message", icon: "MessageOutlined" },
              component: () => import("./views/user/message.vue"),
            },
          ],
        },
        {
          path: "/app/group",
          name: "group",
          meta: { title: "Group", icon: "TeamOutlined" },
          // component: () => import("./views/group/grouplist.vue"),
          component: ViewLayout,
          children: [
            {
              path: "list",
              name: "grouplist",
              meta: { title: "List", icon: "AuditOutlined" },
              component: () => import("./views/group/grouplist.vue"),
            },
            {
              path: "message",
              name: "message",
              meta: { title: "Message", icon: "MessageOutlined" },
              component: () => import("./views/group/message.vue"),
            },
          ],
        },
      ],
    },
  ],
});
