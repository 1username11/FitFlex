import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Feed from './Feed.vue'
import Profile from './Profile.vue'
import Routines from './Routines.vue'
import Exercises from './Exercises.vue'

export const mainRouteNames = {
  main: 'main',
  feed: 'feed',
  profile: 'profile',
  routines: 'routines',
  exercises: 'exercises'
}

export const mainRoutes = {
  name: mainRouteNames.main,
  path: '/main',
  redirect: { name: mainRouteNames.feed },
  component: DefaultLayout,
  children: [
    {
      path: 'feed',
      name: mainRouteNames.feed,
      component: Feed
    },
    {
      path: 'profile',
      name: mainRouteNames.profile,
      component: Profile
    },
    {
      path: 'routines',
      name: mainRouteNames.routines,
      component: Routines
    },
    {
      path: 'exercises',
      name: mainRouteNames.exercises,
      component: Exercises
    }
  ]
}
