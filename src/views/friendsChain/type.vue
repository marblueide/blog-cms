<template>
  <div class="friendsChainType">
    <Table
      v-bind="prop"
      v-model:pageSize="prop.pageSize"
      v-model:currentPage="prop.currentPage"
      @refresh-click="refreshClick"
      @add-click="dialogChange(true, 'add', {})"
    >
      <el-table border :data="tableDate" :indent="20" style="width: 100%">
        <el-table-column align="center" prop="id" label="id"></el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="名称"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="150" fixed="right">
          <template #default="{ $index, row }">
            <el-button
              type="primary"
              size="small"
              :icon="Edit"
              @click="dialogChange(true, 'edit', row)"
            ></el-button>
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

    <el-dialog
      v-model="dialogStatus.visible"
      :title="dialogStatus.title"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="id" v-if="dialogStatus.type === 'edit'">
          <el-input class="w-96" v-model="form.id" disabled></el-input>        
        </el-form-item>
        <el-form-item label="名称">
           <el-input class="w-96" v-model="form.name"></el-input>      
        </el-form-item>
      </el-form>
      <div class="text-center w-full">
         
        <el-button class="mx-20" type="primary" @click="handleConfirm"
          >确定</el-button
        >
           
        <el-button class="mx-20" @click="dialogChange(false)">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Table from "@/components/table/index.vue";
import { FriendsChainType } from "@/types";
import { onUnmounted, reactive, ref, watch } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import { useRoute, useRouter } from "vue-router";
import {
  createChainType,
  deletChainType,
  getChainTypeList,
  updateChainType,
} from "@/api";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
const prop = reactive({
  editDisabled: true,
  deleteDisabled: true,
  total: 100,
  currentPage: +route.query.page! || 1,
  pageSize: +route.query.limit! || 10,
});

const tableDate = ref<FriendsChainType[]>([]);
const dialogStatus = reactive<{
  visible: boolean;
  type: "edit" | "add";
  title: "类型添加" | "类型编辑";
}>({
  visible: false,
  type: "add",
  title: "类型添加",
});

const dialogChange = (
  b: boolean,
  type: "edit" | "add" = "add",
  row: FriendsChainType = {}
) => {
  dialogStatus.visible = b;
  dialogStatus.type = type;
  dialogStatus.title = type == "edit" ? "类型编辑" : "类型添加";
  form.value = row;
};

const getData = async () => {
  let res = await getChainTypeList(prop.pageSize, prop.currentPage);
  tableDate.value = res.getChainTypeList.nodes;
  prop.total = res.getChainTypeList.totalCount
};

const refreshClick = () => {
  getData();
};

const form = ref<FriendsChainType>({});

const handleSingleDelete = async (id: string) => {
  try {
    const res = await deletChainType(id);
    ElMessage({
      type: "success",
      message: res?.deleteChainType.msg,
    });
  } finally {
    getData();
  }
};

const handleConfirm = async () => {
  let msg;
  try {
    if (dialogStatus.type == "edit") {
      msg = (await updateChainType(form.value.id as string, form.value.name))
        ?.updateChainType.msg;
    } else {
      msg = (await createChainType(form.value.name))?.createChainType.msg;
    }
    ElMessage({
      type: "success",
      message: msg,
    });
    dialogChange(false)
  } finally {
    getData();
  }
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

onUnmounted(() => {
  unOffsetAndLimit();
});
</script>

<style lang="scss" scoped></style>
