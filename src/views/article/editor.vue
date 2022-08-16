<template>
  <div class="editor-container">
    <el-form :model="form" label-width="90px" v-if="form">
      <el-form-item label="id">
        <el-input v-model="form.id" class="w-96" disabled />
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title" class="w-96" />
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
            v-if="form.content"
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
        <el-button type="primary" class="mr-10" @click="update">修改</el-button>
        <el-button @click="router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { getArticleById, updateArticle } from "@/api";
import { Article, ArticleUpdateInput, Group, Tag } from "@/types";
import { ElInput, ElMessage } from "element-plus";
import { nextTick, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import MdEditor from "@/components/mdEditor/index.vue";
import _ from "lodash";

const route = useRoute();
const router = useRouter();
const { id } = route.query;

const form = ref<Article>();
const getData = async (id: string) => {
  if (!id) return;
  form.value = await getArticleById(id);
  console.log(form.value);
};
getData(id as string);

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
  console.log(files);
  return files.map((it) => {
    return {
      title: it.name,
      url: URL.createObjectURL(it),
    };
  });
};

const update = async () => {
  if (!form.value?.id) return;
  const tags = form.value.tags?.map((it) => it.name as string) || [];
  const groups = form.value.groups?.map((it) => it.name as string) || [];
  // @ts-ignore
  let input: ArticleUpdateInput = {
    ..._.cloneDeep(form.value),
    tags,
    groups,
  };
  // @ts-ignore
  delete input.__typename;
  let res = await updateArticle(input);
  console.log(res);
  if (res?.code == 200) {
    ElMessage({
      message: "修改成功",
      type: 'success'
    });
  }
};
</script>

<script lang="ts">
export default {
  name: "editorArticle",
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
