import type { RouteRecordRaw } from 'vue-router'

export const exampleViewRouteNames = {
  exampleView: 'exampleView',
  exampleColors: 'exampleColors',
  exampleFlags: 'exampleFlags',
  exampleTransitions: 'exampleTransitions'
}

export const exampleViewRoutes: Array<RouteRecordRaw> = [
  {
    path: 'example',
    name: exampleViewRouteNames.exampleView,
    meta: {
      label: 'general.navigation.exampleView' // translation key
    },
    component: () => import('./ExampleView.vue')
  }
]
