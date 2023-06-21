<template>
  <div class="flex flex-col">
    <div class="flex items-center bg-white border border-gray-300 rounded-xl mb-4 p-5 home-avatar-wrapper">
      <el-image
        :src="currentProfile.avatar_url"
        class="w-[100px] h-[100px] rounded-full overflow-hidden mr-4"
      >
        <template #error>
          <el-image src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" />
        </template>
      </el-image>

      <div>
        <p class="text-xl font-bold mb-2">{{ currentProfile.full_name }}</p>

        <div class="flex space-x-5">
          <div class="text-sm w-fit">
            <p class="flex text-gray-400">Workouts</p>

            <p class="flex justify-center">{{ chartData.length - 1 }}</p>
          </div>

          <div class="text-sm w-fit">
            <p class="flex text-gray-400">Last workout</p>

            <p class="flex justify-center">
              {{ chartData.length > 1 ? `${chartData[chartData.length - 1][1]} sec` : 0 }}
            </p>
          </div>
        </div>

        <p class="font-semibold mt-4 text-gray-400"> {{ currentProfile.bio }}</p>
      </div>
    </div>

    <div class="flex justify-between">
      <div class="w-full">
        <p class="text-xl font-bold mb-4">Workouts</p>

        <div v-if="feeds.length" class="flex flex-col items-center lg:mr-4">
          <WorkoutLog
            v-for="feed in feeds"
            :key="feed.feed_id"
            :user="currentProfile"
            :feed="feed"
            :hashedEquipment="hashedEquipment"
            :hashedExerciseTypes="hashedExerciseTypes"
          />
        </div>

        <div v-else class="h-full flex items-center justify-center">
          <p class="text-gray-400 text-xl font-semibold">No Data</p>
        </div>

        <div v-if="!isAllFeedsLoaded" id="bottom-item" v-loading="loading" class="h-10" />
      </div>

      <div class="hidden lg:block w-full max-w-[377px]">
        <p class="text-xl font-bold mb-4">Statistics</p>

        <div>
          <div class="flex justify-center items-center bg-white border border-gray-300 rounded-xl p-4 min-h-[256px]">
            <HomePageChart v-if="chartData.length > 1" :chartData="chartData" />
            <p v-else class="text-gray-400 text-xl font-semibold">No Data</p>
          </div>

          <draggable
            v-model="routineList"
            :animation="300"
            item-key="id"
            class="cursor-move text-ellipsis overflow-hidden"
          >
            <template #item="{ element: workout }">
              <RoutinesItem :routine="workout" />
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import draggable from 'vuedraggable'

const loading = ref(false)
const paginationStep = ref<number>(1)
const isAllFeedsLoaded = ref(false)

const { userId } = storeToRefs(useGeneralStore())
const { profile } = storeToRefs(useProfileStore())

const { feeds } = storeToRefs(useHomeStore())

const exerciseStore = useExercisesStore()
const { hashedEquipment, hashedExerciseTypes } = storeToRefs(exerciseStore)
const { getEquipment, getExerciseTypes } = exerciseStore

const routinesStore = useRoutinesStore()
const { routineList } = storeToRefs(routinesStore)
const { getRoutines } = routinesStore

const currentProfile = ref({} as IProfile)
const chartData = ref<[string, number | string][]>([
  ['x', 'y'] // Initial data. It should be always in array.
])

async function detectElementByIntersection (userId: string) {
  try {
    loading.value = true
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async entry => {
        if (entry.isIntersecting && !isAllFeedsLoaded.value) {
          const { data, error } = await homeService
            .getFeeds(userId, feeds.value.length, feeds.value.length + paginationStep.value)

          if (error) throw Error(error.message)
          if (data?.length < paginationStep.value) {
            isAllFeedsLoaded.value = !isAllFeedsLoaded.value
          }

          feeds.value = [...feeds.value, ...data] as IFeedResponse[]
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

function getShortWeekdayName (timestamp: number) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const date = new Date(timestamp)
  const weekday = date.getDay()
  return daysOfWeek[weekday]
}

async function getInitialFeed (userId: string) {
  const { data, error } = await homeService.getFeeds(userId, 0, 1)
  if (error) throw Error(error.message)
  feeds.value = data as IFeedResponse[]
}

async function homePageInit () {
  await Promise.all([
    getInitialFeed(userId.value),
    getEquipment(),
    getExerciseTypes(),
    getRoutines(userId.value)
  ])

  if (profile.value?.error) throw new Error('Error fetching profile')
  currentProfile.value = profile.value?.data as IProfile
}

async function getDataForChart () {
  const lastWeekTimeStamp = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).getTime()
  const { data, error } = await homeService.getWorkoutsDuration(userId.value, lastWeekTimeStamp)

  if (error) throw new Error(error.message)

  data.forEach(item => {
    chartData.value.push([getShortWeekdayName(item.created_at), item.duration as number])
  })
}

onMounted(async () => {
  try {
    loading.value = true
    feeds.value = []
    await homePageInit()
    await detectElementByIntersection(userId.value)
    await getDataForChart()
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

<style lang="scss">
.home-avatar-wrapper{
  .el-image {
    &__inner {
      @apply w-full h-full;
    }
  }
}
</style>
