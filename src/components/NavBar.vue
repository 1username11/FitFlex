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
            class="flex items-center space-x-2 text-[#6D727F] hover:text-gray-600 px-5 h-full"
          >
            <!-- TODO change SVG color on active -->
            <FeedIcon v-if="route.name === routeNames.feed" class="svg-icon" />
            <RoutinesIcon v-else-if="route.name === routeNames.routinesList" />
            <ExercisesIcon v-else-if="route.name === routeNames.exercises" />
            <ProfileIcon v-else-if="route.name === routeNames.profile" />

            <span class="hidden capitalize lg:flex lg:items-center h-full">{{ route.name }}</span>
          </RouterLink>
        </div>
      </div>

      <div class="flex justify-end items-center">
        <div class="relative">
          <el-image
            class="w-[34px] h-[34px] rounded-full overflow-hidden"
            src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
            @click="isImageClicked = !isImageClicked"
          />

          <div
            v-if="isImageClicked"
            class="flex flex-col justify-between py-2 absolute top-[35px] right-[-5px]
            bg-white border border-gray-200 rounded-md shadow-sm w-40 h-24"
            @click="isImageClicked = !isImageClicked"
          >
            <div class="py-1.5 px-6 hover:bg-gray-200 cursor-pointer text-gray-500">
              <SettingsIcon />
              Settings
            </div>

            <div class="py-1.5 px-6 hover:bg-gray-200 cursor-pointer text-gray-500">
              <LogoutIcon />
              Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/route-names'

const routes = [
  { name: routeNames.feed },
  { name: routeNames.routinesList },
  { name: routeNames.exercises },
  { name: routeNames.profile }
]
const isImageClicked = ref(false)

</script>

<style lang="scss">
.router-link-active.router-link-exact-active {
  border-bottom: 2px solid #1D83EA;
  color: black;
  .svg-icon {
    fill: black;
  }
}
</style>
