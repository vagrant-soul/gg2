<template>
  <n-flex vertical size="large">
    <n-flex>
      <n-radio-group v-model:value="selectedOption">
        <n-radio-button :value="waystones">地图</n-radio-button>
        <n-radio-button :value="tables">碑牌</n-radio-button>
        <n-radio-button :value="relic">圣物</n-radio-button>
        <n-radio-button :value="vendors">商店</n-radio-button>
      </n-radio-group>
    </n-flex>
    <n-dynamic-input
      v-model:value="value"
      preset="pair"
      show-sort-button
      key-placeholder="按钮名称"
      value-placeholder="正则不超过50个字符"
    />
    <!-- 这部分显示修改的json数据,调试的时候可以打开 -->
    <!-- <pre>{{ JSON.stringify(value, null, 2) }}</pre> -->
    <n-flex justify="end">
      <n-button type="primary" @click="saveContent">保存</n-button>
    </n-flex>
  </n-flex>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { NDynamicInput, NButton, NFlex, NRadioGroup, NRadioButton } from 'naive-ui'
const waystones = 'waystoneContents'
const tables = 'tableContents'
const vendors = 'vendorContents'
const relic = 'relicContents'
const selectedOption = ref(waystones) // 默认选中第一个选项
const value = ref<Array<{ key: string; value: string }>>([])

// 修改加载按钮内容逻辑
const loadButtonContents = async (): Promise<void> => {
  try {
    const data = await window.electron.ipcRenderer.invoke('get-button-contents')
    // 根据 selectedOption 的值选择对应的字段
    const selectedData = data[selectedOption.value]
    value.value = selectedData.map((item: { name: string; value: string }) => ({
      key: item.name,
      value: item.value
    }))
  } catch (error) {
    console.error('Failed to load button contents:', error)
  }
}

// 修改保存内容逻辑
const saveContent = async (): Promise<void> => {
  try {
    // 过滤掉空值
    const validData = value.value.filter((item) => item.key.trim() && item.value.trim())

    // 将数据转换为后端需要的格式
    const newData = validData.map((item) => ({
      name: item.key,
      value: item.value
    }))

    // 调用IPC保存数据，传递当前选中的选项
    await window.electron.ipcRenderer.invoke('save-button-content', {
      type: selectedOption.value,
      data: newData
    })

    // 重新加载数据
    await loadButtonContents()
  } catch (error) {
    console.error('Failed to save content:', error)
  }
}

// 监听 selectedOption 的变化
watch(selectedOption, () => {
  loadButtonContents()
})
onMounted(async () => {
  await loadButtonContents()
})
</script>
