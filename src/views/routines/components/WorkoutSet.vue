<template>
  <div
    class="flex justify-between items-center px-2 h-[45px]"
    :class="{'bg-gray-200': serial % 2 === 0}"
  >
    <div class="flex justify-center bg-white rounded-md items-center border border-gray-200 w-[30px] h-[30px]">
      {{ props.serial }}
    </div>

    <div
      v-if="['weight reps', 'weight distance', 'weighted bodyweight'].includes(exerciseType)"
      class="input-wrapper"
    >
      <!-- <el-input
        v-model="setModel.weight" class="w-fit ml-16" type="text" placeholder="-"
      /> -->
      {{ setModel.weight }}
    </div>

    <div
      v-if="['weight reps', 'weighted bodyweight', 'assisted bodyweight', 'reps only'].includes(exerciseType)"
      class="input-wrapper"
    >
      <!-- <el-input
        v-model="setModel.reps" class="w-fit mr-11" type="text" placeholder="-"
      /> -->
      {{ setModel.reps }}
    </div>

    <div
      v-if="['duration', 'distance duration'].includes(exerciseType)"
      class="input-wrapper"
    >
      <!-- <el-input
        v-model="setModel.duration" class="w-fit mr-11" type="text" placeholder="-"
      /> -->
      {{ setModel.duration }}
    </div>

    <button
      class="w-[30px] h-[30px] bg-white border border-gray-200 rounded-md flex justify-center items-center"
      :class="{'bg-[#1D83EA]': setDone}"
      :disabled="setDone || !props.isWorokoutStarted"
      @click="done()"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  set: ISetRoutine
  serial: number
  isWorokoutStarted: boolean
  exerciseType: string
}>()
const emits = defineEmits(['deleteSet', 'setComplete', 'setUpdate'])
const setDone = ref<boolean>(false)

const setModel = ref<ISetRoutine>({
  weight: props.set.weight,
  reps: props.set.reps,
  duration: props.set.duration
} as ISetRoutine)

function done () {
  setDone.value = true
  emits('setComplete', setModel.value)
}

watch(setModel.value, () => {
  emits('setUpdate', setModel.value)
})
</script>

<style lang="scss">
.input-wrapper {
  .el-input {
    .el-input__wrapper {
      box-shadow: none;
      background-color: transparent;
    }
    .el-input__inner {
      text-align: center;
      height: fit-content;
    }
  }
}
</style>
