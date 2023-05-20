import type { RouteRecordRaw } from 'vue-router'
import Routines from './Routines.vue'

export const routinesViewRouteNames = {
  routines: 'routines'

}

export const routinesViewRoutes: Array<RouteRecordRaw> = [
  {
    path: '/routines',
    name: routinesViewRouteNames.routines,
    component: Routines
  }
]
