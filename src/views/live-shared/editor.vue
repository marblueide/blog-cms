<template>
  <div class="editor-container">
    <el-form :model="form" label-width="90px">
      <el-form-item label="id">
        <el-input v-model="form.id" class="w-96" disabled />
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title" class="w-96" />
      </el-form-item>
      <el-form-item label="封面图">
        <el-upload
          class="avatar-uploader w-96"
          :auto-upload="false"
          :limit="1"
          v-model:file-list="imageFileList"
          :on-remove="imageRemove"
          drag
          ref="upload"
        >
          <div v-show="!form.illustration && !imageFileList.length">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </div>
          <div v-show="form.illustration || imageFileList.length > 0">
            <el-image
              :src="getLocationImgUrl"
              :preview-src-list="[getLocationImgUrl]"
              hide-on-click-modal
              fit="cover"
            />
          </div>
        </el-upload>
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
      <el-form-item label="地址">
        <el-autocomplete
          v-model="form.address"
          placeholder="请输入地址"
          :fetch-suggestions="querySearchAsync"
          value-key="name"
          class="w-96"
        >
          <template #default="{ item }">
            <div class="autocomplete">
              <div class="value">{{ item.name }}</div>
              <div class="district">{{ item.district }}</div>
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="心情">
        <el-input v-model="form.emotion" class="w-96">
          <template #suffix>
            <div class="relative">
              <el-button
                class="px-10 pointer"
                @click="emojiVisible = !emojiVisible"
                text
                >😀</el-button
              >
              <Emoji
                v-model:emoji-visible="emojiVisible"
                @emoji-click="emojiClick"
                top
              />
            </div>
          </template>
        </el-input>
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
      <el-form-item label="权重">
        <el-input-number v-model="form.weight" :step="1" :min="0" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="mr-10" @click="update">修改</el-button>
        <el-button @click="router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { LiveShared, LiveSharedUpdateInput } from "@/types";
import { ElInput, ElMessage, UploadUserFile } from "element-plus";
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import MdEditor from "@/components/mdEditor/index.vue";
import _ from "lodash";
import { getLiveSharedById, updateLiveShared } from "@/api/live-shared";
import { UploadFilled } from "@element-plus/icons-vue";
import Emoji from "@/components/emoji/index.vue";
import { deCodeEmoji, encodeEmoji } from "@/utils/transformEmoji";
import { from } from "@apollo/client";
import { gaodeMap } from "@/utils/api/gaode";
import { InputTipType } from "@/utils/api/gaode/type";

const route = useRoute();
const router = useRouter();
const { id } = route.query;
const IMGBASEURL = import.meta.env.VITE_BASE_IMG_ADDRESS;
// @ts-ignore
const form = ref<LiveShared>({});
const imageFileList = ref<UploadUserFile[]>([]);
const upload = ref();

onMounted(async () => {
  const dom = document.getElementsByClassName("el-upload__input")[0];
  dom.addEventListener(
    "click",
    (e) => {
      if (imageFileList.value.length > 0) e.preventDefault();
    },
    false
  );
});

const getData = async (id: string) => {
  if (!id) return;
  form.value = await getLiveSharedById(id);
  form.value.emotion && (form.value.emotion = deCodeEmoji(form.value.emotion));
  form.value.illustration &&
    imageFileList.value.push({
      name: form.value.illustration,
      url: form.value.illustration,
    });
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
  let input: LiveSharedUpdateInput = _.pick(form.value, [
    "id",
    "content",
    "weight",
    "address",
    "emotion",
  ]) as LiveSharedUpdateInput;
  form.value.tags &&
    (input.tags = form.value.tags.map((it) => it.name as string));
  input.emotion && (input.emotion = encodeEmoji(input.emotion));
  if (imageFileList.value.length > 0 && imageFileList.value[0].raw) {
    input.file = imageFileList.value[0].raw;
  }
  let res = await updateLiveShared(input);
  console.log(res);
  if (res?.code == 200) {
    ElMessage({
      message: "修改成功",
      type: "success",
    });
    router.back();
  }
};

const getLocationImgUrl = computed(() => {
  if (!imageFileList.value.length) return;
  if (form.value?.illustration) {
    return IMGBASEURL + form.value.illustration;
  }
  return URL.createObjectURL(imageFileList.value[0].raw as File);
});

const imageRemove = () => {
  form.value?.illustration && (form.value.illustration = "");
};

const emojiVisible = ref(false);
const emojiClick = (emoji: string) => {
  console.log(emoji);
  form.value.emotion = form.value.emotion ? form.value.emotion + emoji : emoji;
};

const querySearchAsync = async (queryString: string) => {
  if (!queryString || queryString.length == 0 || queryString == "null")
    return [];
  let { tips } = await gaodeMap.inputTip({
    keywords: queryString,
  });
  return tips;
};
</script>

<script lang="ts">
export default {
  name: "liveSharedEditor",
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
.autocomplete {
  padding: 5px 0;
  div {
    line-height: normal !important;
  }
  .district {
    color: #c3c3c3;
    font-size: x-small;
  }
}
</style>
