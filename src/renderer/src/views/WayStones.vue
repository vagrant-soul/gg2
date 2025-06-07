<template>
  <n-layout>
    <n-layout-header
      ><!-- Result开始部分 -->
      <n-flex align="start" justify="space-between" style="width: 100%">
        <n-flex vertical size="medium" style="width: 240px">
          <!-- 查询按钮 - 上方单独一行 -->
          <n-button
            type="primary"
            block
            size="large"
            strong
            style="height: 45px; margin-bottom: 8px"
            @click="ipcHandle"
          >
            <template #icon>
              <n-icon>
                <Search />
              </n-icon>
            </template>
            搜索
          </n-button>
          <!-- 重置和收藏按钮 - 下方并列一行 -->
          <n-flex justify="space-between" align="center">
            <n-button
              type="error"
              style="flex: 1; margin-right: 8px; height: 30px"
              @click="resetState"
            >
              重置
            </n-button>
            <n-button type="warning" style="flex: 1; height: 30px" @click="copyRegex">
              复制
            </n-button>
          </n-flex>
        </n-flex>

        <n-card hoverable style="flex: 1; height: 90px" embedded>
          {{ waystoneRegex }}
          <!-- 显示字符数区域 -->
          <div
            :style="{
              color: waystoneRegex.length > 50 ? 'red' : 'inherit',
              position: 'absolute',
              right: '10px',
              bottom: '10px'
            }"
          >
            当前字符数: {{ waystoneRegex.length }}/50
          </div>
        </n-card>
      </n-flex>
      <!-- Result结束部分 -->
    </n-layout-header>
    <n-layout-content style="margin-top: 20px" :native-scrollbar="false">
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
            <n-flex align="center">
              <n-checkbox v-model:checked="isDelirious" value="瘋癲">此區域玩家 #% 瘋癲</n-checkbox>
              <!-- 暂时无法确定范围,先不做 -->
              <!-- <n-input-number
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
              </n-input-number> -->
            </n-flex>
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
            <n-flex align="center">
              <n-checkbox v-model:checked="isMonsterPacks" value="額外"
                >區域含有 額外 词缀的地图</n-checkbox
              >
            </n-flex>
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
            <!-- 下面是临时显示范围数据 -->
            <!-- <div class="mt-2 text-sm text-gray-500">当前值: {{ defense }}</div> -->
          </n-grid-item>
          <n-grid-item>
            <n-flex align="center">
              <n-checkbox v-model:checked="zeroRome" value='"數: 0"'>復活數是0的地图</n-checkbox>
            </n-flex>
          </n-grid-item>
        </n-grid>
      </n-card>
      <!-- 选项部分结束 -->
      <!-- 列表部分 -->
      <n-card>
        <n-grid :cols="2" :x-gap="20" style="height: 100%">
          <!-- 前缀左侧部分 -->
          <n-gi>
            <n-input
              v-model:value="prefixKeyword"
              clearable
              placeholder="输入前缀内容"
              style="margin-bottom: 16px"
              @input="prefixSearch"
            />
            <n-scrollbar style="max-height: 400px">
              <div class="list-container">
                <div
                  v-for="(item, index) in prefixList"
                  :key="index"
                  class="list-item"
                  :class="{ selected: item.selected }"
                  @click="handleItemClick(item, 'PREFIX')"
                >
                  <n-flex align="center" style="flex-wrap: nowrap; width: 100%">
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
                      @update:value="handleItemInputChange(item, 'PREFIX')"
                      @click.stop
                    />
                    <n-ellipsis style="flex: 1; min-width: 0">
                      <span class="text-content">{{ formatItemName(item) }}</span></n-ellipsis
                    >
                  </n-flex>
                </div>
              </div>
            </n-scrollbar>
          </n-gi>
          <!-- 后缀右侧部分 -->
          <n-gi
            ><n-input
              v-model:value="suffixKeyword"
              clearable
              placeholder="输入后缀内容"
              style="margin-bottom: 16px"
              @input="suffixSearch"
            />
            <n-scrollbar style="max-height: 400px">
              <div class="list-container">
                <div
                  v-for="(item, index) in suffixList"
                  :key="index"
                  class="list-item"
                  :class="{ selected: item.selected }"
                  @click="handleItemClick(item, 'SUFFIX')"
                >
                  <n-flex align="center" style="flex-wrap: nowrap; width: 100%">
                    <n-input
                      v-if="
                        item.name.startsWith('##%') &&
                        item.ranges.length > 0 &&
                        item.ranges[0][0] > 0
                      "
                      v-model:value="item.inputValue"
                      clearable
                      style="width: 95px; margin-right: 2px"
                      :placeholder="`${item.ranges[0][0]}-${item.ranges[0][1]}`"
                      @update:value="handleItemInputChange(item, 'SUFFIX')"
                      @click.stop
                    />
                    <n-ellipsis style="flex: 1; min-width: 0">
                      <span class="text-content">
                        {{ formatItemName(item) }}
                      </span>
                    </n-ellipsis>
                  </n-flex>
                </div>
              </div>
            </n-scrollbar></n-gi
          >
        </n-grid>
        <!-- 下面这部分是用来临时展示结果的 -->
        <!-- <div class="result-container">
          <n-input v-model:value="resultText" placeholder="结果展示区域" />
        </div> -->
      </n-card>
    </n-layout-content>
  </n-layout>
