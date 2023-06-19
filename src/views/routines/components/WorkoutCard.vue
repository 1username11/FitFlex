<template>
  <div class="bg-white p-4 w-full">
    <div class="flex justify-between mb-6">
      <div class="flex space-x-2 items-center">
        <el-image class="w-[40px] h-[40px] rounded-full overflow-hidden" :src="exercise.thumbnails_url">
          <template #error>
            <ImagePlaseholder />
          </template>
        </el-image>

        <p class="font-bold text-lg">{{ exercise.title }}</p>
      </div>
    </div>

    <div class="flex items-center">
      <IconTimer />

      <p class="text-[#1d83ea] ml-1 mr-2">Rest timer</p>

      <p>{{ isLastSetDone ? 'Exercise Done': formattedRestTime }}</p>
    </div>

    <div class="flex justify-between">
      <p>Set</p>
      <p
        v-if="['weighted bodyweight', 'weight reps', 'weight distance']
          .includes(exercise.exercise_type)"
      >
        KG
      </p>

      <p
        v-if="['weight reps', 'weighted bodyweight', 'assisted bodyweight', 'reps only']
          .includes(exercise.exercise_type)"
      >
        Reps
      </p>

      <p v-if="['duration', 'distance duration'].includes(exercise.exercise_type)">
        Duration
      </p>

      <p />
    </div>

    <WorkoutSet
      v-for="(set, idx) in sets"
      :key="set.id"
      :set="set"
      :serial="idx+1"
      :exerciseType="exercise.exercise_type"
      class="mb-3"
      :isWorokoutStarted="isWorkoutStarted"
      @setComplete="setComplete(idx, set)"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  exercise: IExerciseRoutine
  sets: ISetRoutine[]
  isWorkoutStarted: boolean
  bodyweight?: number
}>()

const emit = defineEmits(['addSet', 'deleteSet', 'deleteExercise', 'setComplete', 'exerciseCompleted'])

const { generateGUID } = useHelpers()

let timerId = null
const isLastSetDone = ref(false)
const restTime = ref(props.sets[0]?.rest_time || 0)

const formattedRestTime = computed(() => {
  const minutes = Math.floor(restTime.value / 60)
  const seconds = restTime.value % 60

  return `${padZero(minutes)}:${padZero(seconds)}`
})

function padZero (value: number) {
  return String(value).padStart(2, '0')
}

function startRestCountdown (idx: number) {
  const delay = 1000

  if (restTime.value !== props.sets[idx]?.rest_time) {
    clearTimeout(timerId)
    restTime.value = props.sets[idx]?.rest_time || 0
  }

  timerId = setTimeout(function tick () {
    restTime.value -= 1
    timerId = setTimeout(tick, delay)

    if (!restTime.value) {
      clearTimeout(timerId)
      restTime.value = props.sets[idx + 1]?.rest_time || 0
    }
  }, delay)

  emit('setComplete', props.sets[idx])
}

function lastSetComplete (idx: number) {
  emit('setComplete', props.sets[idx])
  isLastSetDone.value = true
}

function setComplete (idx: number, set: ISetRoutine) {
  set.set_done = true
  if (idx === props.sets.length - 1) {
    lastSetComplete(idx)
  } else {
    startRestCountdown(idx)
  }
}

const exerciseStatistic = computed(() => {
  if (['weight reps', 'weight distance', 'weighted bodyweight'].includes(props.exercise.exercise_type)) {
    return {
      id: generateGUID(),
      user_id: localStorage.getItem('userId'),
      created_at: Date.now(),
      exercise_id: props.exercise.id,
      avarage_weight: props.sets.reduce((acc, set) => acc + (set.weight as number), 0) / props.sets.length,
      max_weight: props.sets.reduce((acc, set) => Math.max(acc, set.weight as number), 0),
      one_reps_max: props.sets.reduce((acc, set) => Math.max(acc, set.weight as number), 0) / 0.033
    }
  } else if (['assisted bodyweight', 'reps only'].includes(props.exercise.exercise_type)) {
    return {
      id: generateGUID(),
      user_id: localStorage.getItem('userId'),
      created_at: Date.now(),
      exercise_id: props.exercise.id,
      most_reps: props.sets.reduce((acc, set) => Math.max(acc, set.reps as number), 0),
      avarage_reps: props.sets.reduce((acc, set) => acc + (set.reps as number), 0) / props.sets.length,
      volume: props.sets.reduce((acc, set) => acc + (props.bodyweight as number) * (set.reps as number), 0)
    }
  } else if (['duration', 'distance duration'].includes(props.exercise.exercise_type)) {
    return {
      id: generateGUID(),
      user_id: localStorage.getItem('userId'),
      created_at: Date.now(),
      exercise_id: props.exercise.id,
      best_set_duration: props.sets.reduce((acc, set) => Math.max(acc, set.duration as number), 0),
      avarage_duration: props.sets.reduce((acc, set) => acc + (set.duration as number), 0) / props.sets.length,
      volume: props.sets.reduce((acc, set) => acc + (props.bodyweight as number) * (set.duration as number), 0)
    }
  }
})

watch(isLastSetDone, (value) => {
  if (value) {
    emit('exerciseCompleted', exerciseStatistic.value)
  }
})
</script>
