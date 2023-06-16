import type { RouteRecordRaw } from 'vue-router'
import Exercises from './Exercises.vue'
import Chart from './components/Chart.vue'

export const exercisesViewRouteNames = {
  exercises: 'exercises',
  chart: 'chart'
}

export const exercisesViewRoutes: Array<RouteRecordRaw> = [
  {
    path: '/exercises',
    name: exercisesViewRouteNames.exercises,
    component: Exercises,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/chart',
    name: exercisesViewRouteNames.chart,
    component: Chart,
    meta: {
      requiresAuth: true
    }
  }

]
