<template>
  <div>
    <div class="flex justify-between bg-white p-4 rounded-lg mb-4">
      <div>
        <p>Duration</p>
        <p>{{ formatTime(duration) }}</p>
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
          class="w-full lg:w-[300px] h-9 rounded-md bg-[#1D83EA] text-white cursor-pointer hover:bg-[#056DD7]"
        >
          Start
        </button>

        <button
          class="w-full lg:w-[300px] h-9 rounded-md bg-white cursor-pointer border hover:bg-gray-100"
        >
          Pause
        </button>

        <button
          class="w-full lg:w-[300px] h-9 rounded-md bg-white cursor-pointer border  hover:bg-gray-100"
        >
          Finish
        </button>
      </div>
      <div>
        <WorkoutCard
          v-for="exercise in routine?.exercises"
          :key="exercise.id"
          :exercise="exercise"
          :sets="exercise.sets"
          @addSet="exercise.sets.push({} as ISet)"
          @deleteSet="exercise.sets.splice($event, 1)"
          @deleteExercise="routine?.exercises.splice($event, 1)"
          @setComplete="setComplete($event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const routinesStore = useRoutinesStore()
const { routines } = storeToRefs(routinesStore)

const params = useRouter().currentRoute.value.params.id
const routine = ref(routines.value.find((workout) => workout.id === params))

const volume = computed(() => {
  if (routine.value) {
    return routine.value.exercises.reduce((acc, exercise) => {
      return acc + exercise.sets.reduce((acc, set) => {
        return acc + (set.reps || 0) * (set.weight || 0)
      }, 0)
    }, 0)
  }
})

const currentVolume = ref(0)
function setComplete (set: ISet) {
  currentVolume.value += (set.reps || 0) * (set.weight || 0)
}

const duration = ref(0)
function startTimer () {
  setInterval(() => {
    duration.value++
  }, 1000)
}
function formatTime (seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const formattedHours = padNumber(hours)
  const formattedMinutes = padNumber(minutes)
  const formattedSeconds = padNumber(remainingSeconds)

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

function padNumber (number: number): string {
  return number.toString().padStart(2, '0')
}

onMounted(startTimer)
</script>

<style lang="scss">
</style>
