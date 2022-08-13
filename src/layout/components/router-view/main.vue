<template>
  <el-main class="layout-main">
    <el-scrollbar class="layout-main-scrollbar">
      <div style="margin-right: 20px; margin-bottom: 60px;">
        <router-view v-slot="{ Component }">
          <transition :name="config.layout.mainAnimation" mode="out-in">
            <keep-alive :include="state.keepAliveComponentNameList">
              <component :is="Component" :key="state.componentKey" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </el-scrollbar>
  </el-main>
</template>

<script setup lang="ts">
import { useConfig } from "@/store/config.js";
import { viewMenu } from "@/store/interface/index.js";
import { useNavTabs } from "@/store/navTabs.js";
import useCurrentInstance from "@/utils/useCurrentInstance.js";
import { onBeforeMount, reactive, watch } from "vue";
import { useRoute } from "vue-router";

const { proxy } = useCurrentInstance();
const config = useConfig();
const route = useRoute();
const navTabs = useNavTabs();

const state: {
  componentKey: string;
  keepAliveComponentNameList: string[];
} = reactive({
  componentKey: route.path,
  keepAliveComponentNameList: [],
});

onBeforeMount(() => {
  proxy.eventBus.on("onTabViewClose", (menu: viewMenu) => {
    state.keepAliveComponentNameList = state.keepAliveComponentNameList.filter(
      (name: string) => menu.keepAlive !== name
    );
  });
});

const addKeepAliveComponentName = (keepAliveName: string) => {
  if (keepAliveName) {
    if (state.keepAliveComponentNameList.includes(keepAliveName)) {
      return;
    }
    state.keepAliveComponentNameList.push(keepAliveName);
  }
};

watch(
  () => route.path,
  () => {
    console.log(route);
    if (route.matched.length > 1) {
      const views = route.matched.slice(1);
      for (let view of views) {
        if (!view.name) continue;
        const curView = navTabs.findMenu(
          navTabs.state.tabsViewRoutes as viewMenu[],
          view.name as string
        );
        curView?.keepAlive && addKeepAliveComponentName(curView?.keepAlive);
      }
    }
    state.componentKey = route.path;
  }
);
</script>

<style scoped lang="scss">
.layout-container .layout-main {
  padding: 0 !important;
  overflow: hidden;
  height: 100%;
  margin: var(--main-space) 0 16px var(--main-space);
}
.layout-main-scrollbar {
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
