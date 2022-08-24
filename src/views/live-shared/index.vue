<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition :name="config.layout.mainAnimation" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useConfig } from "@/store/config";
const config = useConfig();
</script>

<script lang="ts">
export default {
  name: "liveShared",
};
</script>

<style scoped lang="scss"></style>
