import "ant-design-vue/dist/antd.css";
import "@ant-design-vue/pro-layout/dist/style.css";

import { createApp } from "vue";
import route from "./route";
import { ConfigProvider } from "ant-design-vue";
// import icons from "./menuicons";
import ProLayout, { PageContainer } from "@ant-design-vue/pro-layout";
import App from "./App.vue";
import icon from "./icon";

createApp(App)
  .use(route)
  .use(ConfigProvider)
  .use(icon)
  .use(ProLayout)
  .use(PageContainer)
  .mount("#app");