</template>
<script setup lang="ts">
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NGrid,
  NGridItem,
  NScrollbar,
  NGi,
  NIcon
} from 'naive-ui'
import { Search } from '@vicons/ionicons5'
import { ref, computed, type Ref } from 'vue'
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
  NInput,
  NEllipsis
} from 'naive-ui'
import { useClipboard } from '@vueuse/core'
// 导入选项部分数据映射标
import { rarityMap, selectedRule, corrType } from './waystone/setConfig'
// 导入正则表达式生成函数
import {
  generateRarityRegex,
  generateTypeRegex,
  generateLevelRegex,
  generateCorruptedRegex,
  generateProbabilityRegex
} from './waystone/regexGenerator'
import { useDebounceFn } from '@vueuse/core'
import * as OpenCC from 'opencc-js'
// 初始化 OpenCC 实例，设置从简体转换为台湾繁体
const converter = OpenCC.Converter({ from: 'cn', to: 'tw' })

// 与主窗口通信  查询按钮的相关操作
const ipcHandle = async (): Promise<void> => {
  try {
    // 先执行 copyRegex 函数
    await copyRegex()
    // 发送 ping 消息
    window.electron.ipcRenderer.send('ping')
    console.log('ping 消息已发送')
  } catch (error) {
    console.error('执行 ipcHandle 出错:', error)
  }
}

// 列表部分数据和逻辑开始
import { waystoneRegexList, WaystoneRegexList } from '../generated/Waystone'
import { generateNumberRegex } from '../lib/GenerateNumberRegex'
// 定义通用列表项接口
interface ListItem extends WaystoneRegexList {
  selected: boolean
  inputValue: string
}

