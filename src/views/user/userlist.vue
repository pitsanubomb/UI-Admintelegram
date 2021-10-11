<template>
  <a-table
    :dataSource="userList.response.data"
    :columns="columns"
    :loading="userList.loading"
  >
    <template #call="{ record }">
      <span v-if="record.phone">
        <a :href="`tel:` + record.phone">+{{ record.phone }}</a>
      </span>
    </template>
    <!-- <template #action="{ record }">
      <span>
        <a :href="`user/message/` + record.id">Message</a>
      </span>
    </template> -->
  </a-table>
</template>
<script lang="ts" setup>
import getAllUser from "../../hook/users";

const userList: any = getAllUser();
const columns = [
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Telegramname",
    dataIndex: "firstname",
    key: "firstname",
  },
  {
    title: "Call",
    key: "call",
    slots: { customRender: "call" },
  },
  // {
  //   title: "Action",
  //   key: "action",
  //   slots: { customRender: "action" },
  // },
];
</script>
