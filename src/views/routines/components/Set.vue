<template>
  <div
    class="flex justify-between items-center px-2 h-[45px]"
    :class="{'bg-gray-200': serial % 2 === 0}"
  >
    <div class="flex justify-center bg-white rounded-md items-center border border-gray-200 w-[30px] h-[30px]">
      {{ serial }}
    </div>

    <el-input v-model="setModel.weight" class="max-w-[50px] border-none ml-10" type="text" placeholder="-" />

    <el-input v-model="setModel.reps" class="max-w-[50px] ml-7" type="text" placeholder="-" />

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

<style>
.el-input__wrapper{
  box-shadow: none !important;
  background: none !important;
  .is-focus{
    box-shadow: none !important;
  }
}
</style>
