<template>
  <div class="lg:flex gap-5">
    <div>
      <p class="mb-5 text-xl font-bold">My Routines</p>

      <button
        class="flex justify-center items-center bg-white border border-gray-300 pr-4 rounded-md w-[180px] h-[45px] mb-5
          hover:bg-gray-100 hover:border-gray-200 active:bg-gray-200 active:border-gray-300"
        @click="navigate"
      >
        <IconNewRoutine />

        <p>
          New Routine
        </p>
      </button>
    </div>
    
    <div class="bg-white rounded-lg p-5 border border-gray-300 w-full">
      <p class="text-gray-400">
        {{ routines.length > 1 ? `My Routines(${routines.length})` : 'My Routine' }}
      </p>

      <draggable v-model="routines" :animation="300" item-key="id" class="cursor-move">
        <template #item="{ element: workout }">
          <RoutinesItem
            :workout="workout"
            @duplicate="duplicateWorkout(workout)"
            @delete="deleteWorkout(workout)"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/route-names'
import draggable from 'vuedraggable'

const routinesStore = useRoutinesStore()
const { routines } = storeToRefs(routinesStore)

const router = useRouter()

function navigate () {
  router.push({ name: routeNames.createRoutine })
}

function duplicateWorkout (workout: IRoutine) {
  const duplicatedWorkout = {
    ...routines.value.find((w) => w.id === workout.id),
    id: workout.id + 'duplicated'
  }
  routines.value.push(duplicatedWorkout)
}

function deleteWorkout (workout: IRoutine) {
  const deletedWorkout = routines.value.find((w) => w.id === workout.id)
  const index = routines.value.indexOf(deletedWorkout)
  routines.value.splice(index, 1)
}
</script>
