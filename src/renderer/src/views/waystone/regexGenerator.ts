// src/utils/regexGenerator.ts
import { rarityMap, selectedRule, corrType } from './setConfig'

/**
 * 用于选择正则表达式
 * @param selectedRe - 选中的生成正则的方式
 * @returns 用于选择生成正则的表达方式，若无选中则返回null
 * 这个值用于后续判定,不展示结果
 */
export function generateTypeRegex(selectedRe: string | null): string | null {
  if (!selectedRe) return null
  return `"规则: ${selectedRule[selectedRe]}"`
}
/**
 * 生成稀有度
 * @param selectedRarities - 选中的稀有度数组
 * @returns 生成的正则字符串，若无选中项则返回null
 * 多个选项时，返回的是"度: (n|m|r|u)"的形式，单个选项时，返回的是"度: n|m|r|u"的形式
 */
export function generateRarityRegex(selectedRarities: string[]): string | null {
  if (selectedRarities.length === 0 || selectedRarities.length === 3) return null

  const regexParts = selectedRarities.map((rarity) => rarityMap[rarity]).filter(Boolean)
  if (regexParts.length > 1) return `"度: (${regexParts.join('|')})"`
  return `"度: ${regexParts.join('|')}"`
}

/**
 * 生成地图腐化选项
 * @param selectedCorr - 选中的生成正则的方式
 * @returns 用于选择生成正则的表达方式，若无选中则返回null
 * 这个值用于后续判定,不展示结果
 */
export function generateCorruptedRegex(selectedCorr: string | null): string | null {
  if (!selectedCorr) return null
  return `"${corrType[selectedCorr]}"`
}

/**
 * 生成等级范围正则表达式
 * @param minLevel - 最小等级
 * @param maxLevel - 最大等级
 * @returns 生成的正则字符串，若范围无效则返回null
 */
export function generateLevelRegex(minLevel: number, maxLevel: number): string | null {
  if ((minLevel <= 1 && maxLevel === 16) || minLevel > maxLevel) return null

  const regexParts: string[] = []

  // 处理 2 - 9 范围
  if (minLevel <= 9 && maxLevel >= 2) {
    const start = Math.max(minLevel, 2)
    const end = Math.min(maxLevel, 9)
    if (start <= end) {
      regexParts.push(`[${start}-${end}](?!\\d)`)
    }
  }

  // 处理 10 - 16 范围
  if (minLevel <= 16 && maxLevel >= 10) {
    const start = Math.max(minLevel, 10) - 10
    const end = Math.min(maxLevel, 16) - 10
    if (start <= end) {
      regexParts.push(`1[${start}-${end}]`)
    }
  }

  if (regexParts.length === 0) return null

  return `"級: (?:${regexParts.join('|')})"`
}

/**
 * 临时代码,无用可删除部分
 * @param property - 属性名称
 * @param value - 属性值
 * @returns 生成的正则字符串
 */
export function generateNumericPropertyRegex(
  property: string,
  value: number | null
): string | null {
  if (value === null || isNaN(value)) return null
  return `"${property}: ${value}"`
}
