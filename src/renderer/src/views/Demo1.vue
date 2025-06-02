<template>
  <div class="max-w-4xl mx-auto p-4">
    <n-card class="mb-6">
      <h1 class="text-2xl font-bold mb-4">物品正则表达式生成器</h1>

      <!-- 稀有度选择（多选） -->
      <div class="mb-4">
        <h3 class="text-lg font-medium mb-2">稀有度</h3>
        <n-checkbox-group v-model:value="selectedRarities">
          <n-checkbox v-for="(label, key) in rarityOptions" :key="key" :value="key">
            {{ label }}
          </n-checkbox>
        </n-checkbox-group>
      </div>

      <!-- 品质选择（单选） -->
      <div class="mb-4">
        <h3 class="text-lg font-medium mb-2">品质</h3>
        <n-radio-group v-model:value="selectedQuality">
          <n-radio v-for="(label, key) in qualityOptions" :key="key" :value="key">
            {{ label }}
          </n-radio>
        </n-radio-group>
      </div>

      <!-- 等级范围（数字输入框） -->
      <div class="mb-4">
        <h3 class="text-lg font-medium mb-2">物品等级范围</h3>
        <n-space>
          <n-input-number
            v-model:value="minLevel"
            :min="1"
            :max="100"
            placeholder="最小等级"
            style="width: 120px"
          />
          <span>至</span>
          <n-input-number
            v-model:value="maxLevel"
            :min="1"
            :max="100"
            placeholder="最大等级"
            style="width: 120px"
          />
        </n-space>
      </div>

      <!-- 防御值（滑块） -->
      <div class="mb-4">
        <h3 class="text-lg font-medium mb-2">防御值</h3>
        <n-slider v-model:value="defense" :min="0" :max="1000" :step="10" show-input show-tooltip />
        <div class="mt-2 text-sm text-gray-500">当前值: {{ defense }}</div>
      </div>

      <!-- 第一部分列表组件 -->
      <div class="mb-4">
        <h3 class="text-lg font-medium mb-2">可选值列表 - 第一部分</h3>
        <n-list>
          <n-list-item
            v-for="(item, index) in listOptionsPart1"
            :key="index"
            :style="{
              backgroundColor: selectedListItemsPart1.includes(item.value)
                ? '#e5f6ff'
                : 'transparent'
            }"
            @click="toggleListItemSelectionPart1(item.value)"
          >
            <!-- 条件渲染输入框 -->
            <!-- v-if="selectedListItemsPart1.includes(item.value) && item.label.includes('1-1')" -->
            <template #prefix>
              <n-input
                v-if="
                  (function () {
                    const condition =
                      selectedListItemsPart1.includes(item.value) && item.label.includes('1-1')
                    // console.log('Input condition:', condition, 'item:', item)
                    return condition
                  })()
                "
                v-model="listItemInputs[index]"
                style="width: 50px"
                :placeholder="item.value"
                @update:value="updateListItemValue(index, item.value)"
                @click.stop
              />
            </template>
            {{ item.label }}
          </n-list-item>
        </n-list>
      </div>

      <!-- 第二部分列表组件 -->
      <div class="mb-4">
        <h3 class="text-lg font-medium mb-2">可选值列表 - 第二部分</h3>
        <n-list>
          <n-list-item
            v-for="(item, index) in listOptionsPart2"
            :key="index"
            :style="{
              backgroundColor: selectedListItemsPart2.includes(item.value)
                ? '#e5f6ff'
                : 'transparent'
            }"
            @click="toggleListItemSelectionPart2(item.value)"
          >
            {{ item.label }}
          </n-list-item>
        </n-list>
      </div>

      <!-- 生成结果 -->
      <div class="mt-6">
        <h3 class="text-lg font-medium mb-2">生成的正则表达式</h3>
        <n-input v-model:value="regexResult" type="textarea" readonly class="min-h-[100px]" />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NCard,
  NCheckbox,
  NCheckboxGroup,
  NRadio,
  NRadioGroup,
  NInputNumber,
  NSlider,
  NInput,
  NSpace,
  NList,
  NListItem
} from 'naive-ui'
import {
  generateRarityRegex,
  generateQualityRegex,
  generateLevelRegex,
  generateNumericPropertyRegex,
  generateCombinedListItemRegex // 新增生成组合列表项正则的函数
} from './demo/regexGenerator'
import { rarityMap, qualityMap } from './demo/rarityMap'

