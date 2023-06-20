<template>
  <div v-if="!isWorkoutFinished" v-loading="loading">
    <div class="flex justify-between bg-white p-4 rounded-lg mb-4 border border-gray-300">
      <div clas="flex flex-col">
        <p class="text-xl font-semibold">Duration</p>
        <p class="flex justify-center text-lg text-gray-400 font-semibold">{{ formatTime }}</p>
      </div>
      <div clas="flex flex-col">
        <p class="text-xl font-semibold">Total Volume</p>
        <p class="flex justify-center text-lg text-gray-400 font-semibold">{{ volume }}</p>
      </div>
      <div clas="flex flex-col">
        <p class="text-xl font-semibold">Current Volume</p>
        <p class="flex justify-center text-lg text-gray-400 font-semibold">{{ currentVolume }}</p>
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
          @click="finishRoutine"
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

      <div class="w-full border border-gray-300 rounded-md overflow-hidden">
        <WorkoutCard
          v-for="exercise in exercises"
          :key="exercise.id"
          :exercise="exercise"
          :sets="exercise.sets"
          :bodyweight="bodyweight"
          :isWorkoutStarted="isRunning"
          class="border-b border-gray-300 last:border-none"
          @addSet="exercise.sets.push({} as ISetRoutine)"
          @deleteSet="exercise.sets.splice($event, 1)"
          @setComplete="setComplete($event)"
          @exerciseCompleted="exerciseCompleted($event)"
        />
      </div>
    </div>
  </div>

  <div v-else>
    <FinishWorkout :completedWorkout="exercises" :duration="time" />
  </div>
</template>

<script lang="ts" setup>
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
const isWorkoutFinished = ref(false)
const totalVolume = ref(0)
const bodyweight = ref(0)

const formatTime = computed(() => {
  const hours = Math.floor(time.value / 3600).toString().padStart(2, '0')
  const minutes = Math.floor((time.value % 3600) / 60).toString().padStart(2, '0')
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
  return exercises.value.reduce((acc, exercise) => {
    return (
      acc +
      exercise.sets.reduce((acc, set) => {
        return acc + (set.reps || set.duration as number) * (set.weight || bodyweight.value)
      }, 0)
    )
  }, 0)
})

const currentVolume = ref(0)
function setComplete (set: ISetRoutine) {
  console.log('set complete', set)
  exercises.value.forEach((item) => {
    item.sets.forEach((setItem) => {
      if (setItem.id === set.id) {
        setItem.set_done = true
      }
    })
  })
  currentVolume.value += (set.reps || set.duration || 0) * (set.weight || bodyweight.value)
}

function finishRoutine () {
  const checkAllSetDone = exercises.value.every((item) => item.sets.every((setItem) => setItem.set_done))

  if (checkAllSetDone) {
    ElMessageBox.confirm(
      'Congratulations! You have completed this workout.',
      'Success!',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'success'
      }
    ).then(() => {
      pauseTimer()
      isWorkoutFinished.value = true
    })
      .catch((e: any) => {
        console.log(e)
      })
  } else {
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
      .catch((e: any) => {
        console.log(e)
      })
  }
}

const confirmDiscard = () => {
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
    .catch((e: any) => {
      console.log(e)
    })
}

window.addEventListener('beforeunload', (e) => {
  if (formatTime.value !== '00:00:00') {
    e.preventDefault()
    e.returnValue = ''
  }
})

async function exerciseCompleted (exercise: IExerciseStatistics) {
  totalVolume.value += exercise.volume
  await routinesService.insertExerciseStatistics(exercise)
}

onMounted(async () => {
  try {
    loading.value = true
    await getExerciseTypes()
    const { data, error } = await routinesService.getSetsByRoutineId(currentRoute as string)
    if (error) throw new Error(error.message)

    const routineSets = data

    const exercisePromises = [...new Set(routineSets.map((set) => set.exercise_id))]
      .map((id: string) => routinesService.getExerciseById(id))

    const exercisesFetched = (await Promise.all(exercisePromises)).map((item) => {
      if (item.error) throw new Error('Error fetching exercises')
      return item.data[0] as IExerciseExchange
    })

    exercises.value = exercisesFetched.map((item: IExerciseExchange) => {
      return {
        id: item.id,
        title: item.title,
        exercise_type: hashedExerciseTypes.value[item.exercise_type],
        equipment_category: item.equipment_category,
        muscle_group: item.muscle_group,
        thumbnails_url: item.thumbnails_url,
        sets: routineSets.filter((set) => set.exercise_id === item.id)
      } as IExerciseRoutine
    })
    bodyweight.value = localStorage.getItem('bodyweight') ? Number(localStorage.getItem('bodyweight')) : 1
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', () => ({}))
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
</style>
