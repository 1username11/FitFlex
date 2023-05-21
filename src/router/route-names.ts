import { exampleViewRouteNames } from '@/views/example-view/example-view.routes'
import { authRouteNames } from '@/views/auth/auth.routes'
import { routinesViewRouteNames } from '@/views/routines/routines.routes'
import { homeViewRouteNames } from '@/views/home/home.routes'
import { exercisesViewRouteNames } from '@/views/exercises/exercises.routes'

export const routeNames = {
  rootPage: 'rootPage',

  ...exampleViewRouteNames,
  ...authRouteNames,
  ...homeViewRouteNames,
  ...exercisesViewRouteNames,
  ...routinesViewRouteNames,

  additionalDefaultLayoutRoute: 'additionalDefaultLayoutRoute',
  additionalNoLayoutRoute: 'additionalNoLayoutRoute'
}
