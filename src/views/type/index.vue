<template>
  <div class="comment">
    <Table
      v-bind="prop"
      v-model:searchValue="searchValue"
      v-model:pageSize="prop.pageSize"
      v-model:currentPage="prop.currentPage"
      @refreshClick="refreshClick"
      @add-click="dialogChange(true, 'add', '类型添加', {})"
    >
      <el-table
        border
        row-key="id"
        :indent="20"
        style="width: 100%"
        :data="tableData"
      >
        <el-table-column
          align="center"
          prop="id"
          label="ID"
          show-overflow-tooltip
        />
        <el-table-column align="center" prop="name" label="名称" />
        <el-table-column align="center" label="创建时间" sortable>
          <template #default="{ row }">
            {{ dayjs(+row.createTime).format("YYYY-MM-DD HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row, column, $index }">
            <el-tooltip content="添加" placement="top">
              <el-button
                type="primary"
                size="small"
                :disabled="row.children == null"
                :icon="Plus"
                @click="dialogChange(true, 'add', '类型添加', row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-button
                type="primary"
                size="small"
                :icon="Edit"
                @click="dialogChange(true, 'edit', '类型编辑', row)"
              ></el-button>
            </el-tooltip>

            <el-popconfirm
              title="你确定要删除吗?"
              @confirm="handleDeleteType(row.id)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </Table>
    <el-dialog
      v-model="dialogStatus.visible"
      :title="dialogStatus.title"
      width="450px"
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
import { createType, deleteType, getType, updateType } from "@/api";
import Table from "@/components/table/index.vue";
import { Type } from "@/types";
import { onUnmounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { Edit, Delete, Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();

const prop = reactive({
  editDisabled: true,
  deleteDisabled: true,
  total: 100,
  currentPage: +route.query.offset! || 1,
  pageSize: +route.query.limit! || 10,
});

const tableData = ref<Type[]>([]);
const searchValue = ref("");
const dialogStatus = reactive<{
  visible: boolean;
  type: "edit" | "add";
  title: "类型添加" | "类型编辑";
}>({
  visible: false,
  type: "add",
  title: "类型添加",
});
const form = ref<Type>({});

const dialogChange = (
  b: boolean,
  type: "edit" | "add" = "add",
  title: "类型添加" | "类型编辑" = "类型添加",
  row: Type = {}
) => {
  dialogStatus.visible = b;
  dialogStatus.type = type;
  dialogStatus.title = title;
  if (type == "add" && Object.keys(row).length > 0) {
    form.value.name = "";
    form.value.parentType = { id: row.id };
    form.value.rootType = row.rootType != null ? row.rootType : { id: row.id };
  } else if (type == "edit") {
    form.value = row;
  }
};

const handleDeleteType = async (id: string) => {
  try {
    const res = await deleteType(id);
    ElMessage({
      type: "success",
      message: res?.deleteType.msg,
    });
  } finally {
    getData();
  }
};

const handleConfirm = async () => {
  let msg;
  try {
    if (dialogStatus.type == "add") {
      msg = (await createType(form.value))?.createType.msg;
    } else if (dialogStatus.type == "edit") {
      msg = (
        await updateType({
          id: form.value.id,
          name: form.value.name,
        })
      )?.updateType.msg;
    }
    dialogStatus.visible = false;
    ElMessage({
      type: "success",
      message: msg,
    });
  } finally {
    getData();
  }
};

const getData = async () => {
  const res = await getType(prop.currentPage, prop.pageSize);
  tableData.value = res.getTypeByRoot.nodes;
  prop.total = res.getTypeByRoot.totalCount;
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
        offset: page,
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

onUnmounted(() => {
  unOffsetAndLimit();
});
</script>

<script lang="ts">
export default {
  name: "type",
};
</script>

<style scoped lang="scss"></style>
