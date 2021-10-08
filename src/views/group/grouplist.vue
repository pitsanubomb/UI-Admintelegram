<template>
  <a-table
    :dataSource="groupList.response.data"
    :columns="columns"
    :loading="groupList.loading"
  >
    <template #call="{ record }">
      <span>
        <a :href="`tel:` + record.phone">+{{ record.phone }}</a>
      </span>
    </template>
    <template #action="{ record }">
      <span>
        <a :href="`group/message/` + record.id">Message</a>
      </span>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import getAllGroups from "../../hook/groups";

const groupList: any = getAllGroups();
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
  {
    title: "Action",
    key: "action",
    slots: { customRender: "action" },
  },
];
</script>
