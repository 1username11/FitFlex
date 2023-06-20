<template>
  <div class="sticky top-0 z-10 w-full bg-white border-b border-gray-300">
    <div class="flex justify-between mx-auto h-[60px] max-w-[1024px] px-2">
      <nav class="flex items-center">
        <Logo />
        <ul class="flex px-3 h-full">
          <li
            v-for="route in routes"
            :key="route.name"
            class="group"
          >
            <RouterLink
              :to="{name: route.name}"
              class="nav-link flex items-center space-x-2 text-[#6D727F] border-b-2 border-b-white px-5 h-full
              group-hover:text-gray-600 group-hover:border-b-2 group-hover:border-b-[#c6e0fa]"
            >
              <IconHome v-if="route.name === routeNames.home" />
              <IconRoutines v-else-if="route.name === routeNames.routinesList" />
              <IconExercises v-else-if="route.name === routeNames.exercises" />
              <IconGymFriends v-else-if="route.name === routeNames.gymFriends" />

              <span class="hidden capitalize lg:flex lg:items-center h-full">
                {{ route.name }}
              </span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="flex justify-end items-center">
        <el-dropdown trigger="click" class="relative">
          <div class="avatar-wrapper pr-1">
            <el-image
              class="w-[34px] h-[34px] rounded-full overflow-hidden cursor-pointer"
              :src="profile?.data.avatar_url || ''"
            >
              <template #error>
                <el-image :src="avatarPlaceholder" />
              </template>
            </el-image>
          </div>

          <template #dropdown>
            <el-dropdown-menu class="flex flex-col justify-between w-fit py-3">
              <el-dropdown-item
                class="flex items-center py-1.5 px-6
              hover:bg-gray-200 cursor-pointer text-gray-500 text-base"
                @click="navigateTo(routeNames.profile)"
              >
                <IconSettings />
                Settings
              </el-dropdown-item>

              <el-dropdown-item
                class="flex items-center py-1.5 px-6
              hover:bg-gray-200 cursor-pointer text-gray-500 text-base"
                @click="logout"
              >
                <IconLogout />
                Logout
              </el-dropdown-item>

              <el-dropdown-item
                v-if="userRole === 'admin'"
                class="flex items-center py-1.5 px-[19px]
              hover:bg-gray-200 cursor-pointer text-gray-500 text-base"
                @click="navigateTo(routeNames.adminPanel)"
              >
                <IconAdmin />
                Admin Panel
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
  { name: routeNames.exercises },
  { name: routeNames.gymFriends }
]

const router = useRouter()
const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

const userRole = ref('')

const avatarPlaceholder = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'

function navigateTo (routeName: string) {
  router.push({ name: routeName })
}

async function logout () {
  navigateTo(routeNames.login)
  localStorage.clear()
  await authService.signOut()
}

onMounted(async () => {
  try {
    userRole.value = localStorage.getItem('role') || ''
    localStorage.setItem('body_weight', profile.value?.data.body_weight?.toString() || '')
  } catch (error: any) {
    ElNotification({
      title: 'Error',
      message: error.message,
      type: 'error'
    })
  }
})
</script>

<style scoped lang="scss">
.router-link-active.router-link-exact-active.nav-link {
  border-bottom: 2px solid #1D83EA !important;
  color: black !important;
}

.avatar-wrapper{
  .el-image{
    :first-child{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
