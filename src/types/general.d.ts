type TIndexedObject<T = any> = {
  [key: string]: T
}

type TCallbackFn<T extends unknown[] = [], R = void> = (...args: T) => R

interface ISet {
  id: string
  type?: string
  reps: number
  description: string
  weight?: number
}

interface IExercise {
  id: string
  name: string
  restTime?: string
  description?: string
  primary?: string
  img: string
  sets: ISet[]
  equipment: string
}

interface IUser {
  id: string
  name: string
  age: number
  bio?: string
  avatar: string
}

interface IRoutine {
  id: string
  name: string
  exercises: IExercise[]
  user: IUser
}

interface ILog {
  id: string
  user: IUser
  publishTime: Date
  title: string
  description: string
  duration: string
  reps: number
  workout: IRoutine
  likes: number
}

interface IExerciseStatistics {
  id: string
  exerciseId: IExercise['id']
  heaviestWeight: number
  oneRepMax: number
  bestSetVolume: number
  mostReps: number
  bestTime: string
}
