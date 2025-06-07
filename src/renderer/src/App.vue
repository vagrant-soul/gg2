<template>
  <n-config-provider :theme="darkTheme">
    <n-layout class="bg-layout">
      <!-- 使用 draggable 组件包裹内容区域，设置 itemKey 属性 -->
      <draggable
        v-model="draggableItems"
        group="content-group"
        :sort="false"
        item-key="id"
        @start="onDragStart"
        @end="onDragEnd"
      >
        <template #item="{ element }">
          <div
            class="content-container"
            :style="{ left: element.left + 'px', top: element.top + 'px' }"
          >
            <!-- 使用 n-layout 并设置 has-sider 属性 -->
            <n-layout has-sider class="inner-layout">
              <!-- 左侧边栏 -->
              <n-layout-sider class="left-sider" :native-scrollbar="false">
                <n-card content-style="padding: 0;" class="content-card" :bordered="false">
                  <template #header>
                    <div class="card-header">
                      <span class="card-title">正则助手</span>
                      <n-badge v-if="!isVersionEqual" color="#18A058" value="new" :offset="[20, 0]">
                        V{{ version }}
                      </n-badge>
                    </div>
                    <n-divider dashed class="custom-divider" />
                  </template>
                  <template #header-extra>
                    <div class="header-extra-container">
                      <n-button text style="font-size: 24px" @click="toggleMainLayout">
                        <n-icon>
                          <List />
                        </n-icon>
                      </n-button>
                    </div>
                  </template>
                  <Sider></Sider>
                </n-card>
                <n-divider class="custom-divider" style="margin-top: 15px" />
                <div class="image-container">
                  <n-image width="150" :src="electronImage" preview-disabled></n-image>
                </div>
              </n-layout-sider>
              <!-- 右侧内容区域，使用 v-if 控制显示 -->
              <n-layout v-if="isMainLayoutVisible" :native-scrollbar="false">
                <n-layout-header bordered>
                  <Menunav />
                </n-layout-header>
                <n-layout-content content-style="padding: 24px;">
                  <RouterView />
                </n-layout-content>
              </n-layout>
            </n-layout>
          </div>
        </template>
      </draggable>
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { List } from '@vicons/ionicons5'

import {
  NConfigProvider,
  NLayout,
  NCard,
  darkTheme,
  NButton,
  NDivider,
  NBadge,
  NIcon,
  NImage
} from 'naive-ui'
import { NLayoutHeader, NLayoutContent, NLayoutSider } from 'naive-ui'
import Sider from './views/Sider.vue'
import { ref, onMounted, computed } from 'vue'
import Menunav from './components/Menunav.vue'
// 引入图片
import electronImage from './assets/electron.svg'
const version = '2.0.0'
const newVersion = ref('')
// 使用 computed 计算属性比较版本号
const isVersionEqual = computed(() => version === newVersion.value)
// 控制中间布局的显示与隐藏，初始为显示
const isMainLayoutVisible = ref(false)
// 定义切换显示状态的函数
const toggleMainLayout = (): void => {
  isMainLayoutVisible.value = !isMainLayoutVisible.value
}

// 初始化可拖拽列表，添加唯一标识属性 id
const draggableItems = ref([{ id: 1, left: 100, top: 200 }])
// 记录拖拽开始时的鼠标位置
const startMousePos = ref({ x: 0, y: 0 })
// 控制右侧区域显示的变量
// const showRightArea = ref(true)

const onDragStart = (event): void => {
  if (event.originalEvent) {
    // 记录拖拽开始时的鼠标位置
    startMousePos.value = {
      x: event.originalEvent.clientX,
      y: event.originalEvent.clientY
    }
  }
}

const onDragEnd = (event): void => {
  if (event.originalEvent) {
    // 计算鼠标移动的偏移量
    const dx = event.originalEvent.clientX - startMousePos.value.x
    const dy = event.originalEvent.clientY - startMousePos.value.y

    // 更新元素位置
    draggableItems.value[0].left += dx
    draggableItems.value[0].top += dy
  }
}
// 在组件挂载时发起请求
onMounted(async () => {
  try {
    const text = await window.electron.ipcRenderer.invoke('get-version-info')
    newVersion.value = text as string
  } catch (error) {
    console.error('获取版本信息失败:', error)
  }
})
</script>

<style scoped>
.custom-collapse {
  padding-left: 16px; /* 可根据实际需求调整左边距 */
  padding-right: 16px; /* 可根据实际需求调整右边距 */
}
.header-extra-container {
  margin-left: auto; /* 将元素推到最右侧 */
}
.custom-divider {
  margin-bottom: 1px; /* 可根据实际需求调整间距值 */
  margin-top: 3px;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* 设置标题和徽章之间的间距 */
}

.card-title {
  color: #ffffff; /* 设置标题颜色为蓝色 */
}
.bg-layout {
  min-height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
}

.content-container {
  position: absolute;
  width: calc(300px + 800px);
}

.content-card {
  overflow: hidden;
}

.inner-layout {
  /* 去除默认背景 */
  background: none;
}

.left-sider {
  min-width: 300px; /* 设置左侧边栏最小宽度 */
  /* 去除默认背景 */
  /* background: none; */
  /* 确保高度自适应，最高不超过 600px */
  height: auto;
  max-height: 600px;
}

.right-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  text-align: center; /* 水平居中图片 */
  margin-top: 20px; /* 设置与上方内容的间距，可按需调整 */
}
</style>