// 定义通用列表数据获取函数
const getAffixList = (affixType: string): ListItem[] => {
  return waystoneRegexList
    .filter((item) => item.affix === affixType)
    .map((item) => ({
      ...item,
      selected: false,
      inputValue: '',
      text: item.name
    }))
}
// 添加格式化名称的函数
const formatItemName = (item: ListItem): string => {
  if (item.name.startsWith('##%') && item.ranges.length > 0 && item.ranges[0][0] > 0) {
    return item.name.replace(/##/, '')
  }
  return item.name.replace(/##/g, '#')
}
// 前缀部分
const prefixKeyword = ref('')
const prefixList = ref<ListItem[]>(getAffixList('PREFIX'))

// 后缀部分
const suffixKeyword = ref('')
const suffixList = ref<ListItem[]>(getAffixList('SUFFIX'))

// 在组件顶部添加一个全局变量来存储所有选中项
const globalSelectedItems = ref<Record<string, ListItem>>({})
// 通用搜索函数
const createSearchHandler = (
  listRef: Ref<ListItem[]>,
  affixType: string
): ((value: string) => void) => {
  return useDebounceFn((value: string) => {
    // 更新全局选中状态
    listRef.value.forEach((item) => {
      if (item.selected) {
        globalSelectedItems.value[`${affixType}-${item.name}`] = { ...item }
      }
    })

    if (!value.trim()) {
      // 清空搜索时，恢复完整列表但保留选中状态
      const newList = getAffixList(affixType)
      newList.forEach((item) => {
        const key = `${affixType}-${item.name}`
        if (globalSelectedItems.value[key]) {
          item.selected = globalSelectedItems.value[key].selected
          item.inputValue = globalSelectedItems.value[key].inputValue
        }
      })
      listRef.value = newList
    } else {
      // 有搜索词时，过滤列表
      const keyword = value.toLowerCase()
      listRef.value = waystoneRegexList
        .filter((item) => item.affix === affixType && item.name.toLowerCase().includes(keyword))
        .map((item) => ({
          ...item,
          selected: false,
          inputValue: '',
          text: item.name
        }))
    }

    // 恢复选中状态（无论是否清空搜索）
    listRef.value.forEach((item) => {
      const key = `${affixType}-${item.name}`
      if (globalSelectedItems.value[key]) {
        item.selected = globalSelectedItems.value[key].selected
        item.inputValue = globalSelectedItems.value[key].inputValue
      }
    })
  }, 300)
}

// 绑定搜索函数
const prefixSearch = async (value: string): Promise<void> => {
  const convertedValue = await converter(value) // 转换为繁体
  createSearchHandler(prefixList, 'PREFIX')(convertedValue)
}
const suffixSearch = async (value: string): Promise<void> => {
  const convertedValue = await converter(value) // 转换为繁体
  createSearchHandler(suffixList, 'SUFFIX')(convertedValue)
}

// const resultText = ref('') // 用于显示结果的文本,测试代码

// 通用点击处理
const handleItemClick = (item: ListItem, affixType: string): void => {
  item.selected = !item.selected
  const key = `${affixType}-${item.name}`
  if (item.selected) {
    globalSelectedItems.value[key] = { ...item }
  } else {
    delete globalSelectedItems.value[key]
  }
}

// 通用输入处理
const handleItemInputChange = (item: ListItem, affixType: string): void => {
  item.inputValue = item.inputValue.trim()
  if (item.inputValue) {
    item.selected = true
    const key = `${affixType}-${item.name}`
    globalSelectedItems.value[key] = { ...item }
  } else {
    item.selected = false
    const key = `${affixType}-${item.name}`
    delete globalSelectedItems.value[key]
  }
}

// 结果文本更新 测试代码
// const updateResultText = (): void => {
//   const allSelectedItems = [...prefixList.value, ...suffixList.value].filter(
//     (item) => item.selected
//   )
//   resultText.value = allSelectedItems
//     .map((item) => {
//       if (item.inputValue) {
//         const regexStr = generateNumberRegex(item.inputValue, true, false)
//         return `${regexStr}.*${item.regex}`
//       }
//       return item.regex
//     })
//     .join(', ')
// }
// 列表部分数据和逻辑结束
// 状态管理
const selectedRarities = ref<string[]>([])
// 从 selectedRule 中获取 rule-or 对应的键作为默认值
const defaultRuleKey =
  Object.keys(selectedRule).find((key) => selectedRule[key] === 'rule-or') || '任一匹配'
const selectedRe = ref(defaultRuleKey) // 正则类型开关
const selectedCorr = ref<string | null>(null) //腐化地图开关
const maptiger = ref(false) // 地图等级开关
const defense = ref<[number, number]>([1, 16]) // 地图等级范围
const probability = ref(false) // 換界石掉落機率开关
const probabilityValue = ref<number>(200) // 默认換界石掉落機率值
const isDelirious = ref(false) // 瘋癲开关
const isMonsterPacks = ref(false) // 額外怪物开关
const zeroRome = ref(false) // 復活數是0的地图开关

// 定义重置函数
const resetState = (): void => {
  selectedRarities.value = []
  selectedRe.value = defaultRuleKey
  selectedCorr.value = null
  maptiger.value = false
  defense.value = [1, 16]
  probability.value = false
  isDelirious.value = false
  isMonsterPacks.value = false
  zeroRome.value = false
  probabilityValue.value = 200
  globalSelectedItems.value = {}
  prefixList.value = getAffixList('PREFIX')
  suffixList.value = getAffixList('SUFFIX')
  // resultText.value = '' // 清空结果文本  测试代码
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
  Object.entries(selectedRule).map(([key]) => [key, `${key}`])
)

const selectedCorrOptions = Object.fromEntries(
  Object.entries(corrType).map(([key]) => [key, `${key}`])
)
// 计算最终正则表达式
const waystoneRegex = computed(() => {
  // 获取规则类型
  const ruleType = generateTypeRegex(selectedRe.value)

  // 从全局选中状态获取所有选中项，而不是从当前显示的列表中获取
  const selectedPrefixes = Object.entries(globalSelectedItems.value)
    .filter(([key]) => key.startsWith('PREFIX-'))
    .map(([, item]) =>
      item.inputValue
        ? `${generateNumberRegex(item.inputValue, true, false)}.*${item.regex}`
        : item.regex
    )

  const selectedSuffixes = Object.entries(globalSelectedItems.value)
    .filter(([key]) => key.startsWith('SUFFIX-'))
    .map(([, item]) =>
      item.inputValue
        ? `${generateNumberRegex(item.inputValue, true, false)}.*${item.regex}`
        : item.regex
    )

  // 获取概率、疯癫和额外怪物条件
  const probabilityRegex = generateProbabilityRegex(probability.value, probabilityValue.value)
  const specialConditions = [
    probabilityRegex,
    isDelirious.value ? '瘋癲' : null,
    isMonsterPacks.value ? '額外' : null
  ].filter(Boolean)

  // 处理后缀部分 - 始终用 | 连接并用引号包裹
  const suffixPart = selectedSuffixes.length > 0 ? `"${selectedSuffixes.join('|')}"` : null

  // 根据规则类型处理前缀部分
  if (ruleType === 'rule-or') {
    // OR规则：特殊条件和选中前缀用|连接，并用引号包裹
    const orConditions = [...specialConditions, ...selectedPrefixes].filter(Boolean)
    const orPart = orConditions.length > 0 ? `"${orConditions.join('|')}"` : null

    const andConditions = [
      generateRarityRegex(selectedRarities.value),
      generateLevelRegex(defense.value[0], defense.value[1]),
      generateCorruptedRegex(selectedCorr.value),
      zeroRome.value ? '"數: 0"' : null,
      orPart,
      suffixPart
    ].filter(Boolean)

    return andConditions.join(' ')
  } else {
    // AND规则：每个条件单独用引号包裹，用空格连接
    const andConditions = [
      generateRarityRegex(selectedRarities.value),
      generateLevelRegex(defense.value[0], defense.value[1]),
      generateCorruptedRegex(selectedCorr.value),
      zeroRome.value ? '"數: 0"' : null,
      ...specialConditions.map((c) => `"${c}"`),
      ...selectedPrefixes.map((a) => `"${a}"`),
      suffixPart
    ].filter(Boolean)

    return andConditions.join(' ')
  }
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
  margin-bottom: 10px;
}

.list-item {
  padding: 2px;
  margin: 4px 0;
  /* border: 1px solid #e5e7eb; */
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.list-item.selected {
  background-color: #2c3e50;
  border-color: #34495e;
}

.text-content {
  margin-right: 16px;
}

.result-container {
  margin-top: 20px;
}
</style>
