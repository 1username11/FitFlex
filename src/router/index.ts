import { createRouter, createWebHistory } from 'vue-router'

import { routes } from './routes'
import { supabase } from '@/supabase'
import { routeNames } from './route-names'
import { ElNotification } from 'element-plus'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error

    const currentUser = await supabase.auth.getUser()
    const profile = await supabase.from('profiles').select('*').eq('id', currentUser.data.user?.id).single()

    localStorage.setItem('role', profile.data?.role || '')

    await supabase.auth.onAuthStateChange((event, session) => {
      localStorage.setItem('userId', session?.user?.id || '')
    })

    const currentSession = data

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    if (requiresAuth && (!currentSession.session?.access_token || currentUser.error?.status === 401)) {
      localStorage.clear()
      await authService.signOut()
      next({ name: routeNames.login })
    } else if (profile.data?.is_banned) {
      localStorage.clear()
      await authService.signOut()
      next({ name: routeNames.bannedUserPage })
    } else {
      next()
    }
  } catch (e: any) {
    ElNotification({
      title: 'Error',
      message: e.message,
      type: 'error'

    })
  }
})
