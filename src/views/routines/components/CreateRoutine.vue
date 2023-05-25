<template>
  <div class="flex gap-4 justify-between">
    <div class="grow">
      <div class="flex justify-between mb-4">
        <p class="font-bold text-xl">Create routine</p>

        <el-button
          class="w-[200px]"
          type="primary"
          :disabled="createdRoutineModel"
          @click="$emit('save', createdRoutineModel)"
        >
          Save Routine
        </el-button>
      </div>

      <div class="bg-white p-4 rounded-lg border border-gray-200 flex flex-col min-h-[780px]">
        <div class="title-wrapper">
          <el-input
            v-model="title"
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
            @addSet="exercise.sets.push({} as ISet)"
            @deleteSet="exercise.sets.splice($event, 1)"
            @deleteExercise="exercises.splice($event, 1)"
          />
        </div>
        <div
          v-else
          class="flex flex-col justify-center items-center h-full my-auto"
        >
          <NoItemsIcon />
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
defineEmits(['save'])

const title = ref<string>('')
const exercises = ref<IExercise[]>([])

function addExercise (exercise: IExercise) {
  exercises.value.push(exercise)
}

const createdRoutineModel = computed(() => ({
}))

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
