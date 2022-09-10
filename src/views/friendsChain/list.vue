<template>
  <div class="friendsChain">
    <Table>
      <el-table
        border
        :data="tableData"
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
        <el-table-column align="center" label="类型" >
          <template #default="{ row }">
            <el-tag>{{row.type.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="图片" >
          <template #default="{ row }">
            <el-image
              style="width: 150px; height: 100px"
              :src="IMG_BASE_URL + row.imgSrc"
              :preview-src-list="[IMG_BASE_URL + row.imgSrc]"
              fit="cover"
              loading="lazy"
              lazy
              preview-teleported
              hide-on-click-modal
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="link" label="链接" />
        <el-table-column align="center" label="操作" width="150" fixed="right">
          <template #default="{ $index, row }">
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
  </div>
</template>

<script setup lang="ts">
import { deleteFriendsChain, getFriendsChainList } from "@/api";
import Table from "@/components/table/index.vue";
import { FriendsChain } from "@/types";
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
const IMG_BASE_URL = import.meta.env.VITE_BASE_IMG_ADDRESS;

const prop = reactive({
  currentPage: +route.query.page! || 1,
  pageSize: +route.query.limit! || 10,
  total: 100,
  editDisabled: true,
  deleteDisabled: true,
});
const tableData = ref<FriendsChain[]>([]);

const getData = async () => {
  const {
    getFriendsChainList: { nodes, totalCount },
  } = await getFriendsChainList(prop.pageSize, prop.currentPage);
  tableData.value = nodes;
  prop.total = totalCount;
};

let unOffsetAndLimit = watch(
  () => [prop.currentPage, prop.pageSize],
  ([page, size], old) => {
    if (old && old[1] != size) {
      prop.currentPage = 1;
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

let handleSingleDelete = async (id:string) => {
  try {
    const res = await deleteFriendsChain(id)
    ElMessage({
      type:"success",
      message:res?.deleteFriendsChain.msg
    })
  } finally{
    getData()
  }
}

onUnmounted(() => {
  unOffsetAndLimit();
});
</script>

<style scoped lang="scss"></style>
