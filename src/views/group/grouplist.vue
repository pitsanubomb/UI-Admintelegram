<template>
  <a-table
    :dataSource="groupList.response.data"
    :columns="columns"
    :loading="groupList.loading"
  >
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
    title: "Groupname",
    dataIndex: "groupname",
    key: "groupname",
  },
  {
    title: "Action",
    key: "action",
    slots: { customRender: "action" },
  },
];
</script>
