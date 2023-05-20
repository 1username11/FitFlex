<template>
  <div class="flex flex-col p-4 w-full md:w-[700px] bg-white rounded-xl border border-gray-300 mt-4">
    <div>
      <div class="flex mb-4">
        <el-image :src="log.user.avatar" class="w-12 h-12 rounded-full overflow-hidden mr-4" />
        <div>
          <p>{{ log.user.name }}</p>
          <p class="text-gray-400 text-sm">{{ getFormattedDate(log.publishTime ) }}</p>
        </div>
      </div>
      <div class="text-xl font-bold mb-4">{{ log.title }}</div>
      <div class="text-gray-400 mb-4">{{ log.description }}</div>
      <div class="flex space-x-8">
        <div>
          <p class="text-sm text-gray-400 mb-1">Duration</p>
          <p>{{ log.duration }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-400 mb-1">Reps</p>
          <p>
            {{ getTotalReps(log) }}
          </p>
        </div>
      </div>
    </div>
    <span class="w-full h-[1px] bg-gray-300 my-4" />
    <div>
      <div class="text-gray-400 mb-4">Workout</div>
      <div>
        <div
          v-for="exercise in showMore ? log.workout.exercises : log.workout.exercises.slice(0, 3)"
          :key="exercise.id"
          class="flex mb-4"
        >
          <el-image class="w-12 h-12 mr-4 rounded-full overflow-hidden" :src="exercise.img" />

          <div class="flex space-x-1 items-center">
            <div>{{ exercise.sets.length }} sets</div>
            <div>{{ exercise.name }}</div>
          </div>
        </div>
        <div class="flex justify-center">
          <button
            v-if="log.workout.exercises.length > 3 && !showMore"
            class="text-gray-400"
            @click="showMore=!showMore"
          >
            See more exercise
          </button>
          <button
            v-if="showMore"
            class="text-gray-400"
            @click="showMore=!showMore"
          >
            See less exercise
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  log: ILog
}>()

const showMore = ref(false)

function getFormattedDate (date: Date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const day = date.getDate()
  const monthIndex = date.getMonth()
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  const formattedDate = `${day} ${months[monthIndex]} ${year}, ${hours}:${minutes}`

  return formattedDate
}

function getTotalReps (log: ILog) {
  return log.workout.exercises.reduce((totalReps, exercise) => {
    return totalReps + exercise.sets.reduce((exerciseReps, set) => {
      return exerciseReps + set.reps
    }, 0)
  }, 0)
}
</script>
