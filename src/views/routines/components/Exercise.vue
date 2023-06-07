<template>
  <div class="flex">
    <div class="flex items-center p-3">
      <el-image class="w-12 h-12 rounded-full overflow-hidden " :src="exercise.thumbnails_url">
        <template #error>
          <ImagePlaseholder />
        </template>
      </el-image>
    </div>

    <div>
      <p class="text-lg font-bold pb-2 pt-4">{{ exercise.title }}</p>

      <div class="flex space-x-2 mb-2">
        <div class="border border-gray-300 bg-white rounded-lg w-fit pr-2">
          <IconSets />
          {{ exercise.sets.length }} {{ exercise.sets?.length > 1 ? 'sets' : 'set' }}
        </div>

        <div
          v-if="exercise.sets[0].reps"
          class="border border-gray-300 bg-white rounded-lg w-fit pr-2"
        >
          <IconReps />
          {{ minReps === maxReps ? minReps : `${minReps} - ${maxReps}` }} reps
        </div>
        <div
          v-if="exercise.sets[0].weight"
          class="border border-gray-300 bg-white rounded-lg w-fit pr-2"
        >
          <IconEquipment />
          {{ minWeight === maxWeight ? minWeight : `${minWeight} - ${maxWeight}` }} kg
        </div>

        <div
          v-if="exercise.sets[0].duration"
          class="border border-gray-300 bg-white rounded-lg w-fit pr-2"
        >
          <IconDuration />
          {{ minDuration === maxDuration ? minDuration : `${minDuration} - ${maxDuration}` }}
          {{ minDuration === maxDuration ? 'second' : 'seconds' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  exercise: IExerciseRoutine
}>()

const minDuration = ref(Math.min(...props.exercise.sets.map((set) => set.duration || 0)))
const maxDuration = ref(Math.max(...props.exercise.sets.map((set) => set.duration || 0)))
const minReps = ref(Math.min(...props.exercise.sets.map((set) => set.reps || 0)))
const maxReps = ref(Math.max(...props.exercise.sets.map((set) => set.reps || 0)))
const minWeight = ref(Math.min(...props.exercise.sets.map((set) => set.weight || 0)))
const maxWeight = ref(Math.max(...props.exercise.sets.map((set) => set.weight || 0)))
</script>
