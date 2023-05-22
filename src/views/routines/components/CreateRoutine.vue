<template>
  <div>
    <div>
      <p>Create routine</p>
      <button>Save Routine</button>
    </div>
    <div>
      <div>Routine Title</div>
      <ExerciseCard
        v-for="exercise in exercises"
        :key="exercise.id"
        :exercise="exercise"
      />
    </div>
    <Filters />
  </div>
</template>

<script lang="ts" setup>
const routinesStore = useRoutinesStore()
const { exercises } = storeToRefs(routinesStore)
</script>
