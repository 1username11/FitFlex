<template>
  <div class=" lg:flex lg:flex-row-reverse lg:justify-between">
    <div class="flex flex-row space-x-3 mb-3 lg:flex lg:flex-col lg:justify-start lg:space-y-3 lg:space-x-0">
      <button
        class="w-full lg:w-[300px] h-9 rounded-md bg-[#1D83EA] text-white cursor-pointer mr-2 hover:bg-[#056DD7]"
        @click="navigate(routeNames.startWorkout)"
      >
        Start Routine
      </button>

      <button
        class="w-full lg:w-[300px] h-9 rounded-md bg-white cursor-pointer mr-2 border hover:bg-gray-100"
        @click="navigate(routeNames.editRoutine)"
      >
        Edit Routine
      </button>

      <button
        class="w-full lg:w-[300px] h-9 rounded-md bg-white cursor-pointer mr-2 border  hover:bg-gray-100"
        @click="copyLink"
      >
        Copy Link
      </button>
    </div>

    <div v-loading="loading" class="bg-white p-4 border border-gray-300 rounded-lg w-full mr-3">
      <p class="pb-4 text-3xl font-bold">{{ routine?.title }}</p>

      <div class="flex space-x-3 avatar-wrapper">
        <el-image class="w-10 h-10 rounded-full overflow-hidden" :src="avatar">
          <template #error>
            <ImagePlaseholder />
          </template>
        </el-image>

        <p>Created by {{ username }}</p>
      </div>

      <div>
        <Exercise
          v-for="(exerciseItem, idx) in routineDetailsWithExercises"
          :key="exerciseItem.id"
          :exercise="exerciseItem"
          :class="{ 'border-t border-gray-300': idx !== 0 }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/route-names'

const loading = ref(false)
const avatar = ref()
const username = ref()
const routineDetailsWithExercises = ref()

const routinesStore = useRoutinesStore()
const { routine, routineDetails } = storeToRefs(routinesStore)
const { getRoutineDetails } = routinesStore

const { profile } = storeToRefs(useProfileStore())

const router = useRouter()
function navigate (name: string) {
  router.push({ name, params: { id: router.currentRoute.value.params.id } })
}

const copyLink = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url)
  ElNotification({
    title: 'Success',
    message: 'Link copied to clipboard',
    type: 'success',
    duration: 2000
  })
}

onMounted(async () => {
  try {
    loading.value = true
    const { data, error } = await routinesService.getRoutine(router.currentRoute.value.params.id.toString())
    if (error) throw new Error(error.message)
    routine.value = data[0] as IRoutine
    avatar.value = profile?.value?.data.avatar_url
    username.value = profile?.value?.data.username

    await getRoutineDetails(router.currentRoute.value.params.id.toString())
    const exerciseIds = routineDetails.value.data.map((item: ISetRoutine) => item.exercise_id)
    const exercises = (await Promise.all(exerciseIds.map((exerciseId: string) =>
      routinesService.getExerciseById(exerciseId)
    ))).map((item) => item.data)

    routineDetailsWithExercises.value = routineDetails.value.data.map((item: ISetRoutine, index: number) => ({
      exercise_id: exercises[index][0].id,
      exercise_title: exercises[index][0].title,
      exercise_thumbnail: exercises[index][0].thumbnails_url,
      reps: item.reps,
      weight: item.weight,
      duration: item.duration
    })).reduce((result: IExerciseDetails[], item: IRoutineDetails) => {
      const existingExercise = result.find((exercise: IExerciseDetails) => exercise.id === item.exercise_id)

      if (existingExercise) {
        existingExercise.sets.push({
          reps: item.reps || null,
          weight: item.weight || null,
          duration: item.duration || null
        })
      } else {
        result.push({
          id: item.exercise_id,
          title: item.exercise_title,
          thumbnails_url: item.exercise_thumbnail,
          sets: [
            {
              reps: item.reps || null,
              weight: item.weight || null,
              duration: item.duration || null
            }
          ]
        })
      }

      return result
    }, [] as IExerciseDetails[])
  } catch (error: any) {
    ElNotification({
      title: 'Error',
      message: error.message,
      type: 'error',
      duration: 2000
    })
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss">
.avatar-wrapper {
  .el-image {
    &__inner {
      @apply w-full h-full;
    }
  }
}
</style>
