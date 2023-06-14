export const useExercisesStore = defineStore('exercisesStore', () => {
  const exerciseRes = ref<IExerciseExchange[]>([])
  const hashedMuscleGroups = ref({} as TIndexedObject<string>)
  const hashedExerciseTypes = ref({} as TIndexedObject<string>)
  const hashedEquipment = ref({} as TIndexedObject<string>)
  
  const generalStore = useGeneralStore()
  const { userId } = storeToRefs(generalStore)

  const selectedEquipment = ref('')
  const slecetedPrimary = ref('')
  const searchedExercises = ref('')
  const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0

  async function getExercises() {
    exerciseRes.value = (await exercisesService.getExercises(userId.value)).data as IExerciseExchange[]
  }

  async function getMuscleGroups() {
    const data = (await exercisesService.getMuscleGroups()).data as IMuscleGroupRes[]
    hashedMuscleGroups.value = data.reduce((acc, curr) => {
      acc[curr.id] = curr.title
      return acc
    }, {} as TIndexedObject<string>)
  }

  async function getExerciseTypes() {
    const data = (await exercisesService.getExerciseTypes()).data as IExerciseTypeRes[]
    hashedExerciseTypes.value = data.reduce((acc, curr) => {
      acc[curr.id] = curr.title
      return acc
    }, {} as TIndexedObject<string>)
  }

  async function getEquipment() {
    const data = (await exercisesService.getEquipment()).data as IEquipmentRes[]
    hashedEquipment.value = data.reduce((acc, curr) => {
      acc[curr.id] = curr.title
      return acc
    }, {} as TIndexedObject<string>)
  }

  const exercises = computed(() => {
    searchedExercises.value = searchedExercises.value.toLowerCase().trim()

    return exerciseRes.value.reduce((acc, exercise) => {
      const primary = hashedMuscleGroups.value[exercise.muscle_group]
      const equipment = hashedEquipment.value[exercise.equipment_category]
      const exerciseType = hashedExerciseTypes.value[exercise.exercise_type]
      const name = exercise.title.toLowerCase()
      const filterindCondition = (!selectedEquipment.value || equipment === selectedEquipment.value) &&
        (!slecetedPrimary.value || primary === slecetedPrimary.value) &&
        (!searchedExercises.value ||
          name.includes(searchedExercises.value) ||
          primary.toLowerCase().includes(searchedExercises.value))

      if (filterindCondition) {
        acc.push({
          id: exercise.id,
          created_at: exercise.created_at,
          title: exercise.title,
          muscle_group: primary,
          equipment_category: equipment,
          exercise_type: exerciseType,
          exercise_media_url: exercise.exercise_media_url,
          thumbnails_url: exercise.thumbnails_url,
          sets: [] as ISetRoutine[],
          is_public: exercise.is_public
        })
      }

      return acc
    }, [] as IExerciseRoutine[])
  })

  const equipments = computed(() => {
    const uniqueEquipments = new Set<string>()
    exerciseRes.value.forEach((exercise) => {
      const equipmentIds = Object.keys(hashedEquipment.value)
      if (equipmentIds.includes(exercise.equipment_category)) {
        uniqueEquipments.add(hashedEquipment.value[exercise.equipment_category])
      }
    })
    return Array.from(uniqueEquipments).sort(compare)
  })

  const primaries = computed(() => {
    const uniquePrimaries = new Set<string>()
    exerciseRes.value.forEach((exercise) => {
      const muscleGroupsIds = Object.keys(hashedMuscleGroups.value)
      if (muscleGroupsIds.includes(exercise.muscle_group)) {
        uniquePrimaries.add(hashedMuscleGroups.value[exercise.muscle_group])
      }
    })
    return Array.from(uniquePrimaries).sort(compare)
  })

  return {
    getExercises,
    getMuscleGroups,
    getExerciseTypes,
    getEquipment,
    exercises,
    equipments,
    primaries,
    selectedEquipment,
    slecetedPrimary,
    searchedExercises,
    hashedMuscleGroups,
    hashedExerciseTypes,
    hashedEquipment
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExercisesStore, import.meta.hot))
}
