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
      localStorage.setItem('userId', session?.user?.id || '')
    })

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    if ((requiresAuth && !currentSession?.access_token) || profile.value?.data?.is_banned) {
      await authService.signOut()
      localStorage.removeItem('userId')
      localStorage.removeItem('role')

      const redirectPath = profile.value?.data.is_banned ? routeNames.bannedUserPage : routeNames.login
      next({ name: redirectPath })
    } else {
      next()
    }
  } catch (e: any) {
    console.log(e)
  }
}
