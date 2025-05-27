<template>
  <n-layout :native-scrollbar="false">
    <n-flex vertical size="large">
      <Result />
      <TopCard />
      <ListCard />
    </n-flex>
  </n-layout>
</template>
<script setup lang="ts">
import Result from '../components/Result.vue'
import { NLayout, NFlex } from 'naive-ui'
import TopCard from './waystone/TopCard.vue'
import ListCard from './waystone/ListCard.vue'
</script>

<style></style>
