import { routeNames } from '@/router/route-names'

export const useGeneralStore = defineStore('generalStore', () => {
  const userId = ref(localStorage.getItem('userId') || '')

  const accessToken = computed(() => {
    const authMeta = localStorage.getItem('sb-qmkeigkuramlfzjmpxug-auth-token')
    if (authMeta) {
      return JSON.parse(authMeta).access_token
    } else {
      return ''
    }
  })

  const router = useRouter()

  function navigateTo (routeName: string) {
    router.push({ name: routeName })
  }

  async function logout () {
    navigateTo(routeNames.login)
    localStorage.clear()
    await authService.signOut()
  }

  return {
    accessToken,
    userId,
    logout,
    navigateTo
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeneralStore, import.meta.hot))
}
