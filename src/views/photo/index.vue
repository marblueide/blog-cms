<template>
  <Table
    v-bind="queryParams"
    v-model:current-page="queryParams.currentPage"
    v-model:page-size="queryParams.pageSize"
  >
    <el-table ref="table" :data="tableData" stripe style="width: 100%">
      <el-table-column type="selection" width="50" />
      <el-table-column type="index" width="50" />
      <el-table-column prop="id" label="id" show-overflow-tooltip width="100" />
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
          <el-tag v-for="it in row.tags"> {{ it.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200">
        <template #default="{ row }">
          {{ dayjs(+row.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ $index, row }">
          <el-button type="primary" size="small" :icon="Edit"></el-button>
          <el-button size="small" type="danger" :icon="Delete"> </el-button>
        </template>
      </el-table-column>
    </el-table>
  </Table>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { getPhotoWallList } from "@/api/photoWall";
import Table from "@/components/table/index.vue";
import { ElLoading } from "element-plus";
import dayjs from "dayjs";
import { Delete, Edit } from "@element-plus/icons-vue";
import { PhotoWall } from "@/types";

const IMG_BASE_URL = import.meta.env.VITE_BASE_IMG_ADDRESS;

const queryParams = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  editDisabled: true,
  deleteDisabled: true,
});

const tableData = ref<PhotoWall[]>();
const table = ref();

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
  console.log(tableData.value);
};
getData();
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
</style>
