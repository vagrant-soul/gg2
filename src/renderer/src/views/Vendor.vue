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
                  <!-- <n-checkbox-group :value="cities" @update:value="handleUpdateValue">
                    <n-flex item-style="display: flex;" align="center">
                      <n-checkbox value="Beijing" label="北京" />
                      <n-checkbox value="Shanghai" label="上海" />
                      <n-checkbox value="Guangzhou" label="广州" />
                      <n-checkbox value="Shenzen" label="深圳" />
                    </n-flex>
                  </n-checkbox-group> -->
                  <n-checkbox-group :value="selectedRarity" @update:value="handleUpdateRarity">
                    <n-flex item-style="display: flex;" align="center">
                      <n-checkbox value="稀" label="稀有" />
                      <n-checkbox value="魔" label="魔法" />
                      <n-checkbox value="中" label="普通" />
                    </n-flex>
                  </n-checkbox-group>
                </n-form-item-gi>
                <n-form-item-gi :span="8" label="腐化状态:" label-placement="left">
                  <n-radio-group :value="selectedCorrupted" @update:value="handleUpdateCorrupted">
                    <n-flex>
                      <n-radio value="已汙" label="已腐化"></n-radio>
                      <n-radio value="!已汙" label="未腐化"></n-radio>
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
                <n-flex align="center">
                  <n-checkbox v-model:checked="dropchanceEnabled" value=": ">
                    換界石掉落機率大于
                  </n-checkbox>
                  <n-input-number
                    v-model:value="dropchanceValue"
                    placeholder="100"
                    :min="100"
                    :max="700"
                    :step="100"
                    :disabled="!dropchanceEnabled"
                    style="width: 110px"
                  >
                    <template #suffix> % </template>
                  </n-input-number>
                </n-flex>
                <n-checkbox-group :value="selectedgoodMods" @update:value="handleUpdateGoodmods">
                  <n-flex vertical>
                    <n-checkbox value="瘋癲">此區域玩家 #% 瘋癲</n-checkbox>
                    <n-checkbox value="額外">區域含有額外词缀的地图</n-checkbox>
                    <!-- <n-checkbox value="數: 0">復活數: 0(字符串需要加""包裹)</n-checkbox> -->
                  </n-flex>
                </n-checkbox-group>
              </n-form-item-gi>
              <n-checkbox value='"數: 0"' label="復活數: 0"></n-checkbox>
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
import { ref, computed, watch } from 'vue'
// 导入waystone词缀部分数据
import { waystoneRegex, WaystoneRegex } from '@generated/Waystone'
import { useDebounceFn } from '@vueuse/core' // 导入防抖函数
// 导入单据配置文件
// import { rarityConfig } from './waystone/waystoneConfig'

// --------topcard部分的定义开始
// 匹配规则部分
const selectedRule = ref('rule-or') // 设置默认值
//----- 按照模板,后续删除
// const cities = ref<(string | number)[] | null>(null)
// const handleUpdateValue = (value: (string | number)[]): void => {
//   cities.value = value
//   console.log('复选框组选中的数据:', value)
//   console.log('citiesString 的值:', citiesString.value)
// }
// // 计算属性，将 cities 内容转换为字符串
// const citiesString = computed(() => {
//   if (cities.value) {
//     return cities.value.join(',')
//   }
//   return ''
// })

//----- 按照模板测试,后续删除-- 结束

