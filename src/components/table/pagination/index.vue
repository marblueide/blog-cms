<template>
  <div class="pagination">
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :background="background"
      layout="sizes, ->,,prev, pager, next, jumper"
      :total="total"
      @size-change="emit('update:pageSize', $event)"
      @current-change="emit('update:currentPage', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, toRefs } from "vue";
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  background: {
    type: Boolean,
    default: true,
  },
  total: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits<{
  (e: "update:pageSize", sizePage: any): void;
  (e: "update:currentPage", currentSize: any): void;
}>();
</script>

<style scoped lang="scss">
.pagination {
  padding: 0 15px 15px;
  background-color: white;
}
</style>
