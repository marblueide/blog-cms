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
    path:"ariticle",
    name:"ariticle",
    meta:{
      title:"文章管理",
    },
    component:() => import("@/views/article/index.vue"),
    children:[
      {
        path:"add",
        name:"addArticle",
        meta:{
          title:"添加文章",
        },
        component:() => import("@/views/article/add.vue")
      }
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