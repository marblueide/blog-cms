<template>
  <div>
    <Table
      v-bind="queryParams"
      @add-click="router.push({ name: 'multimediaAdd' })"
      @refresh-click="getList"
    >
      <el-table :data="tableData" border stripe ref="table">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="50" />
        <el-table-column prop="id" label="id" show-overflow-tooltip />
        <el-table-column prop="title" label="名称" />
        <el-table-column prop="author" label="作者" />
        <el-table-column prop="cover" label="封面图">
          <template #default="{ row }">
            <el-image
              style="width: 100px; height: 100px;"
              :src="IMG_ADDRESS + row.cover"
              :preview-src-list="[IMG_ADDRESS + row.cover]"
              hide-on-click-modal
              fit="cover"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column prop="outerLink" label="外链" />
        <el-table-column prop="format" label="格式">
          <template #default="{ row }">
            <el-tag type="success">
              {{ row.format }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="标签" min-width="160">
          <template #default="{ row }">
            <el-tag
              v-for="it in row.tags"
              :key="it.id"
              class="ml-2 mb-7 pointer"
              type="success"
            >
              {{ it.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
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
              @click="handlerEdit(row)"
            ></el-button>
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              @click="handerDelete(row.id)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import { FromType, Multimedia } from "@/types";
import { onActivated, reactive, ref } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import Table from "@/components/table/index.vue";
import { useRouter } from "vue-router";
import { deleteMultimedia, getMultimediaList } from "@/api/multimedia";
import { ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();

const IMG_ADDRESS = import.meta.env.VITE_BASE_IMG_ADDRESS;
const tableData = ref<Multimedia[]>([]);
const table = ref();
const queryParams = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  editDisabled: true,
  deleteDisabled: true,
  type: null,
});

const getList = async () => {
  const { pageSize: limit, currentPage } = queryParams;
  let { nodes, totalCount } = await getMultimediaList(
    limit,
    limit * (currentPage - 1)
  );
  tableData.value = nodes;
  queryParams.total = totalCount;
};

onActivated(() => {
  getList()
})

const handlerEdit = (item: Multimedia) => {
  router.push({
    name: "multimediaEdit",
    query: {
      id: item.id,
    },
  });
};
const handerDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm("确定删除？", "Tip", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      center: true,
    });
    const res = await deleteMultimedia(id);
    if (res?.code == 200) {
      ElMessage({
        message: res.msg,
        type: "success",
      });
      getList();
    }
  } catch (error) {}
};
</script>

<script lang="ts">
export default {
  name: "multimediaList",
};
</script>

<style lang="scss" scoped></style>
