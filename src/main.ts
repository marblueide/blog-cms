import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/index"
import {createPinia } from "pinia" 
import 'element-plus/dist/index.css'
import "@/styles/base.scss"
import'nprogress/nprogress.css'
import { registerIcons } from './utils/common'
import mitt from 'mitt'

function start(){
  const app = createApp(App);
  app.use(router)
  app.use(createPinia())
  registerIcons(app)

  app.config.globalProperties.eventBus = mitt()
  app.mount("#app")
}

start()
