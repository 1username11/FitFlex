<template>
  <div v-loading="loading">
    <div class="flex justify-between bg-white p-4 rounded-lg mb-4">
      <div>
        <p>Duration</p>
        <p>{{ formatTime }}</p>
      </div>
      <div>
        <p>Volume</p>
        <p>{{ volume }}</p>
      </div>
      <div>
        <p>Current Volume</p>
        <p>{{ currentVolume }}</p>
      </div>
    </div>
    <div class="lg:flex lg:flex-row-reverse justify-between gap-4">
      <div class="flex space-x-4 lg:space-x-0 lg:flex-col lg:space-y-2 lg:grow mb-4">
        <button
          v-if="!isRunning"
          class="w-full lg:w-[300px] h-9 rounded-md bg-[#1D83EA] text-white cursor-pointer hover:bg-[#056DD7]"
          @click="startTimer"
        >
          Start
        </button>

        <button
          v-else
          class="w-full lg:w-[300px] h-9 rounded-md bg-[#1D83EA] text-white cursor-pointer hover:bg-[#056DD7]"
        >
          Finish
        </button>

        <button
          class="w-full lg:w-[300px] h-9 rounded-md bg-white cursor-pointer border hover:bg-gray-100"
          @click="pauseTimer"
        >
          Pause
        </button>

        <button
          v-if="isRunning"
          class="w-full lg:w-[300px] h-9 rounded-md bg-white cursor-pointer
          border border-red-300 hover:bg-red-100 text-red-500"
          @click="confirmDiscard"
        >
          Discard
        </button>
      </div>
      <div class="w-full">
        <WorkoutCard
          v-for="exercise in exercises"
          :key="exercise.id"
          :exercise="exercise"
          :sets="exercise.sets"
          :isWorokoutStarted="isRunning"
          @addSet="exercise.sets.push({} as ISet)"
          @deleteSet="exercise.sets.splice($event, 1)"
          @deleteExercise="routine?.exercises.splice($event, 1)"
          @setComplete="setComplete($event)"
          @exerciseCompleted="exerciseCompleted($event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'

import type { IExerciseRoutine, ISetRoutine } from './routine'

const routinesStore = useRoutinesStore()
const { routines } = storeToRefs(routinesStore)

const exerciseStore = useExercisesStore()
const { getExerciseTypes } = exerciseStore
const { hashedExerciseTypes } = storeToRefs(exerciseStore)

const router = useRouter()
const exercises = ref([] as IExerciseRoutine[])
const loading = ref(false)
const currentRoute = router.currentRoute.value.params.id
const initialTime = 0
const time = ref(initialTime)
const intervalRef = ref()
const isRunning = ref(false)
const isOverlayVisible = ref(false)

const formatTime = computed(() => {
  const hours = Math.floor(time.value / 3600)
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((time.value % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (time.value % 60).toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
})

function startTimer () {
  if (!isRunning.value) {
    isRunning.value = true
    intervalRef.value = setInterval(() => {
      time.value++
    }, 1000)
  }
}

function pauseTimer () {
  if (isRunning.value) {
    isRunning.value = false
    clearInterval(intervalRef.value)
    intervalRef.value = null
  }
}

const volume = computed(() => {
  return exercises.value.reduce((acc, curr) => {
    return acc + curr.sets.reduce((acc, curr) => {
      return acc + (curr.reps || 0) * (curr.weight || 0)
    }, 0)
  }, 0)
})

const currentVolume = ref(0)
function setComplete (set: ISetRoutine) {
  currentVolume.value += (set.reps || 0) * (set.weight || 0)
}

const confirmDiscard = () => {
  isOverlayVisible.value = true
  ElMessageBox.confirm(
    'Are you sure you want to discard this workout?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(() => {
    router.push({ name: 'routines' })
  })
    .catch((e) => {
      console.log(e)
      isOverlayVisible.value = false
    })
}

async function exerciseCompleted (exercise: IExerciseRoutine) {
  console.log('exercise completed', exercise)
  return await routinesService.insertExerciseStatistcs(exercise)
}

onMounted(async () => {
  try {
    loading.value = true
    getExerciseTypes()
    const routine = (await routinesService.getRoutine(currentRoute)).data
    const routineSets = (await routinesService.getSetsByRoutineId(currentRoute)).data
    const exercisePromises = routineSets.map((item) =>
      routinesService.getExerciseById(item.exercise_id)
    )
    const exercisesFetched = (await Promise.all(exercisePromises)).map((item) => item.data[0]).reduce((acc, curr) => {
      if (acc.find((item) => item.id === curr.id)) return acc
      return [...acc, curr]
    }, [])
    exercises.value = exercisesFetched.map((item) => ({
      created_at: item.created_at,
      title: item.title,
      equipment_category: item.equipment_category,
      muscle_group: item.muscle_group,
      secondary_muscle: item.secondary_muscle,
      exercise_media_url: item.exercise_media_url,
      exercise_type: hashedExerciseTypes.value[item.exercise_type],
      id: item.id,
      thumbnails_url: item.thumbnails_url,
      sets: routineSets?.filter((set) => set.exercise_id === item.id) as ISet[]
    }))

    console.log('hashedExerciseTypes', hashedExerciseTypes.value)
    console.log('routineSets', routineSets)

    console.log('exercises', exercises.value)
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}
.el-message-box{
}
</style>
