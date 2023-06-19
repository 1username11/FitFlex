<template>
  <div class="bg-white p-4 w-full">
    <div class="flex justify-between mb-6">
      <div class="flex space-x-2 items-center">
        <el-image class="w-[40px] h-[40px] rounded-full overflow-hidden" :src="exercise.thumbnails_url">
          <template #error>
            <ImagePlaseholder />
          </template>
        </el-image>

        <p class="font-bold text-lg truncate">{{ exercise.title }}</p>
      </div>

      <el-dropdown trigger="click">
        <span>
          <IconExerciseCardButton />
        </span>

        <template #dropdown>
          <el-dropdown-menu class="text-base text-gray-400 py-3 space-y-2 cursor-pointer min-w-[210px]">
            <el-dropdown-item class="hover:bg-gray-300 px-6 py-1" @click="$emit('deleteExercise', exercise.id)">
              <IconDelete />
              Delete Exercise
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div>
      <div class="flex">
        <IconTimer />

        <p class="text-[#1d83ea] ml-1 mr-2">Rest timer</p>

        <el-select
          v-model="restTime"
          class="w-[100px]"
          placeholder="Off"
          @change="$emit('setRestTime', restTime)"
        >
          <el-option
            v-for="time in timeOptions"
            :key="time"
            :label="time + 's'"
            :value="time"
          />
        </el-select>
      </div>

      <div class="flex justify-between px-2 text-lg font-medium">
        <p>Set</p>
        <template v-for="(value, key) in setsColumns" :key="key">
          <p v-if="value" class="capitalize">{{ key }}</p>
        </template>
        <p />
      </div>

      <Set
        v-for="(set, idx) in sets"
        :key="set.id"
        :set="set"
        :serial="idx+1"
        :exerciseType="exercise.exercise_type"
        class="mb-3"
        @deleteSet="deleteSet(idx)"
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
const { setsColumnsConditions } = useHelpers()

const props = defineProps<{
  exercise: IExerciseRoutine
  sets: ISetRoutine[]
}>()

const emit = defineEmits(['addSet', 'deleteSet', 'deleteExercise', 'setUpdate', 'setRestTime'])

const restTime = ref<number>()
const timeOptions = ref([30, 60, 90, 120, 150, 180, 210])
const setsColumns = setsColumnsConditions(props.exercise.exercise_type)

function deleteSet (idx: number) {
  if (props.sets.length > 1) {
    emit('deleteSet', idx)
  } else {
    emit('deleteExercise', props.exercise.id)
  }
}
</script>
