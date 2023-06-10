export const useHomeStore = defineStore('homeStore', () => {
  const feeds = ref<any[]>([])
  const routines = ref<any[]>([])
  const routinesIds = ref<string[]>([])
  const routinesSets = ref<any[]>([])

  async function getFeeds(userId: string) {
    const { data, error } = await homeService.getFeeds(userId)
    if (error) throw Error(error.message)
    feeds.value = data
  }

  function getUniqueRoutineIds(data: Array<any>) {
    routinesIds.value = data.map((item) => item.routine_id).filter((id, index, array) => array.indexOf(id) === index)
  }

  async function getRoutines(data: Array<any>) {
    const routinesPromises = data.map((item) => {
      return routinesService.getRoutine(item)
    })
    routines.value = await Promise.all(routinesPromises)
  }

  async function getRoutinesWithDetails(data: Array<any>) {
    const routinesPromises = data.map((item) => {
      return routinesService.getSetsByRoutineId(item)
    })

    routinesSets.value = await Promise.all(routinesPromises)
  }

  return {
    getFeeds,
    getUniqueRoutineIds,
    getRoutines,
    getRoutinesWithDetails,
    feeds,
    routines,
    routinesIds,
    routinesWithDetails: routinesSets

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHomeStore, import.meta.hot))
}
