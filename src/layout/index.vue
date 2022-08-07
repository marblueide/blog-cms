<template>
  <el-container class="layout-container">
    <Aside></Aside>
    <el-container class="main-warpper">
      <Header />
      <Main/>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Aside from "./components/aside.vue";
import Header from "./components/header.vue";
import Main from "./components/router-view/main.vue";
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100%;
  width: 100%;
  .main-warpper{
   flex-direction: column;
  }
}
</style>
