<template>
  <div class="flex gap-4">
    <Filters
      @seeDetails="seeDetails"
    />

    <ExerciseDetailCard :exercise="seeDetailExercise" />
  </div>
</template>

<script lang="ts" setup>
import ExerciseDetailCard from './components/ExerciseDetailCard.vue'
const seeDetailExercise = ref({} as IExerciseRoutine)

async function seeDetails (exercise: IExerciseRoutine) {
  seeDetailExercise.value = exercise
}

</script>
