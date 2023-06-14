import type { RouteRecordRaw } from 'vue-router'
import AdminPanel from './AdminPanel.vue'

export const adminRouteNames = {
  adminPanel: 'adminPanel'
}

export const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: '/admin-panel',
    name: adminRouteNames.adminPanel,
    component: AdminPanel,
    meta: {
      requiresAuth: true
    }
  }
]
