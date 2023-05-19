<template>
  <div class="w-full bg-white border-b border-gray-300">
    <div class="flex justify-between bg-white mx-auto h-[60px] max-w-[1024px] px-3">
      <div class="flex justify-start items-center">
        <Logo />
        <div class="flex px-3 h-full">
          <RouterLink
            v-for="route in routes"
            :key="route.name"
            :to="{name: route.name}"
            class="flex items-center space-x-2 text-[#6D727F] hover:text-gray-600 px-5 h-full link-wrapper"
          >
            <div>
              <FeedIcon v-if="route.name === routeNames.feed" />
              <RoutinesIcon v-if="route.name === routeNames.routines" />
              <ExercisesIcon v-if="route.name === routeNames.exercises" />
              <ProfileIcon v-if="route.name === routeNames.profile" />
            </div>

            <span class="hidden capitalize lg:flex lg:items-center h-full">{{ route.name }}</span>
          </RouterLink>
        </div>
      </div>

      <div class="flex justify-end items-center">
        <el-image class="w-[34px] h-[34px] rounded-full overflow-hidden" src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/route-names'

const routes = [
  { name: routeNames.feed },
  { name: routeNames.routines },
  { name: routeNames.exercises },
  { name: routeNames.profile }
]
</script>

<style scoped lang="scss">
.router-link-active.router-link-exact-active {
  border-bottom: 2px solid #1D83EA;
  color: black;
}
</style>
