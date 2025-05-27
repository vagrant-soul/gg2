<template>
  <n-layout has-sider class="app-layout">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="150"
      :width="300"
      show-trigger
      content-style="padding: 24px;"
      :native-scrollbar="false"
    >
      <Sider />
    </n-layout-sider>

    <n-layout :native-scrollbar="false">
      <n-layout-header bordered>
        <Menunav />
      </n-layout-header>

      <n-layout-content content-style="padding: 24px;">
        <RouterView />
      </n-layout-content>

      <n-layout-footer bordered> 成府路 </n-layout-footer>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter, NLayoutSider } from 'naive-ui'
import Menunav from './components/Menunav.vue'
import Sider from './views/Sider.vue'
</script>
<style scoped>
.app-layout {
  height: 100vh;
}

.n-layout-header,
.n-layout-footer {
  padding: 24px;
}
</style>
