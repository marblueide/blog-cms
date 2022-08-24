<template>
  <div class="comment">
    <Table
      v-bind="prop"
      v-model:searchValue="searchValue"
      v-model:pageSize="prop.pageSize"
      v-model:currentPage="prop.currentPage"
      @refreshClick="refreshClick"
    >
      <el-table
        border
        :data="tableData"
        row-key="id"
        :indent="20"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          prop="id"
          label="ID"
          show-overflow-tooltip
        />
        <el-table-column align="center" prop="name" label="名称" />
        <el-table-column align="center" prop="content" label="内容" />
        <el-table-column align="center" prop="email" label="邮箱" />
        <el-table-column align="center" label="是否隐藏">
          <template #default="{ row, column, $index }">
            <el-switch
              v-model="row.visible"
              class="ml-2"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
              @change="(val:boolean) => {visibleChange(row.id,val)}"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          sortable
        >
          <template #default="{ row, column, $index }">
            {{ dayjs(+row.createTime).format("YYYY-MM-DD HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="article" label="文章标题">
          <template #default="{ row, column, $index }">
            {{ row.article?.title }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型">
          <template #default="{ row, column, $index }">
            {{ typeToString(row) }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作">
          <template #default="{ row, column, $index }">
            <el-tooltip content="删除" placement="top">
              <el-button
                type="danger"
                @click="deleteCommentHandle(row.id)"
                size="small"
                :icon="Delete"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { getCommnet, switchCommentVisible, deleteComment } from "@/api";
import Table from "@/components/table/index.vue";
import {
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { CommentTypeEnum, Comment } from "@/types/index";
import {Delete} from "@element-plus/icons-vue"

const route = useRoute();
const router = useRouter();
const prop = reactive({
  currentPage: +route.query.page! || 1,
  pageSize: +route.query.limit! || 10,
  total: 100,
  editDisabled: true,
  deleteDisabled: true,
});
const searchValue = ref("");
const tableData = ref<Comment[]>([]);

const getData = async () => {
  const {currentPage,pageSize} = prop
  let res = await getCommnet(pageSize * (currentPage - 1), prop.pageSize);
  tableData.value = res.getCommentByRoot.nodes as Comment[];
  prop.total = res.getCommentByRoot.totalCount;
};

const visibleChange = async (id: string, val: boolean) => {
  try {
    const res = await switchCommentVisible(id, val);
    ElMessage({
      type: "success",
      message: res?.updateComment.msg,
    });
  } catch (error: string) {}
};

const typeToString = (comment: Comment) => {
  if (comment.type == CommentTypeEnum.article) {
    return "文章评论" + (comment.parentComment ? "[回复]" : "");
  } else if (comment.type == CommentTypeEnum.commnet) {
    return "留言板" + (comment.parentComment ? "[回复]" : "");
  }
};

let unOffsetAndLimit = watch(
  () => [prop.currentPage, prop.pageSize],
  ([page, size],old) => {
    if(old && old[1] != size){
      prop.currentPage = 1
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

const refreshClick = () => {
  getData();
};

const deleteCommentHandle = async (id: string) => {
  try {
    const res = await deleteComment(id);
    ElMessage({
      type: "success",
      message: res?.deleteComment.msg,
    });
  }finally {
    getData();
  }
};

onUnmounted(() => {
  unOffsetAndLimit();
});
</script>

<script lang="ts">
export default {
  name: "comment",
};
</script>

<style scoped lang="scss">
</style>
