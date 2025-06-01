// src/utils/rarityMap.ts
export interface RarityMap {
  [key: string]: string
}

export interface QualityMap {
  [key: string]: string
}

export const rarityMap: RarityMap = {
  Normal: 'n',
  Magic: 'm',
  Rare: 'r',
  Unique: 'u'
}

export const qualityMap: QualityMap = {
  Normal: 'q1',
  Superiour: 'q2',
  Exceptional: 'q3',
  Elite: 'q4'
}
