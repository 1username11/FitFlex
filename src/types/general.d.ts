type TIndexedObject<T = any> = {
  [key: string]: T
}

interface ISet {
  id: string
  type?: string
  reps: number
  description?: string
  weight?: number
  duration?: string
}

interface IExercise {
  id: string
  name: string
  restTime?: string
  exerciseType?: any
  primary?: string
  thumbnail: string
  sets?: ISet[]
  equipment?: string
  media?: string
}

interface IExerciseStatistics {
  id: string
  most_reps: any
  best_set_duration: any
  avarage_duration: any
  avarage_weight: number
  max_weight: number
  volume: number
  exercise_id: string
  avarage_reps: any
  one_reps_max: number
  created_at: number
}
