<template>
  <div class="flex border-b border-b-gray-300">
    <div class="flex items-center p-3">
      <el-image class="w-12 h-12 rounded-full overflow-hidden " />
    </div>

    <div>
      <p class="text-lg font-bold pb-2 pt-4">{{ exercise.name }}</p>

      <div class="flex space-x-2 mb-2">
        <div class="border border-gray-300 bg-white rounded-lg w-fit pr-2">
          <IconSets />
          {{ exercise.sets.length }} {{ exercise.sets.length > 1 ? 'sets' : 'set' }}
        </div>

        <div class="border border-gray-300 bg-white rounded-lg w-fit pr-2">
          <IconReps />
          {{ Math.min(...exercise.sets.map((set) => set.reps)) }} -
          {{ Math.max(...exercise.sets.map((set) => set.reps)) }}
          reps
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  exercise: IExercise
}>()
</script>
