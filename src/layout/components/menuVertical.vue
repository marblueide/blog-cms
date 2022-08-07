<template>
  <el-scrollbar>
    <el-menu
      mode="vertical"
      :collapse="config.layout.menuCollapse"
      :unique-opened="config.layout.menuUniqueOpened"
      :background-color="config.layout.menuBackground"
      :text-color="config.layout.menuColor"
      :active-text-color="config.layout.menuActiveColor"
      :default-active="state.defaultActive"
    >
     <MenuTree :menus="navTabs.state.tabsViewRoutes"/>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import { onBeforeRouteUpdate, RouteLocationNormalizedLoaded, useRoute } from "vue-router";
import { useConfig } from "@/store/config.js";
import type { ElScrollbar } from "element-plus";
import MenuTree from "./menuTree.vue";
import { useNavTabs } from "@/store/navTabs";

const navTabs = useNavTabs()
const route = useRoute();
const verticalMenusRef = ref<InstanceType<typeof ElScrollbar>>();
const state = reactive({
  defaultActive: "",
});
const config = useConfig();

const currentRouteActive = (currentRoute:RouteLocationNormalizedLoaded) => {
  state.defaultActive = currentRoute.name
}

// 滚动条滚动到激活菜单所在位置
const verticalMenusScroll = () => {
    nextTick(() => {
        let activeMenu: HTMLElement | null = document.querySelector('.el-menu.layouts-menu-vertical li.is-active')
        if (!activeMenu) return false
        verticalMenusRef.value?.setScrollTop(activeMenu.offsetTop)
    })
}

onMounted(() => {
  currentRouteActive(route)
  verticalMenusScroll()
})

onBeforeRouteUpdate((to) => {
    currentRouteActive(to)
})
</script>

<style lang="scss" scoped></style>
