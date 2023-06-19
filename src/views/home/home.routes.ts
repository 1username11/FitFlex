import type { RouteRecordRaw } from 'vue-router'

export const homeViewRouteNames = {
  home: 'home'
}

export const homeViewRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: homeViewRouteNames.home,
    component: () => import('./Home.vue'),
    meta: {
      requiresAuth: true
    }
  }
]
