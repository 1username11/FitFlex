<template>
  <div class="flex flex-col">
    <div class="flex bg-white border border-gray-300 rounded-xl mb-4 p-5 home-avatar-wrapper">
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

        <div class="flex space-x-5">
          <div class="text-sm w-fit">
            <p class="flex text-gray-400">Workouts on this week</p>

            <p class="flex justify-center">{{ chartData.length - 1 }}</p>
          </div>

          <div class="text-sm w-fit">
            <p class="flex text-gray-400">Last workout duration</p>

            <p class="flex justify-center">{{ chartData[chartData.length - 1][1] }}</p>
          </div>
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
              <RoutinesItem
                :routine="workout"
              />
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>

  <p id="bottom-item" class="h-10" />
</template>

<script lang="ts" setup>
import { supabase } from '@/supabase'
import WorkoutLog from './components/WorkoutLog.vue'
import draggable from 'vuedraggable'

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

const routinesStore = useRoutinesStore()
const { routineList } = storeToRefs(routinesStore)
const { getRoutines } = routinesStore

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
const chartData = ref<[string, number | string][]>([
  ['x', 'y']
])
function getShortWeekdayName (timestamp: number) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const date = new Date(timestamp)
  const weekday = date.getDay()
  return daysOfWeek[weekday]
}
function getTimestampWithinLastWeek () {
  const now = new Date() // Поточна дата та час
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // Таймстемп одного тижня назад

  const timestamp = Math.floor(Math.random() * (now.getTime() - oneWeekAgo.getTime())) + oneWeekAgo.getTime()

  return timestamp
}

onMounted(async () => {
  try {
    loading.value = true
    await Promise.all([
      getInitialFeeds(userId.value),
      getEquipment(),
      getExerciseTypes()
    ])
    if (profile.value?.error) throw new Error('Error fetching profile')
    console.log('profile', profile.value?.data)

    currentProfile.value = profile.value?.data || {} as IUser

    await detectElementByIntersection(userId.value)

    const { data, error } = await supabase.from('feed').select('created_at, duration').gt('created_at', getTimestampWithinLastWeek()).eq('user_id', userId.value)
    if (error) throw new Error(error.message)
    console.log('data', data)
    data.forEach(item => {
      chartData.value.push([getShortWeekdayName(item.created_at), item.duration as number])
    })
    await getRoutines(userId.value)
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
  .el-image{
    :first-child{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
