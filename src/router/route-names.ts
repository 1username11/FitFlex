import { exampleViewRouteNames } from '@/views/example-view/example-view.routes'
import { authRouteNames } from '@/views/auth/auth.routes'
import { routinesViewRouteNames } from '@/views/routines/routines.routes'
import { homeViewRouteNames } from '@/views/home/home.routes'
import { exercisesViewRouteNames } from '@/views/exercises/exercises.routes'
import { profileRouteNames } from '@/views/profile-settings/profile.routes'
import { adminRouteNames } from '@/views/admin/admin.routes'
import { gymFriendsRouteNames } from '@/views/gym-friends/gym-friends.routes'

export const routeNames = {
  rootPage: 'rootPage',
  createExercise: 'createExercise',
  ...exampleViewRouteNames,
  ...authRouteNames,
  ...homeViewRouteNames,
  ...exercisesViewRouteNames,
  ...routinesViewRouteNames,
  ...profileRouteNames,
  ...adminRouteNames,
  ...gymFriendsRouteNames,

  additionalDefaultLayoutRoute: 'additionalDefaultLayoutRoute',
  additionalNoLayoutRoute: 'additionalNoLayoutRoute'
}
