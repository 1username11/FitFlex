import type { RouteRecordRaw } from 'vue-router'
import RoutinesList from './RoutinesList.vue'
import RoutineDetail from './components/RoutineDetail.vue'
import Exercise from './components/Exercise.vue'
import CreateRoutine from './components/CreateRoutine.vue'

export const routinesViewRouteNames = {
  routinesList: 'routines',
  routineDetail: 'routineDetail',
  exercise: 'exercise',
  createRoutine: 'createRoutine'
}

export const routinesViewRoutes: Array<RouteRecordRaw> = [
  {
    path: '/routines',
    name: routinesViewRouteNames.routinesList,
    component: RoutinesList
  },
  {
    path: '/routine-deatil/:id',
    name: routinesViewRouteNames.routineDetail,
    component: RoutineDetail
  },
  {
    path: '/exercise',
    name: routinesViewRouteNames.exercise,
    component: Exercise
  },
  {
    path: '/createRoutine',
    name: routinesViewRouteNames.createRoutine,
    component: CreateRoutine
  }
]
