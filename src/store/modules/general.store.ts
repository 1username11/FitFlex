export const useGeneralStore = defineStore('generalStore', () => {
  const userId = ref(localStorage.getItem('userId') || '')

  const accessToken = computed(() => {
    const authMeta = localStorage.getItem('sb-qmkeigkuramlfzjmpxug-auth-token')
    return authMeta ? JSON.parse(authMeta).access_token : ''
  })

  return {
    accessToken,
    userId
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeneralStore, import.meta.hot))
}