// 状态管理
const selectedRarities = ref<string[]>([])
const selectedQuality = ref<string | null>(null)
const minLevel = ref(1)
const maxLevel = ref(100)
const defense = ref(500)

// 第一部分列表项相关状态
const listOptionsPart1 = ref([
  { label: '选项1-1', value: 'option1-1' },
  { label: '选项1-2', value: 'option1-2' },
  { label: '选项1-3', value: 'option1-3' }
])
// console.log('listOptionsPart1:', listOptionsPart1.value)
const selectedListItemsPart1 = ref<string[]>([])
// 新增输入框值存储
const listItemInputs = ref<Record<number, string>>({})

// 第二部分列表项相关状态
const listOptionsPart2 = ref([
  { label: '选项2-1', value: 'option2-1' },
  { label: '选项2-2', value: 'option2-2' },
  { label: '选项2-3', value: 'option2-3' }
])
const selectedListItemsPart2 = ref<string[]>([])

// 定义切换第一部分列表项选中状态的函数
const toggleListItemSelectionPart1 = (value: string): void => {
  const index = selectedListItemsPart1.value.indexOf(value)
  const itemIndex = listOptionsPart1.value.findIndex((item) => item.value === value)
  if (index === -1) {
    selectedListItemsPart1.value.push(value)
    // 选中时设置输入框初始值
    if (listOptionsPart1.value[itemIndex].label.includes('1-1')) {
      listItemInputs.value[itemIndex] = ''
    }
  } else {
    selectedListItemsPart1.value.splice(index, 1)
    // 取消选中时清空输入框
    if (itemIndex !== -1) {
      delete listItemInputs.value[itemIndex]
    }
  }
}
// 输入框值改变时更新列表项值
const updateListItemValue = (index: number, originalValue: string): void => {
  console.log('updateListItemValue 函数被触发，index:', index, 'originalValue:', originalValue)
  console.log('当前 listItemInputs:', listItemInputs.value)
  const inputValue = listItemInputs.value[index] || ''
  console.log(`输入框索引 ${index} 的值为: ${inputValue}`)
  const itemIndex = selectedListItemsPart1.value.indexOf(originalValue)
  if (itemIndex !== -1) {
    if (inputValue) {
      selectedListItemsPart1.value[itemIndex] = `${inputValue} ${originalValue}`
    } else {
      selectedListItemsPart1.value[itemIndex] = originalValue
    }

    // 强制触发响应式更新
    selectedListItemsPart1.value = [...selectedListItemsPart1.value]
  }
}
// 定义切换第二部分列表项选中状态的函数
const toggleListItemSelectionPart2 = (value: string): void => {
  const index = selectedListItemsPart2.value.indexOf(value)
  if (index === -1) {
    selectedListItemsPart2.value.push(value)
  } else {
    selectedListItemsPart2.value.splice(index, 1)
  }
}

// 生成选项列表
const rarityOptions = Object.fromEntries(Object.entries(rarityMap).map(([key]) => [key, `${key}`]))

const qualityOptions = Object.fromEntries(
  Object.entries(qualityMap).map(([key]) => [key, `${key}`])
)

// 计算最终正则表达式
const regexResult = computed(() => {
  const conditions = [
    generateRarityRegex(selectedRarities.value),
    generateQualityRegex(selectedQuality.value),
    generateLevelRegex(minLevel.value, maxLevel.value),
    generateNumericPropertyRegex('def', defense.value, selectedQuality.value), // 传入选中品质
    generateCombinedListItemRegex(
      selectedListItemsPart1.value,
      selectedListItemsPart2.value,
      selectedQuality.value
    ) // 传入选中品质
  ].filter(Boolean)

  return conditions.length > 0 ? conditions.join(' ') : null
})
</script>

<style scoped>
.n-checkbox,
.n-radio {
  margin-bottom: 8px;
}
</style>
