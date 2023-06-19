import type { RouteRecordRaw } from 'vue-router'

export const exercisesViewRouteNames = {
  exercises: 'exercises',
  chart: 'chart'
}

export const exercisesViewRoutes: Array<RouteRecordRaw> = [
  {
    path: '/exercises',
    name: exercisesViewRouteNames.exercises,
    component: () => import('./Exercises.vue'),
    meta: {
      requiresAuth: true
    }
  }
]
