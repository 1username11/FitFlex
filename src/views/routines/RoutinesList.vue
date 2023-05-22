<template>
  <div class="lg:flex gap-5">
    <div>
      <p class="mb-5 text-xl font-bold">My Routines</p>
      <ElButton class="bg-white border border-gray-300 pr-4 py-1 rounded-lg w-[180px] mb-5">
        <NewRoutineIcon />
        New Routine
      </ElButton>
    </div>
    <div class="bg-white rounded-lg p-5 border border-gray-300 w-full">
      <p class="text-gray-400">
        My Routines {{ workouts.length > 1 ? `(${workouts.length})` : '' }}
      </p>
      <draggable v-model="workouts" :animation="300" item-key="id" class="cursor-move">
        <template #item="{ element: workout }">
          <RoutinesItem :workout="workout" />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import draggable from 'vuedraggable'

const routinesStore = useRoutinesStore()
const { workouts } = storeToRefs(routinesStore)
</script>
