<template>
  <div>
    <Table
      @refresh-click="getList"
      v-bind="queryParams"
      v-model:current-page="queryParams.currentPage"
      v-model:page-size="queryParams.pageSize"
      :total="tableData?.totalCount || 0"
    >
      <el-table ref="table" :data="tableData?.nodes" border stripe style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="50" />
        <el-table-column
          prop="id"
          label="id"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          prop="title"
          label="标题"
          show-overflow-tooltip
          width="150"
        />
        <el-table-column prop="summary" label="前言" width="150">
          <template #default="scope">
            <span class="ellipsis-3">{{ scope.row.summary }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" width="150">
          <template #default="scope">
            <span class="ellipsis-3">{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contentNum" label="字数" />
        <el-table-column prop="likes" label="点赞数" />
        <el-table-column prop="viewNum" label="观看数" />
        <el-table-column prop="tags" label="标签" min-width="160">
          <template #default="scope">
            <el-tag
              class="ml-2"
              v-for="it in scope.row.tags"
              :key="it.id"
              type="success"
              >{{ it.name }}</el-tag
            >
          </template>
        </el-table-column>
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
        <el-table-column prop="isPublic" label="是否公开" width="100">
          <template #default="scope">
            <el-switch v-model="scope.row.isPublic" @change="switchChange" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ $index, row }">
            <el-button
              type="primary"
              size="small"
              :icon="Edit"
              @click="editClick($index, row)"
            ></el-button>
            <el-button size="small" type="danger" :icon="Delete"> </el-button>
          </template>
        </el-table-column>
      </el-table>
    </Table>
  </div>
</template>

<script lang="ts">
export default {
  name: "listArticle",
};
</script>

<script setup lang="ts">
import { getArticleList } from "@/api";
import Table from "@/components/table/index.vue";
import { Pagination, Article } from "@/types";
import { ref, reactive, watch } from "vue";
import _ from "lodash";
import { ElLoading } from "element-plus";
import dayjs from "dayjs";
import { Delete, Edit } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const table = ref();
const router = useRouter();

const tableData = ref<Pagination<Article>>({
  nodes: [],
  totalCount: 0,
});

const queryParams = reactive({
  pageSize: 10,
  currentPage: 1,
  editDisabled: true,
  deleteDisabled: true,
});

watch(queryParams, (newVal) => {
  if (newVal.pageSize * (newVal.currentPage - 1) > tableData.value?.totalCount)
    getList();
});

const getList = async () => {
  let loadingInstance;
  try {
    loadingInstance = ElLoading.service({
      target: table.value.$el,
    });
  } catch (error) {}
  const offset = queryParams.pageSize * (queryParams.currentPage - 1);
  const { nodes, totalCount } = await getArticleList(queryParams.pageSize, offset);
  tableData.value = {
    nodes,
    totalCount,
  };
  loadingInstance?.close();
  console.log(tableData.value);
};

getList();

const switchChange = (e: boolean) => {
  console.log(e);
};

const editClick = (index: number, article: Article) => {
  console.log(index, article);
  const { id } = article;
  router.push({
    name: "editorArticle",
    query: {
      id,
    },
  });
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

.el-table :deep(.cell) {
  text-align: center;
}
</style>