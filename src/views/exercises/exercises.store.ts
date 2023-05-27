// the first argument is a unique id of the store across your application
export const useExercisesStore = defineStore('exercisesStore', () => {
  const exercises = ref<IExercise[]>([])
  const exerciseRes = ref<IExerciseRes[]>([])
  const muscleGroupsRes = ref<IMuscleGroupRes[]>([])
  const exerciseTypesRes = ref<IExerciseTypeRes[]>([])
  const equipmentRes = ref<IEquipmentRes[]>([])

  async function getExercises() {
    const res = await exercisesService.getExercises()
    if (res.data && res.data.length > 0 && res.status === 200) {
      res.data.forEach((exercise) => {
        exerciseRes.value.push({
          id: exercise.id,
          title: exercise.title,
          equipment_category: exercise.equipment_category,
          muscle_group: exercise.muscle_group,
          secondary_muscles: exercise.secondary_muscles,
          exercise_media_url: exercise.exercise_media_url,
          exercise_type: exercise.exercise_type,
          created_at: exercise.created_at
        })
      })
    }
  }

  async function getMuscleGroups() {
    const res = await exercisesService.getMuscleGroups()
    if (res.data && res.data.length > 0 && res.status === 200) {
      res.data.forEach((muscleGroup) => {
        muscleGroupsRes.value.push({
          id: muscleGroup.id,
          title: muscleGroup.title,
          created_at: muscleGroup.created_at
        })
      })
    }
  }

  async function getExerciseTypes() {
    const res = await exercisesService.getExerciseTypes()
    if (res.data && res.data.length > 0 && res.status === 200) {
      res.data.forEach((exerciseType) => {
        exerciseTypesRes.value.push({
          id: exerciseType.id,
          title: exerciseType.title,
          created_at: exerciseType.created_at
        })
      })
    }
  }

  async function getEquipment() {
    const res = await exercisesService.getEquipment()
    if (res.data && res.data.length && res.status === 200) {
      res.data.forEach((equipment) => {
        equipmentRes.value.push({
          id: equipment.id,
          title: equipment.title,
          created_at: equipment.created_at
        })
      })
    }
  }

  return {
    getExercises,
    getMuscleGroups,
    getExerciseTypes,
    getEquipment,
    exercises,
    exerciseRes,
    muscleGroupsRes,
    exerciseTypesRes,
    equipmentRes
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExercisesStore, import.meta.hot))
}
