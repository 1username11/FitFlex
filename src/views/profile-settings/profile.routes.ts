import type { RouteRecordRaw } from 'vue-router'
import ProfileSettings from './ProfileSettings.vue'

export const profileRouteNames = {
  profileSettings: 'profileSettings'
}

export const profileRoutes: Array<RouteRecordRaw> = [
  {
    path: 'settings',
    name: profileRouteNames.profileSettings,
    component: ProfileSettings,
    meta: {
      requiresAuth: true
    }
  }
]
