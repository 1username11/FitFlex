import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { supabase } from '@/supabase'
import { routeNames } from '@/router/route-names'

export const routeGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  try {
    const { getProfile } = useProfileStore()
    const { profile } = storeToRefs(useProfileStore())

    const { data, error } = await supabase.auth.getSession()
    if (error) throw new Error(error.message)

    const currentSession = data.session
    await getProfile(data.session?.user.id || '')
    localStorage.setItem('role', profile.value?.data?.role || '')

    supabase.auth.onAuthStateChange((event, session) => {
      console.log('event', event)
      localStorage.setItem('userId', session?.user?.id || '')
    })

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    if (requiresAuth && !currentSession?.access_token) {
      localStorage.clear()
      await authService.signOut()
      next({ name: routeNames.login })
    } else if (profile.value?.data?.is_banned) {
      localStorage.clear()
      await authService.signOut()
      next({ name: routeNames.bannedUserPage })
    } else {
      next()
    }
  } catch (e: any) {
    console.log(e)
  }
}
