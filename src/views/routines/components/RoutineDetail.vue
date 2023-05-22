<template>
  <div class=" lg:flex lg:flex-row-reverse lg:justify-between">
    <div class="flex flex-row space-x-3 mb-3 lg:flex lg:flex-col lg:justify-start lg:space-y-3 lg:space-x-0">
      <button class="w-full lg:w-[300px] h-9 rounded-md bg-[#1D83EA] text-white cursor-pointer mr-2 hover:bg-[#056DD7]">
        Start Routine
      </button>

      <button class="w-full lg:w-[300px] h-9 rounded-md bg-white cursor-pointer mr-2 border hover:bg-gray-100">
        Edit Routine
      </button>

      <button
        class="w-full lg:w-[300px] h-9 rounded-md bg-white cursor-pointer mr-2 border  hover:bg-gray-100"
        @click="copyLink"
      >
        Copy Link
      </button>
    </div>

    <div class="bg-white px-4 pt-4 border border-gray-300 rounded-lg w-full mr-3">
      <p class="pb-4 text-3xl font-bold">{{ workout ? workout.name : '' }}</p>

      <div class="flex space-x-3">
        <el-image class="w-5 h-5 rounded-full overflow-hidden" :src=" workout ? workout.user.avatar : ''" />

        <p>Created by {{ workout ? workout.user.name : '' }}</p>
      </div>

      <div>
        <Exercise
          v-for="(exerciseItem, idx) in workout ? workout.exercises: []"
          :key="exerciseItem.id"
          :exercise="exerciseItem"
          :class="{
            'border-none': workout ? idx === workout.exercises.length - 1: false
          }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const currentRoute = useRoute()

const routinesStore = useRoutinesStore()
const { workouts } = storeToRefs(routinesStore)

const workout = computed(() => {
  const result = workouts.value.find((workout) => workout.id === currentRoute.params.id)
  if (result) {
    return result
  }
})

function copyLink () {
  const url = window.location.href
  navigator.clipboard.writeText(url)
}

</script>
