<template>
  <div class="lg:flex gap-5">
    <div>
      <p class="mb-5 text-xl font-bold">My Routines</p>

      <button
        class="flex justify-center items-center bg-white border border-gray-300 pr-4 rounded-md w-[180px] h-[45px] mb-5
          hover:bg-gray-100 hover:border-gray-200 active:bg-gray-200 active:border-gray-300"
        @click="goToCreateRoutine"
      >
        <IconNewRoutine />

        New Routine
      </button>
    </div>

    <div v-loading="loading" class="bg-white rounded-lg p-5 border border-gray-300 w-full">
      <p class="text-gray-400">
        {{ routineList.length > 1 ? `My Routines(${routineList.length})` : 'My Routine' }}
      </p>

      <template v-if="routineList.length">
        <draggable
          v-model="routineList"
          :animation="300"
          item-key="id"
          class="cursor-move"
        >
          <template #item="{ element: workout }">
            <RoutinesItem
              :routine="workout"
              @duplicate="duplicateWorkout(workout)"
              @delete="deleteWorkout(workout)"
            />
          </template>
        </draggable>
      </template>

      <p v-else class="text-xl mt-2.5">
        You don't have any routines yet. Create new one!
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/route-names'
import draggable from 'vuedraggable'

const router = useRouter()
const routinesStore = useRoutinesStore()
const { routineList } = storeToRefs(routinesStore)
const { getRoutines } = routinesStore
const { generateGUID } = useHelpers()
const { userId } = storeToRefs(useGeneralStore())

const loading = ref(false)

async function goToCreateRoutine () {
  await router.push({ name: routeNames.createRoutine })
}

async function duplicateWorkout (routine: IRoutine) {
  try {
    loading.value = true
    const [fetchedRoutine, fetchedRoutineSets] = await Promise.all([
      routinesService.getRoutine(routine.id),
      routinesService.getSetsByRoutineId(routine.id)
    ])
    const createdAt = new Date().toISOString()

    if (fetchedRoutine.error || fetchedRoutineSets.error) {
      throw new Error('Error fetching data')
    }

    const duplicatedRoutine = {
      ...fetchedRoutine.data[0],
      id: generateGUID(),
      created_at: createdAt
    }

    const routineSets = fetchedRoutineSets.data.map((set) => ({
      ...set,
      id: generateGUID(),
      created_at: createdAt,
      routine_id: duplicatedRoutine.id
    }))

    const { error: insertRoutineError } = await routinesService.insertRoutine(duplicatedRoutine)
    const { error: insertSetsError } = await routinesService.insertSets(routineSets)

    if (insertRoutineError || insertSetsError) {
      throw new Error('Error duplicating routine')
    }
    ElNotification({
      title: 'Success',
      message: 'Routine duplicated',
      type: 'success'
    })
    await getRoutines(userId.value)
  } catch (error) {
    ElNotification({
      title: 'Error',
      message: 'Error duplicating routine',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

async function deleteWorkout (routine: IRoutine) {
  try {
    loading.value = true

    const { error: deleteSetsError } = await routinesService.deleteRoutineSets(routine.id)
    const { error: deleteRoutineError } = await routinesService.deleteRoutine(routine.id)
    if (deleteSetsError || deleteRoutineError) {
      throw new Error('Error deleting routine')
    }
    const index = routineList.value.findIndex((r) => r.id === routine.id)
    routineList.value.splice(index, 1)
    ElNotification({
      title: 'Success',
      message: 'Routine deleted',
      type: 'success'
    })
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    loading.value = true
    await getRoutines(userId.value)
  } catch (error) {
    ElNotification({
      title: 'Error',
      message: 'Error fetching routines',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
})

</script>
