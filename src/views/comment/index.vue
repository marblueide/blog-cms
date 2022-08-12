<template>
  <div class="comment">
    <Table
      v-bind="prop"
      v-model:searchValue="searchValue"
      @searchChange="searchChange"
      @currentChange="currentChange"
    >
      <el-table
        :data="tableData"
        row-key="id"
        :indent="20"
      >
        <el-table-column prop="id" label="ID" show-overflow-tooltip />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column label="是否隐藏">
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
        <el-table-column prop="createTime" label="创建时间">
          <template #default="{ row, column, $index }">
            {{ dayjs(+row.createTime).format("YYYY-MM-DD HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column prop="article" label="文章">
          <template #default="{ row, column, $index }">
            {{ row.article?.title }}
          </template>
        </el-table-column>
      </el-table>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { getCommnet, switchCommentVisible } from "@/api";
import Table from "@/components/table/index.vue";
import { reactive, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";

const route = useRoute();
const router = useRouter();
const prop = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 100,
  editDisabled: true,
  deleteDisabled: true,
});
const searchValue = ref("");
const tableData = ref<Comment[]>([]);

const currentChange = (offset: number) => {
  router.replace({
    query: {
      limit: prop.pageSize,
      offset,
    },
  });
};

const getData = async () => {
  let res = await getCommnet(prop.currentPage, prop.pageSize);
  console.log(res);
  tableData.value = res.getCommentByRoot.nodes;
  prop.total = res.getCommentByRoot.totalCount;
};

const visibleChange = async (id:string,val:boolean) => {
  const res = await switchCommentVisible(id,val)
  console.log(res)
}

getData();

watchEffect(() => {
  route.query.limit && (prop.pageSize = +route.query.limit as number);
  route.query.offset && (prop.currentPage = +route.query.offset as number);
});

const searchChange = () => {
  console.log("searchChange");
};
</script>

<script lang="ts">
export default {
  name: "comment",
};
</script>

<style scoped lang="scss"></style>
