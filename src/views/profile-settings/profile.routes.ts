import type { RouteRecordRaw } from 'vue-router'
import Profile from './Profile.vue'

export const profileRouteNames = {
  profile: 'profile'
}

export const profileRoutes: Array<RouteRecordRaw> = [
  {
    path: 'settings',
    name: profileRouteNames.profile,
    component: Profile,
    meta: {
      requiresAuth: true
    }
  }
]
