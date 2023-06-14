import type { RouteRecordRaw } from 'vue-router'
import BlankLayout from '@/layouts/BlankLayout.vue'
import BannedUserPage from './BannedUserPage.vue'

export const authRouteNames = {
  auth: 'auth',
  login: 'login',
  signUp: 'signUp',
  forgotPassword: 'forgotPassword',
  updatePassword: 'updatePassword',
  bannedUserPage: 'bannedUserPage'
}

export const authRoutes: RouteRecordRaw = {
  name: authRouteNames.auth,
  path: '/auth',
  redirect: { name: authRouteNames.login },
  component: BlankLayout,
  children: [
    {
      path: 'login',
      name: authRouteNames.login,
      component: () => import('./Login.vue')
    },
    {
      path: 'sign-up',
      name: authRouteNames.signUp,
      component: () => import('./SignUp.vue')
    },
    {
      path: 'forgot-password',
      name: authRouteNames.forgotPassword,
      component: () => import('./ForgotPassword.vue')
    },
    {
      path: 'update-password',
      name: authRouteNames.updatePassword,
      component: () => import('./UpdatePassword.vue')
    },
    {
      path: '/banned',
      name: authRouteNames.bannedUserPage,
      component: BannedUserPage
    }
  ]
}