//地图稀有度部分
const selectedRarity = ref<(string | number)[] | null>(null)
// 处理稀有度选择结果
const handleUpdateRarity = (value: (string | number)[]): void => {
  selectedRarity.value = value
  // console.log('复选框组选中的数据:', value)
  // console.log('tigerRegex 的值:', tigerRegex.value)
}
// 计算属性，合并优化地图稀有度字符串
const tigerRegex = computed(() => {
  if (!selectedRarity.value || selectedRarity.value.length === 0) return null

  const types = selectedRarity.value
  if (types.length === 3) return null // 全选返回null

  if (types.length > 1) return `度:(${types.join('|')})`
  return `度:${types[0]}`
})
// console.log('selectedRarity 的值:', rarityResult.value)
// console.log('selectedRarity 的值:', selectedRarity.value) // 输出 selectedRarity 的值
// 地图腐化状态部分
const selectedCorrupted = ref<string | null>(null)
const handleUpdateCorrupted = (value: string): void => {
  selectedCorrupted.value = value
}
// 计算属性，生成腐化状态字符串
const corruptedRegex = computed(() => {
  const map = {
    污染: '污染',
    为污染: '为污染'
  }
  return selectedCorrupted.value ? map[selectedCorrupted.value] : null
})
// 未完待续
const maptiger = ref(false)
const mapLevelRange = ref<[number, number]>([1, 16])
// 其他内容部分
// --掉落几率部分
const dropchanceEnabled = ref(false) // 默认禁用状态
const dropchanceValue = ref(100) // 默认值
const dropchanceRegex = computed(() => {
  if (dropchanceEnabled.value) {
    // 固定字符串，取数字输入框值的首位
    const firstDigit = String(dropchanceValue.value)[0]
    return dropchanceEnabled.value ? `: \\+[${firstDigit}-9]\\d\\d` : null
  }
  return ''
})

// 监听 combinedValue 的变化，将结果打印到控制台  这部分是临时增加的,用于调试,主要是还没想好
// 感觉可能还需要重构,当前的整体逻辑不太对
// 思考的思路是  应该有一个初始的状态管理,然后不同的操作会更改这些状态,最后再根据这些状态生成最终的结果
watch(dropchanceRegex, (newValue) => {
  console.log(newValue)
})

//-- goodmods部分
const selectedgoodMods = ref<(string | number)[]>([])
const handleUpdateGoodmods = (value: (string | number)[]): void => {
  selectedgoodMods.value = value

  // 生成动态字符串
  // const result = value
  //   .map((item) => {
  //     // if (item === '"數: 0"') return item // 已经带引号的值保持不变
  //     return `"${item}"` // 其他值添加引号
  //   })
  //   .join(' ')

  // console.log('选中的其他内容:', selectedgoodMods.value)
}

// 计算属性，生成其他内容字符串部分合并到下面字符串计算里面

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

// 前缀搜索（带防抖）
const prefixSearch = useDebounceFn(() => {
  // 搜索逻辑在 computed 属性中已实现
}, 300)

// 后缀搜索（带防抖）
const suffixSearch = useDebounceFn(() => {
  // 搜索逻辑在 computed 属性中已实现
}, 300)
// --------listcard部分的定义结束
// 汇总结果定义相关部分
const WaystoneResult = computed(() => {
  let leftResult = ''
  let rightResult = ''
  let rarityResult = tigerRegex.value ? `"${tigerRegex.value}"` : ''
  let corruptedResult = corruptedRegex.value
  const goodModsResult = selectedgoodMods.value || []
  const dropchanceResult = dropchanceRegex.value ? `"${dropchanceRegex.value}"` : ''
  if (selectedRule.value === 'rule-and') {
    // 当 selectedRule 为 'rule-and' 时，左侧每个值单独用 "" 包裹
    leftResult = [
      ...leftSelectedRegex.value.map((item) => `"${item}"`),
      ...goodModsResult.map((item) => {
        // if (item === '"數: 0"') return item // 已经带引号的值保持不变
        return `"${item}"` // 其他值添加引号
      }),
      dropchanceResult
    ].join(' ')
    // 右侧值用 | 连接后用 "" 包裹
    const rightRegexStr = rightSelectedRegex.value.join('|')
    rightResult = rightRegexStr ? `"${rightRegexStr}"` : ''
  } else {
    // 其他情况（rule-or），左右两侧值用 | 连接后用 "" 包裹
    const leftRegexStr = [
      ...leftSelectedRegex.value,
      ...goodModsResult.map((item) => {
        // if (item === '"數: 0"') return item.slice(1, -1) // 去掉已有的引号
        return item
      }),
      dropchanceRegex.value
    ].join('|')
    leftResult = leftRegexStr ? `"${leftRegexStr}"` : ''
    const rightRegexStr = rightSelectedRegex.value.join('|')
    rightResult = rightRegexStr ? `"${rightRegexStr}"` : ''
  }

  // 合并左右结果，中间用空格分隔
  return [leftResult, rightResult, rarityResult, corruptedResult].filter(Boolean).join(' ')
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
