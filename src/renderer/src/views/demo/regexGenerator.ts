// src/utils/regexGenerator.ts
import { rarityMap, qualityMap } from './rarityMap'

/**
 * 生成稀有度正则表达式
 * @param selectedRarities - 选中的稀有度数组
 * @returns 生成的正则字符串，若无选中项则返回null
 */
export function generateRarityRegex(selectedRarities: string[]): string | null {
  if (selectedRarities.length === 0) return null

  const regexParts = selectedRarities.map((rarity) => rarityMap[rarity]).filter(Boolean)

  return regexParts.length > 0 ? `"y: (${regexParts.join('|')})"` : null
}

/**
 * 生成品质正则表达式
 * @param selectedQuality - 选中的品质
 * @returns 生成的正则字符串，若无选中则返回null
 */
export function generateQualityRegex(selectedQuality: string | null): string | null {
  if (!selectedQuality) return null
  return `"q: ${qualityMap[selectedQuality]}"`
}

/**
 * 生成等级范围正则表达式
 * @param minLevel - 最小等级
 * @param maxLevel - 最大等级
 * @returns 生成的正则字符串，若范围无效则返回null
 */
export function generateLevelRegex(minLevel: number, maxLevel: number): string | null {
  if (minLevel <= 0 || maxLevel <= 0 || minLevel > maxLevel) return null

  return minLevel === maxLevel ? `"ilvl: ${minLevel}"` : `"ilvl: [${minLevel}-${maxLevel}]"`
}

/**
 * 生成数值属性正则表达式
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
