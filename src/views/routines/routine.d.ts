interface ISetRoutine {
  id: string
  created_at?: string
  reps?: number
  rest_time?: number
  weight?: number
  duration?: number
  exercise_id?: string
  routine_id?: string
  set_done?: boolean
}

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
  exercise_type: string
  sets: ISetRoutine[]
}

interface IRoutine {
  id: string
  title: string
  exercises?: IExerciseRoutine[]
  user: IUser
  created_at: string
}

interface IExerciseDetails {
  id: string
  title: string
  thumbnails_url: string
  sets: Set[]
}

interface ISetDetails {
  reps: number
  weight?: number
  duration: any
}

interface IRoutineDetails {
  exercise_id: string
  exercise_title: string
  exercise_thumbnail: string
  reps?: number
  weight?: number
  duration?: any
}
