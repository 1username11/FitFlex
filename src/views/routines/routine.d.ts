interface ISetRoutine {
  id?: string
  created_at?: string
  reps?: number | null
  rest_time?: number | null
  weight?: number | null
  duration?: number | null
  exercise_id?: string
  routine_id?: string
  set_done?: boolean
}

type TExerciseType = 'weight reps' | 'reps only' | 'weighted bodyweight' | 'assisted bodyweight' | 'duration' | 'distance duration' | 'weight distance'

interface IExerciseRoutine {
  id: string
  created_at?: string
  title: string
  equipment_category: string
  muscle_group: string
  rest_time?: number
  secondary_muscles?: any
  exercise_media_url?: string
  thumbnails_url?: string
  exercise_type: TExerciseType
  sets: ISetRoutine[]
  is_public: boolean
}

interface IRoutine {
  id: string
  title: string
  exercises?: IExerciseRoutine[]
  user: string
  created_at: Date
}

interface IExerciseDetails {
  id: string
  title: string
  thumbnails_url: string
  sets: ISetRoutine[]
}

interface IRoutineDetails {
  exercise_id: string
  exercise_title: string
  exercise_thumbnail: string
  reps?: number
  weight?: number
  duration?: any
}

interface IExerciseStatistics {
  id: string
  user_id: string
  created_at: number
  exercise_id: string
  avarage_weight?: number
  max_weight?: number
  one_reps_max?: number
  most_reps?: number
  avarage_reps?: number
  best_set_duration?: number
  avarage_duration?: number
  volume: number
}
