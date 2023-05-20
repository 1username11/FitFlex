import type { RouteRecordRaw } from 'vue-router'
import Profile from './Profile.vue'

export const profileViewRouteNames = {
  profile: 'profine'

}

export const profileViewRoutes: Array<RouteRecordRaw> = [
  {
    path: '/profile',
    name: profileViewRouteNames.profile,
    component: Profile
  }
]
