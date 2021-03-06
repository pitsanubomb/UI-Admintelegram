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
        <a-radio value="video">Video</a-radio>
        <a-radio value="media">Media</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Select group" name="user">
      <a-select
        v-model:value="formState.user"
        placeholder="please group"
        mode="multiple"
        :options="option.response.data.map((u:any) => ({value:u.id,label:u.groupname}))"
      >
      </a-select>
    </a-form-item>
    <template v-if="formState.checked === 'message'">
      <a-form-item label="Message" name="message">
        <a-input v-model:value="formState.message" />
      </a-form-item>
    </template>
    <template v-else-if="formState.checked === 'video'">
      <a-form-item label="Upload Video">
        <a-upload
          v-model:file-list="formState.fileVideo"
          name="file"
          :multiple="false"
          :before-upload="beforeUploadVideo"
          action="https://api-telegramadmin.herokuapp.com/upload/video"
          @change="handleChangeVideo"
        >
          <a-button>
            <upload-outlined></upload-outlined>
            Click to Upload
          </a-button>
        </a-upload>
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
      <a-form-item name="buttonUrl1" label="Link">
        <a-input v-model:value="formState.buttonUrl1" />
      </a-form-item>
      <a-form-item name="buttonUrl1" label="Button text">
        <a-input v-model:value="formState.buttontext1" />
      </a-form-item>
      <a-form-item name="buttonUrl2" label="Link">
        <a-input v-model:value="formState.buttonUrl2" />
      </a-form-item>
      <a-form-item name="buttonText2" label="Button text">
        <a-input v-model:value="formState.buttontext2" />
      </a-form-item>
      <a-form-item name="buttonUrl3" label="Link">
        <a-input v-model:value="formState.buttonUrl3" />
      </a-form-item>
      <a-form-item name="buttonText3" label="Button text">
        <a-input v-model:value="formState.buttontext3" />
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
import { defineComponent, ref, reactive, toRaw, UnwrapRef } from "vue";
import button from "ant-design-vue/lib/button";
import getAllGroups from "../../hook/groups";

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
      message: "Please select group",
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

const option: any = getAllGroups();

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

const handleChangeVideo = (info: FileInfo) => {
  if (info.file.status === "uploading") {
    loading.value = true;
    return;
  }
  if (info.file.status === "done") {
    loading.value = false;
    imageUrl.value = `https://api-telegramadmin.herokuapp.com/upload/video/${info.file.response.filename}`;
  }
  if (info.file.status === "error") {
    loading.value = false;
    message.error("upload error");
  }
};

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

const beforeUploadVideo = (file: FileItem) => {
  // console.log(file.type)
  const isVideo = file.type === "video/mp4";
  if (!isVideo) {
    message.error("You can only upload mp4 file!");
  }
  const isLt40M = file.size / 1024 / 1024 <= 40;
  if (!isLt40M) {
    message.error("Image must smaller than 40MB!");
  }
  return isVideo && isLt40M;
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
            "https://api-telegramadmin.herokuapp.com/telegram/group",
            requestOptions
          )
            .then((response) => message.success(`ส่งข้อความสำเร็จ`))
            .then((result) => console.log(result))
            .catch((error) => message.error(error));
        } else if (body.checked === `video`) {
          let myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          let raw = JSON.stringify({
            id: e,
            video: imageUrl.value,
          });

          let requestOptions: any = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };
          fetch(
            "https://api-telegramadmin.herokuapp.com/telegram/group/video",
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
        } else {
          let myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          let show = 1;
          let b = [];

          let newObj: any = {};
          newObj[body.buttontext1] = body.buttonUrl1;

          if (body.buttontext2 !== "") {
            newObj[body.buttontext2] = body.buttonUrl2;
            show = 2;
          }

          if (body.buttontext3 !== "") {
            newObj[body.buttontext3] = body.buttonUrl3;
            show = 2;
          }
          b.push(newObj);

          let raw = JSON.stringify({
            id: e,
            image: imageUrl.value,
            show: show,
            button: b[0],
          });

          let requestOptions: any = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          fetch(
            "https://api-telegramadmin.herokuapp.com/telegram/group/image",
            requestOptions
          )
            .then((response) => message.success(`ส่งข้อความสำเร็จ`))
            .then((result) => console.log(result))
            .catch((error) => message.error(error));
        }
      });
      formRef.value.resetFields();
    })
    .catch((error: ValidateErrorEntity<FormState>) => {
      console.log("error", error);
    });
};
</script>
