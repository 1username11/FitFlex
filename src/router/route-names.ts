import { exampleViewRouteNames } from '@/views/example-view/example-view.routes'
import { authRouteNames } from '@/views/auth/auth.routes'
import { routinesViewRouteNames } from '@/views/routines/routines.routes'
import { profileViewRouteNames } from '@/views/profile/profile.routes'
import { feedViewRouteNames } from '@/views/feed/feed.routes'
import { exercisesViewRouteNames } from '@/views/exercises/exercises.routes'

export const routeNames = {
  rootPage: 'rootPage',

  ...exampleViewRouteNames,
  ...authRouteNames,
  ...feedViewRouteNames,
  ...exercisesViewRouteNames,
  ...routinesViewRouteNames,
  ...profileViewRouteNames,

  additionalDefaultLayoutRoute: 'additionalDefaultLayoutRoute',
  additionalNoLayoutRoute: 'additionalNoLayoutRoute'
}
