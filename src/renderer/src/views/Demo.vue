<template>
  <n-card title="Vue Naive UI 案例">
    <div class="list-container">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="list-item"
        :class="{ selected: item.selected }"
        @click="handleTextClick(item)"
      >
        <span class="text-content">{{ item.text }}</span>
        <n-input
          v-if="item.text.includes('输入框')"
          v-model:value="item.inputValue"
          placeholder="请输入内容"
          @update:value="handleInputChange(item)"
          @click.stop
        />
      </div>
    </div>
    <div class="result-container">
      <n-input v-model:value="resultText" placeholder="结果展示区域" />
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NInput } from 'naive-ui'
interface ListItem {
  text: string
  inputValue: string
  selected: boolean
  value: string
}

const list = ref<ListItem[]>([
  { text: '普通文本项', inputValue: '', selected: false, value: 'option1-1' },
  { text: '带输入框的文本项', inputValue: '', selected: false, value: 'option1-2' },
  { text: '另一个普通文本', inputValue: '', selected: false, value: 'option1-3' },
  { text: '测试输入框显示条件', inputValue: '', selected: false, value: 'option1-4' }
])

const resultText = ref('')

const handleTextClick = (item: ListItem): void => {
  item.selected = !item.selected
  updateResultText()
}

const handleInputChange = (item: ListItem): void => {
  item.inputValue = item.inputValue.trim() // 可选：添加一些处理逻辑 不加会提示报错, 但是不影响使用
  updateResultText()
}

const updateResultText = (): void => {
  const selectedItems = list.value.filter((item) => item.selected)
  resultText.value = selectedItems
    .map((item) => {
      // 如果有输入值，则拼接输入值和value；否则只显示value
      return item.inputValue ? `${item.value}:${item.inputValue}` : item.value
    })
    .join(', ')
}
</script>

<style scoped>
.list-container {
  margin-bottom: 20px;
}

.list-item {
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.list-item.selected {
  background-color: #e0f2fe;
  border-color: #bae6fd;
}

.text-content {
  margin-right: 16px;
}

.result-container {
  margin-top: 20px;
}
</style>
