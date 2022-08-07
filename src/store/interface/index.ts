import type { Component } from "vue"

export interface Layout {
  showDrawer: boolean
  shrink: boolean
  layoutMode: string
  mainAnimation: string
  menuWidth: number
  menuDefaultIcon: string
  menuCollapse: boolean
  menuUniqueOpened: boolean
  menuShowTopBar: boolean
  menuBackground: string
  menuColor: string
  menuActiveBackground: string
  menuActiveColor: string
  menuTopBarBackground: string
  headerBarTabColor: string
  headerBarBackground: string
  headerBarHoverBackground: string
  headerBarTabActiveBackground: string
  headerBarTabActiveColor: string
}

export interface viewMenu {
  title: string
  path: string
  name: string
  type?: string
  icon?: string
  keepAlive?: string
  query?: anyObj
  params?: anyObj
  children?: viewMenu[]
  component?: Component
}

export interface NavTabs {
  activeIndex: number
  activeRoute: viewMenu | null
  tabsView: Array<viewMenu>
  tabFullScreen: boolean
  tabsViewRoutes: Array<viewMenu>
  authNode: Map<string, string[]>
}