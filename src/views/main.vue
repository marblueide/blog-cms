<template>
  <lay-out></lay-out>
</template>

<script setup lang="ts">
import LayOut from "@/layout/index.vue";
import { onMounted } from "vue";
import {routes} from "@/router/index"
import { useNavTabs } from "@/store/navTabs.js";
import { viewMenu } from "@/store/interface/index.js";
import { onBeforeRouteUpdate, RouteRecordRaw } from "vue-router";

const navTab = useNavTabs();

onMounted(() => {
  init();
});

const init = () => {
  const viewRoutes:viewMenu[] = []
  for(const route of routes){
      viewRoutes.push(navTab.routeRecordRawToViewMenu(route))
  }
  navTab.setTabsViewRoutes(viewRoutes)
};


</script>
