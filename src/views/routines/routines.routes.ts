import type { RouteRecordRaw } from 'vue-router'
import RoutinesList from './RoutinesList.vue'
import RoutineDetail from './components/RoutineDetail.vue'
import Exercise from './components/Exercise.vue'
import CreateRoutine from './components/CreateRoutine.vue'
import EditRoutine from './components/EditRoutine.vue'
import Workout from './Workout.vue'
import FinishWorkout from './components/FinishWorkout.vue'

export const routinesViewRouteNames = {
  routinesList: 'routines',
  routineDetail: 'routineDetail',
  exercise: 'exercise',
  createRoutine: 'createRoutine',
  filters: 'filters',
  editRoutine: 'editRoutine',
  startWorkout: 'startWorkout',
  finishWorkout: 'finishWorkout'
}

export const routinesViewRoutes: Array<RouteRecordRaw> = [
  {
    path: '/routines',
    name: routinesViewRouteNames.routinesList,
    component: RoutinesList,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/routine-detail/:id',
    name: routinesViewRouteNames.routineDetail,
    component: RoutineDetail,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/exercise',
    name: routinesViewRouteNames.exercise,
    component: Exercise,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/create-routine',
    name: routinesViewRouteNames.createRoutine,
    component: CreateRoutine,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/edit-routine/:id',
    name: routinesViewRouteNames.editRoutine,
    component: EditRoutine,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/start-workout/:id',
    name: routinesViewRouteNames.startWorkout,
    component: Workout,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/finish-workout/:id',
    name: routinesViewRouteNames.finishWorkout,
    component: FinishWorkout,
    meta: {
      requiresAuth: true
    }
  }

]
