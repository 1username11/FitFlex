<template>
  <div
    class="flex justify-between items-center h-[45px]"
    :class="{'bg-gray-200': serial % 2 === 0}"
  >
    <div class="flex justify-center bg-white rounded-md items-center border border-gray-200 w-[30px] h-[30px]">
      {{ props.serial }}
    </div>

    <template v-for="(value, key) in setsColumns" :key="key">
      <div v-if="value" class="input-wrapper">
        <el-input
          v-model="setModel[key]"
          class="w-fit mr-11"
          type="number"
          placeholder="-"
        />
      </div>
    </template>

    <button @click="$emit('deleteSet')">
      <IconDelete />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { watchDebounced } from '@vueuse/core'
const { setsColumnsConditions } = useHelpers()

const props = defineProps<{
  exerciseType: string
  set: ISetRoutine
  serial: number
}>()

const emits = defineEmits(['deleteSet', 'setComplete', 'setUpdate'])

const setsColumns = setsColumnsConditions(props.exerciseType)

const setModel = reactive(Object.assign({}, props.set))

watchDebounced(setModel, () => {
  emits('setUpdate', setModel)
}, { debounce: 500, maxWait: 1000 })
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
