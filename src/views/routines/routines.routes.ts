import type { RouteRecordRaw } from 'vue-router'

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
    component: () => import('./RoutinesList.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/routine-detail/:id',
    name: routinesViewRouteNames.routineDetail,
    component: () => import('./components/RoutineDetail.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/exercise',
    name: routinesViewRouteNames.exercise,
    component: () => import('./components/Exercise.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/create-routine',
    name: routinesViewRouteNames.createRoutine,
    component: () => import('./components/CreateRoutine.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/edit-routine/:id',
    name: routinesViewRouteNames.editRoutine,
    component: () => import('./components/EditRoutine.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/start-workout/:id',
    name: routinesViewRouteNames.startWorkout,
    component: () => import('./Workout.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/finish-workout/:id',
    name: routinesViewRouteNames.finishWorkout,
    component: () => import('./components/FinishWorkout.vue'),
    meta: {
      requiresAuth: true
    }
  }

]
