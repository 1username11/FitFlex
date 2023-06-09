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

    <div class="flex items-center font-normal text-lg">
      <IconTimer />

      <p class="text-[#1d83ea] ml-1 mr-2">Rest timer</p>

      <p>{{ isLastSetDone ? 'Exercise Done': formattedRestTime }}</p>
    </div>

    <div class="flex justify-between px-2 text-lg font-medium">
      <p>Set</p>
      <template v-for="(value, key) in setsColumns" :key="key">
        <p
          v-if="value" class="capitalize"
          :class="{
            '-mr-5': key === 'weight',
            'mr-5': key === 'reps',
            'mr-1': key === 'duration',
          }"
        >
          {{ key }}
        </p>
      </template>
      <p
        :class="{
          'ml-1': setsColumns.weight,
        }"
      />
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
const { setsColumnsConditions } = useHelpers()
const setsColumns = setsColumnsConditions(props.exercise.exercise_type)

let timerId: any = null
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
  emit('exerciseCompleted', exerciseStatistic.value)
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
  if (setsColumns.weight) {
    const maxSet = props.sets.reduce((set, acc) => {
      (set.weight as number) > (acc.weight as number) ? acc = set : acc
      return acc
    }, {} as ISetRoutine)

    return {
      id: generateGUID(),
      user_id: localStorage.getItem('userId'),
      created_at: Date.now(),
      exercise_id: props.exercise.id,
      avarage_weight: props.sets.reduce((acc, set) => acc + (set.weight as number), 0) / props.sets.length,
      max_weight: props.sets.reduce((acc, set) => Math.max(acc, set.weight as number), 0),
      one_reps_max: Math.round((100 * (maxSet.weight as number)) /
      Math.abs(101.3 - (2.67123 * (maxSet.reps as number)))),
      volume: props.sets.reduce((acc, set) => acc + (set.weight as number) * (set.reps as number), 0)
    }
  } else if (setsColumns.reps) {
    return {
      id: generateGUID(),
      user_id: localStorage.getItem('userId'),
      created_at: Date.now(),
      exercise_id: props.exercise.id,
      most_reps: props.sets.reduce((acc, set) => Math.max(acc, set.reps as number), 0),
      avarage_reps: props.sets.reduce((acc, set) => acc + (set.reps as number), 0) / props.sets.length,
      volume: props.sets.reduce((acc, set) => acc + (props.bodyweight as number) * (set.reps as number), 0)
    }
  } else if (setsColumns.duration) {
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
</script>
