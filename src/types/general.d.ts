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
