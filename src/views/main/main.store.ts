export const useMainStore = defineStore('mainStore', () => {
  return {

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExampleViewStore, import.meta.hot))
}
