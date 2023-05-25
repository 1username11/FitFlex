<template>
  <div
    class="flex justify-between items-center px-2 h-[45px]"
    :class="{'bg-gray-200': serial % 2 === 0}"
  >
    <div class="flex justify-center bg-white rounded-md items-center border border-gray-200 w-[30px] h-[30px]">
      {{ serial }}
    </div>

    <div class="input-wrapper">
      <el-input v-model="setModel.weight" class="w-fit ml-16" type="text" placeholder="-" />
    </div>

    <div class="input-wrapper">
      <el-input v-model="setModel.reps" class="w-fit mr-11" type="text" placeholder="-" />
    </div>
    <button @click="$emit('deleteSet')">
      <DeleteIcon />
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  set: ISet
  serial: number
}>()
defineEmits(['deleteSet'])

const setModel = ref<ISet>({} as ISet)
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
