<template>
  <div class="bg-white p-4 rounded-md w-full">
    <div class="flex space-x-2">
      <el-image class="w-[40px] h-[40px] rounded-full overflow-hidden" />
      <p class="font-bold text-lg">{{ exercise.name }}</p>
    </div>
    <div>
      <div class="flex">
        <TimerIcon />
        <p class="text-[#1d83ea] ml-1 mr-2">
          Rest timer
        </p>
        <el-select
          v-model="restTime"
          class="w-[100px]"
          placeholder="Off"
        >
          <el-option label="30s" value="30" />
          <el-option label="60s" value="60" />
          <el-option label="90s" value="90" />
          <el-option label="120s" value="120" />
          <el-option label="150s" value="120" />
          <el-option label="180s" value="120" />
          <el-option label="210s" value="120" />
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
      />
      <el-button class="w-full" @click.stop="$emit('addSet')">
       + Add set
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  exercise: IExercise
  sets: ISet[]
}>()
defineEmits(['addSet', 'deleteSet'])

const restTime = ref<number>()
</script>
