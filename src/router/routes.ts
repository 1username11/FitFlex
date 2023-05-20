import type { RouteRecordRaw } from 'vue-router'

import { routeNames } from './route-names'

import { authRoutes } from '@/views/auth/auth.routes'
import { exampleViewRoutes } from '@/views/example-view/example-view.routes'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { feedViewRoutes } from '@/views/feed/feed.routes'
import { routinesViewRoutes } from '@/views/routines/routines.routes'
import { exercisesViewRoutes } from '@/views/exercises/exercises.routes'
import { profileViewRoutes } from '@/views/profile/profile.routes'

const defaultLayoutRoutes: RouteRecordRaw = {
  path: '/',
  name: routeNames.rootPage,
  redirect: { name: routeNames.feed },
  component: DefaultLayout,
  children: [
    // list of views that use default layout
    ...exampleViewRoutes,
    ...feedViewRoutes,
    ...routinesViewRoutes,
    ...exercisesViewRoutes,
    ...profileViewRoutes
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
