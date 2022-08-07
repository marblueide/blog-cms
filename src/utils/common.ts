import { App } from "vue"
import * as elIcons from '@element-plus/icons-vue'
import Icon from "@/components/icon/index.vue"
import { viewMenu } from "@/store/interface"

export function registerIcons(app: App) {
  /*
   * 全局注册 Icon
   * 使用方式: <Icon name="name" size="size" color="color" />
   * 详见<待完善>
   */
  app.component('Icon', Icon)

  /*
   * 全局注册element Plus的icon
   */
  const icons = elIcons as any
  for (const i in icons) {
      app.component(`el-icon-${icons[i].name}`, icons[i])
  }
}

export function routerLink(route:viewMenu){
  
}