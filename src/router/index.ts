import {createRouter,createWebHistory,RouteRecordRaw} from "vue-router"
import NProgress from "nprogress"
import { useNavTabs } from "@/store/navTabs"

export const routes:Array<RouteRecordRaw> = [
  {
    path:"control", 
    name:"control",
    meta:{
      title:"控制台"
    },
    component:() => import("@/views/control/index.vue")
  },
  {
    path:"comment",
    name:"comment",
    meta:{
      title:"评论管理",
      query:{
        limit:10,
        offset:1
      }
    },
    component:() => import("@/views/comment/index.vue")
  },
  {
    path:"Article",
    name:"Article",
    meta:{
      title:"文章管理",
    },
    component:() => import("@/views/article/index.vue"),
    children:[
      {
        path:"list",
        name:"listArticle",
        meta:{
          title:"文章列表",
        },
        component:() => import("@/views/article/list.vue")
      },
      {
        path:"editor",
        name:"editorArticle",
        meta:{
          title: "文章编辑"
        },
        component:() => import("@/views/article/editor.vue")
      },
    ]
  },
  {
    path:"photo",
    name:"photo",
    meta:{
      title:"图片管理"
    },
    component:() => import("@/views/photo/index.vue")
  },
  {
    path:"user",
    name:"user",
    meta:{
      title:"用户管理"
    },
    component:() => import("@/views/user/index.vue")
  },
  {
    path: 'tags',
    name: 'tags',
    meta: {
      title: '标签管理'
    },
    component: () => import("@/views/tags/index.vue")
  },
  {
    path: 'groups',
    name: 'groups',
    meta: {
      title: '分组管理',
    },
    component: () => import('@/views/group/index.vue')
  },
  {
    path: 'live_shared',
    name: 'liveShared',
    meta: {
      title: '生活分享管理'
    },
    component: () => import('@/views/live-shared/index.vue')
  }
]

//基本路由
export const baseRoutes: Array<RouteRecordRaw> = [
  {
    path:"/",
    name:"admin",
    redirect:"control",
    component:() => import("@/views/main.vue"),
    meta:{
      title:"首页"
    },
    children:routes
  },
]



const router = createRouter({
  history:createWebHistory(),
  routes:baseRoutes
})

router.beforeEach((to, from, next) => {
  NProgress.configure({ showSpinner: false })
  NProgress.start()
  // if (!window.existLoading) {
  //     loading.show()
  //     window.existLoading = true
  // }
  next()
})

// 路由加载后
router.afterEach((to, from) => {
  // if (window.existLoading) {
  //     loading.hide()
  // }
  const navTabs = useNavTabs()
  if(navTabs.state.tabsView.length == 0 && to.matched.length > 0){
    const route = to.matched.slice(-1)[0]
    navTabs.addTabsView({
      title:route.meta.title as string,
      path:route.path,
      name:route.name as string
    })
  }
  NProgress.done()
})  

export default router