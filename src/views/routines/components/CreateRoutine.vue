<template>
  <div class="flex gap-4 justify-between">
    <div class="grow">
      <div class="flex justify-between mb-4">
        <p class="font-bold text-xl">Create routine</p>

        <ElButton
          class="w-[200px]"
          type="primary"
          :disabled="!isValid"
          @click="saveHandler"
        >
          Save Routine
        </ElButton>
      </div>

      <div class="bg-white p-4 rounded-lg border border-gray-200 flex flex-col min-h-[780px]">
        <div class="title-wrapper">
          <ElInput
            v-model="title"
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
            :class="{'border-b border-gray-300'
              : index !== exercises.length - 1, 'border-none'
              : index === exercises.length - 1}"
            @addSet="exercise.sets.push({} as ISetRoutine)"
            @deleteSet="exercise.sets?.splice($event, 1)"
            @deleteExercise="exercises.splice($event, 1)"
            @setUpdate="exercise.sets[$event.idx] = $event.set"
            @setRestTime="exercise.rest_time = $event"
          />
        </div>
        <div
          v-else
          class="flex flex-col justify-center items-center h-full my-auto"
        >
          <IconNoItems />

          <p class="text-lg font-bold mt-4">
            Get started
          </p>

          <p class="mt-1">
            Start by adding an exercise to your routine.
          </p>
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

const emits = defineEmits(['save'])

const router = useRouter()
const title = ref<string>('')
const exercises = ref<IExerciseRoutine[]>([])
const createdRoutineModel = computed(() => {
  return {
    title: title.value,
    exercises: exercises.value
  }
})

const { generateGUID } = useHelpers()

const generalStore = useGeneralStore()
const { userId } = storeToRefs(generalStore)

function addExercise (event: IExerciseRoutine) {
  exercises.value.push(event)
}

async function saveHandler () {
  try {
    emits('save')
    const routine = ref({
      id: generateGUID(),
      created_at: new Date(),
      user: userId.value,
      title: title.value
    })

    const exerciseSets = computed(() => {
      return createdRoutineModel.value.exercises.map((exercise: IExerciseRoutine) => {
        const sets = exercise.sets.map((set: ISetRoutine) => ({
          id: generateGUID(),
          reps: set.reps || null,
          rest_time: exercise.rest_time || null,
          duration: set.duration || null,
          weight: Number(set.weight) || null,
          exercise_id: exercise.id,
          routine_id: routine.value.id
        }))

        return sets
      })
    })
    const { error: insertRoutineErr } = await routinesService.insertRoutine(routine.value)
    const { error: insertSetsErr } = await routinesService.insertSets(exerciseSets.value.flat())
    if (insertRoutineErr || insertSetsErr) throw new Error('Error while inserting routine')
    ElNotification({
      title: 'Success',
      message: 'Routine created successfully',
      type: 'success'
    })
    router.push({ name: 'routines' })
  } catch (error: any) {
    ElNotification({
      title: 'Error',
      message: error.message,
      type: 'error'
    })
  }
}

function validateExerciseObject (obj) {
  // Перевірка наявності заголовка
  if (!obj.title || obj.title.trim() === '') {
    return false
  }

  // Перевірка наявності принаймні однієї вправи
  if (!obj.exercises || obj.exercises.length === 0) {
    return false
  }

  // Перевірка наявності принаймні одного непорожнього поля в sets кожної вправи
  for (const exercise of obj.exercises) {
    if (!exercise.sets || exercise.sets.length === 0) {
      return false
    }

    let hasNonEmptyField = false
    for (const set of exercise.sets) {
      // Перевірка наявності принаймні одного непорожнього поля в кожному set
      if (Object.values(set).some((value) => value && value.trim() !== '')) {
        hasNonEmptyField = true
        break
      }
    }

    if (!hasNonEmptyField) {
      return false
    }
  }

  // Пройдено всі перевірки
  return true
}

const isValid = computed(() => {
  return validateExerciseObject(createdRoutineModel.value)
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
