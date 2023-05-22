<template>
 <div class="bg-white p-4 rounded-md">
  <div>
    <el-image />
    <p>{{ exercise.name }}</p>
  </div>
  <div>
    <div class="flex space-x-1">
      <TimerIcon />
      <p>
        Rest timer
      </p>
    </div>
    <div class="flex justify-between">
      <p>Set</p>
      <p>KG</p>
      <p>Reps</p>
      <p />
    </div>
    <Set :set="exercise.sets[0]" :serial="0" />
    <el-button class="w-full">Add set</el-button>
  </div>
 </div>
</template>

<script lang="ts" setup>

defineProps<{
  exercise: IExercise

}>()
</script>
