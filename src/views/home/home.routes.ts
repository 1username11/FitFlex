import type { RouteRecordRaw } from 'vue-router'
import Home from './Home.vue'

export const homeViewRouteNames = {
  home: 'home'
}

export const homeViewRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: homeViewRouteNames.home,
    component: Home
  }
]
