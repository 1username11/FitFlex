import type { RouteRecordRaw } from 'vue-router'
import { supabase } from '@/supabase'

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
    },
    beforeEnter: async (to, from) => {
      const profile = await supabase.from('profiles').select('*').eq('id', localStorage.getItem('userId')).single()
      if (profile.data?.is_public) {
        return true
      }
      return false
    }
  }
]
