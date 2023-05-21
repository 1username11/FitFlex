import type { RouteRecordRaw } from 'vue-router'
import RoutinesList from './RoutinesList.vue'
import RoutineDetail from './components/RoutineDetail.vue'
import Exercise from './components/Exercise.vue'

export const routinesViewRouteNames = {
  routinesList: 'routinesList',
  routineDetail: 'routineDetail',
  exercise: 'exercise'
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
  }
]
