<template>
  <div class="table-header-box">
    <Transition name="el-zoom-in-bottom" mode="out-in">
      <div class="table-com-search" v-show="commonVisable">
        <div style="padding: 0 15px;">
          <slot name="commonSearch"></slot>
        </div>
      </div>
    </Transition>
    
    <div class="table-header">
      <div>
        <el-tooltip content="刷新" placement="top">
          <el-button color="#40485b" type="info" @click="emit('refreshClick')">
            <Icon name="el-icon-Refresh" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="添加" placement="top">
          <el-button type="primary" @click="emit('addClick')">
            <Icon name="el-icon-Plus" size="17px" />
            <span>添加</span>
          </el-button>
        </el-tooltip>
        <el-tooltip content="编辑" placement="top">
          <el-button
            :disabled="props.editDisabled"
            type="primary"
            @click="emit('editClick')"
          >
            <Icon name="el-icon-Edit" />
            <span>编辑</span>
          </el-button>
        </el-tooltip>
        <el-tooltip content="删除" placement="top">
          <el-button
            :disabled="props.deleteDisabled"
            type="danger"
            @click="emit('editClick')"
          >
            <Icon name="el-icon-DeleteFilled" />
            <span>删除</span>
          </el-button>
        </el-tooltip>
      </div>
      <div class="table-header-right">
        <el-input
          :modelValue="searchValue"
          @input="handlerChange"
          :placeholder="props.searchPlaceholder"
        />
        <div class="table-search-button-group">
          <el-dropdown>
            <el-button plain :icon="Grid" />
            <template #dropdown>
              <el-dropdown-menu v-for="it in dropdownData">
                <el-checkbox :label="it[dropdownValue]">
                  {{ it[dropdownLable] }}
                </el-checkbox>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-tooltip content="展开通用搜索" placement="top">
            <el-button
              plain
              :icon="Search"
              @click="commonVisable = !commonVisable"
            />
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, withDefaults } from "vue";
import Icon from "@/components/icon/index.vue";
import { Search, Grid } from "@element-plus/icons-vue";
import _ from "lodash";

const props = withDefaults(
  defineProps<{
    editDisabled: boolean;
    deleteDisabled: boolean;
    searchValue?: string;
    searchPlaceholder?: string;
    dropdownLable?: string;
    dropdownValue?: string;
    dropdownData?: any[];
  }>(),
  {
    searchValue: "",
    searchPlaceholder: "请输入内容",
    dropdownLable: "label",
    dropdownValue: "value",
  }
);

const emit = defineEmits<{
  (e: "refreshClick"): void;
  (e: "addClick"): void;
  (e: "editClick"): void;
  (e: "deleteClick"): void;
  (e: "update:searchValue", event: any): void;
  (e: "searchChange", value: string): void;
}>();

const commonVisable = ref(false);

const handlerChange = (e: string) => {
  emit("update:searchValue", e);
  searchChange(e);
};

const searchChange = _.debounce((e) => {
  emit("searchChange", e);
}, 1000);
</script>

<style scoped lang="scss">
.table-header {
  display: flex;
  justify-content: space-between;
  padding: 15px 15px;
  background-color: white;
  span {
    color: #fff;
  }
  .icon {
    color: #fff !important;
  }
  .table-header-right {
    display: flex;
    :deep(.el-input) {
      width: auto;
    }
    .table-search-button-group {
      display: inline-flex;
      margin-left: 16px;
      border: 1px solid var(--el-border-color);
      border-radius: var(--el-border-radius-base);
      overflow: hidden;
    }
    button {
      border-radius: 0;
      border-color: #fff;
    }
    button:hover {
      background-color: #dcdfe6;
      color: inherit;
      border-color: #dcdfe6;
    }
  }
}
.table-com-search{
  background-color: white;
  padding: 15px 0 0;
}
</style>
