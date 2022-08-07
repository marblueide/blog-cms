import router from "@/router";
import { isNavigationFailure, NavigationFailureType } from "vue-router";
import { ElNotification } from "element-plus";
import { viewMenu } from "@/store/interface";
import { useNavTabs } from "@/store/navTabs";

export const clickMenu = async (menu: viewMenu) => {
  await routePush(menu);
};

export const routePush = async ({ name, params, query }: viewMenu) => {
  try {
    const failure = await router.push({
      name: name,
      params: params,
      query: query,
    });
    if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
      ElNotification({
        message: "导航失败，被导航守卫拦截",
        type: "error",
      });
    } else if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
      ElNotification({
        message: "导航失败，已在导航目标位置！",
        type: "warning",
      });
    }
  } catch (error) {
    ElNotification({
      message: "导航失败，路由错误！",
      type: "error",
    });
    console.error(error);
  }
};
