<template>
  <Table @refresh-click="getData" v-bind="queryParams">
    <el-table :data="tableData" border stripe>
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="50" />
      <el-table-column prop="id" label="id" show-overflow-tooltip />
      <el-table-column prop="name" label="名称" />
      <!-- <el-table-column prop="nameEn" label="英文名称" /> -->
      <el-table-column prop="type" label="类别">
        <template #default="{ row }">
          <el-tag :type="TagTypeColor[TagType[row.type]]">{{
            TagType[row.type]
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="权重" />
      <el-table-column prop="createTime" label="创建时间">
        <template #default="{ row }">
          {{ dayjs(+row.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
    </el-table>
  </Table>
</template>

<script lang="ts" setup>
import { getTagList } from "@/api";
import { reactive, ref } from "vue";
import Table from "@/components/table/index.vue";
import { Tag, TagType, TagTypeColor } from "@/types";
import dayjs from "dayjs";

const tableData = ref<Tag[]>([]);
const queryParams = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  editDisabled: true,
  deleteDisabled: true,
  type: null,
});

const getData = async () => {
  const offset = queryParams.pageSize * (queryParams.currentPage - 1);
  let { nodes, totalCount } = await getTagList(
    queryParams.pageSize,
    offset,
    queryParams.type
  );
  queryParams.total = totalCount;
  tableData.value = nodes;
  console.log(tableData.value);
};
getData();
</script>

<style lang="scss" scoped>
.el-table :deep(.cell) {
  text-align: center;
}
</style>
