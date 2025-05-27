<template>
  <n-layout :native-scrollbar="false">
    <n-flex vertical size="large">
      <!-- Result开始部分 -->
      <n-flex align="start" justify="space-between" style="width: 100%">
        <n-flex vertical size="medium" style="width: 240px">
          <!-- 查询按钮 - 上方单独一行 -->
          <n-button type="primary" block size="large" style="height: 64px; margin-bottom: 8px">
            查询
          </n-button>
          <!-- 重置和收藏按钮 - 下方并列一行 -->
          <n-flex justify="space-between" align="center">
            <n-button type="error" style="flex: 1; margin-right: 8px; height: 40px">
              重置
            </n-button>
            <n-button type="warning" style="flex: 1; height: 40px"> 收藏 </n-button>
          </n-flex>
        </n-flex>
        <n-card hoverable style="flex: 1; height: 120px" embedded> {{ WaystoneResult }} </n-card>
      </n-flex>
      <!-- Result结束部分 -->
      <!-- Topcard开始部分 -->
      <!-- 表单部分 -->
      <n-card>
        <n-form label-placement="left" label-width="auto" :show-feedback="false">
          <n-grid :cols="2" :x-gap="24">
            <n-gi>
              <n-flex vertical align="start">
                <n-form-item-gi :span="8" label="匹配规则:" label-placement="left">
                  <n-radio-group v-model:value="selectedRule">
                    <n-flex>
                      <n-radio value="rule-or">任一匹配</n-radio>
                      <n-radio value="rule-and">完全匹配</n-radio>
                    </n-flex>
                  </n-radio-group>
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="稀 有 度 :" label-placement="left">
                  <n-checkbox-group v-model:value="selectedRarity">
                    <n-flex>
                      <n-checkbox value="普通加班"> 普通 </n-checkbox>
                      <n-checkbox value="魔法加班"> 魔法 </n-checkbox>
                      <n-checkbox value="稀有加班"> 稀有 </n-checkbox>
                    </n-flex>
                  </n-checkbox-group>
                </n-form-item-gi>
                <n-form-item-gi :span="8" label="腐化状态:" label-placement="left">
                  <n-radio-group v-model:value="selectedCorrupted">
                    <n-flex>
                      <n-radio value="corrupted">已腐化</n-radio>
                      <n-radio value="uncorrupted">未腐化</n-radio>
                    </n-flex>
                  </n-radio-group>
                </n-form-item-gi>
                <n-form-item-gi :span="8" label-placement="left">
                  <n-flex align="center">
                    <n-checkbox v-model:checked="maptiger" style="margin-right: 12px"
                      >地图等级</n-checkbox
                    >
                    <!-- 可添加标记,但是不太好看:marks="{ 2: '', 4: '', 6: '', 8: '', 10: '', 12: '', 14: '' }" -->
                    <n-slider
                      v-model:value="mapLevelRange"
                      :min="1"
                      :max="16"
                      :step="1"
                      :disabled="!maptiger"
                      range
                      style="flex: 1; width: 150px"
                    />
                  </n-flex>
                </n-form-item-gi>
              </n-flex>
            </n-gi>
            <n-gi>
              <n-form-item-gi :span="12" label="其他内容" label-placement="top">
                <n-checkbox-group>
                  <n-flex vertical>
                    <n-flex align="center">
                      <n-checkbox value="dropchance">換界石掉落機率大于</n-checkbox>
                      <n-input-number
                        placeholder="100"
                        :min="100"
                        :max="700"
                        :step="100"
                        style="width: 110px"
                      >
                        <template #suffix> % </template>
                      </n-input-number>
                    </n-flex>
                    <n-checkbox value="delirious">此區域玩家 #% 瘋癲</n-checkbox>
                    <n-checkbox value="addpacks">區域含有額外 # 群怪物</n-checkbox>
                    <n-checkbox value="zerogate">时空之门数量:0</n-checkbox>
                  </n-flex>
                </n-checkbox-group>
              </n-form-item-gi>
            </n-gi>
          </n-grid>
        </n-form>
      </n-card>
      <!-- Topcard结束部分 -->
      <!-- ListCard开始部分 -->
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
                      backgroundColor: leftSelectedIndexes.includes(index)
                        ? '#e5f6ff'
                        : 'transparent'
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
                      backgroundColor: rightSelectedIndexes.includes(index)
                        ? '#e5f6ff'
                        : 'transparent'
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
      <!-- ListCard结束部分 -->
    </n-flex>
  </n-layout>
