<template>
  <n-flex align="start" justify="space-between" style="width: 100%">
    <n-flex vertical size="medium" style="width: 240px">
      <!-- 查询按钮 - 上方单独一行 -->
      <n-button type="primary" block size="large" style="height: 64px; margin-bottom: 8px">
        查询
      </n-button>

      <!-- 重置和收藏按钮 - 下方并列一行 -->
      <n-flex justify="space-between" align="center">
        <n-button type="error" style="flex: 1; margin-right: 8px; height: 40px"> 重置 </n-button>
        <n-button type="warning" style="flex: 1; height: 40px"> 收藏 </n-button>
      </n-flex>
    </n-flex>
    <n-card hoverable style="flex: 1; height: 120px" embedded> 这里是内容的显示部分 </n-card>
  </n-flex>
</template>

<script setup lang="ts">
import { NCard, NButton, NFlex } from 'naive-ui'
</script>

<style scoped>
.n-card {
  border-radius: 8px;
  margin-left: 24px;
  margin-right: 24px;
}
/* 新增容器间距 */
.n-flex[style*='width: 100%'] {
  margin-top: 10px;

  margin-left: 24px;
}
</style>
