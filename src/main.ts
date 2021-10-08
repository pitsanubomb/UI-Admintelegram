import "ant-design-vue/dist/antd.css";
import "@ant-design-vue/pro-layout/dist/style.css";

import { createApp } from "vue";
import route from "./route";
import Antd, { ConfigProvider } from "ant-design-vue";
import ProLayout, { PageContainer } from "@ant-design-vue/pro-layout";
import App from "./App.vue";
import icon from "./icon";
import store from "./store";

createApp(App)
  .use(route)
  .use(ConfigProvider)
  .use(Antd)
  .use(icon)
  .use(store)
  .use(ProLayout)
  .use(PageContainer)
  .mount("#app");
