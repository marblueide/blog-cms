<template>
  <el-header class="header-box">
    <component :is="config.layout.layoutMode + 'NavBar'"></component>
  </el-header>
</template>


<script setup lang="ts">
import { useConfig } from '@/store/config';
import Tabs from './navBar/tabs.vue'; 
import DefaultNavBar from './navBar/default.vue'

const config = useConfig()  

</script>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'layout/header',
    components: { DefaultNavBar },
})
</script>

<style scoped lang="scss">
.header-box{
  background-color: var(--color-bg-1);
}
</style>