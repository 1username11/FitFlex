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
const seeDetailExercise = ref({} as IExercise)

function seeDetails (exercise: IExercise) {
  seeDetailExercise.value = exercise
}
</script>
