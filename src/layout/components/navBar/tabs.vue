<template>
  <div class="nav-tabs" ref="tabScrollbarRef">
    <div
      class="ba-nav-tab"
      v-for="(item, idx) in navTabs.state.tabsView"
      :ref="navTabsRef.set"
      @click="toTab(item as viewMenu)"
    >
      {{ item.title }}
      <Icon
        v-show="navTabs.state.tabsView.length > 1"
        name="el-icon-Close"
        class="close-icon"
        size="10"
        @click.stop="closeTab(item as viewMenu)"
      />
    </div>
    <div :style="activeBoxStyle" class="nav-tabs-active-box"></div>
  </div>
</template>

<script setup lang="ts">
import { useNavTabs } from "@/store/navTabs.js";
import Icon from "@/components/icon/index.vue";
import { viewMenu } from "@/store/interface/index.js";
import {
  onBeforeRouteUpdate,
  RouteLocationNormalized,
  useRoute,
  useRouter,
} from "vue-router";
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import { useTemplateRefsList } from "@vueuse/core";
import { useConfig } from "@/store/config.js";
import { clickMenu } from "@/utils/router.js";
import useCurrentInstance from "@/utils/useCurrentInstance.js";

const navTabsRef = useTemplateRefsList<HTMLDivElement>();
const tabScrollbarRef = ref();

const router = useRouter();
const route = useRoute();
const navTabs = useNavTabs();
const config = useConfig();
const { proxy } = useCurrentInstance();

const activeBoxStyle = reactive({
  width: "0",
  transform: "translateX(0px)",
});

const toTab = async (item: viewMenu) => {
  await clickMenu(item);
};

const selectNavTab = (dom: HTMLDivElement) => {
  if (!dom) return;
  activeBoxStyle.width = dom.clientWidth + "px";
  activeBoxStyle.transform = `translateX(${dom.offsetLeft}px)`;

  let scrollLeft =
    dom.offsetLeft + dom.clientWidth - tabScrollbarRef.value.clientWidth;
  if (dom.offsetLeft < tabScrollbarRef.value.scrollLeft) {
    tabScrollbarRef.value.scrollTo(dom.offsetLeft, 0);
  } else if (scrollLeft > tabScrollbarRef.value.scrollLeft) {
    tabScrollbarRef.value.scrollTo(scrollLeft, 0);
  }
};

onMounted(() => {
  nextTick(() => {
    selectNavTab(navTabsRef.value[navTabs.state.activeIndex]);
  });
});

const closeTab = (view: viewMenu) => {
  navTabs.closeTab(view);
  proxy.eventBus.emit("onTabViewClose", view);
  if (view.name == route.name) {
    lastTab();
  } else {
    navTabs.state.activeRoute && navTabs.setActive(navTabs.state.activeRoute as unknown as viewMenu)
    nextTick(() => {
      selectNavTab(navTabsRef.value[navTabs.state.activeIndex]);
    });
  }
};

const lastTab = () => {
  const last: viewMenu = navTabs.state.tabsView.slice(-1)[0] as viewMenu;
  if (last) {
    toTab(last);
  } else {
    router.push("/");
  }
};

onBeforeRouteUpdate(async (to, from) => {
  updateTab(to);
  nextTick(() => {
    selectNavTab(navTabsRef.value[navTabs.state.activeIndex]);
  });
});

const updateTab = function (newRoute: RouteLocationNormalized | viewMenu) {
  // 添加tab
  const tab = navTabs.addTab(newRoute);
  tab && navTabs.setActive(tab);
  nextTick(() => {
    selectNavTab(navTabsRef.value[navTabs.state.activeIndex]);
  });
};
</script>

<style scoped lang="scss">
.nav-tabs {
  overflow-x: auto;
  overflow-y: hidden;
  margin-right: var(--main-space);
  scrollbar-width: none;

  &::-webkit-scrollbar {
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #eaeaea;
    border-radius: var(--el-border-radius-base);
    box-shadow: none;
    -webkit-box-shadow: none;
  }
  &::-webkit-scrollbar-track {
    background: v-bind(
      'config.layout.layoutMode == "Default" ? "none":"config.layout.headerBarBackground"'
    );
  }
  &:hover {
    &::-webkit-scrollbar-thumb:hover {
      background: #c8c9cc;
    }
  }
}
.ba-nav-tab {
  white-space: nowrap;
  height: 40px;
}
</style>
