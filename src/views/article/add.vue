<template>
  <div class="editor-container">
    <el-form
      ref="ruleFormRef"
      :model="form"
      :rules="rules"
      label-width="90px"
      v-if="form"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" class="w-96" />
      </el-form-item>
      <el-form-item label="封面图">
        <el-upload
          :auto-upload="false"
          list-type="picture-card"
          v-model:file-list="fileList"
          :limit="1"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="概要">
        <el-input
          v-model="form.summary"
          class="w-50"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
      </el-form-item>
      <el-form-item label="文章内容">
        <div style="width: 85%">
          <MdEditor
            v-model:content="form.content"
            :upload-image="mdEditorUploadImg"
          />
        </div>
      </el-form-item>
      <el-form-item label="标签">
        <el-tag
          v-for="(tag, i) in form.tags"
          :key="tag.id || i"
          class="mx-1"
          closable
          :disable-transitions="false"
          @close="tagClose(i, form?.tags)"
        >
          {{ tag.name }}
        </el-tag>
        <el-input
          v-if="tagInputVisible"
          ref="TagInputRef"
          v-model="tagInputValue"
          class="ml-1 w-20"
          size="small"
          @keyup.enter="TagInputConfirm"
          @blur="TagInputConfirm"
        />
        <el-button
          v-else
          class="button-new-tag ml-1"
          size="small"
          @click="tagInputShow"
        >
          + New Tag
        </el-button>
      </el-form-item>
      <el-form-item label="分组">
        <el-tag
          v-for="(group, i) in form.groups"
          :key="group.id"
          class="mx-1"
          closable
          :disable-transitions="false"
          @close="tagClose(i, form?.groups)"
        >
          {{ group.name }}
        </el-tag>
        <el-input
          v-if="groupInputVisibleRef"
          ref="groupInputRef"
          v-model="groupInputValueRef"
          class="ml-1 w-20"
          size="small"
          @keyup.enter="groupInputConfirm"
          @blur="groupInputConfirm"
        />
        <el-button
          v-else
          class="button-new-tag ml-1"
          size="small"
          @click="groupInputShow"
        >
          + New Group
        </el-button>
      </el-form-item>
      <el-form-item label="权重">
        <el-input-number v-model="form.weight" :step="1" :min="0" />
      </el-form-item>
      <el-form-item label="是否公开">
        <el-switch
          v-model="form.isPublic"
          size="large"
          class="ml-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        />
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
import { createArticle } from "@/api";
import { Article, ArticleCreateInput } from "@/types";
import {
  ElInput,
  ElMessage,
  FormInstance,
  FormRules,
  UploadUserFile,
} from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { nextTick, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import MdEditor from "@/components/mdEditor/index.vue";
import _ from "lodash";

const router = useRouter();

const form = ref<Article>({
  title: "",
  weight: 0,
  summary: "",
  content: "",
  isPublic: false,
  tags: [],
  groups: [],
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: "标题不为空",
      trigger: "blur",
    },
  ],
});
const fileList = ref<UploadUserFile[]>([]);

const tagInputVisible = ref(false);
const tagInputValue = ref("");
const TagInputRef = ref<InstanceType<typeof ElInput>>();
const tagInputShow = () => {
  tagInputVisible.value = true;
  nextTick(() => {
    TagInputRef.value!.input!.focus();
  });
};
const TagInputConfirm = () => {
  if (tagInputValue.value) {
    form.value?.tags &&
      form.value?.tags.push({
        name: tagInputValue.value,
      });
  }
  tagInputVisible.value = false;
  tagInputValue.value = "";
};

const groupInputVisibleRef = ref(false);
const groupInputValueRef = ref("");
const groupInputRef = ref<InstanceType<typeof ElInput>>();

const groupInputShow = () => {
  groupInputVisibleRef.value = true;
  nextTick(() => {
    groupInputRef.value!.input!.focus();
  });
};
const groupInputConfirm = () => {
  if (groupInputValueRef.value) {
    form.value?.groups &&
      form.value?.groups.push({
        name: groupInputValueRef.value,
      });
  }
  groupInputVisibleRef.value = false;
  groupInputValueRef.value = "";
};
const tagClose = (index: number, prop: any[] | undefined) => {
  if (!Array.isArray(prop)) return;
  prop.splice(index, 1);
};

const mdEditorUploadImg = (files: File[]) => {
  return files.map((it) => {
    return {
      title: it.name,
      url: URL.createObjectURL(it),
    };
  });
};

const reset = () => {
  form.value = {
    title: "",
    weight: 0,
    summary: "",
    content: "",
    isPublic: false,
    tags: [],
    groups: [],
  };
};

const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      create();
    } else {
      console.log("error submit!", fields);
    }
  });
};

const create = async () => {
  const tags = form.value.tags?.map((it) => it.name as string) || [];
  const groups = form.value.groups?.map((it) => it.name as string) || [];
  let input: ArticleCreateInput = {
    ...form.value,
    tags,
    groups,
  };
  if (fileList.value[0]?.raw) {
    input.file = fileList.value[0].raw;
  }
  let res = await createArticle(input);
  if (res?.code == 200) {
    ElMessage({
      message: res.msg,
      type: "success",
    });
    reset()
    router.back();
  }
};
</script>

<script lang="ts">
export default {
  name: "addArticle",
};
</script>

<style lang="scss" scoped>
.editor-container {
  background-color: white;
  padding: 1.25rem;
}
.editor-container :deep(.el-form-item__label) {
  justify-content: flex-start;
}
</style>
