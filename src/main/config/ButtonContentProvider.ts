// 定义按钮内容数据，明确类型
export interface ButtonContent {
  name: string
  value: string
}
// 定义按钮内容数据，改为 JSON 格式
export interface ButtonData {
  waystoneContents: ButtonContent[]
  tableContents: ButtonContent[]
  vendorContents: ButtonContent[]
  relicContents: ButtonContent[]
}

// 修改导出内容
export const buttonContents: ButtonData = {
  waystoneContents: [
    { name: '地图1内容', value: '1数值' },
    { name: '地图2内容', value: '2数值' },
    { name: '地图3内容', value: '3数值' },
    { name: '地图4内容', value: '4数值' },
    { name: '地图19内容', value: '19数值' },
    { name: '地图20内容', value: '20数值' }
  ],
  tableContents: [
    { name: '石碑1内容', value: '1数值' },
    { name: '石碑2内容', value: '2数值' },
    { name: '石碑3内容', value: '3数值' },
    { name: '石碑4内容', value: '4数值' },
    { name: '石碑19内容', value: '19数值' },
    { name: '石碑20内容', value: '20数值' }
  ],
  vendorContents: [
    { name: '商店1内容', value: '1数值' },
    { name: '商店2内容', value: '2数值' },
    { name: '商店3内容', value: '3数值' },
    { name: '商店4内容', value: '4数值' },
    { name: '商店19内容', value: '19数值' },
    { name: '商店20内容', value: '20数值' }
  ],
  relicContents: [
    { name: '圣物1内容', value: '1数值' },
    { name: '圣物2内容', value: '2数值' },
    { name: '圣物3内容', value: '3数值' },
    { name: '圣物4内容', value: '4数值' },
    { name: '圣物19内容', value: '19数值' },
    { name: '圣物20内容', value: '20数值' }
  ]
}
