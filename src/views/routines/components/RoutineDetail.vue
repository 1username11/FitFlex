<template>
  <div class="bg-white px-4 pt-4 border border-gray-300 rounded-lg">
    <p class="pb-4 text-3xl font-bold">{{ workout.name }}</p>
    <div class="flex space-x-3">
      <el-image class="w-5 h-5 rounded-full overflow-hidden" :src="workout.user.avatar" />
      <p>Created by {{ workout.user.name }}</p>
    </div>
    <div>
      <Exercise
        v-for="(exerciseItem, idx) in workout.exercises"
        :key="exerciseItem.id"
        :exercise="exerciseItem"
        :class="{
          'border-none': idx === workout.exercises.length - 1
        }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>

// отримати з поточного роуту id та зробити пошук по воркаутам в сторі

</script>
