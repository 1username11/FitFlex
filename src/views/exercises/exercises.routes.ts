import type { RouteRecordRaw } from 'vue-router'
import Exercises from './Exercises.vue'

export const exercisesViewRouteNames = {
  exercises: 'exercises'

}

export const exercisesViewRoutes: Array<RouteRecordRaw> = [
  {
    path: '/exercises',
    name: exercisesViewRouteNames.exercises,
    component: Exercises
  }
]
