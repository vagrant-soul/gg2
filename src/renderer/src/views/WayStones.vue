<template>
  <n-layout>
    <n-layout-header
      ><!-- Result开始部分 -->
      <n-flex align="start" justify="space-between" style="width: 100%">
        <n-flex vertical size="medium" style="width: 240px">
          <!-- 查询按钮 - 上方单独一行 -->
          <n-button type="primary" block size="large" style="height: 64px; margin-bottom: 8px">
            查询
          </n-button>
          <!-- 重置和收藏按钮 - 下方并列一行 -->
          <n-flex justify="space-between" align="center">
            <n-button
              type="error"
              style="flex: 1; margin-right: 8px; height: 40px"
              @click="resetState"
            >
              重置
            </n-button>
            <n-button type="warning" style="flex: 1; height: 40px" @click="copyRegex">
              复制
            </n-button>
          </n-flex>
        </n-flex>
        <n-card hoverable style="flex: 1; height: 120px" embedded> {{ waystoneRegex }} </n-card>
      </n-flex>
      <!-- Result结束部分 -->
    </n-layout-header>
    <n-layout-content style="margin-top: 20px">
      <!-- 选项部分 -->
      <n-card>
        <n-grid :x-gap="12" :y-gap="8" :cols="2">
          <n-grid-item>
            匹配规则:
            <n-radio-group v-model:value="selectedRe">
              <n-radio v-for="(label, key) in selectedRuleOptions" :key="key" :value="key">
                {{ label }}
              </n-radio>
            </n-radio-group>
          </n-grid-item>
          <n-grid-item>
            <n-flex align="center">
              <n-checkbox v-model:checked="probability" value=": ">換界石掉落機率大于 </n-checkbox>
              <n-input-number
                v-model:value="probabilityValue"
                clearable
                placeholder="200"
                :min="100"
                :max="700"
                :step="100"
                :disabled="!probability"
                style="width: 130px"
                button-placement="both"
              >
                <template #suffix> % </template>
              </n-input-number>
            </n-flex>
          </n-grid-item>
          <n-grid-item>
            <n-flex align="center">
              稀有度:
              <n-checkbox-group v-model:value="selectedRarities">
                <n-checkbox v-for="(label, key) in rarityOptions" :key="key" :value="key">
                  {{ label }}
                </n-checkbox>
              </n-checkbox-group>
            </n-flex>
          </n-grid-item>
          <n-grid-item>
            <div class="light-green">右2</div>
          </n-grid-item>
          <n-grid-item>
            腐化状态:
            <n-radio-group v-model:value="selectedCorr">
              <n-radio v-for="(label, key) in selectedCorrOptions" :key="key" :value="key">
                {{ label }}
              </n-radio>
            </n-radio-group>
          </n-grid-item>
          <n-grid-item>
            <div class="light-green">右3</div>
          </n-grid-item>
          <n-grid-item>
            <n-flex align="center">
              <n-checkbox v-model:checked="maptiger">地图等级</n-checkbox>
              <n-slider
                v-model:value="defense"
                :min="1"
                :max="16"
                :step="1"
                range
                :marks="{ 4: '4', 8: '8', 12: '12' }"
                :disabled="!maptiger"
                placement="bottom"
                style="flex: 1; min-width: 150px"
              />
            </n-flex>
            <div class="mt-2 text-sm text-gray-500">当前值: {{ defense }}</div>
          </n-grid-item>
          <n-grid-item>
            <div class="light-green">右4</div>
          </n-grid-item>
        </n-grid>
      </n-card>
      <!-- 选项部分结束 -->
      <!-- 列表部分 -->
      <n-card title="Vue Naive UI 案例">
        <n-grid :cols="2" :x-gap="20" style="height: 100%">
          <!-- 前缀左侧部分 -->
          <n-gi>
            <n-scrollbar style="max-height: 400px">
              <div class="list-container">
                <div
                  v-for="(item, index) in list"
                  :key="index"
                  class="list-item"
                  :class="{ selected: item.selected }"
                  @click="handleTextClick(item)"
                >
                  <n-flex align="center">
                    <n-input
                      v-if="
                        item.name.startsWith('##%') &&
                        item.ranges.length > 0 &&
                        item.ranges[0][0] > 0
                      "
                      v-model:value="item.inputValue"
                      clearable
                      style="width: 90px; margin-right: 2px"
                      :placeholder="`${item.ranges[0][0]}-${item.ranges[0][1]}`"
                      @update:value="handleInputChange(item)"
                      @click.stop
                    />
                    <span class="text-content">{{
                      item.name.startsWith('##%') && item.ranges.length > 0 && item.ranges[0][0] > 0
                        ? item.name.replace(/##/, '')
                        : item.name.replace(/##/g, '#')
                    }}</span>
                  </n-flex>
                </div>
              </div>
            </n-scrollbar>
          </n-gi>
          <!-- 后缀右侧部分 -->
          <n-gi> 内容待添加 </n-gi>
        </n-grid>
        <div class="result-container">
          <n-input v-model:value="resultText" placeholder="结果展示区域" />
        </div>
      </n-card>
    </n-layout-content>
  </n-layout>
</template>
<script setup lang="ts">
import { NLayout, NLayoutHeader, NLayoutContent, NGrid, NGridItem, NScrollbar, NGi } from 'naive-ui'
import { ref, computed } from 'vue'
//result部分的导入
import { NCard, NButton, NFlex } from 'naive-ui'
//主要内容部分的导入
import {
  NCheckbox,
  NCheckboxGroup,
  NRadioGroup,
  NRadio,
  NSlider,
  NInputNumber,
  NInput
} from 'naive-ui'
import { useClipboard } from '@vueuse/core'
// 导入选项部分数据映射标
import { rarityMap, selectedRule, corrType } from './waystone/setConfig'
// 导入正则表达式生成函数
import {
  generateRarityRegex,
  generateTypeRegex, //稍后使用,暂时报错
  generateLevelRegex,
  generateCorruptedRegex
} from './waystone/regexGenerator'
// 列表部分数据和逻辑开始
import { waystoneRegexList, WaystoneRegexList } from '../generated/Waystone'
import { generateNumberRegex } from '../lib/GenerateNumberRegex'
interface ListItem extends WaystoneRegexList {
  selected: boolean
  inputValue: string
}
// 这部分是前缀部分,后面调试完毕后应该需要改名字
const list = ref<ListItem[]>(
  waystoneRegexList
    .filter((item) => item.affix === 'PREFIX') // 只筛选PREFIX类型
    .map((item) => ({
      ...item,
      selected: false,
      inputValue: '',
      text: item.name
    }))
)

const resultText = ref('')

// 修改 handleTextClick 方法
const handleTextClick = (item: ListItem): void => {
  item.selected = !item.selected
  updateResultText()
}

// 修改 handleInputChange 方法
const handleInputChange = (item: ListItem): void => {
  item.inputValue = item.inputValue.trim()
  if (item.inputValue) {
    item.selected = true // 当有输入值时设为选中状态
  }
  updateResultText()
}

// 修改 updateResultText 方法
const updateResultText = (): void => {
  const selectedItems = list.value.filter((item) => item.selected)
  resultText.value = selectedItems
    .map((item) => {
      if (item.inputValue) {
        const regexStr = generateNumberRegex(item.inputValue, true, false)
        return `${regexStr}.*${item.regex}`
      }
      return item.regex
    })
    .join(', ')
}
// 列表部分数据和逻辑结束
// 状态管理
const selectedRarities = ref<string[]>([])
// 从 selectedRule 中获取 rule-or 对应的键作为默认值
const defaultRuleKey =
  Object.keys(selectedRule).find((key) => selectedRule[key] === 'rule-or') || '任一匹配'
const selectedRe = ref(defaultRuleKey)
const selectedCorr = ref<string | null>(null)

const maptiger = ref(false) // 地图等级开关
const defense = ref<[number, number]>([1, 16]) // 地图等级范围
const probability = ref(false) // 換界石掉落機率开关
const probabilityValue = ref<number>(200) // 默认換界石掉落機率值

// 定义重置函数
const resetState = (): void => {
  selectedRarities.value = []
  selectedRe.value = defaultRuleKey
  selectedCorr.value = null
  maptiger.value = false
  defense.value = [1, 16]
  probability.value = false
  probabilityValue.value = 200
}
const { copy } = useClipboard()

// 定义复制函数
const copyRegex: () => Promise<void> = async () => {
  const regexText = waystoneRegex.value
  if (regexText) {
    try {
      await copy(regexText)
      console.log('正则表达式已复制到剪贴板')
    } catch (err) {
      console.error('复制失败:', err)
    }
  }
}

// 生成选项列表
const rarityOptions = Object.fromEntries(
  // Object.entries(rarityMap).map(([key, value]) => [key, `${key} (${value})`])
  Object.entries(rarityMap).map(([key]) => [key, `${key}`])
)

const selectedRuleOptions = Object.fromEntries(
  // Object.entries(qualityMap).map(([key, value]) => [key, `${key} (${value})`])
  Object.entries(selectedRule).map(([key]) => [key, `${key}`])
)

const selectedCorrOptions = Object.fromEntries(
  // Object.entries(qualityMap).map(([key, value]) => [key, `${key} (${value})`])
  Object.entries(corrType).map(([key]) => [key, `${key}`])
)
// 计算最终正则表达式
const waystoneRegex = computed(() => {
  const conditions = [
    generateRarityRegex(selectedRarities.value),
    // generateTypeRegex(selectedRe.value), //调试的时候可以打开 显示选择的规则
    generateLevelRegex(defense.value[0], defense.value[1]),
    generateCorruptedRegex(selectedCorr.value)
  ].filter(Boolean)

  return conditions.length > 0 ? conditions.join(' ') : null
})
</script>

<style>
.light-green {
  background-color: rgba(0, 128, 0, 0.12);
}
.green {
  background-color: rgba(0, 128, 0, 0.24);
}
.list-container {
  margin-bottom: 20px;
}

.list-item {
  padding: 12px;
  margin: 8px 0;
  /* border: 1px solid #e5e7eb; */
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
