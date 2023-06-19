import type { RouteRecordRaw } from 'vue-router'

export const profileRouteNames = {
  profile: 'profile'
}

export const profileRoutes: Array<RouteRecordRaw> = [
  {
    path: 'settings',
    name: profileRouteNames.profile,
    component: () => import('./Profile.vue'),
    meta: {
      requiresAuth: true
    }
  }
]
