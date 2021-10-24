<template>
  <a-modal
    v-if="option.loading === false"
    title="Title"
    v-model:visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
  >
    <a-select
      v-model:value="options"
      :options="option.response.data.map((u:any) => ({value:u.id,label:u.groupname}))"
      mode="multiple"
      placeholder="Please select"
      style="width: 200px"
    >
    </a-select>
  </a-modal>
  <a-table
    :dataSource="channelList.response.data"
    :columns="columns"
    :loading="channelList.loading"
    class="components-table-demo-nested"
  >
    <template #expandedRowRender="record">
      <a-table
        :columns="innerColumns"
        :data-source="record.record.messages"
        :pagination="false"
      >
        <template #file="{ text }">
          <video v-if="isVideo(text)" width="50" controls :src="text"></video>
          <a-image v-else :width="50" :src="text" />
        </template>
        <template #operation="{ text }">
          <span class="table-operation">
            <a-button type="primary" @click="showModal(record.record.id, text)"
              >Foward message</a-button
            >
          </span>
        </template>
      </a-table>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import getAllChannels from "../../hook/channel";
import getAllGroups from "../../hook/groups";
import { message } from "ant-design-vue";

const channelList: any = getAllChannels();
const confirmLoading = ref<boolean>(false);
const option: any = getAllGroups();
const columns = [
  {
    title: "Channalname",
    dataIndex: "title",
    key: "title",
  },
];

const visible = ref<boolean>(false);
const options = ref<Array<any>>([]);
let gid: string;
let mid: string;

const showModal = (r: any, id: string) => {
  gid = r;
  mid = id;
  visible.value = true;
};

const handleOk = () => {
  confirmLoading.value = true;
  let i = 0;
  options.value.forEach((element) => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({
      from: gid,
      mid: mid,
    });

    let requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `https://api-telegramadmin.herokuapp.com/telegram/foward/${element}`,
      requestOptions
    ).then(() => {
      i++;
      if (i == options.value.length) {
        confirmLoading.value = false;
        visible.value = false;
        message.success(`Foward ข้อความสำเร็จ`);
      }
    }).catch((e) => message.error(`ไม่สามารถ Foward ข้อความได้`))
  });
};

const innerColumns = [
  {
    title: "Id",
    dataIndex: "mid",
    key: "mid",
  },
  {
    title: "Message",
    dataIndex: "message",
    key: "message",
  },
  {
    title: "File",
    dataIndex: "file",
    key: "file",
    slots: { customRender: "file" },
  },
  {
    title: "Action",
    dataIndex: "mid",
    key: "mid",
    slots: { customRender: "operation" },
  },
];

const isVideo = (url: string) => {
  return url.match(/mp4/);
};
</script>
