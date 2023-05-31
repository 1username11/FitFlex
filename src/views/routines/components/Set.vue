<template>
  <div
    class="flex justify-between items-center px-2 h-[45px]"
    :class="{'bg-gray-200': serial % 2 === 0}"
  >
    <div class="flex justify-center bg-white rounded-md items-center border border-gray-200 w-[30px] h-[30px]">
      {{ props.serial }}
    </div>

    <div
      class="input-wrapper"
    >
      <el-input
        v-if="router.currentRoute.value.fullPath.split('/')[1] === 'createRoutine' || 'edit-routine'"
        v-model="setModel.weight" class="w-fit ml-16" type="text" placeholder="-"
      />
      <p v-else-if="router.currentRoute.value.fullPath.split('/')[1] === 'start-workout'">{{ props.set.weight }}</p>
    </div>

    <div
      class="input-wrapper"
    >
      <el-input
        v-if="router.currentRoute.value.fullPath.split('/')[1] === 'createRoutine' || 'edit-routine'"
        v-model="setModel.reps" class="w-fit mr-11" type="text" placeholder="-"
      />
      <p v-else>{{ props.set.reps }}</p>
    </div>

    <button
      v-if="router.currentRoute.value.fullPath.split('/')[1] === 'start-workout'"
      class="w-[30px] h-[30px] bg-white border border-gray-200 rounded-md flex justify-center items-center"
      :class="{'bg-[#1D83EA]': setDone}"
      @click="done()"
    />

    <button v-else @click="$emit('deleteSet')">
      <IconDelete />
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  set: ISet
  serial: number
}>()
const emits = defineEmits(['deleteSet', 'setComplete', 'setUpdate'])

const router = useRouter()
const setModel = ref<ISet>({
  weight: props.set.weight,
  reps: props.set.reps
} as ISet)
const setDone = ref<boolean>(false)

function done () {
  emits('setComplete', setModel.value)
  setDone.value = true
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
