<template>
  <div style="padding:15px; background-color: white;">
    <el-pagination
    v-model:currentPage="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 50, 100]"
    :background="background"
    layout="sizes, ->,,prev, pager, next, jumper"
    :total="total"
    @size-change="emit('currentChange', $event)"
    @current-change="emit('sizeChange', $event)"
  />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, toRefs } from "vue";
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
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
  }
});

// const { currentPage, pageSize, background, total } = toRefs(props);

const emit = defineEmits<{
  (e: "sizeChange", sizePage: number): void;
  (e: "currentChange", currentSize: number): void;
}>();
</script>

<style scoped lang="scss"></style>
