<template>
  <div>
    <Table
      v-bind="queryParams"
      v-model:current-page="queryParams.currentPage"
      v-model:page-size="queryParams.pageSize"
      @refresh-click="getData"
      @add-click="dialogChange('标签添加', 'add', true)"
    >
      <el-table :data="tableData" border stripe ref="table">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="nameEn" label="英文名称" />
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
              @click="dialogChange('分组编辑', 'editor', true, row)"
            ></el-button>
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              @click="deleted(row)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </Table>
    <el-dialog
      v-model="dialogTableVisible"
      :title="dialogTitle"
      width="450px"
      @close="dialogTableVisible = false"
      @closed="dialogChange('', '')"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="id" v-if="formType === 'editor'">
          <el-input class="w-96" v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input class="w-96" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="名称英文">
          <el-input class="w-96" v-model="form.nameEn"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-center w-full">
        <el-button
          v-if="formType == 'editor'"
          class="mx-20"
          type="primary"
          @click="update"
        >
          提交
        </el-button>
        <el-button v-else class="mx-20" type="primary" @click="create"
          >创建</el-button
        >
        <el-button class="mx-20" @click="dialogTableVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import Table from "@/components/table/index.vue";
import { FromType, Group, GroupUpdateInput } from "@/types";
import { nextTick, reactive, ref } from "vue";
import dayjs from "dayjs";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { createGroup, deteleGroup, getGroupList, updateGroup } from "@/api";
import { Delete, Edit } from "@element-plus/icons-vue";
import _ from "lodash";

const tableData = ref<Group[]>();
const table = ref();

const queryParams = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  editDisabled: true,
  deleteDisabled: true,
});

const getData = async () => {
  let loadingInstance;
  try {
    loadingInstance = ElLoading.service({
      target: table.value.$el,
    });
  } catch (error) {}
  const { pageSize, currentPage } = queryParams;
  const offset = pageSize * (currentPage - 1);
  let { nodes, totalCount } = await getGroupList(pageSize, offset);
  queryParams.total = totalCount;
  tableData.value = nodes;
  console.log(tableData.value);
  loadingInstance?.close();
};
getData();

const dialogTableVisible = ref(false);
const dialogTitle = ref("");
const formType = ref<FromType>();
const form = ref<Group>({});

const reset = () => {
  form.value = {};
};

const dialogChange = async (
  title: string,
  type: FromType,
  state?: boolean,
  group?: Group
) => {
  state && (dialogTableVisible.value = state);
  dialogTitle.value = title;
  formType.value = type;
  group && (form.value = group);
  if (dialogTableVisible.value === false) reset();
};

const deleted = async (group: Group) => {
  try {
    await ElMessageBox.confirm("确定删除此标签？", "Tip", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      center: true,
    });
    const res = await deteleGroup(group.id as number);
    if (res?.code === 200) {
      ElMessage({
        message: res.msg,
        type: "success",
      });
      getData();
    }
  } catch (error) {}
};

const update = async () => {
  const data = _.pick(form.value, ["id", "name", "nameEn"]);
  const res = await updateGroup(data as GroupUpdateInput);
  if (res?.code === 200) {
    ElMessage({
      message: res.msg,
      type: "success",
    });
    dialogTableVisible.value = false;
    getData();
  }
};

const create = async () => {
  const { name, nameEn } = form.value;
  if (!name) {
    ElMessage({
      message: "名称为空",
      type: "info",
    });
    return;
  }
  let res = await createGroup({
    name,
    nameEn,
  });
  if (res?.code === 200) {
    ElMessage({
      message: res.msg,
      type: "success",
    });
    dialogTableVisible.value = false
    getData()
  }
};
</script>

<style lang="scss" scoped>
.el-table :deep(.cell) {
  text-align: center;
}
</style>
