<template>
  <div class="table-box">
    <TableHeader
      v-bind="props"
      @add-click="emit('addClick')"
      @refresh-click="emit('refreshClick')"
      @edit-click="emit('editClick')"
      @delete-click="emit('deleteClick')"
      @update:search-value="emit('update:searchValue', $event)"
      @search-change="emit('searchChange', $event)"
    >
      <template #commonSearch>
        <slot name="commonSearch"></slot>
      </template>
    </TableHeader>

    <div class="content">
      <slot></slot>
    </div>
    <Pagination
      v-bind="props"
      @size-change="emit('sizeChange', $event)"
      @current-change="emit('currentChange', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { useAttrs, defineEmits, defineProps } from "vue";
import TableHeader from "./header/index.vue";
import Pagination from "./pagination/index.vue";
import { TableHeaderPropType } from "./types";

const props = defineProps<{
  editDisabled: boolean;
  deleteDisabled: boolean;
  pageSize: number;
  total: number;
  currentPage?: number;
  searchValue?: string;
  searchPlaceholder?: string;
  dropdownLable?: string;
  dropdownValue?: string;
  dropdownData?: any[];
  background?: boolean;
}>();

const emit = defineEmits<{
  (e: "refreshClick"): void;
  (e: "addClick"): void;
  (e: "editClick"): void;
  (e: "deleteClick"): void;
  (e: "update:searchValue", event: any): void;
  (e: "searchChange", value: string): void;
  (e: "sizeChange", sizePage: number): void;
  (e: "currentChange", currentSize: number): void;
}>();

</script>

<style scoped lang="scss">
  .content{
    padding: 0 15px;
    background-color: white;
  }
</style>
