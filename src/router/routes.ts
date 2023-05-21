import type { RouteRecordRaw } from 'vue-router'

import { routeNames } from './route-names'

import { authRoutes } from '@/views/auth/auth.routes'
import { exampleViewRoutes } from '@/views/example-view/example-view.routes'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { homeViewRoutes } from '@/views/home/home.routes'
import { routinesViewRoutes } from '@/views/routines/routines.routes'
import { exercisesViewRoutes } from '@/views/exercises/exercises.routes'

const defaultLayoutRoutes: RouteRecordRaw = {
  path: '/',
  name: routeNames.rootPage,
  redirect: { name: routeNames.home },
  component: DefaultLayout,
  children: [
    // list of views that use default layout
    ...exampleViewRoutes,
    ...homeViewRoutes,
    ...routinesViewRoutes,
    ...exercisesViewRoutes
  ]
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },

  authRoutes,
  defaultLayoutRoutes
]

export {
  routes,
  defaultLayoutRoutes
}
