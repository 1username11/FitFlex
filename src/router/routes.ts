import type { RouteRecordRaw } from 'vue-router'

import { routeNames } from './route-names'

import { authRoutes } from '@/views/auth/auth.routes'
import { exampleViewRoutes } from '@/views/example-view/example-view.routes'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { mainRoutes } from '@/views/main/main.routes'

const defaultLayoutRoutes: RouteRecordRaw = {
  path: '/',
  name: routeNames.rootPage,
  redirect: { name: routeNames.exampleView },
  component: DefaultLayout,
  children: [
    // list of views that use default layout
    ...exampleViewRoutes
  ]
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },

  authRoutes,
  defaultLayoutRoutes,
  mainRoutes
]

export {
  routes,
  defaultLayoutRoutes
}
