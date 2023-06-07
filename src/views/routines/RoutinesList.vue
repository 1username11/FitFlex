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

    <div v-loading="loading" class="bg-white rounded-lg p-5 border border-gray-300 w-full">
      <p class="text-gray-400">
        {{ routineList.length > 1 ? `My Routines(${routineList.length})` : 'My Routine' }}
      </p>

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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { routeNames } from '@/router/route-names'
import { supabase } from '@/supabase'
import draggable from 'vuedraggable'

const loading = ref(false)

const routinesStore = useRoutinesStore()
const { routineList } = storeToRefs(routinesStore)
const { getRoutines } = routinesStore

const generalStore = useGeneralStore()
const { generateGUID } = generalStore

const router = useRouter()

function navigate () {
  router.push({ name: routeNames.createRoutine })
}

async function duplicateWorkout (workout: IRoutine) {
  try {
    loading.value = true
    const fetchedData = await Promise.all([
      routinesService.getRoutine(workout.id),
      routinesService.getSetsByRoutineId(workout.id)
    ])

    if (fetchedData[0].error || fetchedData[1].error) throw new Error('Error fetching data')
    const duplicatedRoutine = {
      ...fetchedData[0].data[0] as IRoutine,
      id: generateGUID(),
      created_at: new Date().toISOString()
    }

    const routineSets = fetchedData[1].data.map((set) => {
      set.id = generateGUID()
      set.created_at = new Date().toISOString()
      set.routine_id = duplicatedRoutine.id
      return set
    })

    await routinesService.insertRoutine(duplicatedRoutine)
    await routinesService.insertSets(routineSets)
    const userId = (await supabase.auth.getUser()).data.user?.id as string
    await getRoutines(userId).then(() => {
      console.log('routines', routineList.value)
    })
    console.log('duplicatedRoutine', duplicatedRoutine)
    console.log('routineSets', routineSets)
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

async function deleteWorkout (workout: IRoutine) {
  try {
    loading.value = true
    const index = routineList.value.findIndex((w) => w.id === workout.id)
    routineList.value.splice(index, 1)
    await routinesService.deleteRoutineSets(workout.id)
    await routinesService.deleteRoutine(workout.id)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

// async function updateRoutineOrder () {
//   try {
//     loading.value = true
//     // Отримайте оновлену послідовність елементів після перетягування
//     const updatedRoutineList = routineList.value.map((workout, index) => ({
//       ...workout,
//       order: index + 1 // Встановіть порядок залежно від індексу (можливо, потрібно врахувати індекс з 0 або 1)
//     }))
//     const userId = (await supabase.auth.getUser()).data.user?.id as string
//     // Оновіть порядок елементів в базі даних
//     await routinesService.deleteRoutines(userId)
//   } catch (error) {
//     console.log(error)
//   } finally {
//     loading.value = false
//   }
// }

onMounted(async () => {
  try {
    loading.value = true
    const { data, error } = await supabase.auth.getUser()
    if (error) throw new Error('Error fetching user')
    const userId = data.user?.id as string
    await getRoutines(userId).then(() => {
      console.log('routines', routineList.value)
    })
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
