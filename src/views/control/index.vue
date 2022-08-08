<template>
  <Table
    v-bind="prop"
    v-model:searchValue="searchValue"
    @searchChange="searchChange"
  >
    <template #commonSearch>
      sdfsdffd
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from "@/components/table/index.vue";
import { reactive, ref, toRefs } from "vue";

const prop = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 100,
  editDisabled: true,
  deleteDisabled: true,
});

const searchValue = ref("123");

const searchChange = () => {
  console.log('searchChange')
}
</script>

<style scoped lang="scss"></style>
