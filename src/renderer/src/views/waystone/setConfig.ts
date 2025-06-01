// src/utils/rarityMap.ts
export interface RarityMap {
  [key: string]: string
}

export interface selectedRule {
  [key: string]: string
}
export interface CorrType {
  [key: string]: string
}

export const selectedRule: selectedRule = {
  任一匹配: 'rule-or',
  完全匹配: 'rule-and'
}

export const rarityMap: RarityMap = {
  稀有: '稀',
  魔法: '魔',
  普通: '中'
}

export const corrType: CorrType = {
  腐化: '已汙',
  未腐化: '!已汙'
}
