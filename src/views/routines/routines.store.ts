export const useRoutinesStore = defineStore('routinesStore', () => {
  const routine = ref<IRoutine>()
  const exercise = ref<IExercise>({} as IExercise)
  const set = ref<ISet>({} as ISet)
  const routineList = ref([] as IRoutine[])
  const sets = ref<ISet[]>([])
  const exercises = ref<IExercise[]>([])
  const routines = ref<IRoutine[]>([])
  const routineDetails = ref()

  async function getRoutines (userId: string) {
    try {
      const { data, error } = await routinesService.getRoutines(userId)
      if (error) {
        throw error
      }
      routineList.value = data as IRoutine[]
    } catch (error: any) {
      ElNotification({
        title: 'Error',
        message: error.message,
        type: 'error'
      })
    }
  }

  async function getRoutineDetails (id: string) {
    try {
      routineDetails.value = await routinesService.getSetsByRoutineId(id)
      console.log('routineDetails.value', routineDetails.value)
    } catch (error: any) {
      ElNotification({
        title: 'Error',
        message: error.message,
        type: 'error'
      })
    }
  }

  return {
    routine,
    exercise,
    set,
    sets,
    exercises,
    routines,
    routineList,
    routineDetails,
    getRoutines,
    getRoutineDetails
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRoutinesStore, import.meta.hot))
}
