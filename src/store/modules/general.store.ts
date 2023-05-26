// the first argument is a unique id of the store across your application
export const useGeneralStore = defineStore('generalStore', () => {
  const exampleGeneralVar = ref<IExampleInterface>()
  const generalLoading = ref(false)

  async function getGeneralStoreVar () {
    try {
      generalLoading.value = true
      exampleGeneralVar.value = await exampleViewService.getSomeData((exampleGeneralVar.value?.id || 0) + 1)
    } finally {
      generalLoading.value = false
    }
  }
  const isIosBrowser = computed(() => /iPhone|iPad|Safari/i.test(navigator.userAgent))

  return {
    exampleGeneralVar,
    generalLoading,
    isIosBrowser,
    getGeneralStoreVar
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGeneralStore, import.meta.hot))
}
