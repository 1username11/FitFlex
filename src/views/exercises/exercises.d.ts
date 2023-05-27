interface IMuscleGroupRes {
  created_at: string
  title: string
  id: string
}

interface IExerciseRes {
  created_at: string
  title: string
  equipment_category: string
  muscle_group: string
  secondary_muscles: any
  exercise_media_url: string
  exercise_type: string
  id: string
}

interface IExerciseTypeRes {
  id: string
  created_at: string
  title: string
}

interface IEquipmentRes {
  created_at: string
  title: string
  id: string
}
