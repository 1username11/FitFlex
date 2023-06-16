<template>
  <div
    class="flex justify-between items-center px-2 h-[45px]"
    :class="{'bg-gray-200': serial % 2 === 0}"
  >
    <div class="flex justify-center bg-white rounded-md items-center border border-gray-200 w-[30px] h-[30px]">
      {{ props.serial }}
    </div>

    <div
      v-if="['weight reps', 'weight distance', 'weighted bodyweight']
        .includes(exerciseType)"
      class="input-wrapper"
    >
      <el-input
        v-model="setModel.weight" class="w-fit ml-16" type="number" placeholder="-"
      />
    </div>

    <div
      v-if="['weight reps', 'weighted bodyweight', 'assisted bodyweight', 'reps only']
        .includes(exerciseType)"
      class="input-wrapper"
    >
      <el-input
        v-model="setModel.reps" class="w-fit mr-11" type="number" placeholder="-"
      />
    </div>

    <div
      v-if="['duration', 'distance duration']
        .includes(exerciseType)"
      class="input-wrapper"
    >
      <el-input
        v-model="setModel.duration" class="w-fit mr-11" type="number" placeholder="-"
      />
    </div>

    <button @click="$emit('deleteSet')">
      <IconDelete />
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  exerciseType: string
  set: ISetRoutine
  serial: number
}>()

const emits = defineEmits(['deleteSet', 'setComplete', 'setUpdate'])

const setModel = ref<ISetRoutine>({
  weight: props.set.weight,
  reps: props.set.reps,
  duration: props.set.duration
} as ISetRoutine)

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
