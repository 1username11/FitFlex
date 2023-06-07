<template>
  <div class="flex gap-4">
    <Filters
      @seeDetails="seeDetails"
    />

    <ExerciseDetailCard :exercise="seeDetailExercise" :statistics="{} as IExerciseStatistics" />
  </div>
</template>

<script lang="ts" setup>
import ExerciseDetailCard from './components/ExerciseDetailCard.vue'
const seeDetailExercise = ref({} as IExerciseRoutine)

function seeDetails (exercise: IExerciseRoutine) {
  console.log(exercise)
  seeDetailExercise.value = exercise
  console.log(seeDetailExercise.value)
}

</script>
