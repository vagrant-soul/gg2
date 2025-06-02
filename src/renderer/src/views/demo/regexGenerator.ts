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
 * 生成防御值正则表达式
 * @param propertyName - 属性名，如 'def'
 * @param value - 属性值
 * @param selectedQuality - 选中的品质值
 * @returns 生成的正则字符串
 */
export function generateNumericPropertyRegex(
  propertyName: string,
  value: number,
  selectedQuality: string | null
): string {
  const baseRegex = `${propertyName}:${value}`
  if (selectedQuality === 'Normal') {
    return `normal:${baseRegex}`
  } else if (selectedQuality === 'Superiour') {
    return `q2:${baseRegex}`
  }
  return baseRegex
}

/**
 * 生成组合列表项正则表达式
 * @param selectedItemsPart1 - 第一部分选中的列表项值数组
 * @param selectedItemsPart2 - 第二部分选中的列表项值数组
 * @param selectedQuality - 选中的品质值
 * @returns 生成的正则字符串，若两个数组都为空则返回 null
 */
export function generateCombinedListItemRegex(
  selectedItemsPart1: string[],
  selectedItemsPart2: string[],
  selectedQuality: string | null
): string | null {
  let part1Regex = ''
  if (selectedItemsPart1.length > 0) {
    if (selectedQuality === 'Normal') {
      part1Regex = `normal:(${selectedItemsPart1.join('|')})`
    } else if (selectedQuality === 'Superiour') {
      part1Regex = `q2:(${selectedItemsPart1.join('|')})`
    } else {
      // part1Regex = `(${selectedItemsPart1.join('|')})`
      part1Regex = `(?:${selectedItemsPart1.map((item) => escapeRegExp(item)).join('|')})`
    }
  }

  const part2Regex = selectedItemsPart2.length > 0 ? `(${selectedItemsPart2.join('|')})` : ''

  const allRegexParts = [part1Regex, part2Regex].filter(Boolean)

  return allRegexParts.length > 0 ? allRegexParts.join('|') : null
}
/**
 * 转义正则表达式特殊字符
 * @param str - 要转义的字符串
 * @returns 转义后的字符串
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
