<template>
  <div class="flex flex-col">
    <div class="flex bg-white border border-gray-300 rounded-xl mb-4 p-5">
      <el-image
        :src="currentProfile.avatar_url"
        class="w-[100px] h-[100px] rounded-full overflow-hidden mr-4"
      />
      <div>
        <p class="text-xl font-bold mb-2">{{ currentProfile.full_name }}</p>
        <div class="text-sm w-fit">
          <p class="flex text-gray-400">Workouts</p>

          <!-- <p class="flex justify-center">{{ testData.length }}</p> -->
        </div>
      </div>
    </div>
    <div class="flex justify-between">
      <div class="w-full">
        <p class="text-xl font-bold mb-4">Workouts</p>

        <!-- <div class="flex flex-col items-center lg:mr-4">
          <WorkoutLog
            v-for="testDataItem in testData"
            :key="testDataItem.id"
            :log="testDataItem"
          />
        </div> -->
      </div>

      <div class="hidden lg:block w-full max-w-[377px]">
        <p class="text-xl font-bold mb-4">Statistics</p>

        <div class="flex bg-white border border-gray-300 rounded-xl p-4">
          Statistics
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WorkoutLog from './components/WorkoutLog.vue'

const profileStore = useProfileStore()
const { profile, currentUserId } = storeToRefs(profileStore)
const { getProfile, getCurrentUser } = profileStore

const currentProfile = ref({
  avatar_url: '',
  username: '',
  full_name: ''
})

onBeforeMount(async () => {
  await getCurrentUser()
  await getProfile(currentUserId.value)
  currentProfile.value = profile.value.data
})

</script>
