import { createRouter, createWebHistory } from 'vue-router'

import { routes } from './routes'
import { supabase } from '@/supabase'
import { routeNames } from './route-names'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { data, error } = await supabase.auth.getSession()

  const currentUser = await supabase.auth.getUser()
  const profile = await supabase.from('profiles').select('*').eq('id', currentUser.data.user?.id).single()

  console.log('currentUser', currentUser)
  console.log('profile', profile)
  localStorage.setItem('role', profile.data?.role || '')

  await supabase.auth.onAuthStateChange((event, session) => {
    console.log('event', event)
    console.log('session', session)
    localStorage.setItem('userId', session?.user?.id || '')
  })

  const currentSession = data

  console.log('currentSession', currentSession.session?.access_token)
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  console.log('requiresAuth', requiresAuth)

  console.log('error', error?.status)

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
})
