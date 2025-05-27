<template>
  <n-card class="main-container" content-style="padding: 0; height: 100%;">
    <n-grid :cols="2" :x-gap="20" style="height: 100%">
      <!-- 左侧区域 -->
      <n-gi>
        <n-card
          class="custom-card"
          content-style="height: 100%; display: flex; flex-direction: column;"
        >
          <n-input
            v-model:value="prefixKeyword"
            clearable
            placeholder="输入前缀内容"
            style="margin-bottom: 16px"
            @input="prefixSearch"
          />
          <n-scrollbar class="scrollable-list">
            <n-list style="flex: 1">
              <n-list-item
                v-for="(item, index) in filteredLeftList"
                :key="index"
                :style="{
                  backgroundColor: leftSelectedIndexes.includes(index) ? '#e5f6ff' : 'transparent'
                }"
                @click="toggleLeftSelection(index)"
              >
                {{ item.name }}
              </n-list-item>
            </n-list>
          </n-scrollbar>
        </n-card>
      </n-gi>

      <!-- 右侧区域 -->
      <n-gi>
        <n-card
          class="custom-card"
          content-style="height: 100%; display: flex; flex-direction: column;"
        >
          <n-input
            v-model:value="suffixKeyword"
            clearable
            placeholder="输入后缀内容"
            style="margin-bottom: 16px"
            @input="suffixSearch"
          />
          <n-scrollbar class="scrollable-list">
            <n-list style="flex: 1">
              <n-list-item
                v-for="(item, index) in filteredRightList"
                :key="index"
                :style="{
                  backgroundColor: rightSelectedIndexes.includes(index) ? '#e5f6ff' : 'transparent'
                }"
                @click="toggleRightSelection(index)"
              >
                {{ item.name }}
              </n-list-item>
            </n-list>
          </n-scrollbar>
        </n-card>
      </n-gi>
    </n-grid>
  </n-card>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { NGrid, NGi, NCard, NScrollbar, NList, NListItem, NInput } from 'naive-ui'

// 左侧数据
const leftList = ref([
  { name: '苹果', description: '好吃' },
  { name: '香蕉', description: '香甜' },
  { name: '橙子', description: '多汁' },
  { name: '葡萄', description: '酸甜' },
  { name: '草莓', description: '鲜美' }
])
const prefixKeyword = ref('')

// 右侧数据
const rightList = ref([
  { name: '苹果1', description: '好吃1' },
  { name: '香蕉2', description: '香甜2' },
  { name: '橙子3', description: '多汁3' },
  { name: '葡萄4', description: '酸甜4' },
  { name: '草莓5', description: '鲜美5' }
])
const suffixKeyword = ref('')
// 存储选中项的索引
const leftSelectedIndexes = ref<number[]>([])
const rightSelectedIndexes = ref<number[]>([])
// 存储选中项的描述
const leftSelectedDescriptions = ref<string[]>([])
const rightSelectedDescriptions = ref<string[]>([])
// 计算属性，根据前缀过滤左侧列表
const filteredLeftList = computed(() => {
  if (!prefixKeyword.value.trim()) {
    return leftList.value
  }
  const keyword = prefixKeyword.value.toLowerCase()
  return leftList.value.filter((item) => item.name.toLowerCase().includes(keyword))
})

// 计算属性，根据后缀过滤右侧列表
const filteredRightList = computed(() => {
  if (!suffixKeyword.value.trim()) {
    return rightList.value
  }
  const keyword = suffixKeyword.value.toLowerCase()
  return rightList.value.filter((item) => item.name.toLowerCase().includes(keyword))
})

// 切换左侧选择状态的函数
const toggleLeftSelection = (index: number): void => {
  const indexInSelected = leftSelectedIndexes.value.indexOf(index)
  if (indexInSelected > -1) {
    leftSelectedIndexes.value.splice(indexInSelected, 1)
    leftSelectedDescriptions.value.splice(indexInSelected, 1)
  } else {
    leftSelectedIndexes.value.push(index)
    leftSelectedDescriptions.value.push(leftList.value[index].description)
  }
}

// 切换右侧选择状态的函数
const toggleRightSelection = (index: number): void => {
  const indexInSelected = rightSelectedIndexes.value.indexOf(index)
  if (indexInSelected > -1) {
    rightSelectedIndexes.value.splice(indexInSelected, 1)
    rightSelectedDescriptions.value.splice(indexInSelected, 1)
  } else {
    rightSelectedIndexes.value.push(index)
    rightSelectedDescriptions.value.push(rightList.value[index].description)
  }
}

// 防抖函数
const debounce = <T extends (...args: never[]) => unknown>(
  fn: T,
  delay: number
): ((this: ThisParameterType<T>, ...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

// 前缀搜索（带防抖）
const prefixSearch = debounce(() => {
  // 搜索逻辑在 computed 属性中已实现
}, 300)

// 后缀搜索（带防抖）
const suffixSearch = debounce(() => {
  // 搜索逻辑在 computed 属性中已实现
}, 300)
</script>
<style scoped>
.main-container {
  padding: 20px;
  height: 100%; /* 新增：填充父容器高度 */
}

.custom-card {
  height: 100%; /* 改为100%填充 */
  padding: 16px; /* 新增内边距 */
}

.scrollable-list {
  height: 400px;
  margin-top: 16px;
}

/* 新增输入框样式 */
.n-input {
  margin-bottom: 16px;
}
</style>
