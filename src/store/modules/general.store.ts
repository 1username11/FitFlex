import { routeNames } from '@/router/route-names'

// the first argument is a unique id of the store across your application
export const useGeneralStore = defineStore('generalStore', () => {
  const exampleGeneralVar = ref<IExampleInterface>()
  const generalLoading = ref(false)
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
    // navigateTo(routeNames.login)
    // localStorage.removeItem('sb-qmkeigkuramlfzjmpxug-auth-token')
    // localStorage.removeItem('ref-token')
    await authService.signOut()
  }
  console.log(accessToken.value.access_token)

  return {
    exampleGeneralVar,
    generalLoading,
    accessToken,
    getGeneralStoreVar,
    logout,
    navigateTo
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeneralStore, import.meta.hot))
}
