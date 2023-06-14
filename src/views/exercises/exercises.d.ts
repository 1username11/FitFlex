interface IMuscleGroupRes {
  created_at: string
  title: string
  id: string
}

interface IExerciseExchange {
  id: string
  created_at: string
  title: string
  equipment_category: string
  muscle_group: string
  secondary_muscles?: unknown | null
  exercise_media_url: string
  thumbnails_url: string
  exercise_type: string
  is_public: boolean
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
