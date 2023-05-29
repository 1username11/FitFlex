export const useExercisesStore = defineStore('exercisesStore', () => {
  const exerciseRes = ref<IExerciseRes[]>([])
  const muscleGroupsRes = ref<any>()
  const exerciseTypesRes = ref<any>()
  const equipmentRes = ref<any>()

  const equipmentForFiltering = ref('')
  const primaryForFiltering = ref('')
  const inputFilteringValue = ref('')

  const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0

  async function getExercises() {
    exerciseRes.value = (await exercisesService.getExercises()).data as IExerciseRes[]
  }

  async function getMuscleGroups() {
    muscleGroupsRes.value = (await exercisesService.getMuscleGroups()).data?.reduce((acc, curr) => {
      acc[curr.id] = curr.title
      return acc
    }, {})
    console.log(muscleGroupsRes.value)
  }

  async function getExerciseTypes() {
    exerciseTypesRes.value = (await exercisesService.getExerciseTypes()).data
      ?.reduce((acc, curr) => {
        acc[curr.id] = curr.title
        return acc
      }, {})
  }

  async function getEquipment() {
    equipmentRes.value = (await exercisesService.getEquipment()).data
      ?.reduce((acc, curr) => {
        acc[curr.id] = curr.title
        return acc
      }, {})
  }

  const exercises = computed(() => {
    const filteringValue = inputFilteringValue.value.toLowerCase().trim()
    return exerciseRes.value.map((exercise: IExerciseRes) => {
      return {
        id: exercise.id,
        name: exercise.title,
        primary: muscleGroupsRes.value[exercise.muscle_group],
        equipment: equipmentRes.value[exercise.equipment_category],
        img: exercise.exercise_media_url
      }
    }).filter((exercise) => {
      const meetsEquipmentFilter =
        !equipmentForFiltering.value || exercise.equipment === equipmentForFiltering.value
      const meetsPrimaryFilter =
        !primaryForFiltering.value || exercise.primary === primaryForFiltering.value
      const meetsSearchFilter =
        !filteringValue ||
        exercise.name.toLowerCase().includes(filteringValue) ||
        exercise.primary.toLowerCase().includes(filteringValue)

      return meetsEquipmentFilter && meetsPrimaryFilter && meetsSearchFilter
    })
  })

  const equipments = computed(() => {
    return exerciseRes.value.map((exercise) => {
      const equipmentIds = Object.keys(equipmentRes.value)
      if (equipmentIds.includes(exercise.equipment_category)) {
        return equipmentRes.value[exercise.equipment_category]
      }
    }).sort(compare)
  })

  const primaries = computed(() => {
    return exerciseRes.value.map((exercise) => {
      const muscleGroupsIds = Object.keys(muscleGroupsRes.value)
      if (muscleGroupsIds.includes(exercise.muscle_group)) {
        return muscleGroupsRes.value[exercise.muscle_group]
      }
    }).sort(compare)
  })

  return {
    getExercises,
    getMuscleGroups,
    getExerciseTypes,
    getEquipment,
    exercises,
    equipments,
    primaries,
    equipmentForFiltering,
    primaryForFiltering,
    inputFilteringValue

  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExercisesStore, import.meta.hot))
}
