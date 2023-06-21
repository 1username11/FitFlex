<template>
  <div class="flex lg:gap-4 justify-between">
    <div class="grow">
      <div class="flex justify-between mb-4">
        <p class="font-bold text-xl">Create routine</p>

        <ElButton
          class="max-w-[200px]"
          type="primary"
          :disabled="!isValid"
          @click="saveHandler"
        >
          Save Routine
        </ElButton>
      </div>

      <div class="bg-white md:p-4 rounded-lg border border-gray-200 flex flex-col min-h-[780px]">
        <div class="create-routine-title-wrapper">
          <ElInput
            v-model="routine.title"
            class="text-3xl text-gray-400 w-full py-4 pr-4 border-b-2 border-b-200"
            placeholder="Routine Title"
          />
        </div>

        <div v-if="exercises.length">
          <ExerciseCard
            v-for="exercise in exercises"
            :key="exercise.id"
            :exercise="exercise"
            :sets="exercise.sets"
            class="border-b border-gray-300 last:border-none"
            @addSet="exercise.sets.push({} as ISetRoutine)"
            @deleteSet="exercise.sets?.splice($event, 1)"
            @deleteExercise="deleteExercise"
            @setUpdate="exercise.sets[$event.idx] = $event.set"
            @setRestTime="exercise.rest_time = $event"
          />
        </div>

        <div v-else class="flex flex-col justify-center items-center h-full my-auto">
          <IconNoItems />
          <p class="text-lg font-bold mt-4">Get started</p>
          <p class="mt-1">Start by adding an exercise to your routine.</p>
        </div>
      </div>
    </div>

    <Filters
      class="sticky hidden h-[600px] lg:flex"
      @addExercise="addExercise"
    />
  </div>
</template>

<script lang="ts" setup>
const { generateGUID } = useHelpers()
const { userId } = storeToRefs(useGeneralStore())

const router = useRouter()

let shouldCheckUnsavedChanges = true
const exercises = ref<IExerciseRoutine[]>([])
const routine = ref({
  id: generateGUID(), // we generate this id for exercises sets
  created_at: new Date(),
  user: userId.value,
  title: ''
} as IRoutine)

const exerciseSets = computed(() => {
  return exercises.value.flatMap((exercise: IExerciseRoutine) => {
    return exercise.sets.map((set: ISetRoutine) => ({
      id: generateGUID(),
      reps: set.reps || null,
      rest_time: exercise.rest_time || null,
      duration: set.duration || null,
      weight: Number(set.weight) || null,
      exercise_id: exercise.id,
      routine_id: routine.value.id
    }))
  })
})

function addExercise (exercise: IExerciseRoutine) {
  exercises.value.push(exercise)
}

function deleteExercise (exerciseId: string) {
  exercises.value = exercises.value.filter((e) => e.id !== exerciseId)
}

async function saveHandler () {
  try {
    const { error: insertRoutineErr } = await routinesService.insertRoutine(routine.value)
    const { error: insertSetsErr } = await routinesService.insertSets(exerciseSets.value)

    if (insertRoutineErr || insertSetsErr) throw new Error('Error while inserting routine')
    ElNotification({ title: 'Success', message: 'Routine created successfully', type: 'success' })
    shouldCheckUnsavedChanges = false
    await router.push({ name: 'routines' })
  } catch (error: any) {
    ElNotification({ title: 'Error', message: error.message, type: 'error' })
  }
}

const isValid = computed(() => {
  const validationConditions = {
    title: routine.value.title.trim() !== '',
    exercises: exercises.value.length && exercises.value.every((exercise) => {
      return exercise.sets.length && exercise.sets.every((set) => {
        if (exercise.exercise_type === 'weight reps' || exercise.exercise_type === 'weighted bodyweight') {
          return set.weight && set.reps
        } else if (exercise.exercise_type === 'reps only' || exercise.exercise_type === 'assisted bodyweight') {
          return !!set.reps
        } else if (exercise.exercise_type === 'duration' || exercise.exercise_type === 'distance duration') {
          return !!set.duration
        } else if (exercise.exercise_type === 'weight distance') {
          return set.weight && set.duration
        }
      })
    })
  }
  return validationConditions.title && validationConditions.exercises
})

onBeforeRouteLeave(async (to, from, next) => {
  const isModified = JSON.stringify(exercises.value) !== '[]'

  if (isModified && shouldCheckUnsavedChanges) {
    await ElMessageBox.confirm(
      'You have unsaved changes, are you sure you want to leave?',
      'Warning',
      {
        confirmButtonText: 'Leave',
        cancelButtonText: 'Stay',
        type: 'warning'
      }
    )
      .then(() => {
        next()
      })
      .catch(() => {
        next(false)
      })
  } else {
    next()
  }
})

window.addEventListener('beforeunload', (e) => {
  const isModified = JSON.stringify(exercises.value) !== '[]'
  if (isModified) {
    e.preventDefault()
    e.returnValue = ''
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', () => '')
})
</script>

<style lang="scss">
.create-routine-title-wrapper {
  .el-input {
    font-size: x-large;
    .el-input__wrapper {
      box-shadow: none
    }
    .el-input__inner {
      height: fit-content;
    }
  }
}
</style>