</template>

<script setup lang="ts">
//result部分的导入
import { NCard, NButton, NFlex, NLayout } from 'naive-ui'
//topcard部分的导入
import {
  NGrid,
  NGi,
  NForm,
  NSlider,
  NCheckbox,
  NCheckboxGroup,
  NFormItemGridItem as NFormItemGi,
  NRadioGroup,
  NRadio,
  NInputNumber
} from 'naive-ui'
//listcard部分的导入
import { NScrollbar, NList, NListItem, NInput } from 'naive-ui'
import { ref, computed } from 'vue'
// 导入waystone词缀部分数据
import { waystoneRegex, WaystoneRegex } from '@generated/Waystone'
// --------topcard部分的定义开始
// 匹配规则部分
const selectedRule = ref('rule-or') // 设置默认值
const selectedRarity = ref<string[]>([])
// console.log('selectedRarity 的值:', selectedRarity.value) // 输出 selectedRarity 的值
const selectedCorrupted = ref<string | null>(null)
const maptiger = ref(false)
const mapLevelRange = ref<[number, number]>([1, 16])
// --------topcard部分的定义结束
// --------listcard部分的定义开始
// 封装过滤和转换数据的函数
interface AffixItem {
  name: string
  regex: string
}
const getAffixData = (affixType: string): AffixItem[] => {
  return waystoneRegex
    .filter((item: WaystoneRegex) => item.affix === affixType)
    .map((item: WaystoneRegex) => ({
      name: item.name,
      regex: item.regex
    }))
}

// 左侧数据

const leftList = ref(getAffixData('PREFIX'))
const prefixKeyword = ref('')

// 右侧数据
const rightList = ref(getAffixData('SUFFIX'))
const suffixKeyword = ref('')
// 存储选中项的索引
const leftSelectedIndexes = ref<number[]>([])
const rightSelectedIndexes = ref<number[]>([])
// 存储选中项的描述
const leftSelectedRegex = ref<string[]>([])
const rightSelectedRegex = ref<string[]>([])
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
    leftSelectedRegex.value.splice(indexInSelected, 1)
  } else {
    leftSelectedIndexes.value.push(index)
    leftSelectedRegex.value.push(leftList.value[index].regex)
  }
}

// 切换右侧选择状态的函数
const toggleRightSelection = (index: number): void => {
  const indexInSelected = rightSelectedIndexes.value.indexOf(index)
  if (indexInSelected > -1) {
    rightSelectedIndexes.value.splice(indexInSelected, 1)
    rightSelectedRegex.value.splice(indexInSelected, 1)
  } else {
    rightSelectedIndexes.value.push(index)
    rightSelectedRegex.value.push(rightList.value[index].regex)
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
// --------listcard部分的定义结束
// 汇总结果定义相关部分
const WaystoneResult = computed(() => {
  let leftResult = ''
  let rightResult = ''

  if (selectedRule.value === 'rule-and') {
    // 当 selectedRule 为 'rule-and' 时，左侧每个值单独用 "" 包裹
    leftResult = leftSelectedRegex.value.map((item) => `"${item}"`).join(' ')
    // 右侧值用 | 连接后用 "" 包裹
    const rightRegexStr = rightSelectedRegex.value.join('|')
    rightResult = rightRegexStr ? `"${rightRegexStr}"` : ''
  } else {
    // 其他情况（rule-or），左右两侧值用 | 连接后用 "" 包裹
    const leftRegexStr = leftSelectedRegex.value.join('|')
    leftResult = leftRegexStr ? `"${leftRegexStr}"` : ''
    const rightRegexStr = rightSelectedRegex.value.join('|')
    rightResult = rightRegexStr ? `"${rightRegexStr}"` : ''
  }

  // 合并左右结果，中间用空格分隔
  return [leftResult, rightResult].filter(Boolean).join(' ')
})
</script>
<style scoped>
/* card部分的样式开始 */
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
/* topcard部分的样式开始 */
/* list-card部分的样式开始 */
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
