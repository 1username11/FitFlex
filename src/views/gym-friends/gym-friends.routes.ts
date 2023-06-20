import type { RouteRecordRaw } from 'vue-router'

export const gymFriendsRouteNames = {
  gymFriends: 'gymFriends'
}

export const gymFriendsRoutes: Array<RouteRecordRaw> = [
  {
    path: '/gym-friends',
    name: gymFriendsRouteNames.gymFriends,
    component: () => import('./GymFriends.vue'),
    meta: {
      requiresAuth: true
    }
  }
]
