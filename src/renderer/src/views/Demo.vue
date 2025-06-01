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
  NSpace
} from 'naive-ui'
import {
  generateRarityRegex,
  generateQualityRegex,
  generateLevelRegex,
  generateNumericPropertyRegex
} from './demo/regexGenerator'
import { rarityMap, qualityMap } from './demo/rarityMap'

// 状态管理
const selectedRarities = ref<string[]>([])
const selectedQuality = ref<string | null>(null)
const minLevel = ref(1)
const maxLevel = ref(100)
const defense = ref(500)

// 生成选项列表
const rarityOptions = Object.fromEntries(
  // Object.entries(rarityMap).map(([key, value]) => [key, `${key} (${value})`])
  Object.entries(rarityMap).map(([key]) => [key, `${key}`])
)

const qualityOptions = Object.fromEntries(
  // Object.entries(qualityMap).map(([key, value]) => [key, `${key} (${value})`])
  Object.entries(qualityMap).map(([key]) => [key, `${key}`])
)

// 计算最终正则表达式
const regexResult = computed(() => {
  const conditions = [
    generateRarityRegex(selectedRarities.value),
    generateQualityRegex(selectedQuality.value),
    generateLevelRegex(minLevel.value, maxLevel.value),
    generateNumericPropertyRegex('def', defense.value)
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
