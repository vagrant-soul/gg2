<template>
  <n-collapse arrow-placement="right" :default-expanded-names="['1']" class="custom-collapse">
    <n-collapse-item name="1">
      <!-- 使用 #header 插槽自定义标题内容 -->
      <template #header>
        <!-- 图片路径根据实际情况修改 -->
        <img
          src="../assets/electron.svg"
          alt="title icon"
          style="width: 20px; height: 20px; margin-right: 8px"
        />
        <span>地图正则</span>
      </template>
      <n-flex vertical size="medium">
        <n-flex v-for="(row, rowIndex) in chunkedwaystoneContents" :key="rowIndex" size="medium">
          <n-button
            v-for="(button, colIndex) in row"
            :key="colIndex"
            ghost
            type="info"
            class="content-button"
            @click="handleButtonClick(button.value)"
          >
            {{ button.name }}
          </n-button>
        </n-flex>
      </n-flex>
    </n-collapse-item>
    <n-collapse-item name="2">
      <!-- 使用 #header 插槽自定义标题内容 -->
      <template #header>
        <!-- 图片路径根据实际情况修改 -->
        <img
          src="../assets/electron.svg"
          alt="title icon"
          style="width: 20px; height: 20px; margin-right: 8px"
        />
        <span>碑牌正则</span>
      </template>
      <n-flex vertical size="medium">
        <n-flex v-for="(row, rowIndex) in chunkedTableContents" :key="rowIndex" size="medium">
          <n-button
            v-for="(button, colIndex) in row"
            :key="colIndex"
            ghost
            type="info"
            class="content-button"
            @click="handleButtonClick(button.value)"
          >
            {{ button.name }}
          </n-button>
        </n-flex>
      </n-flex>
    </n-collapse-item>
    <n-collapse-item name="3">
      <!-- 使用 #header 插槽自定义标题内容 -->
      <template #header>
        <!-- 图片路径根据实际情况修改 -->
        <img
          src="../assets/electron.svg"
          alt="title icon"
          style="width: 20px; height: 20px; margin-right: 8px"
        />
        <span>圣物正则</span>
      </template>
      <n-flex vertical size="medium">
        <n-flex v-for="(row, rowIndex) in chunkedrelicContents" :key="rowIndex" size="medium">
          <n-button
            v-for="(button, colIndex) in row"
            :key="colIndex"
            ghost
            type="info"
            class="content-button"
            @click="handleButtonClick(button.value)"
          >
            {{ button.name }}
          </n-button>
        </n-flex>
      </n-flex>
    </n-collapse-item>
    <n-collapse-item name="4">
      <!-- 使用 #header 插槽自定义标题内容 -->
      <template #header>
        <!-- 图片路径根据实际情况修改 -->
        <img
          src="../assets/electron.svg"
          alt="title icon"
          style="width: 20px; height: 20px; margin-right: 8px"
        />
        <span>碑牌正则</span>
      </template>
      <n-flex vertical size="medium">
        <n-flex v-for="(row, rowIndex) in chunkedvendorContents" :key="rowIndex" size="medium">
          <n-button
            v-for="(button, colIndex) in row"
            :key="colIndex"
            ghost
            type="info"
            class="content-button"
            @click="handleButtonClick(button.value)"
          >
            {{ button.name }}
          </n-button>
        </n-flex>
      </n-flex>
    </n-collapse-item>
    <!-- 其他折叠项 -->
  </n-collapse>
</template>
<script setup lang="ts">
import { NCollapse, NCollapseItem, NFlex, NButton } from 'naive-ui'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useClipboard } from '@vueuse/core'

interface ButtonContent {
  name: string
  value: string
}

const waystoneContents = ref<ButtonContent[]>([])
const tableContents = ref<ButtonContent[]>([])
const vendorContents = ref<ButtonContent[]>([])
const relicContents = ref<ButtonContent[]>([])
// 将按钮内容按每行 2 个分组
// 通用分组函数
const chunkContents = (contents: ButtonContent[], chunkSize: number): ButtonContent[][] => {
  const result: ButtonContent[][] = []
  for (let i = 0; i < contents.length; i += chunkSize) {
    result.push(contents.slice(i, i + chunkSize))
  }
  return result
}

// 使用通用函数创建计算属性
const chunkedwaystoneContents = computed(() => chunkContents(waystoneContents.value, 2))
const chunkedTableContents = computed(() => chunkContents(tableContents.value, 2))
const chunkedrelicContents = computed(() => chunkContents(relicContents.value, 2))
const chunkedvendorContents = computed(() => chunkContents(vendorContents.value, 2))
// 加载按钮内容
const loadButtonContents = async (): Promise<void> => {
  try {
    const data = await window.electron.ipcRenderer.invoke('get-button-contents')
    waystoneContents.value = data.waystoneContents
    tableContents.value = data.tableContents
    relicContents.value = data.relicContents
    vendorContents.value = data.vendorContents
  } catch (error) {
    console.error('Failed to load contents:', error)
  }
}

// 组件挂载时加载数据
onMounted(async () => {
  // 监听数据更新事件
  const updateHandler = async (): Promise<void> => {
    await loadButtonContents()
  }
  window.electron.ipcRenderer.on('button-contents-updated', updateHandler)

  // 组件卸载时移除监听
  onUnmounted(() => {
    window.electron.ipcRenderer.removeListener('button-contents-updated', updateHandler)
  })
  await loadButtonContents()
})
// 引入 useClipboard
const { copy } = useClipboard()

// 处理按钮点击事件
const handleButtonClick = async (value: string): Promise<void> => {
  try {
    // 复制值到剪贴板
    await copy(value)
    console.log('值已复制到剪贴板')
    // 发送 ping 事件
    window.electron.ipcRenderer.send('ping')
    console.log('ping 事件已发送')
  } catch (error) {
    console.error('复制值或发送 ping 事件出错:', error)
  }
}
</script>
<style scoped>
.custom-collapse {
  padding-left: 16px; /* 折叠组件左右间距 */
  padding-right: 16px; /* 可根据实际需求调整右边距 */
}

.content-button {
  /* 按钮相关的样式 */
  width: 115px; /* 固定按钮宽度，可按需调整 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 多余文字用省略号显示 */
  white-space: nowrap; /* 文本不换行 */
}
</style>
