<template>
  <div class="photoWall">
    <Table
      v-bind="queryParams"
      v-model:current-page="queryParams.currentPage"
      v-model:page-size="queryParams.pageSize"
      @add-click="dialogChange(true)"
    >
      <el-table ref="table" :data="tableData" stripe style="width: 100%">
        <el-table-column type="selection" width="50" />
        <el-table-column type="index" width="50" />
        <el-table-column
          prop="id"
          label="id"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="author" label="作者" />
        <el-table-column prop="path" label="图片" width="200">
          <template #default="{ row }">
            <el-image
              style="width: 150px; height: 100px"
              :src="IMG_BASE_URL + row.path"
              :preview-src-list="[IMG_BASE_URL + row.path]"
              fit="cover"
              loading="lazy"
              lazy
              preview-teleported
              hide-on-click-modal
            />
          </template>
        </el-table-column>
        <el-table-column prop="originUrl" label="源地址" />
        <el-table-column prop="tags" label="标签" min-width="160">
          <template #default="{ row }">
            <el-tag class="ml-5" v-for="it in row.tags"> {{ it.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分类" min-width="160">
          <template #default="{ row }">
            <el-tag v-if="row.type">{{ row?.type?.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200">
          <template #default="{ row }">
            {{ dayjs(+row.createTime).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ $index, row }">
            <el-button
              type="primary"
              size="small"
              :icon="Edit"
              @click="dialogChange(true, 'edit', row)"
            ></el-button>
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              @click="handleSingleDelete(row.id)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </Table>
    <el-dialog
      v-model="dialogStatus.visible"
      :title="dialogStatus.title"
      width="600px"
    >
      <div class="edit-form-warpper">
        <el-form :model="form" label-width="80px">
          <el-form-item label="id" v-if="dialogStatus.type === 'edit'">
            <el-input class="w-96" v-model="form.id" disabled></el-input>      
             
          </el-form-item>
          <el-form-item label="名称">
             <el-input class="w-96" v-model="form.name"></el-input>      
          </el-form-item>
          <el-form-item label="作者">
            <el-input class="w-96" v-model="form.author"></el-input>  
          </el-form-item>
          <el-form-item label="缩略图">
            <el-upload
              class="upload-demo w-96"
              list-type="picture-card"
              v-model:file-list="editImgs"
              :limit="1"
              :auto-upload="false"
            >
              <template #file="{ file }">
                <div>
                  <el-image
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    fit="cover"
                    :preview-src-list="[showImg]"
                    ref="elImg"
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePreview"
                    >
                      <el-icon><zoom-in /></el-icon>
                    </span>
                    <span class="el-upload-list__item-delete">
                      <el-icon><Download /></el-icon>
                    </span>
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <el-icon><Delete /></el-icon>
                    </span>
                  </span>
                </div>
              </template>
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="原始路径">
            <el-input class="w-96" v-model="form.originUrl"></el-input>  
          </el-form-item>
          <el-form-item label="标签">
            <Tag
              :data="form.tags"
              @query-search-async="querySearchAsync"
              @close-tag="handleCloseTag"
              v-model:value="inputValue"
              @handle-input-confirm="handleInputConfirm"
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
        </el-form>
      </div>

      <div class="text-center w-full">
         
        <el-button class="mx-20" type="primary" @click="handleConfirm"
          >确定</el-button
        >
           
        <el-button class="mx-20" @click="dialogChange(false)">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onActivated, onUnmounted, reactive, ref, watch, watchEffect } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import {
  addPhotoWall,
  deletePhotoWall,
  getPhotoWallList,
  updatePhotoWall,
} from "@/api/photoWall";
import Table from "@/components/table/index.vue";
import { ElLoading, ElMessage, UploadUserFile } from "element-plus";
import dayjs from "dayjs";
import { Delete, Edit, Download, Plus, ZoomIn } from "@element-plus/icons-vue";
import { Label, PhotoWall, Type } from "@/types";
import { useRoute, useRouter } from "vue-router";
import { getTagByNameVague, getTypeByName } from "@/api";
import { computed } from "@vue/reactivity";
import { from } from "@apollo/client";
import Tag from "@/components/tag.vue";

const IMG_BASE_URL = import.meta.env.VITE_BASE_IMG_ADDRESS;

const querySearch = [
  { value: "vue", link: "https://github.com/vuejs/vue" },
  { value: "element", link: "https://github.com/ElemeFE/element" },
  { value: "cooking", link: "https://github.com/ElemeFE/cooking" },
  { value: "mint-ui", link: "https://github.com/ElemeFE/mint-ui" },
  { value: "vuex", link: "https://github.com/vuejs/vuex" },
  { value: "vue-router", link: "https://github.com/vuejs/vue-router" },
  { value: "babel", link: "https://github.com/babel/babel" },
];

const route = useRoute();
const router = useRouter();
const IMGBASEURL = import.meta.env.VITE_BASE_IMG_ADDRESS;

const queryParams = reactive({
  currentPage: +route.query.page! || 1,
  pageSize: +route.query.limit! || 10,
  total: 100,
  editDisabled: true,
  deleteDisabled: true,
});
const getData = async () => {
  let loadingInstance;
  try {
    loadingInstance = ElLoading.service({
      target: table.value.$el,
    });
  } catch (error) {}
  const { pageSize, currentPage } = queryParams;
  const offset = pageSize * (currentPage - 1);
  let { nodes, totalCount } = await getPhotoWallList(pageSize, offset);
  queryParams.total = totalCount;
  tableData.value = nodes;
  loadingInstance?.close();
};

let unOffsetAndLimit = watch(
  () => [queryParams.currentPage, queryParams.pageSize],
  ([page, size], old) => {
    if (old && old[1] != size) {
      queryParams.currentPage = 1;
    }
    router.replace({
      query: {
        limit: size,
        page: page,
      },
    });
    getData();
  },
  {
    immediate: true,
  }
);

const handleSingleDelete = async (id: string) => {
  try {
    const res = await deletePhotoWall(id);
    ElMessage({
      type: "success",
      message: res?.deletePhoto.msg,
    });
  } finally {
    getData();
  }
};

const tableData = ref<PhotoWall[]>();
const table = ref();

const dialogStatus = reactive<{
  visible: boolean;
  type: "edit" | "add";
  title: "图片添加" | "图片编辑";
}>({
  visible: false,
  type: "add",
  title: "图片添加",
});
const form = ref<PhotoWall>({});
const selectData = ref<Type[]>([]);
const selectProp = {
  value: "id",
  label: "name",
  children: "childType",
  checkStrictly: true,
  emitPath: false,
};
const editImgs = ref<UploadUserFile[]>([]);
const elImg = ref();
const formType = ref<string>("");
const inputValue = ref("");

const handlePreview = () => {
  elImg.value.$el.childNodes[0].click();
};

const handleRemove = (file: any) => {
  const index = editImgs.value.findIndex((f) => {
    return f == file;
  });
  editImgs.value.splice(index, 1);
};

const handleConfirm = async () => {
  try {
    const { name, originUrl, author, tags } = form.value;
    if (!name) {
      ElMessage({
        type: "info",
        message: "名称不能为空",
      });
    }
    if (dialogStatus.type == "add") {
      let res = await addPhotoWall({
        name,
        originUrl,
        author,
        tags: tags?.map((tag) => tag.name),
        type: formType.value,
        file: editImgs.value[0].raw as File,
      });
      ElMessage({
        type: "success",
        message: res?.addPhotoToWall.msg,
      });
    } else if (dialogStatus.type == "edit") {
      const res = await updatePhotoWall({
        id: form.value.id,
        name,
        originUrl,
        author,
        tags: tags?.map((tag) => tag.name),
        type: formType.value,
        file: (editImgs.value[0].raw as File) ?? null,
      });
      ElMessage({
        type: "success",
        message: res?.updatePhotoWall.msg,
      });
    }
    dialogChange(false);
  } finally {
    getData();
  }
};

const dialogChange = (
  b: boolean,
  type: "edit" | "add" = "add",
  row: PhotoWall = {
    name: "",
    originUrl: "",
    tags: [],
  }
) => {
  dialogStatus.visible = b;
  dialogStatus.type = type;
  dialogStatus.title = type == "edit" ? "图片添加" : "图片编辑";
  form.value = row;
  formType.value = row.type?.id || "";
  editImgs.value =
    type == "edit"
      ? [
          {
            name: form.value.name as string,
            url: IMGBASEURL + form.value.path,
          },
        ]
      : [];
};

const showImg = computed(() => {
  if (editImgs.value.length == 0) return;
  if (editImgs.value[0].url) {
    return editImgs.value[0].url;
  }
  return URL.createObjectURL(editImgs.value[0].raw as File);
});

const getType = async () => {
  const res = await getTypeByName("图片");
  selectData.value = res.getTypeByNameAndRoot.childType || [];
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    form.value.tags?.push({
      name: inputValue.value,
    });
  }
};

const querySearchAsync = async (val: string, cb: (arg: any) => void) => {
  const res = await getTagByNameVague(val);
  cb(res.getTagByVagueName);
};

const handleCloseTag = (tag: Type) => {
  const index = form.value.tags?.findIndex((v) => v == tag);
  index != -1 && form.value.tags?.splice(index as number, 1);
};

getType();

onUnmounted(() => {
  unOffsetAndLimit();
});

onActivated(() => {
  getData()
})
</script>

<script lang="ts">
export default {
  name: "photo",
};
</script>

<style scoped lang="scss">
.el-table :deep(.cell) {
  text-align: center;
}

.edit-form-warpper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
