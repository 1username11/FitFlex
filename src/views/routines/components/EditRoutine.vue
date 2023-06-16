<template>
  <div v-loading="loading" class="flex gap-4 justify-between">
    <div class="grow">
      <div class="flex justify-between mb-4">
        <p class="font-bold text-xl">Edit routine</p>

        <ElButton
          class="w-[200px]"
          type="primary"
          :disabled="!isValid"
          @click="saveHandler"
        >
          Edit Routine
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
            :class="{ 'border-b border-gray-300'
              : index !== exercises.length - 1, 'border-none'
              : index === exercises.length - 1 }"
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

const exercisesStore = useExercisesStore()
const { hashedExerciseTypes } = storeToRefs(exercisesStore)

const title = ref<string>('')
const exercises = ref<IExerciseRoutine[]>([])
const loading = ref(false)

const router = useRouter()
const currentRoute = router.currentRoute.value.params.id

const generalStore = useGeneralStore()
const { generateGUID } = generalStore
const { userId } = storeToRefs(generalStore)

function addExercise (event: IExerciseRoutine) {
  console.log(event)

  const exercise = ref<IExerciseRoutine>({
    id: event.id,
    title: event.title,
    sets: event.sets,
    exercise_type: event.exercise_type as string,
    equipment_category: event.equipment_category,
    muscle_group: event.muscle_group,
    thumbnails_url: event.thumbnails_url,
    is_public: event.is_public
  })

  exercises.value.push(exercise.value)
}

const editRoutineModel = computed(() => {
  return {
    title: title.value,
    exercises: exercises.value
  }
})

async function saveHandler () {
  emits('save')
  const routine = ref({
    id: generateGUID(),
    created_at: new Date(),
    user: userId.value,
    title: title.value
  })

  const exerciseSets = computed(() => {
    return editRoutineModel.value.exercises.map((exercise) => {
      const sets = exercise.sets?.map((set) => ({
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
  await routinesService.insertRoutine(routine.value)
  await routinesService.insertSets(exerciseSets.value.flat())
  await routinesService.deleteRoutineSets(currentRoute as string)
  await routinesService.deleteRoutine(currentRoute as string)

  console.log(exerciseSets.value.flat())
}

watch(editRoutineModel.value, () => {
  console.log(editRoutineModel.value)
}, { deep: true })

onMounted(async () => {
  try {
    loading.value = true

    const [routine, routineSets] = await Promise.all([
      routinesService.getRoutine(currentRoute as string),
      routinesService.getSetsByRoutineId(currentRoute as string)
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
        id: item.id,
        title: item.title,
        exercise_type: hashedExerciseTypes.value[item.exercise_type],
        equipment_category: item.equipment_category,
        muscle_group: item.muscle_group,
        thumbnails_url: item.thumbnails_url,
        sets: routineSets.data.filter((set) => set.exercise_id === item.id)
      } as IExerciseRoutine
    })
    title.value = routine.data[0].title
    console.log('routine', routine)
    console.log('routineSets', routineSets)
    console.log('exercises', exercises)
    console.log('exercisesFetched', exercisesFetched)
    console.log('editRoutineModel', editRoutineModel.value)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
})
function validateExerciseObject (obj) {
  // Перевірка наявності title
  if (!obj.title || obj.title.trim() === '') {
    return false
  }

  // Перевірка наявності хоча б однієї вправи
  if (!obj.exercises || obj.exercises.length === 0) {
    return false
  }

  // Перевірка наявності заповнених наборів даних у всіх вправах
  for (const exercise of obj.exercises) {
    if (!exercise.sets || exercise.sets.length === 0) {
      return false
    }
  }

  return true
}
const isValid = computed(() => {
  return validateExerciseObject(editRoutineModel.value)
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
