<template>
  <Table
    v-bind="queryParams"
    v-model:current-page="queryParams.currentPage"
    v-model:page-size="queryParams.pageSize"
    @add-click="addClick"
    @refresh-click="getData"
  >
    <el-table :data="tableData" border stripe ref="table">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="id" label="id" show-overflow-tooltip />
      <el-table-column prop="title" label="标题" show-overflow-tooltip />
      <!-- <el-table-column prop="content" label="内容" show-overflow-tooltip /> -->
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="emotion" label="心情" />
      <el-table-column prop="illustration" label="封面图" />
      <el-table-column prop="weight" label="权重" />
      <el-table-column
        prop="createTime"
        sortable
        label="创建时间"
        min-width="200"
      >
        <template #default="{ row }">
          {{ dayjs(+row.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        sortable
        label="更新时间"
        min-width="200"
      >
        <template #default="{ row }">
          {{ dayjs(+row.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ $index, row }">
          <el-button
            type="primary"
            size="small"
            :icon="Edit"
            @click="editorClick(row)"
          ></el-button>
          <el-button
            size="small"
            type="danger"
            :icon="Delete"
            @click="deleted(row)"
          >
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </Table>
</template>

<script lang="ts" setup>
import Table from "@/components/table/index.vue";
import { LiveShared } from "@/types";
import { reactive, ref } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { ElLoading, ElMessage, ElMessageBox, Tag } from "element-plus";
import { deleteLiveShared, getLiveSharedList } from "@/api/live-shared";
import { useRouter } from "vue-router";

const router = useRouter();
const tableData = ref<LiveShared[]>([]);
const table = ref();

const queryParams = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
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
  let { nodes, totalCount } = await getLiveSharedList(pageSize, offset);
  queryParams.total = totalCount;
  tableData.value = nodes;
  console.log(tableData.value);
  loadingInstance?.close();
};

getData();

const editorClick = (liveShared: LiveShared) => {
  const { id } = liveShared;
  router.push({
    name: "liveSharedEditor",
    query: {
      id,
    },
  });
};

const deleted = async (liveShared: LiveShared) => {
  try {
    await ElMessageBox.confirm("确定删除此标签？", "Tip", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      center: true,
    });
    if (!liveShared.id) return;
    const res = await deleteLiveShared(liveShared.id);
    if (res?.code === 200) {
      ElMessage({
        message: res.msg,
        type: "success",
      });
      getData();
    }
  } catch (error) {}
};

const addClick = () => {
  // router.push()
}
</script>

<script lang="ts">
export default {
  name: "liveSharedList",
};
</script>

<style lang="scss" scoped>
.el-table :deep(.cell) {
  text-align: center;
}
</style>
