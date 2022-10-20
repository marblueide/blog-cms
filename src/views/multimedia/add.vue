<template>
  <div class="editor-container">
    <el-form :model="form" label-width="80px" ref="ruleFormRef" :rules="rules">
      <el-form-item label="标题" prop="title">
        <el-input class="w-96" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input class="w-96" v-model="form.author"></el-input>
      </el-form-item>
      <el-form-item label="外链">
        <el-input class="w-96" v-model="form.outerLink"></el-input>
      </el-form-item>
      <el-form-item label="封面图">
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          v-model:file-list="coverFileList"
          :auto-upload="false"
          accept="image/*"
          :limit="1"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文件">
        <el-upload
          class="file-uploader w-96"
          ref="upload"
          v-model:file-list="fileList"
          :on-change="fileUploadChange"
          :auto-upload="false"
          :limit="1"
          accept="audio/*,video/*"
          drag
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">Video and audio only</div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="标签">
        <TagInput
          :data="form.tags"
          @query-search-async="querySearchAsync"
          @close-tag="handleCloseTag"
          v-model:value="inputValue"
          @handle-input-confirm="handleInputConfirm"
          placeholder="请输入标签"
        />
      </el-form-item>
      <el-form-item label="权重">
        <el-input-number v-model="form.weight" :step="1" :min="0" :max="10" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="mr-10" @click="submit(ruleFormRef)"
          >添加</el-button
        >
        <el-button @click="router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ArticleCreateInput, FromType, Multimedia } from "@/types";
import {
  ElMessage,
  FormInstance,
  FormRules,
  UploadProps,
  UploadUserFile,
} from "element-plus";
import { reactive, ref } from "vue";
import { Plus, UploadFilled } from "@element-plus/icons-vue";
import TagInput from "@/components/tag.vue";
import { useTagInput } from "./hook/useTagInput";
import { useRouter } from "vue-router";
import { MultimediaCreateInput } from "@/types/input/multimedia";
import { createMultimedia } from "@/api/multimedia";

const router = useRouter();
const form = ref<Multimedia>({
  tags: [],
  weight: 0,
});
const coverFileList = ref<UploadUserFile[]>([]);
const fileList = ref<UploadUserFile[]>([]);
const ruleFormRef = ref<FormInstance>();
const { inputValue, handleCloseTag, handleInputConfirm, querySearchAsync } =
  useTagInput(form);
const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: "标题不为空",
      trigger: "change",
    },
  ],
});

const fileUploadChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile)
  if (!form.value.title) {
    form.value.title = uploadFile.name;
  }
};

const regExp = {
  audio: /audio/i,
  video: /video/i,
};

const reset = () => {
  form.value = {};
  coverFileList.value = [];
  fileList.value = [];
};

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      create();
    } else {
      console.log("error submit!", fields);
    }
  });
};

const setFileType = (input: MultimediaCreateInput, type: string) => {
  if (regExp.audio.test(type)) {
    input.type = "Music";
  } else if (regExp.video.test(type)) {
    input.type = "Video";
  }
};

const create = async () => {
  const tags = form.value.tags?.map((it) => it.name as string) || [];
  // @ts-ignore
  let input: MultimediaCreateInput = {
    ...form.value,
    tags,
  };
  if (fileList.value[0]?.raw) {
    input.file = fileList.value[0].raw;
    const type = fileList.value[0].raw.type;
    setFileType(input, type);
  }
  if (coverFileList.value[0]?.raw) {
    input.coverFile = coverFileList.value[0].raw;
  }
  if(!input.type) throw new Error('Select the file you want to upload')
  console.log(input);
  let res = await createMultimedia(input);
  if (res?.code === 200) {
    ElMessage({
      message: res.msg,
      type: "success",
    });
    reset();
    router.back();
  }
};
</script>

<script lang="ts">
export default {
  name: "multimediaAdd",
};
</script>

<style lang="scss" scoped>
.editor-container {
  background-color: white;
  padding: 1.25rem;
}
</style>
