<template>
  <div class="lg:flex gap-5">
    <div>
      <p class="mb-5 text-xl font-bold">My Routines</p>
      <el-button
        class="bg-white border border-gray-300 pr-4 rounded-md w-[180px] h-[45px] mb-5"
        @click="navigate"
      >
        <NewRoutineIcon />

        New Routine
      </el-button>
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
import { routeNames } from '@/router/route-names'
import draggable from 'vuedraggable'

const routinesStore = useRoutinesStore()
const { workouts } = storeToRefs(routinesStore)

const router = useRouter()

function navigate () {
  router.push({ name: routeNames.createRoutine })
}
</script>
