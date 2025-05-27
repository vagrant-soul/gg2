<template>
  <n-collapse arrow-placement="right" :default-expanded-names="['1']">
    <n-collapse-item title="地图正则" name="1">
      <n-flex vertical size="medium">
        <n-flex v-for="(row, rowIndex) in chunkedwaystoneContents" :key="rowIndex" size="medium">
          <n-button v-for="(button, colIndex) in row" :key="colIndex">
            {{ button.name }}
          </n-button>
        </n-flex>
      </n-flex>
    </n-collapse-item>
    <n-collapse-item title="碑牌正则" name="2">
      <n-flex vertical size="medium">
        <n-flex v-for="(row, rowIndex) in chunkedTableContents" :key="rowIndex" size="medium">
          <n-button v-for="(button, colIndex) in row" :key="colIndex">
            {{ button.name }}
          </n-button>
        </n-flex>
      </n-flex>
    </n-collapse-item>
    <n-collapse-item title="圣物正则" name="3">
      <n-flex vertical size="medium">
        <n-flex v-for="(row, rowIndex) in chunkedrelicContents" :key="rowIndex" size="medium">
          <n-button v-for="(button, colIndex) in row" :key="colIndex">
            {{ button.name }}
          </n-button>
        </n-flex>
      </n-flex>
    </n-collapse-item>
    <n-collapse-item title="商店正则" name="4">
      <n-flex vertical size="medium">
        <n-flex v-for="(row, rowIndex) in chunkedvendorContents" :key="rowIndex" size="medium">
          <n-button v-for="(button, colIndex) in row" :key="colIndex">
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
</script>
