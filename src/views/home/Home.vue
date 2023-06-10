<template>
  <div class="flex flex-col">
    <div class="flex bg-white border border-gray-300 rounded-xl mb-4 p-5">
      <ElImage
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

        <div class="flex flex-col items-center lg:mr-4">
          <WorkoutLog
            v-for="testDataItem in testData"
            :key="testDataItem.id"
            :log="testDataItem"
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
</template>

<script lang="ts" setup>
import { ca } from 'element-plus/es/locale/index.js'
import WorkoutLog from './components/WorkoutLog.vue'

const profileStore = useProfileStore()
const { profile, currentUserId } = storeToRefs(profileStore)
const { getProfile, getCurrentUser } = profileStore

const homeService = useHomeStore()
const { getFeeds, getUniqueRoutineIds, getRoutines, getRoutinesWithDetails } = homeService
const { feeds, routines, routinesIds, routinesWithDetails: routinesSets } = storeToRefs(homeService)

const currentProfile = ref({
  avatar_url: '',
  username: '',
  full_name: ''
})

onMounted(async () => {
  try {
    await getCurrentUser()
    await getProfile(currentUserId.value)
    await getFeeds(currentUserId.value)
    getUniqueRoutineIds(feeds.value)
    await getRoutines(routinesIds.value)
    await getRoutinesWithDetails(routinesIds.value)

    const exercisePromises = [...new Set(routinesSets.value.map((item) => {
      return item.data.map((item) => item.exercise_id)
    }))]

    // const exercisesFetched = (await Promise.all(exercisePromises)).map((item) => {
    //   if (item.error) throw new Error('Error fetching exercises')
    //   return item.data[0] as IExerciseExchange
    // })

    currentProfile.value = profile.value.data
    console.log('routines', routines.value)
    console.log('feeds', feeds.value)
    console.log('rotinesIds', routinesIds.value)
    console.log('routinesWithDetails', routinesSets.value)
    console.log('exercisePromises', exercisePromises)
    // console.log('exercisesFetched', exercisesFetched)
  } catch (err) {
    console.log(err)
  }
})

</script>
