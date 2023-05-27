<template>
  <div
    class="sticky top-0 z-49 w-full bg-white border-b border-gray-300"
  >
    <div class="flex justify-between mx-auto h-[60px] max-w-[1024px] px-5">
      <nav class="flex justify-start items-center">
        <Logo />
        <ul class="flex px-3 h-full">
          <li
            v-for="route in routes"
            :key="route.name"
          >
            <RouterLink
              :to="{name: route.name}"
              class="flex items-center space-x-2 text-[#6D727F] border-b-2 border-b-white hover:text-gray-600
              hover:border-b-2 hover:border-b-[#c6e0fa] px-5 h-full"
            >
              <!-- TODO change SVG color on active -->
              <FeedIcon
                v-if="route.name === routeNames.home"
                :isHovered="isHovered"
              />
              <RoutinesIcon v-else-if="route.name === routeNames.routinesList" />
              <ExercisesIcon v-else-if="route.name === routeNames.exercises" />

              <span class="hidden capitalize lg:flex lg:items-center h-full">
                {{ route.name }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="flex justify-end items-center">
        <el-dropdown trigger="click" class="relative">
          <el-image
            class="w-[34px] h-[34px] rounded-full overflow-hidden cursor-pointer"
            src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
          />
          <template #dropdown>
            <el-dropdown-menu class="flex flex-col justify-between w-fit py-3">
              <el-dropdown-item
                class="flex items-center py-1.5 px-6
              hover:bg-gray-200 cursor-pointer text-gray-500 text-base"
                @click="navigateTo(routeNames.profileSettings)"
              >
                <SettingsIcon />
                <p>
                  Settings
                </p>
              </el-dropdown-item>
              <el-dropdown-item
                class="flex items-center py-1.5 px-6
              hover:bg-gray-200 cursor-pointer text-gray-500 text-base"
                @click="logout()"
              >
                <LogoutIcon />
                <p>
                  Logout
                </p>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/route-names'

const routes = [
  { name: routeNames.home },
  { name: routeNames.routinesList },
  { name: routeNames.exercises }
]
const router = useRouter()

const isHovered = ref(false)

function navigateTo (routeName: string) {
  router.push({ name: routeName })
}

async function logout () {
  navigateTo(routeNames.auth)
  return await authService.signOut()
}
</script>

<style lang="scss">
.router-link-active.router-link-exact-active {
  border-bottom: 2px solid #1D83EA !important;
  color: black !important;
}
</style>
