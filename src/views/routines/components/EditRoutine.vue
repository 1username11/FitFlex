<template>
  <div class="flex gap-4 justify-between">
    <div class="w-full">
      <div class="flex justify-between mb-4">
        <p class="font-bold text-xl">Create routine</p>
        <el-button class="w-[200px]" type="primary" disabled>Save Routine</el-button>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="title-wrapper">
          <el-input
            v-model="title"
            class="text-3xl text-gray-400 w-full py-4 pr-4 border-b-2 border-b-200"
            placeholder="Routine Title"
          />
        </div>
        <ExerciseCard
          v-for="exercise in routine?.exercises"
          :key="exercise.id"
          :exercise="exercise"
          :sets="exercise.sets"
          @addSet="exercise.sets.push({} as ISet)"
          @deleteSet="exercise.sets.splice($event, 1)"
        />
      </div>
    </div>
    <Filters class="hidden w-[320px] lg:block" @addExercise="addExercise($event)" />
  </div>
</template>

<script lang="ts" setup>
const routinesStore = useRoutinesStore()
const { workouts } = storeToRefs(routinesStore)
const params = useRouter().currentRoute.value.params.id
const routine = ref(workouts.value.find((workout) => workout.id === params))
const title = ref<string>(routine.value?.name || '')

function addExercise (exercise: IExercise) {
  routine.value?.exercises.push(exercise)
}

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
