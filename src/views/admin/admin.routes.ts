import type { RouteRecordRaw } from 'vue-router'

export const adminRouteNames = {
  adminPanel: 'adminPanel'
}

export const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: '/admin-panel',
    name: adminRouteNames.adminPanel,
    component: () => import('./AdminPanel.vue'),
    meta: {
      requiresAuth: true
    }
  }
]
