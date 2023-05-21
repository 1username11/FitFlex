type TIndexedObject<T = any> = {
  [key: string]: T
}

type TCallbackFn<T extends unknown[] = [], R = void> = (...args: T) => R

interface ISet {
  id: string
  reps: number
  description: string
  weight?: number
}
interface IExercise {
  id: string
  name: string
  img: string
  sets: ISet[]
}

interface IUser {
  id: string
  name: string
  age: number
  avatar: string
}

interface IWorkout {
  id: string
  name: string
  exercises: IExercise[]
  user: IUser
}

interface IComment {
  id: string
  user: IUser
  content: string
}

interface ILog {
  id: string
  user: IUser
  publishTime: Date
  title: string
  description: string
  duration: string
  reps: number
  workout: IWorkout
  likes: number
  comments: IComment[]
}
