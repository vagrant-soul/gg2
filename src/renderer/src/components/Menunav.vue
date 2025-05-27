<template>
  <n-menu :options="menuOptions" mode="horizontal" style="margin: 0 16px"></n-menu>
</template>

<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import type { Component } from 'vue'
import { LogOutOutline as HomeIcon, LaptopOutline as WorkIcon } from '@vicons/ionicons5'
import { NIcon, NMenu } from 'naive-ui'
import { h } from 'vue'
import { RouterLink } from 'vue-router'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/'
          }
        },
        { default: () => '地图正则' }
      ),
    key: 'waystone',
    icon: renderIcon(HomeIcon)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/vendor'
          }
        },
        { default: () => '商店正则' }
      ),
    key: 'vendor',
    icon: renderIcon(WorkIcon)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/favorite'
          }
        },
        { default: () => '编辑收藏' }
      ),
    key: 'favorite',
    icon: renderIcon(WorkIcon)
  }
]
</script>
