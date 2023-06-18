<template>
  <div v-loading="loading" class="flex gap-4 justify-between">
    <div class="grow">
      <div class="flex justify-between mb-4">
        <p class="font-bold text-xl">Edit routine</p>

        <ElButton
          class="w-[200px]"
          type="primary"
          :disabled="!isValid"
          @click="editHandler"
        >
          Edit Routine
        </ElButton>
      </div>

      <div class="bg-white p-4 rounded-lg border border-gray-200 flex flex-col min-h-[780px]">
        <div class="title-wrapper">
          <ElInput
            v-model="editRoutine.title"
            class="text-3xl text-gray-400 w-full py-4 pr-4 border-b-2 border-b-200"
            placeholder="Routine Title"
          />
        </div>

        <div v-if="exercises.length">
          <ExerciseCard
            v-for="(exercise, index) in exercises"
            :key="exercise.id"
            :exercise="exercise"
            :sets="exercise.sets"
            :class="{ 'border-b border-gray-300'
              : index !== exercises.length - 1, 'border-none'
              : index === exercises.length - 1 }"
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
      class="sticky  hidden h-[600px] lg:flex"
      @addExercise="addExercise($event)"
    />
  </div>
</template>

<script lang="ts" setup>
const exercisesStore = useExercisesStore()
const { hashedExerciseTypes } = storeToRefs(exercisesStore)
const router = useRouter()
const editingRoutineId = ref(router.currentRoute.value.params.id as string)
const { generateGUID } = useHelpers()
const { userId } = storeToRefs(useGeneralStore())

const exercises = ref<IExerciseRoutine[]>([])
const loading = ref(false)
const initialExercisesValue = ref<IExerciseRoutine[]>([])
const initialTitle = ref('')

const editRoutine = ref({
  id: generateGUID(),
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
      routine_id: editRoutine.value.id
    }))
  })
})

function addExercise (exercise: IExerciseRoutine) {
  exercises.value.push(exercise)
}

function deleteExercise (exerciseId: string) {
  exercises.value = exercises.value.filter((e) => e.id !== exerciseId)
}

async function editHandler () {
  try {
    const { error: insertRoutineErr } = await routinesService.insertRoutine(editRoutine.value)
    const { error: insertSetsErr } = await routinesService.insertSets(exerciseSets.value)
    const { error: deleteRoutineSetsErr } = await routinesService.deleteRoutineSets(editingRoutineId.value)
    const { error: deleteRoutineErr } = await routinesService.deleteRoutine(editingRoutineId.value)
    if (insertRoutineErr || insertSetsErr || deleteRoutineSetsErr || deleteRoutineErr) throw new Error('Error saving routine')
    ElNotification({
      title: 'Success',
      message: 'Routine edited successfully',
      type: 'success'
    })
    await router.push({ name: 'routines' })
  } catch (err: any) {
    ElNotification({
      title: 'Error',
      message: err.message,
      type: 'error'
    })
  }
}

onMounted(async () => {
  try {
    loading.value = true

    const [routine, routineSets] = await Promise.all([
      routinesService.getRoutine(editingRoutineId.value),
      routinesService.getSetsByRoutineId(editingRoutineId.value)
    ])

    if (routine.error || routineSets.error) throw new Error('Error fetching routine')

    const exercisePromises = [...new Set(routineSets.data.map((set) => set.exercise_id))]
      .map((id: string) => routinesService.getExerciseById(id))

    const exercisesFetched = (await Promise.all(exercisePromises)).map((item) => {
      if (item.error) throw new Error('Error fetching exercises')
      return item.data[0] as IExerciseExchange
    })

    exercises.value = exercisesFetched.map((item: IExerciseExchange) => {
      return {
        ...item,
        exercise_type: hashedExerciseTypes.value[item.exercise_type],
        sets: routineSets.data.filter((set) => set.exercise_id === item.id),
        rest_time: routineSets.data.find((set) => set.exercise_id === item.id)?.rest_time
      } as IExerciseRoutine
    })
    editRoutine.value.title = routine.data[0].title
    initialTitle.value = routine.data[0].title
    initialExercisesValue.value = JSON.parse(JSON.stringify(exercises.value))
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
})

const isValid = computed(() => {
  const validationConditions = {
    title: editRoutine.value.title.trim() !== '',
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
  const isModified = JSON.stringify(exercises.value) !== JSON.stringify(initialExercisesValue.value) ||
  initialTitle.value !== editRoutine.value.title

  if (isModified) {
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
  const isModified = JSON.stringify(exercises.value) !== JSON.stringify(initialExercisesValue.value) ||
  initialTitle.value !== editRoutine.value.title

  if (isModified) {
    e.preventDefault()
    e.returnValue = ''
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', () => {})
})
</script>

<style lang="scss">
.title-wrapper {
  .el-input {
    .el-input__wrapper {
      box-shadow: none
    }
    .el-input__inner {
      height: fit-content;
    }
  }
}
</style>
