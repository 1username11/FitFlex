import type { RouteRecordRaw } from 'vue-router'
import Exercises from './Exercises.vue'
import VideoCapture from './VideoCapture.vue'

export const exercisesViewRouteNames = {
  exercises: 'exercises',
  video: 'video'
}

export const exercisesViewRoutes: Array<RouteRecordRaw> = [
  {
    path: '/exercises',
    name: exercisesViewRouteNames.exercises,
    component: Exercises
  },
  {
    path: '/video',
    name: exercisesViewRouteNames.video,
    component: VideoCapture
  }
]
