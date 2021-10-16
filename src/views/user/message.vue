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
        <a-radio value="image">Image</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Select user" name="user">
      <a-select
        v-model:value="formState.user"
        placeholder="please select users"
        mode="multiple"
        :options="option.response.data.map((u:any) => ({value:u.id,label:u.username}))"
      >
      </a-select>
    </a-form-item>
    <template v-if="formState.checked === 'message'">
      <a-form-item label="Message" name="message">
        <a-input v-model:value="formState.message" />
      </a-form-item>
    </template>
    <template v-else>
      <a-form-item label="Upload Image">
        <a-upload
          v-model:file-list="formState.fileImage"
          name="file"
          list-type="picture-card"
          class="avatar-uploader"
          action="https://api-telegramadmin.herokuapp.com/upload"
          :show-upload-list="false"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <img :width="200" v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
      </a-form-item>
      <!-- <a-form-item label="imageurl" name="imageUrl">
        <a-input v-model:value="formState.imageUrl" />
      </a-form-item> -->
      <a-form-item name="buttonUrl1" label="Link">
        <a-input v-model:value="formState.buttonUrl1" />
      </a-form-item>
      <a-form-item name="buttonUrl1" label="Button text">
        <a-input v-model:value="formState.buttontext1" />
      </a-form-item>
    </template>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">Create</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">Cancel</a-button>
    </a-form-item>
  </a-form>
  <canvas id="aImage"></canvas>
</template>
<script lang="ts" setup>
import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { message } from "ant-design-vue";
import { defineComponent, ref, reactive, toRaw, UnwrapRef } from "vue";
import getAllUser from "../../hook/users";
import button from "ant-design-vue/lib/button";

interface FormState {
  user: [];
  message: string;
  checked: string;
  fileImage: [];
  imageUrl: string;
  buttonUrl1: string;
  buttonUrl2: string;
  buttonUrl3: string;
  buttontext1: string;
  buttontext2: string;
  buttontext3: string;
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
      message: "Please select user",
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

const option: any = getAllUser();

const loading = ref<boolean>(false);
const imageUrl = ref<string>("");
const formRef = ref();
const formState: UnwrapRef<FormState> = reactive({
  user: [],
  message: "",
  checked: "message",
  imageUrl: "",
  fileImage: [],
  buttonUrl1: "",
  buttonUrl2: "",
  buttonUrl3: "",
  buttontext1: "",
  buttontext2: "",
  buttontext3: "",
});

const handleChange = (info: FileInfo) => {
  if (info.file.status === "uploading") {
    loading.value = true;
    return;
  }
  if (info.file.status === "done") {
    loading.value = false;
    imageUrl.value = `https://api-telegramadmin.herokuapp.com/upload/img/${info.file.response.filename}`;
  }
  if (info.file.status === "error") {
    loading.value = false;
    message.error("upload error");
  }
};

const beforeUpload = (file: FileItem) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG or PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
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
            "https://api-telegramadmin.herokuapp.com/telegram/",
            requestOptions
          )
            .then((response) => message.success(`ส่งข้อความสำเร็จ`))
            .then((result) => console.log(result))
            .catch((error) => message.error(error));
        } else {
          let myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          let newObj: any = {};
          newObj[body.buttontext1] = body.buttonUrl1;

          let raw = JSON.stringify({
            id: e,
            image: imageUrl.value,
            show: 1,
            button: newObj,
          });

          let requestOptions: any = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          fetch(
            "https://api-telegramadmin.herokuapp.com/telegram/image",
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
