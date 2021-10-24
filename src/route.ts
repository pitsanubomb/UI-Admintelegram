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
      redirect: "/app/user/",
      children: [
        {
          path: "/app/user",
          name: "user",
          meta: { title: "User", icon: "UserOutlined" },
          redirect: "/app/user/list/",
          component: ViewLayout,
          children: [
            {
              path: "list",
              name: "userlist",
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
        {
          path: "/app/channel",
          name: "channel",
          meta: { title: "Channel", icon: "TeamOutlined" },
          // component: () => import("./views/group/grouplist.vue"),
          component: ViewLayout,
          children: [
            {
              path: "list",
              name: "chanellist",
              meta: { title: "List", icon: "AuditOutlined" },
              component: () => import("./views/channel/channellist.vue"),
            },
            // {
            //   path: "message",
            //   name: "message",
            //   meta: { title: "Message", icon: "MessageOutlined" },
            //   component: () => import("./views/group/message.vue"),
            // },
          ],
        },
      ],
    },
  ],
});
