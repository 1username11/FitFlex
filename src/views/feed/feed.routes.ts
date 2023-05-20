import type { RouteRecordRaw } from 'vue-router'
import Feed from './Feed.vue'

export const feedViewRouteNames = {
  feed: 'feed'
}

export const feedViewRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: feedViewRouteNames.feed,
    component: Feed
  }
]
