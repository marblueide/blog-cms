<template>
  <div class="tag">
    <el-tag class="ml-5" closable @close="handleClose(tag)" v-for="tag in data">
      {{ tag.name }}
    </el-tag>
    <el-autocomplete
      v-if="visible"
      :modelValue="value"
      :fetch-suggestions="handleSearch"
      :trigger-on-focus="false"
      ref="InputRef"
      clearable
      size="small"
      class="inline-input ml-3 w-20"
      @input="emit('update:value', $event)"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <!-- <el-input
      v-if="visible"
      ref="InputRef"
      :modelValue="value"
      class="ml-3 w-20"
      size="small"
      @input="emit('update:value', $event)"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    /> -->
    <el-button v-else class="button-new-tag ml-1" size="small" @click="show">
      + New Tag
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { Tag } from "@/types";
import { withDefaults, defineProps, defineEmits, ref, nextTick } from "vue";
const props = withDefaults(
  defineProps<{
    value: string;
    data?: Tag[];
  }>(),
  {
    value: "",
  }
);

const visible = ref(false);
const InputRef = ref();

const show = async () => {
  visible.value = true;
  await nextTick();
  InputRef.value.focus();
};

const handleSearch = async (query:string,cb: (arg: any) => void) => {
  emit("querySearchAsync",query,cb)
}

const handleInputConfirm = (e: any) => {
  emit("handleInputConfirm");
  emit("update:value", "");
  visible.value = false;
};

const handleClose = (tag:Tag) => {
  emit("closeTag",tag)
}

const emit = defineEmits<{
  (e: "handleInputConfirm"): void;
  (e: "showInput"): void;
  (e: "closeTag",tag:Tag):void
  (e: "update:value", event: any): void;
  (e:"querySearchAsync",val:string,cb: (arg: any) => void):void
}>();
</script>
