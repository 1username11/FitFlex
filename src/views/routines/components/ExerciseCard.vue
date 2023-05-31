<template>
  <div class="bg-white p-4 rounded-md w-full">
    <div class="flex justify-between mb-6">
      <div class="flex space-x-2">
        <el-image class="w-[40px] h-[40px] rounded-full overflow-hidden" />

        <p class="font-bold text-lg">{{ exercise.name }}</p>
      </div>

      <el-dropdown trigger="click">
        <span>
          <IconExerciseCardButton />
        </span>

        <template #dropdown>
          <el-dropdown-menu class="text-base text-gray-400 py-3 space-y-2 cursor-pointer min-w-[210px]">
            <el-dropdown-item class="hover:bg-gray-300 px-6 py-1" @click="$emit('deleteExercise', exercise)">
              <DeleteIcon />
              Delete Exercise
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div>
      <div class="flex">
        <IconTimer />

        <p class="text-[#1d83ea] ml-1 mr-2">
          Rest timer
        </p>

        <el-select
          v-model="restTime"
          class="w-[100px]"
          placeholder="Off"
        >
          <el-option v-for="time in timeOptions" :key="time" :label="time + 's'" :value="time" />
        </el-select>
      </div>
      <div class="flex justify-between">
        <p>Set</p>
        <p>KG</p>
        <p>Reps</p>
        <p />
      </div>
      <Set
        v-for="(set, idx) in sets"
        :key="set.id"
        :set="set"
        :serial="idx+1"
        class="mb-3"
        @deleteSet="$emit('deleteSet', idx)"
        @setUpdate="$emit('setUpdate', { idx, set: $event })"
      />
      <button
        class="bg-white border border-gray-300 py-1 rounded-md w-full mb-5
          hover:bg-gray-100 hover:border-gray-200 active:bg-gray-200 active:border-gray-300"
        @click.stop="$emit('addSet')"
      >
        + Add set
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  exercise: IExercise
  sets: ISet[]
}>()
defineEmits(['addSet', 'deleteSet', 'deleteExercise', 'setUpdate'])

const restTime = ref<number>()
const timeOptions = ref<number[]>([30, 60, 90, 120, 150, 180, 210])
</script>
