import type { RouteRecordRaw } from 'vue-router'
import GymFriends from './GymFriends.vue'

export const gymFriendsRouteNames = {
  gymFriends: 'gymFriends'
}

export const gymFriendsRoutes: Array<RouteRecordRaw> = [
  {
    path: '/admin-panel',
    name: gymFriendsRouteNames.gymFriends,
    component: GymFriends,
    meta: {
      requiresAuth: true
    }
  }
]
