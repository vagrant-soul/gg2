import { createWebHashHistory, createRouter } from 'vue-router'

import WayStones from '../views/WayStones.vue'
import Vendor from '../views/Vendor.vue'
import Favorite from '../views/Favorite.vue'
const routes = [
  { path: '/', component: WayStones },
  { path: '/vendor', component: Vendor },
  { path: '/favorite', component: Favorite }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
