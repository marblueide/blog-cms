<template>
  <div>
    <Table
      v-bind="queryParams"
      v-model:current-page="queryParams.currentPage"
      v-model:page-size="queryParams.pageSize"
      @add-click="dialogChange(true, '标签添加', 'add')"
      @refresh-click="getData"
    >
      <el-table :data="tableData" border stripe ref="table">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="50" />
        <el-table-column prop="id" label="id" show-overflow-tooltip />
        <el-table-column prop="name" label="名称" />
        <!-- <el-table-column prop="nameEn" label="英文名称" /> -->
        <el-table-column prop="type" label="类别">
          <template #default="{ row }">
            <el-tag :type="getTagColor(row.type)">{{
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
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ $index, row }">
            <el-button
              type="primary"
              size="small"
              :icon="Edit"
              @click="dialogChange(true, '标签编辑', 'editor', row)"
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
      @close="dialogChange(false, '', '')"
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
        <el-form-item label="类别">
          <el-select v-model="form.type" placeholder="请选择类别" size="large">
            <el-option
              v-for="item in TagTypeList"
              :key="item.value"
              :label="item.key"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="权重">
          <el-input-number v-model="form.weight" :min="0" />
        </el-form-item>
      </el-form>
      <div class="text-center w-full">
        <el-button
          v-if="formType == 'editor'"
          class="mx-20"
          type="primary"
          @click="update"
          >提交</el-button
        >
        <el-button v-else class="mx-20" type="primary" @click="create"
          >创建</el-button
        >
        <el-button class="mx-20" @click="dialogChange(false, '', '')"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { createTag, deleteTag, getTagList, updateTag } from "@/api";
import { computed, reactive, ref } from "vue";
import Table from "@/components/table/index.vue";
import { FromType, Tag, TagType, TagTypeColor, TagTypeList } from "@/types";
import dayjs from "dayjs";
import { Delete, Edit } from "@element-plus/icons-vue";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import _ from "lodash";

const tableData = ref<Tag[]>([]);
const table = ref();

const queryParams = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  editDisabled: true,
  deleteDisabled: true,
  type: null,
});

const getData = async () => {
  let loadingInstance;
  try {
    loadingInstance = ElLoading.service({
      target: table.value.$el,
    });
  } catch (error) {}
  const offset = queryParams.pageSize * (queryParams.currentPage - 1);
  let { nodes, totalCount } = await getTagList(
    queryParams.pageSize,
    offset,
    queryParams.type
  );
  queryParams.total = totalCount;
  tableData.value = nodes;
  loadingInstance?.close();
};
getData();

const getTagColor = computed(() => {
  return (type: TagType) => {
    //@ts-ignore
    return TagTypeColor[TagType[type]];
  };
});

const dialogTableVisible = ref(false);
const dialogTitle = ref("");
const formType = ref<FromType>();
const form = ref<Tag>({});

const reset = () => {
  form.value = {};
};

const dialogChange = (
  state: boolean,
  title: string,
  type: FromType,
  tag?: Tag
) => {
  dialogTableVisible.value = state;
  dialogTitle.value = title;
  formType.value = type;
  tag && (form.value = tag);
  if (dialogTableVisible.value === false) reset();
};

const deleted = async (tag: Tag) => {
  try {
    await ElMessageBox.confirm("确定删除此标签？", "Tip", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      center: true,
    });
    if (!tag.id) return;
    const res = await deleteTag(tag.id);
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
  try {
    let data = _.omit(form.value, ['__typename', 'createTime']);
    const res = await updateTag(data);
    if (res?.code === 200) {
      ElMessage({
        message: res.msg,
        type: "success",
      });
      dialogChange(false, "", "");
    }
  } catch (error) {}
};

const create = async () => {
  try {
    const { name, nameEn, type, weight } = form.value;
    if (!name || !type) {
      ElMessage({
        message: "名称或类型为空",
        type: "info",
      });
      return;
    }
    let res = await createTag({
      name,
      nameEn,
      type,
      weight,
    });
    if (res?.code === 200) {
      ElMessage({
        message: res.msg,
        type: "success",
      });
      dialogChange(false, "", "");
      getData();
    }
  } catch (error) {}
};
</script>

<style lang="scss" scoped>
.el-table :deep(.cell) {
  text-align: center;
}
</style>
