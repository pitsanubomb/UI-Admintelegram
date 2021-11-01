<template>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    v-if="option.response.data"
  >
    <a-form-item label="Select Message Type">
      <a-radio-group name="radioGroup" v-model:value="formState.checked">
        <a-radio value="message">Message</a-radio>
        <a-radio value="media">Media</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Select channel" name="user">
      <a-select
        v-model:value="formState.user"
        placeholder="please channel"
        mode="multiple"
        :options="option.response.data.map((u:any) => ({value:u.id,label:u.title}))"
      >
      </a-select>
    </a-form-item>
    <template v-if="formState.checked === 'message'">
      <a-form-item label="Message" name="message">
        <a-input v-model:value="formState.message" />
      </a-form-item>
    </template>
    <template v-else-if="formState.checked === 'media'">
      <a-form-item label="Upload Video">
        <a-upload
          v-model:file-list="formState.fileVideo"
          name="file"
          :multiple="false"
          :before-upload="beforeUploadMedia"
          action="https://api-telegramadmin.herokuapp.com/upload/media"
          @change="handleChangeMedia"
        >
          <a-button>
            <upload-outlined></upload-outlined>
            Click to Upload
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="Caption" name="caption">
        <a-textarea v-model:value="formState.caption" />
      </a-form-item>
    </template>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">Create</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">Cancel</a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { message } from "ant-design-vue";
import { ref, reactive, toRaw, UnwrapRef } from "vue";
import getAllChannels from "../../hook/channel";

interface FormState {
  user: [];
  message: string;
  checked: string;
  fileImage: [];
  fileVideo: [];
  buttonUrl1: string;
  buttonUrl2: string;
  buttonUrl3: string;
  buttontext1: string;
  buttontext2: string;
  buttontext3: string;
  caption: string;
}

interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string | any;
  url?: string;
  type?: string;
  size: number;
  originFileObj: any;
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}

const labelCol = { span: 6 };
const wrapperCol = { span: 14 };
const rules = {
  user: [
    {
      required: true,
      message: "Please select channel",
      trigger: "change",
      type: "array",
    },
  ],
  message: [
    { required: true, message: "Please input message", trigger: "blur" },
  ],
  imageUrl: [
    { required: true, message: "Please input imagelink", trigger: "blur" },
  ],
  buttonUrl1: [
    { required: true, message: "Please input link", trigger: "blur" },
  ],
  buttontext1: [
    { required: true, message: "Please input text", trigger: "blur" },
  ],
};

const option: any = getAllChannels();

const loading = ref<boolean>(false);
const imageUrl = ref<string>("");
const mediaList: any = [];
const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({
  user: [],
  message: "",
  checked: "message",
  imageUrl: "",
  fileImage: [],
  fileVideo: [],
  buttonUrl1: "",
  buttonUrl2: "",
  buttonUrl3: "",
  buttontext1: "",
  buttontext2: "",
  buttontext3: "",
  caption: "",
});

const handleChangeMedia = (info: FileInfo) => {
  if (info.file.status === "uploading") {
    loading.value = true;
    return;
  }
  if (info.file.status === "done") {
    loading.value = false;
    let type = info.file.type?.match(/image/g);
    let vtype = info.file.type?.match(/video/g);
    // if(type === "")
    if (type) {
      mediaList.push({
        type: "photo",
        media: {
          url: `https://api-telegramadmin.herokuapp.com/upload/meida/${info.file.response.filename}`,
        },
      });
    } else if (vtype) {
      mediaList.push({
        type: "video",
        media: {
          url: `https://api-telegramadmin.herokuapp.com/upload/meida/${info.file.response.filename}`,
        },
      });
    }
  }
  if (info.file.status === "error") {
    loading.value = false;
    message.error("upload error");
  }
};

const beforeUploadMedia = (file: FileItem) => {
  // console.log(file.type)
  const isLt40M = file.size / 1024 / 1024 <= 40;
  if (!isLt40M) {
    message.error("Image must smaller than 40MB!");
  }
  return isLt40M;
};

const resetForm = () => {
  formRef.value.resetFields();
};

const onSubmit = () => {
  formRef.value
    .validate()
    .then(() => {
      let body = toRaw(formState);
      body.user.forEach((e) => {
        if (body.checked === `message`) {
          let myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          let raw = JSON.stringify({
            id: e,
            message: body.message,
          });

          let requestOptions: any = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          fetch(
            "https://api-telegramadmin.herokuapp.com/telegram/channel/message",
            requestOptions
          )
            .then((response) => message.success(`ส่งข้อความสำเร็จ`))
            .then((result) => console.log(result))
            .catch((error) => message.error(error));
        } else if (body.checked === `media`) {
          let myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          mediaList[0].caption = body.caption;

          let raw = JSON.stringify({
            id: e,
            media: mediaList,
          });

          let requestOptions: any = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          fetch(
            "https://api-telegramadmin.herokuapp.com/telegram/media",
            requestOptions
          )
            .then((response) => message.success(`ส่งข้อความสำเร็จ`))
            .then((result) => console.log(result))
            .catch((error) => message.error(error));
        }
      });
    })
    .catch((error: ValidateErrorEntity<FormState>) => {
      console.log("error", error);
    });
};
</script>
