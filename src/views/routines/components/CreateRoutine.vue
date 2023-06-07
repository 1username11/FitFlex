<template>
  <div class="flex gap-4 justify-between">
    <div class="grow">
      <div class="flex justify-between mb-4">
        <p class="font-bold text-xl">Create routine</p>

        <ElButton
          class="w-[200px]"
          type="primary"
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
import { supabase } from '@/supabase'

const emits = defineEmits(['save'])

const title = ref<string>('')
const exercises = ref<IExerciseRoutine[]>([])
const createdRoutineModel = computed(() => {
  return {
    title: title.value,
    exercises: exercises.value
  }
})

const generalStore = useGeneralStore()
const { generateGUID } = generalStore

async function getUserId () {
  const { data, error } = await supabase.auth.getUser()
  if (error) return error
  return data.user.id
}

function addExercise (event: IExerciseRoutine) {
  exercises.value.push(event)
}

async function saveHandler () {
  emits('save')
  const routine = ref({
    id: generateGUID(),
    created_at: new Date(),
    user: await getUserId(),
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
  await routinesService.insertRoutine(routine.value)
  await routinesService.insertSets(exerciseSets.value.flat())
  console.log(exerciseSets.value.flat())
}

watch(createdRoutineModel.value.exercises, () => {
  console.log(createdRoutineModel.value)
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
