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
const seeDetailExercise = ref({})

function seeDetails (exercise: IExercise) {
  console.log(exercise)
  seeDetailExercise.value = exercise
  console.log(seeDetailExercise.value)
}

</script>
