<template>
  <div>
    <Table
      @refresh-click="getList"
      v-bind="queryParams"
      v-model:current-page="queryParams.currentPage"
      v-model:page-size="queryParams.pageSize"
      :total="tableData?.totalCount || 0"
      @add-click="router.push({ name: 'addArticle' })"
    >
      <el-table
        ref="table"
        :data="tableData?.nodes"
        border
        stripe
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
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
        <el-table-column prop="pic" label="封面图" width="150">
          <template #default="{ row }">
            <div v-if="row.pic">
              <el-image
                style="width: 100px"
                :src="img_address + row.pic"
                fit="cover"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="summary" label="前言" width="150">
          <template #default="{ row }">
            <span class="ellipsis-3">{{ row.summary }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="content" label="内容" width="150">
          <template #default="{ row }">
            <span class="ellipsis-3">{{ row.content }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="tags" label="标签" min-width="160">
          <template #default="{ row }">
            <el-tag
              class="ml-2 mb-7"
              v-for="it in row.tags"
              :key="it.id"
              type="success"
              >{{ it.name }}</el-tag
            >
          </template>
        </el-table-column>
        <!-- <el-table-column prop="contentNum" label="字数" /> -->
        <el-table-column prop="likes" label="点赞数" />
        <el-table-column prop="viewNum" label="观看数" />
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
          <template #default="{ row }">
            <el-switch
              :model-value="row.isPublic"
              @change="switchChange($event, row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175" fixed="right">
          <template #default="{ $index, row }">
            <el-button
              type="primary"
              size="small"
              :icon="Edit"
              @click="editClick($index, row)"
            ></el-button>
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              @click="deleted(row)"
            >
            </el-button>
            <el-dropdown trigger="click">
              <el-button
                class="ml-12"
                size="small"
                type="info"
                plain
                :icon="MoreFilled"
              >
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="dropClick(row, true)" v-if="row.weight !== 10">
                    <el-icon
                      ><Download style="transform: rotate(180deg)"
                    /></el-icon>
                    置顶
                  </el-dropdown-item>
                  <el-dropdown-item @click="dropClick(row, false)" v-else>
                    <el-icon><Close /></el-icon>
                    取消置顶
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
import {
  deleteArticle,
  getArticleList,
  updateArticle,
  getArticleSticky,
} from "@/api";
import Table from "@/components/table/index.vue";
import { Pagination, Article, weightMax } from "@/types";
import { ref, reactive, watch } from "vue";
import _ from "lodash";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import dayjs from "dayjs";
import {
  Delete,
  Edit,
  MoreFilled,
  Download,
  Close,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const table = ref();
const router = useRouter();
const img_address = import.meta.env.VITE_BASE_IMG_ADDRESS;

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

watch(queryParams, () => {
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
  const { nodes, totalCount } = await getArticleSticky(
    queryParams.pageSize,
    offset
  );
  tableData.value = {
    nodes,
    totalCount,
  };
  loadingInstance?.close();
};
getList();

const tableRowClassName = ({ row }: { row: Article; rowIndex: number }) => {
  if (row.weight === weightMax) {
    return "sticky";
  }
  return "";
};

const switchChange = async (e: boolean, { id }: Article) => {
  if (!id) return;
  let res = await updateArticle({ id, isPublic: e });
  if (res?.code == 200) {
    ElMessage({
      message: res.msg,
      type: "success",
    });
    getList();
  }
};

const editClick = (index: number, article: Article) => {
  const { id } = article;
  router.push({
    name: "editorArticle",
    query: {
      id,
    },
  });
};

const deleted = async (article: Article) => {
  const { id } = article;
  if (!id) {
    ElMessage({
      message: "文章不存在",
      type: "error",
    });
    return;
  }
  try {
    await ElMessageBox.confirm("确定删除此标签？", "Tip", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      center: true,
    });
    let res = await deleteArticle(id);
    if (res?.code === 200) {
      ElMessage({
        message: res.msg,
        type: "success",
      });
      getList();
    }
  } catch (error) {}
};

const dropClick = async ({ id }: Article, isSticky: boolean) => {
  if (!id) return;
  let res = await updateArticle({ id, weight: isSticky ? weightMax : 0 });
  if (res?.code == 200) {
    ElMessage({
      message: res.msg,
      type: "success",
    });
    getList();
  }
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

.el-table :deep(.sticky .el-table__cell) {
  background-color: var(--el-color-success-light-9) !important;
}
</style>
