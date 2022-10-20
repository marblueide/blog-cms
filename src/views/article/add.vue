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
        <TagInput
          :data="form.tags"
          placeholder="New Tag"
          @query-search-async="querySearchAsync"
          @close-tag="handleCloseTag"
          v-model:value="inputValue"
          @handle-input-confirm="handleInputConfirm"
        />
      </el-form-item>
      <el-form-item label="分组">
        <TagInput
          :data="form.groups"
          placeholder="New Group"
          value-key="name"
          @query-search-async="queryGroupSearchAsync"
          @close-tag="handleGroupCloseTag"
          v-model:value="groupInputValue"
          @handle-input-confirm="handleGroupInputConfirm"
        />
      </el-form-item>
      <el-form-item label="类别">
        <el-cascader
          :options="selectData"
          clearable
          :show-all-levels="false"
          :props="selectProp"
          v-model="formType"
        />
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
import { createArticle, getTypeByName } from "@/api";
import { Article, ArticleCreateInput, Type } from "@/types";
import {
  ElInput,
  ElMessage,
  FormInstance,
  FormRules,
  UploadUserFile,
} from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { nextTick, onActivated, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import MdEditor from "@/components/mdEditor/index.vue";
import _ from "lodash";
import TagInput from "@/components/tag.vue";
import { useTagInput } from "./hook/useTagInput";
import { useGroupTagInput } from "./hook/useGroupInput";

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
const { inputValue, handleCloseTag, handleInputConfirm, querySearchAsync } =
  useTagInput(form);
const {
  inputValue: groupInputValue,
  handleGroupCloseTag,
  handleGroupInputConfirm,
  queryGroupSearchAsync,
} = useGroupTagInput(form);
const formType = ref<string>("");
const selectData = ref<Type[]>([]);
const selectProp = {
  value: "id",
  label: "name",
  children: "childType",
  checkStrictly: true,
  emitPath: false,
};

const getType = async () => {
  const res = await getTypeByName("Article");
  selectData.value = res.getTypeByNameAndRoot.childType || [];
};

getType();

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
  fileList.value = [];
  formType.value = ""
};

onActivated(() => {
  reset();
});

const mdEditorUploadImg = (files: File[]) => {
  return files.map((it) => {
    return {
      title: it.name,
      url: URL.createObjectURL(it),
    };
  });
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
    type: formType.value
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
    reset();
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
