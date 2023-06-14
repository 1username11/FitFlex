<template>
  <div class="flex flex-col">
    <div class="flex bg-white border border-gray-300 rounded-xl mb-4 p-5">
      <el-image
        :src="currentProfile.avatar_url"
        class="w-[100px] h-[100px] rounded-full overflow-hidden mr-4"
      >
        <template #error>
          <div class="image-slot">
            <el-image src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" />
          </div>
        </template>
      </el-image>

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

        <div class="flex flex-col items-center lg:mr-4">
          <WorkoutLog
            v-for="feed in feeds"
            :key="feed.id"
            :user="currentProfile"
            :feed="feed"
            :hashedEquipment="hashedEquipment"
            :hashedExerciseTypes="hashedExerciseTypes"
          />
        </div>
      </div>

      <div class="hidden lg:block w-full max-w-[377px]">
        <p class="text-xl font-bold mb-4">Statistics</p>

        <div class="flex bg-white border border-gray-300 rounded-xl p-4">
          Statistics
        </div>
      </div>
    </div>
  </div>

  <p id="bottom-item" class="h-10" />
</template>

<script lang="ts" setup>
import { supabase } from '@/supabase'
import WorkoutLog from './components/WorkoutLog.vue'

const loading = ref(false)
const paginationStep = ref<number>(1)
const isAllFeedsLoaded = ref(false)

const generalStore = useGeneralStore()
const { userId } = storeToRefs(generalStore)

const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

const homeStore = useHomeStore()
const { getInitialFeeds } = homeStore
const { feeds } = storeToRefs(homeStore)

const exerciseStore = useExercisesStore()
const { hashedEquipment, hashedExerciseTypes } = storeToRefs(exerciseStore)
const { getEquipment, getExerciseTypes } = exerciseStore

async function detectElementByIntersection (userId: string) {
  try {
    loading.value = true
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async entry => {
        if (entry.isIntersecting && !isAllFeedsLoaded.value) {
          const { data, error } = await supabase
            .from('feed')
            .select('*')
            .eq('user_id', userId)
            .range(feeds.value.length, feeds.value.length + paginationStep.value)
          if (error) throw Error(error.message)
          if (data.length < paginationStep.value) {
            isAllFeedsLoaded.value = !isAllFeedsLoaded.value
          }
          console.log('data', data.length)
          console.log('isAllFeedsLoaded', isAllFeedsLoaded.value)

          feeds.value = [...feeds.value, ...data]
        }
      })
    }, {})

    observer.observe(document.getElementById('bottom-item') as any)
  } catch (err: any) {
    ElNotification({
      title: 'Error',
      message: err.message,
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

const currentProfile = ref({} as IUser)

onMounted(async () => {
  try {
    loading.value = true
    await Promise.all([
      getInitialFeeds(userId.value),
      getEquipment(),
      getExerciseTypes()
    ])
    if (profile.value?.error) throw new Error('Error fetching profile')

    currentProfile.value = profile.value?.data || {} as IUser

    await detectElementByIntersection(userId.value)
  } catch (err: any) {
    ElNotification({
      title: 'Error',
      message: err.message,
      type: 'error'
    })
  } finally {
    loading.value = false
  }
})

</script>
