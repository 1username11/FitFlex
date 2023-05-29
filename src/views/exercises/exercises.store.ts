export const useExercisesStore = defineStore('exercisesStore', () => {
  const exerciseRes = ref<IExerciseRes[]>([])
  const hashedMuscleGroups = ref({} as TIndexedObject<string>)
  const hashedExerciseTypes = ref({} as TIndexedObject<string>)
  const hashedEquipment = ref({} as TIndexedObject<string>)

  const selectedEquipment = ref('')
  const slecetedPrimary = ref('')
  const searchedExercises = ref('')
  const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0

  async function getExercises() {
    exerciseRes.value = (await exercisesService.getExercises()).data as IExerciseRes[]
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
      const name = exercise.title.toLowerCase()
      const filterindCondition = (!selectedEquipment.value || equipment === selectedEquipment.value) &&
        (!slecetedPrimary.value || primary === slecetedPrimary.value) &&
        (!searchedExercises.value ||
          name.includes(searchedExercises.value) ||
          primary.toLowerCase().includes(searchedExercises.value))

      if (filterindCondition) {
        acc.push({
          id: exercise.id,
          name: exercise.title,
          primary,
          equipment,
          img: exercise.exercise_media_url
        })
      }

      return acc
    }, [] as IExercise[])
  })

  const equipments = computed(() => {
    return exerciseRes.value.reduce((acc, exercise) => {
      const equipmentIds = Object.keys(hashedEquipment.value)
      if (equipmentIds.includes(exercise.equipment_category)) {
        acc.push(hashedEquipment.value[exercise.equipment_category])
      }
      return acc
    }, [] as string[]).sort(compare)
  })

  const primaries = computed(() => {
    return exerciseRes.value.reduce((acc, exercise) => {
      const muscleGroupsIds = Object.keys(hashedMuscleGroups.value)
      if (muscleGroupsIds.includes(exercise.muscle_group)) {
        acc.push(hashedMuscleGroups.value[exercise.muscle_group])
      }
      return acc
    }, [] as string[]).sort(compare)
  })

  async function insertExercise(exercise) {
    return await exercisesService.insertExercise(exercise)
  }

  return {
    getExercises,
    getMuscleGroups,
    getExerciseTypes,
    getEquipment,
    insertExercise,
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
