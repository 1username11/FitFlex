<template>
  <div class="flex gap-4">
    <Filters
      @seeDetails="seeDetails($event)"
    />

    <ExerciseDetailCard :exercise="seeDetailExercise" :statistics="{} as IExerciseStatistics" />
  </div>
</template>

<script lang="ts" setup>
import ExerciseDetailCard from './components/ExerciseDetailCard.vue'
import { ref } from 'vue'

function seeDetails (exercise: IExercise) {
  seeDetailExercise.value = exercise
}

const seeDetailExercise = ref({} as IExercise)
</script>
