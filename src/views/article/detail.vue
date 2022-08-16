<template>
  <div>
    <Table
      @refresh-click="getList"
      :edit-disabled="false"
      :delete-disabled="false"
      v-model:current-page="queryParams.pageSize"
      v-model:page-size="queryParams.limit"
      :total="tableData?.totalCount || 0"
    >
      <el-table :data="tableData?.nodes" border >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" show-overflow-tooltip />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="summary" label="前言">
          <template #default="scope">
            <span class="ellipsis-3">{{ scope.row.summary }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容">
          <template #default="scope">
            <span class="ellipsis-3">{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contentNum" label="字数" />
        <el-table-column prop="likes" sortable label="点赞数" />
        <el-table-column prop="viewNum" sortable label="观看数" />
        <el-table-column prop="tags" sortable label="标签" min-width="100">
          <template #default="scope">
            <el-tag class="ml-2" v-for="it in scope.row.tags" type="success" >{{it.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isPublic" sortable label="是否公开" >
          <template #default="scope">
            <el-switch v-model="scope.row.isPublic" @change="switchChange" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" sortable label="创建时间" />
        <el-table-column prop="updateTime" sortable label="更新时间" />
      </el-table>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { getArticleList } from "@/api";
import Table from "@/components/table/index.vue";
import { Pagination, Article } from "@/types";
import { ref, reactive, watch } from "vue";
import _ from "lodash";

const tableData = ref<Pagination<Article>>({
  nodes: [],
  totalCount: 0,
});
const loading = ref(true)
const queryParams = reactive({
  limit: 10,
  pageSize: 1,
});

watch(queryParams, (newVal) => {
  if (newVal.limit * (newVal.pageSize - 1) > tableData.value?.totalCount)
    getList();
});

const getList = async () => {
  loading.value = true
  const offset = queryParams.limit * (queryParams.pageSize - 1);
  const { nodes, totalCount } = await getArticleList(queryParams.limit, offset);
  tableData.value = {
    nodes,
    totalCount,
  };
  loading.value = false
  console.log(tableData.value)
};

getList();

const switchChange = (e: boolean) => {
  console.log(e);
};
</script>

<style scoped lang="scss">
.ellipsis-3 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
