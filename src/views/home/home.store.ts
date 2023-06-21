export const useHomeStore = defineStore('homeStore', () => {
  const feeds = ref<IFeedResponse[]>([])

  return {
    feeds
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHomeStore, import.meta.hot))
}
