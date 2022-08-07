<template>
  <el-aside :class="'layout-aside-' + config.layout.layoutMode + ' ' + (config.layout.shrink ? 'shrink' : '')">
    <MenuVertical />
  </el-aside>
</template>

<script setup lang="ts">
import MenuVertical from "./menuVertical.vue";
import { useConfig } from "@/store/config.js";
import { computed } from "@vue/reactivity";
const config = useConfig();

const menuWidth = computed(() => config.menuWidth())

</script>

<style lang="scss" scoped>
.layout-aside-Default {
  background: var(--color-basic-white);
  margin: 16px 0 16px 16px;
  height: calc(100vh - 32px);
  box-shadow: var(--el-box-shadow-light);
  border-radius: var(--el-border-radius-base);
  overflow: hidden;
  transition: width 0.3s ease;
  width: v-bind(menuWidth);
}

.layout-aside-Classic {
    background: var(--color-basic-white);
    margin: 0px;
    height: 100vh;
    overflow: hidden;
    transition: width 0.3s ease;
    width: v-bind(menuWidth);
}
.shrink {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999999;
}
</style>
