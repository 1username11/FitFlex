import { routeNames } from '@/router/route-names'

export const useGeneralStore = defineStore('generalStore', () => {
  const exampleGeneralVar = ref<IExampleInterface>()
  const generalLoading = ref(false)
  const userId = ref(localStorage.getItem('userId') || '')

  const accessToken = computed(() => {
    const authMeta = localStorage.getItem('sb-qmkeigkuramlfzjmpxug-auth-token')
    if (authMeta) {
      return JSON.parse(authMeta).access_token
    } else {
      return ''
    }
  })

  async function getGeneralStoreVar() {
    try {
      generalLoading.value = true
      exampleGeneralVar.value = await exampleViewService.getSomeData((exampleGeneralVar.value?.id || 0) + 1)
    } finally {
      generalLoading.value = false
    }
  }

  const router = useRouter()

  function navigateTo(routeName: string) {
    router.push({ name: routeName })
  }

  async function logout() {
    navigateTo(routeNames.login)
    localStorage.clear()
    await authService.signOut()
  }

  function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  return {
    exampleGeneralVar,
    generalLoading,
    accessToken,
    userId,
    generateGUID,
    getGeneralStoreVar,
    logout,
    navigateTo
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeneralStore, import.meta.hot))
}
