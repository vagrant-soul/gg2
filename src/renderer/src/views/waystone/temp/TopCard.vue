<template>
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
</template>
<script setup lang="ts">
import {
  NGrid,
  NGi,
  NCard,
  NForm,
  NSlider,
  NFlex,
  NCheckbox,
  NCheckboxGroup,
  NFormItemGridItem as NFormItemGi,
  NRadioGroup,
  NRadio,
  NInputNumber
} from 'naive-ui'
import { ref } from 'vue'
// 匹配规则部分
const selectedRule = ref('rule-or') // 设置默认值
const selectedRarity = ref<string[]>([])
// console.log('selectedRarity 的值:', selectedRarity.value) // 输出 selectedRarity 的值
const selectedCorrupted = ref<string | null>(null)
const maptiger = ref(false)
const mapLevelRange = ref<[number, number]>([1, 16])
</script>
