import { createRouter, createWebHistory } from 'vue-router'

import { routes } from './routes'
import { routeGuard } from './route-guard'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(routeGuard)
