import { defineStore } from "pinia";
import { reactive } from "vue";
import { RouteLocationNormalized, RouteRecordRaw } from "vue-router";
import { NavTabs, viewMenu } from "./interface";

export const useNavTabs = defineStore("navTabs", () => {
  const state: NavTabs = reactive({
    activeIndex: 0,
    activeRoute: null,
    // tab列表
    tabsView: [],
    tabFullScreen: false,
    // 从后台加载到的菜单路由列表
    tabsViewRoutes: [],
    authNode: new Map(),
  });

  function closeTab(route: viewMenu) {
    state.tabsView.map((v, k) => {
      if (v.path == route.path) {
        state.tabsView.splice(k, 1);
      }
    });
  }

  const routeRecordRawToViewMenu = (route: RouteRecordRaw): viewMenu => {
    const res: viewMenu = {
      title: route?.meta?.title as string,
      path: route.path,
      name: route.name as string,
      keepAlive: route.meta?.keep == false ? "" : (route.name as string),
    };

    if (route.children && route.children.length > 0) {
      res.children = route.children.map((r) => routeRecordRawToViewMenu(r));
    }

    return res;
  };

  // 关闭多个标签, retainMenu 代表需要保留的标签,否则关闭全部标签
  const closeTabs = (retainMenu: viewMenu | false = false): void => {
    if (retainMenu) {
      state.tabsView = [retainMenu];
    } else {
      state.tabsView = [];
    }
  };

  const addTabsView = (tabView: viewMenu) => {
    const curMenu = findMenu(state.tabsView, tabView.name);
    if (curMenu) return;
    state.tabsView.push(tabView);
  };

  const setTabsViewRoutes = (data: viewMenu[]): void => {
    state.tabsViewRoutes = data;
  };

  const setTabsView = (data: viewMenu[]): void => {
    state.tabsView = data;
  };

  const setActive = (route: viewMenu) => {
    const currentRoute = findMenu(state.tabsViewRoutes, route.name);
    if (!currentRoute) return;
    const activeRouteIndex = state.tabsView.findIndex((r) => {
      return r.name == route.name;
    });
    if (activeRouteIndex == -1) return;
    state.activeRoute = currentRoute;
    state.activeIndex = activeRouteIndex;
  };

  const findMenu = (
    tabsViewRoutes: viewMenu[],
    name: string
  ): viewMenu | null => {
    for (const route of tabsViewRoutes) {
      if (route.name == name) {
        return route;
      } else if (route.children && route.children.length > 0) {
        const res = findMenu(route.children, name);
        if (res) {
          return res;
        }
      }
    }
    return null;
  };

  function addTab(route: RouteLocationNormalized | viewMenu) {
    if (!route.name) return;
    for (const key in state.tabsView) {
      if (state.tabsView[key].name === route.name) {
        state.tabsView[key].params = route.params ?? {};
        state.tabsView[key].query = route.query ?? {};
        state.tabsView[key].path = route.path;
        return state.tabsView[key];
      }
    }
    const currentRoute = findMenu(
      state.tabsViewRoutes,
      route.name as unknown as string
    );
    if (!currentRoute) return;
    currentRoute!.params = route.params ?? {};
    currentRoute!.query = route.query ?? {};
    currentRoute!.path = route.path;
    state.tabsView.push(currentRoute);
    return currentRoute;
  }

  return {
    state,
    addTab,
    closeTab,
    closeTabs,
    setTabsViewRoutes,
    setActive,
    addTabsView,
    setTabsView,
    routeRecordRawToViewMenu,
  };
});
